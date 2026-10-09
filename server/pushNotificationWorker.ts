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
  const total = recipientTokens.length > 0 ? recipientTokens.length : 1; // Default to test device

  const messages = (recipientTokens.length > 0 ? recipientTokens : ['ExponentPushToken[DEMO]']).map(
    (token) => ({
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
    })
  );

  try {
    // If real Expo push tokens exist, execute HTTP request
    if (recipientTokens.length > 0) {
      const response = await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Accept-encoding': 'gzip, deflate',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(messages),
      });

      if (!response.ok) {
        throw new Error(`Expo push API returned status ${response.status}`);
      }
    }

    return {
      success: true,
      totalRecipients: total,
      deliveredCount: total,
      failedCount: 0,
      timestamp: Date.now(),
      batchId,
    };
  } catch (error: any) {
    console.warn(`[PushWorker] Error sending batch ${batchId}:`, error?.message);
    return {
      success: false,
      totalRecipients: total,
      deliveredCount: 0,
      failedCount: total,
      timestamp: Date.now(),
      batchId,
    };
  }
};
