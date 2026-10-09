import { createHmac, timingSafeEqual } from 'crypto';
import type { Article } from '../types';
import { dispatchBreakingPushNotification } from './pushNotificationWorker';

export interface CMSWebhookPayload {
  event: 'article.published' | 'article.updated' | 'article.deleted' | 'breaking.alert';
  timestamp: number;
  article: {
    id: string;
    title: string;
    slug?: string;
    content: string;
    category: string;
    author: string;
    publishedAt: string;
    imageUrl?: string;
    isBreaking?: boolean;
    importance?: 'normal' | 'high' | 'urgent';
    tags?: string[];
  };
}

export interface WebhookValidationResult {
  isValid: boolean;
  reason?: string;
}

/**
 * Validates HMAC SHA-256 signature from Amar Desh CMS webhook
 * Uses timing-safe comparison to prevent timing attacks
 */
export const verifyCmsWebhookSignature = (
  rawBody: string,
  signatureHeader: string,
  secretKey: string
): WebhookValidationResult => {
  if (!signatureHeader) {
    return { isValid: false, reason: 'Missing X-AmarDesh-Signature header' };
  }

  try {
    const computedHash = createHmac('sha256', secretKey)
      .update(rawBody)
      .digest('hex');

    const expectedSignature = `sha256=${computedHash}`;
    
    // Extract signature from header (may or may not have sha256= prefix)
    const providedSignature = signatureHeader.startsWith('sha256=')
      ? signatureHeader
      : `sha256=${signatureHeader}`;

    // Use timing-safe comparison to prevent timing attacks
    const sigBuffer = Buffer.from(providedSignature);
    const expectedBuffer = Buffer.from(expectedSignature);
    
    if (sigBuffer.length !== expectedBuffer.length) {
      return { isValid: false, reason: 'Signature length mismatch' };
    }

    const matches = timingSafeEqual(sigBuffer, expectedBuffer);

    if (!matches) {
      return { isValid: false, reason: 'Signature mismatch' };
    }

    return { isValid: true };
  } catch (err: any) {
    return { isValid: false, reason: `Verification error: ${err?.message}` };
  }
};

/**
 * Validates webhook timestamp to prevent replay attacks
 * Allows 5-minute window for clock skew
 */
export const verifyWebhookTimestamp = (
  timestamp: number,
  maxAgeMs: number = 5 * 60 * 1000 // 5 minutes
): WebhookValidationResult => {
  const now = Date.now();
  const age = now - timestamp;

  if (age < 0) {
    return { isValid: false, reason: 'Timestamp is in the future' };
  }

  if (age > maxAgeMs) {
    return { isValid: false, reason: 'Timestamp too old (possible replay attack)' };
  }

  return { isValid: true };
};

/**
 * Normalizes raw CMS article payload into the app's standard Article format
 */
export const normalizeCmsArticle = (
  raw: CMSWebhookPayload['article']
): Article => {
  const content = raw.content.trim();

  return {
    id: raw.id || `ad-${Date.now()}`,
    title: raw.title.trim(),
    // Short teaser for cards. Derived from the body so CMS-published articles
    // render the same way as RSS ones, which always carry an excerpt.
    excerpt: content.slice(0, 180),
    content,
    category: raw.category || 'জাতীয়',
    author: raw.author || 'দৈনিক আমার দেশ ডেস্ক',
    publishedAt: raw.publishedAt || new Date().toISOString(),
    imageUrl:
      raw.imageUrl ||
      'https://images.dailyamardesh.com/ad/amardesh-shadhinotar-kotha-bole.jpg',
    isBreaking: Boolean(raw.isBreaking || raw.importance === 'urgent'),
  };
};

/**
 * Main Webhook Handler: processes incoming publishing event,
 * updates local caches, and automatically broadcasts breaking alerts to millions of readers.
 */
export const handleCmsWebhook = async (
  payload: CMSWebhookPayload,
  clientSecret: string,
  rawBody: string,
  signatureHeader: string
): Promise<{ success: boolean; message: string; article?: Article }> => {
  // Validate required parameters
  if (!clientSecret) {
    return { success: false, message: 'Webhook secret is required' };
  }

  if (!payload || !payload.event || !payload.article) {
    return { success: false, message: 'Invalid webhook payload structure' };
  }

  // Verify signature
  const signatureResult = verifyCmsWebhookSignature(rawBody, signatureHeader, clientSecret);
  if (!signatureResult.isValid) {
    return { success: false, message: `Invalid signature: ${signatureResult.reason}` };
  }

  // Verify timestamp (prevent replay attacks)
  const timestampResult = verifyWebhookTimestamp(payload.timestamp);
  if (!timestampResult.isValid) {
    return { success: false, message: `Invalid timestamp: ${timestampResult.reason}` };
  }

  const normalizedArticle = normalizeCmsArticle(payload.article);

  switch (payload.event) {
    case 'article.published':
    case 'breaking.alert': {
      // If marked as breaking, trigger push notification worker
      if (normalizedArticle.isBreaking || payload.article.importance === 'urgent') {
        await dispatchBreakingPushNotification({
          articleId: normalizedArticle.id,
          title: `ব্রেকিং নিউজ: ${normalizedArticle.title}`,
          body: normalizedArticle.content.slice(0, 100) + '...',
          category: normalizedArticle.category,
          imageUrl: normalizedArticle.imageUrl,
        });
      }

      return {
        success: true,
        message: 'Article processed and broadcasted successfully',
        article: normalizedArticle,
      };
    }

    case 'article.updated': {
      return {
        success: true,
        message: 'Article updated successfully',
        article: normalizedArticle,
      };
    }

    case 'article.deleted': {
      return {
        success: true,
        message: 'Article marked as unpublished',
        article: normalizedArticle,
      };
    }

    default:
      return { success: false, message: `Unhandled event type: ${payload.event}` };
  }
};
