import * as Sharing from 'expo-sharing';
import * as Clipboard from 'expo-clipboard';
import * as Linking from 'expo-linking';
import { Share } from 'react-native';
import { Article } from '../data/mockData';
import { generateArticleLink } from './deepLinkService';

export type SharePlatform = 
  | 'whatsapp'
  | 'facebook'
  | 'twitter'
  | 'telegram'
  | 'email'
  | 'copy'
  | 'native';

export const generateShareText = (article: Article): string => {
  return `আমার দেশ থেকে একটি সংবাদ: ${article.title}`;
};

export const generateShareURL = (article: Article): string => {
  return generateArticleLink(article.id);
};

/**
 * Open a share-intent URL in the browser/app (mailto, wa.me, twitter intents).
 *
 * Note: `Sharing.shareAsync` only accepts local file URIs — passing remote
 * https URLs throws at runtime, so platform intents use `Linking.openURL`.
 */
const openShareURL = async (url: string): Promise<void> => {
  try {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      // Fallback to the system share sheet
      await Share.share({ message: url });
    }
  } catch (error) {
    console.error('Error opening share URL:', error);
  }
};

// Share to WhatsApp
export const shareToWhatsApp = async (article: Article): Promise<void> => {
  const url = generateShareURL(article);
  const text = generateShareText(article);
  const whatsappURL = `https://wa.me/?text=${encodeURIComponent(`${text}\n\n${url}`)}`;

  await openShareURL(whatsappURL);
};

// Share to Facebook
export const shareToFacebook = async (article: Article): Promise<void> => {
  const url = generateShareURL(article);
  const facebookURL = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;

  await openShareURL(facebookURL);
};

// Share to Twitter
export const shareToTwitter = async (article: Article): Promise<void> => {
  const url = generateShareURL(article);
  const text = generateShareText(article);
  const twitterURL = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;

  await openShareURL(twitterURL);
};

// Share to Telegram
export const shareToTelegram = async (article: Article): Promise<void> => {
  const url = generateShareURL(article);
  const text = generateShareText(article);
  const telegramURL = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;

  await openShareURL(telegramURL);
};

// Share via Email
export const shareViaEmail = async (article: Article): Promise<void> => {
  const url = generateShareURL(article);
  const text = generateShareText(article);
  const emailURL = `mailto:?subject=${encodeURIComponent(article.title)}&body=${encodeURIComponent(`${text}\n\n${url}`)}`;

  await openShareURL(emailURL);
};

// Copy link to clipboard
export const copyLinkToClipboard = async (article: Article): Promise<boolean> => {
  const url = generateShareURL(article);
  
  try {
    await Clipboard.setStringAsync(url);
    return true;
  } catch (error) {
    console.error('Error copying to clipboard:', error);
    return false;
  }
};

// Native share (system share sheet)
export const shareNative = async (article: Article): Promise<void> => {
  const url = generateShareURL(article);
  const text = generateShareText(article);

  try {
    // RN Share handles text/URL sharing on both platforms without needing
    // a local file, unlike Sharing.shareAsync which requires file URIs.
    await Share.share({
      message: `${text}\n\n${url}`,
      url,
      title: article.title,
    } as Parameters<typeof Share.share>[0]);
  } catch (error) {
    console.error('Error sharing natively:', error);
  }
};

// Share to specific platform
export const shareToPlatform = async (
  platform: SharePlatform,
  article: Article
): Promise<void> => {
  switch (platform) {
    case 'whatsapp':
      await shareToWhatsApp(article);
      break;
    case 'facebook':
      await shareToFacebook(article);
      break;
    case 'twitter':
      await shareToTwitter(article);
      break;
    case 'telegram':
      await shareToTelegram(article);
      break;
    case 'email':
      await shareViaEmail(article);
      break;
    case 'copy':
      await copyLinkToClipboard(article);
      break;
    case 'native':
      await shareNative(article);
      break;
  }
};

// Share image (for Instagram/Facebook stories)
export const shareImage = async (imageUri: string): Promise<void> => {
  try {
    const isAvailable = await Sharing.isAvailableAsync();
    
    if (isAvailable) {
      // Sharing.shareAsync requires a local file URI
      await Sharing.shareAsync(imageUri, {
        mimeType: 'image/png',
        dialogTitle: 'শেয়ার করুন',
      });
    }
  } catch (error) {
    console.error('Error sharing image:', error);
  }
};
