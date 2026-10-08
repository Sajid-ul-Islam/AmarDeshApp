#!/usr/bin/env node
/**
 * Automated RSS Feed Poller & Notification Broadcaster
 *
 * Polls https://www.dailyamardesh.com/feed and broadcasts Expo push
 * notifications when new breaking articles appear. Designed to be run from a
 * cron job, a scheduled workflow, or manually:
 *
 *   EXPO_PUSH_ACCESS_TOKEN=... node scripts/poll-and-notify.js
 *
 * Behaviour:
 *   - Only articles whose category is জাতীয় / রাজনীতি (or whose title contains
 *     "ব্রেকিং") are considered urgent enough to interrupt the reader.
 *   - Already-notified article URLs are remembered in `.last-notified-articles.json`
 *     (bounded to the most recent 100) so restarts do not re-notify.
 *   - The Android channel id MUST match the channel the app creates
 *     (`breaking-news`, see services/notificationService.ts); a mismatch makes
 *     Android drop the notification silently.
 *
 * Dry-run by default: pass --send to actually call the Expo Push API.
 */

const fs = require('fs');
const path = require('path');

const RSS_FEED_URL = 'https://www.dailyamardesh.com/feed';
const EXPO_PUSH_ENDPOINT = 'https://exp.host/--/api/v2/push/send';
const STATE_FILE = path.join(__dirname, '.last-notified-articles.json');

/** Must match CHANNELS.BREAKING in services/notificationService.ts. */
const BREAKING_CHANNEL_ID = 'breaking-news';

/** Categories worth a push notification. */
const URGENT_CATEGORIES = ['জাতীয়', 'রাজনীতি'];

const MAX_STATE_ENTRIES = 100;
const PUSH_BATCH_SIZE = 100;

/**
 * Reads recipient push tokens.
 *
 * There is no device-registration backend in this repository yet, so tokens are
 * supplied by the caller via EXPO_PUSH_TOKENS (comma-separated). Without
 * tokens the script performs a dry run and sends nothing, rather than reporting
 * a delivery that never happened.
 */
function readRecipientTokens() {
  const raw = process.env.EXPO_PUSH_TOKENS || '';
  return raw
    .split(',')
    .map((token) => token.trim())
    .filter(Boolean);
}

