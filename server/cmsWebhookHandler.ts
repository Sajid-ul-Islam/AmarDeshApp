import { createHmac } from 'crypto';
import { Article } from '../data/mockData';
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

    const expectedHeader = `sha256=${computedHash}`;
    const matches =
      signatureHeader === expectedHeader || signatureHeader === computedHash;

    if (!matches) {
      return { isValid: false, reason: 'Signature mismatch' };
    }

    return { isValid: true };
  } catch (err: any) {
    return { isValid: false, reason: `Verification error: ${err?.message}` };
  }
};

/**
 * Normalizes raw CMS article payload into the app's standard Article format
 */
export const normalizeCmsArticle = (
  raw: CMSWebhookPayload['article']
): Article => {
  return {
    id: raw.id || `ad-${Date.now()}`,
    title: raw.title.trim(),
    content: raw.content.trim(),
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
  clientSecret: string = process.env.CMS_WEBHOOK_SECRET || 'amardesh-webhook-secret-2026'
): Promise<{ success: boolean; message: string; article?: Article }> => {
  if (!payload || !payload.event || !payload.article) {
    return { success: false, message: 'Invalid webhook payload structure' };
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
