export interface PushNotificationPayload {
  articleId: string;
  title: string;
  body: string;
  category: string;
  imageUrl?: string;
}

export interface PushDeliveryReport {
  success: boolean;
  totalRecipients: number;
  deliveredCount: number;
  failedCount: number;
  timestamp: number;
  batchId: string;
}

/**
 * Android notification channel id.
 *
 * MUST match `CHANNELS.BREAKING` in services/notificationService.ts, otherwise
 * Android silently drops the notification (no such channel). The previous value
 * was `breaking_news` while the app created `breaking-news`.
 */
const BREAKING_CHANNEL_ID = 'breaking-news';

/**
 * Batches and dispatches push notifications to active mobile app readers
 * using the Expo Push API.
 *
 * `data.articleId` (app-scheme-free) is the preferred payload: the client
 * routes it through `navigationService.openArticle()`. A `url` is not sent,
 * because the app must not be asked to open its own custom scheme.
 */
export const dispatchBreakingPushNotification = async (
  payload: PushNotificationPayload,
  recipientTokens: string[] = []
): Promise<PushDeliveryReport> => {
  const batchId = `push-batch-${Date.now()}`;

  // If no recipients, return early with zero counts (don't fake success)
  if (recipientTokens.length === 0) {
    console.warn('[PushWorker] No recipient tokens provided, skipping push notification');
    return {
      success: true,
      totalRecipients: 0,
      deliveredCount: 0,
      failedCount: 0,
      timestamp: Date.now(),
      batchId,
    };
  }

  const messages = recipientTokens.map((token) => ({
    to: token,
    sound: 'default',
    title: payload.title,
    body: payload.body,
    data: {
      articleId: payload.articleId,
      category: payload.category,
      source: 'push',
    },
    priority: 'high',
    channelId: BREAKING_CHANNEL_ID,
    _displayInForeground: true,
  }));

  try {
    // Expo Push API has a limit of 100 messages per request
    // Chunk messages into batches of 100
    const CHUNK_SIZE = 100;
    let totalDelivered = 0;
    let totalFailed = 0;

    for (let i = 0; i < messages.length; i += CHUNK_SIZE) {
      const chunk = messages.slice(i, i + CHUNK_SIZE);
      
      const response = await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Accept-encoding': 'gzip, deflate',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(chunk),
      });

      if (!response.ok) {
        throw new Error(`Expo push API returned status ${response.status}`);
      }

      const result = await response.json();
      
      // Count successes and failures from response
      if (result.data) {
        result.data.forEach((receipt: any) => {
          if (receipt.status === 'ok') {
            totalDelivered++;
          } else {
            totalFailed++;
            console.warn(`[PushWorker] Failed to deliver to token:`, receipt.details?.error);
          }
        });
      }
    }

    return {
      success: totalFailed === 0,
      totalRecipients: recipientTokens.length,
      deliveredCount: totalDelivered,
      failedCount: totalFailed,
      timestamp: Date.now(),
      batchId,
    };
  } catch (error: any) {
    console.error(`[PushWorker] Error sending batch ${batchId}:`, error?.message);
    return {
      success: false,
      totalRecipients: recipientTokens.length,
      deliveredCount: 0,
      failedCount: recipientTokens.length,
      timestamp: Date.now(),
      batchId,
    };
  }
};
