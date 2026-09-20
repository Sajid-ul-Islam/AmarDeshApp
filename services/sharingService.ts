import * as Sharing from 'expo-sharing';
import * as Clipboard from 'expo-clipboard';
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

// Share to WhatsApp
export const shareToWhatsApp = async (article: Article): Promise<void> => {
  const url = generateShareURL(article);
  const text = generateShareText(article);
  const whatsappURL = `https://wa.me/?text=${encodeURIComponent(`${text}\n\n${url}`)}`;
  
  try {
    await Sharing.shareAsync(whatsappURL, {
      dialogTitle: 'WhatsApp এ শেয়ার করুন',
    });
  } catch (error) {
    console.error('Error sharing to WhatsApp:', error);
  }
};

// Share to Facebook
export const shareToFacebook = async (article: Article): Promise<void> => {
  const url = generateShareURL(article);
  const facebookURL = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
  
  try {
    await Sharing.shareAsync(facebookURL, {
      dialogTitle: 'Facebook এ শেয়ার করুন',
    });
  } catch (error) {
    console.error('Error sharing to Facebook:', error);
  }
};

// Share to Twitter
export const shareToTwitter = async (article: Article): Promise<void> => {
  const url = generateShareURL(article);
  const text = generateShareText(article);
  const twitterURL = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
  
  try {
    await Sharing.shareAsync(twitterURL, {
      dialogTitle: 'Twitter এ শেয়ার করুন',
    });
  } catch (error) {
    console.error('Error sharing to Twitter:', error);
  }
};

// Share to Telegram
export const shareToTelegram = async (article: Article): Promise<void> => {
  const url = generateShareURL(article);
  const text = generateShareText(article);
  const telegramURL = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
  
  try {
    await Sharing.shareAsync(telegramURL, {
      dialogTitle: 'Telegram এ শেয়ার করুন',
    });
  } catch (error) {
    console.error('Error sharing to Telegram:', error);
  }
};

// Share via Email
export const shareViaEmail = async (article: Article): Promise<void> => {
  const url = generateShareURL(article);
  const text = generateShareText(article);
  const emailURL = `mailto:?subject=${encodeURIComponent(article.title)}&body=${encodeURIComponent(`${text}\n\n${url}`)}`;
  
  try {
    await Sharing.shareAsync(emailURL, {
      dialogTitle: 'ইমেইলে শেয়ার করুন',
    });
  } catch (error) {
    console.error('Error sharing via email:', error);
  }
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
    const isAvailable = await Sharing.isAvailableAsync();
    
    if (isAvailable) {
      await Sharing.shareAsync(url, {
        dialogTitle: text,
        UTI: 'public.plain-text',
        mimeType: 'text/plain',
      });
    } else {
      // Fallback to clipboard
      await copyLinkToClipboard(article);
    }
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
      await Sharing.shareAsync(imageUri, {
        mimeType: 'image/png',
        dialogTitle: 'শেয়ার করুন',
      });
    }
  } catch (error) {
    console.error('Error sharing image:', error);
  }
};
