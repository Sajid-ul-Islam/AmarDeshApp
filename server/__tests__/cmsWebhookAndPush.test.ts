import {
  verifyCmsWebhookSignature,
  normalizeCmsArticle,
  handleCmsWebhook,
  CMSWebhookPayload,
} from '../cmsWebhookHandler';
import { dispatchBreakingPushNotification } from '../pushNotificationWorker';
import { createHmac } from 'crypto';

describe('CMS Webhook & Push Notification Server Worker', () => {
  const secretKey = 'test-cms-secret-key-2026';

  it('validates authentic HMAC-SHA256 signatures and rejects tampered ones', () => {
    const rawBody = JSON.stringify({ event: 'article.published', timestamp: 123456 });
    const validSignature = createHmac('sha256', secretKey).update(rawBody).digest('hex');

    const validCheck = verifyCmsWebhookSignature(rawBody, validSignature, secretKey);
    expect(validCheck.isValid).toBe(true);

    const invalidCheck = verifyCmsWebhookSignature(rawBody, 'tampered-signature', secretKey);
    expect(invalidCheck.isValid).toBe(false);
    expect(invalidCheck.reason).toBeDefined();

    const missingCheck = verifyCmsWebhookSignature(rawBody, '', secretKey);
    expect(missingCheck.isValid).toBe(false);
  });

  it('normalizes raw CMS articles with fallback defaults and Bengali attribution', () => {
    const normalized = normalizeCmsArticle({
      id: 'cms-999',
      title: 'নতুন সংস্কার আইন পাস',
      content: 'বিস্তারিত সংসদীয় প্রতিবেদন...',
      category: 'রাজনীতি',
      author: 'সংসদ প্রতিনিধি',
      publishedAt: '2026-10-07T12:00:00Z',
      isBreaking: true,
    });

    expect(normalized.id).toBe('cms-999');
    expect(normalized.title).toBe('নতুন সংস্কার আইন পাস');
    expect(normalized.isBreaking).toBe(true);
    expect(normalized.author).toBe('সংসদ প্রতিনিধি');
    expect(normalized.imageUrl).toBeDefined();
  });

  it('processes article publishing webhook and triggers breaking push delivery', async () => {
    const payload: CMSWebhookPayload = {
      event: 'breaking.alert',
      timestamp: Date.now(),
      article: {
        id: 'ad-breaking-1',
        title: 'অর্থনীতিতে নতুন নীতিমালা ঘোষণা',
        content: 'বাংলাদেশ ব্যাংক আজ বিশেষ প্রজ্ঞাপন জারি করেছে...',
        category: 'অর্থনীতি',
        author: 'নিজস্ব প্রতিবেদক',
        publishedAt: new Date().toISOString(),
        importance: 'urgent',
      },
    };

    const rawBody = JSON.stringify(payload);
    const signature = createHmac('sha256', secretKey).update(rawBody).digest('hex');

    const response = await handleCmsWebhook(payload, secretKey, rawBody, signature);
    expect(response.success).toBe(true);
    expect(response.article?.isBreaking).toBe(true);
    expect(response.article?.title).toContain('অর্থনীতিতে');
  });

  it('dispatches push notifications and generates delivery reports', async () => {
    const report = await dispatchBreakingPushNotification({
      articleId: 'art-push-test',
      title: 'ব্রেকিং নিউজ: পরীক্ষা সফল',
      body: 'সকল টেস্ট সফলভাবে উত্তীর্ণ হয়েছে।',
      category: 'জাতীয়',
    });

    expect(report.success).toBe(true);
    expect(report.batchId).toBeDefined();
    expect(report.totalRecipients).toBeGreaterThanOrEqual(1);
    expect(report.failedCount).toBe(0);
  });
});