function readLastNotified() {
  if (!fs.existsSync(STATE_FILE)) return [];
  try {
    const parsed = JSON.parse(fs.readFileSync(STATE_FILE, 'utf-8'));
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeLastNotified(links) {
  fs.writeFileSync(
    STATE_FILE,
    JSON.stringify(links.slice(-MAX_STATE_ENTRIES), null, 2)
  );
}

function isUrgent(item) {
  return (
    item.title.includes('ব্রেকিং') || URGENT_CATEGORIES.includes(item.category)
  );
}

function chunk(items, size) {
  const batches = [];
  for (let i = 0; i < items.length; i += size) {
    batches.push(items.slice(i, i + size));
  }
  return batches;
}

/**
 * Send messages through the Expo Push API.
 * Returns { sent, failed } — never reports success for a failed HTTP call.
 */
async function sendPushMessages(tokens, payload) {
  const headers = {
    Accept: 'application/json',
    'Accept-encoding': 'gzip, deflate',
    'Content-Type': 'application/json',
  };
  if (process.env.EXPO_PUSH_ACCESS_TOKEN) {
    headers.Authorization = `Bearer ${process.env.EXPO_PUSH_ACCESS_TOKEN}`;
  }

  let sent = 0;
  let failed = 0;

  for (const batch of chunk(tokens, PUSH_BATCH_SIZE)) {
    const messages = batch.map((token) => ({
      to: token,
      sound: 'default',
      title: 'দৈনিক আমার দেশ • ব্রেকিং নিউজ',
      body: payload.title,
      data: {
        articleId: payload.articleId,
        category: payload.category,
        source: 'push',
      },
      priority: 'high',
      channelId: BREAKING_CHANNEL_ID,
    }));

    try {
      const response = await fetch(EXPO_PUSH_ENDPOINT, {
        method: 'POST',
        headers,
        body: JSON.stringify(messages),
      });

      if (!response.ok) {
        console.error(
          `[Poller] Expo Push API returned HTTP ${response.status} for ${batch.length} message(s)`
        );
        failed += batch.length;
        continue;
      }

      const body = await response.json().catch(() => null);
      const tickets = Array.isArray(body?.data) ? body.data : [];

      // Per-message tickets: a 200 response can still contain per-token errors.
      const batchFailures = tickets.filter((t) => t?.status === 'error').length;
      if (batchFailures > 0) {
        console.warn(
          `[Poller] ${batchFailures}/${batch.length} push ticket(s) reported errors`
        );
      }
      sent += batch.length - batchFailures;
      failed += batchFailures;
    } catch (error) {
      console.error('[Poller] Push request failed:', error?.message || error);
      failed += batch.length;
    }
  }

  return { sent, failed };
}

async function runPoller(options = {}) {
  const send = options.send === true;
  console.log('[Poller] Checking Daily Amar Desh RSS feed...');

  const lastNotified = readLastNotified();
  const tokens = readRecipientTokens();

  try {
    const response = await fetch(RSS_FEED_URL, {
      headers: { 'User-Agent': 'AmarDeshNotificationPoller/1.0' },
    });

    if (!response.ok) {
      console.error(`[Poller] HTTP Error: ${response.status}`);
      return { checked: 0, urgent: 0, sent: 0, failed: 0 };
    }

    const xml = await response.text();
    const items = parseRssItems(xml);
    console.log(`[Poller] Fetched ${items.length} items from RSS.`);

    const newlyNotified = [...lastNotified];
    const urgent = [];

    for (const item of items) {
      // Deep links use the article's slug (last path segment), which is what
      // the app's article route resolves — never the full URL.
      if (isUrgent(item)) {
        urgent.push(item);
      }
      if (!newlyNotified.includes(item.link)) {
        newlyNotified.push(item.link);
      }
    }

    const fresh = urgent.filter((item) => !lastNotified.includes(item.link));

    if (fresh.length === 0) {
      console.log('[Poller] No new urgent articles.');
      writeLastNotified(newlyNotified);
      return { checked: items.length, urgent: 0, sent: 0, failed: 0 };
    }

    if (tokens.length === 0) {
      console.log(
        `[Poller] ${fresh.length} new urgent article(s) found, but EXPO_PUSH_TOKENS is empty — dry run, nothing sent.`
      );
      for (const item of fresh) {
        console.log(`  • ${item.title}`);
      }
      writeLastNotified(newlyNotified);
      return { checked: items.length, urgent: fresh.length, sent: 0, failed: 0 };
    }

    if (!send) {
      console.log(
        `[Poller] Dry run: would notify ${tokens.length} device(s) about ${fresh.length} article(s). Pass --send to deliver.`
      );
      for (const item of fresh) {
        console.log(`  • ${item.title}`);
      }
      writeLastNotified(newlyNotified);
      return { checked: items.length, urgent: fresh.length, sent: 0, failed: 0 };
    }

    let sent = 0;
    let failed = 0;

    for (const item of fresh) {
      console.log(`[Poller] Notifying: "${item.title}"`);
      const result = await sendPushMessages(tokens, {
        title: item.title,
        category: item.category,
        articleId: slugFromUrl(item.link),
      });
      sent += result.sent;
      failed += result.failed;
    }

    writeLastNotified(newlyNotified);

    console.log(
      `[Poller] Done. sent=${sent} failed=${failed} articles=${fresh.length}`
    );
    return { checked: items.length, urgent: fresh.length, sent, failed };
  } catch (error) {
    console.error('[Poller] Failed to poll feed:', error);
    return { checked: 0, urgent: 0, sent: 0, failed: 0 };
  }
}

/** Last path segment of an article URL — the id the app's /article/[id] route uses. */
function slugFromUrl(url) {
  if (!url) return '';
  try {
    const parts = new URL(url).pathname.split('/').filter(Boolean);
    return parts[parts.length - 1] || '';
  } catch {
    return url.split('/').filter(Boolean).pop() || '';
  }
}

function parseRssItems(xml) {
  const items = [];
  const matches = xml.match(/<item>[\s\S]*?<\/item>/g) || [];

  for (const item of matches) {
    const title = extractTag(item, 'title');
    const link = extractTag(item, 'link');
    const category = extractTag(item, 'category');
    const pubDate = extractTag(item, 'pubDate');

    if (title && link) {
      items.push({ title, link, category, pubDate });
    }
  }

  return items;
}

function extractTag(xml, tag) {
  const m = xml.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i'));
  if (!m) return '';
  return m[1]
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .trim();
}

if (require.main === module) {
  const send = process.argv.includes('--send');
  runPoller({ send }).then((summary) => {
    // Non-zero exit when a send was attempted and every message failed, so a
    // scheduler can alert instead of silently succeeding.
    if (send && summary.sent === 0 && summary.failed > 0) {
      process.exitCode = 1;
    }
  });
}

module.exports = {
  runPoller,
  parseRssItems,
  slugFromUrl,
  isUrgent,
  sendPushMessages,
  BREAKING_CHANNEL_ID,
};
