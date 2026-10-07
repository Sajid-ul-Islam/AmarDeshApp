/**
 * Automated RSS Feed Poller & Notification Broadcaster
 *
 * Checks https://www.dailyamardesh.com/feed every 10 minutes (or via cron/GitHub Actions)
 * and broadcasts FCM / Expo Push Notifications to subscribed topics when new breaking
 * articles appear.
 */

const fs = require('fs');
const path = require('path');

const RSS_FEED_URL = 'https://www.dailyamardesh.com/feed';
const STATE_FILE = path.join(__dirname, '.last-notified-articles.json');

async function runPoller() {
  console.log('[Poller] Checking Daily Amar Desh RSS feed...');

  let lastNotified = [];
  if (fs.existsSync(STATE_FILE)) {
    try {
      lastNotified = JSON.parse(fs.readFileSync(STATE_FILE, 'utf-8'));
    } catch (e) {
      lastNotified = [];
    }
  }

  try {
    const response = await fetch(RSS_FEED_URL, {
      headers: {
        'User-Agent': 'AmarDeshNotificationPoller/1.0',
      },
    });

    if (!response.ok) {
      console.error(`[Poller] HTTP Error: ${response.status}`);
      return;
    }

    const xml = await response.text();
    const items = parseRssItems(xml);
    console.log(`[Poller] Fetched ${items.length} items from RSS.`);

    const newlyNotified = [...lastNotified];

    for (const item of items) {
      if (lastNotified.includes(item.link)) continue;

      // Check if article is breaking or recent national/politics
      const isUrgent =
        item.title.includes('ব্রেকিং') ||
        item.category === 'জাতীয়' ||
        item.category === 'রাজনীতি';

      if (isUrgent) {
        console.log(`[Poller] Triggering notification for: "${item.title}"`);
        await broadcastNotification({
          title: 'দৈনিক আমার দেশ • ব্রেকিং নিউজ',
          body: item.title,
          data: {
            url: item.link,
            category: item.category,
          },
        });
      }

      newlyNotified.push(item.link);
    }

    // Keep state bounded to last 100 links
    const trimmedState = newlyNotified.slice(-100);
    fs.writeFileSync(STATE_FILE, JSON.stringify(trimmedState, null, 2));
    console.log('[Poller] Polling cycle complete.');
  } catch (error) {
    console.error('[Poller] Failed to poll feed:', error);
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
  return m ? m[1].replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1').trim() : '';
}

async function broadcastNotification(payload) {
  // Can be configured to send via FCM or Expo Push Notifications API
  console.log('[Notification Payload]', JSON.stringify(payload, null, 2));
}

if (require.main === module) {
  runPoller();
}

module.exports = { runPoller, parseRssItems };
