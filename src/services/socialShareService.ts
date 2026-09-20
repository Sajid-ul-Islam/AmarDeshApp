// Social Share Service - Platform-specific sharing

import { Article } from '../types';
import { generateArticleShareUrl } from './deepLinkService';

export type SharePlatform = 
  | 'whatsapp'
  | 'facebook'
  | 'twitter'
  | 'telegram'
  | 'email'
  | 'copy'
  | 'native';

/**
 * Generate share text for an article
 */
export function generateShareText(article: Article): string {
  return `আমার দেশ থেকে একটি সংবাদ: ${article.title}`;
}

/**
 * Share to WhatsApp
 */
export function shareToWhatsApp(article: Article): void {
  const url = generateArticleShareUrl(article.id);
  const text = generateShareText(article);
  const encodedText = encodeURIComponent(`${text}\n\n${url}`);
  window.open(`https://wa.me/?text=${encodedText}`, '_blank');
}

/**
 * Share to Facebook
 */
export function shareToFacebook(article: Article): void {
  const url = generateArticleShareUrl(article.id);
  const encodedUrl = encodeURIComponent(url);
  window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`, '_blank');
}

/**
 * Share to Twitter/X
 */
export function shareToTwitter(article: Article): void {
  const url = generateArticleShareUrl(article.id);
  const text = generateShareText(article);
  const encodedText = encodeURIComponent(text);
  const encodedUrl = encodeURIComponent(url);
  window.open(`https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`, '_blank');
}

/**
 * Share to Telegram
 */
export function shareToTelegram(article: Article): void {
  const url = generateArticleShareUrl(article.id);
  const text = generateShareText(article);
  const encodedText = encodeURIComponent(text);
  const encodedUrl = encodeURIComponent(url);
  window.open(`https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`, '_blank');
}

/**
 * Share via Email
 */
export function shareViaEmail(article: Article): void {
  const url = generateArticleShareUrl(article.id);
  const subject = encodeURIComponent(article.title);
  const body = encodeURIComponent(`${generateShareText(article)}\n\n${url}`);
  window.location.href = `mailto:?subject=${subject}&body=${body}`;
}

/**
 * Copy link to clipboard
 */
export async function copyLinkToClipboard(article: Article): Promise<boolean> {
  const url = generateArticleShareUrl(article.id);
  try {
    await navigator.clipboard.writeText(url);
    return true;
  } catch (error) {
    console.error('Failed to copy link:', error);
    return false;
  }
}

/**
 * Share using native Web Share API
 */
export async function shareNative(article: Article): Promise<boolean> {
  if (!navigator.share) {
    return false;
  }

  const url = generateArticleShareUrl(article.id);
  const text = generateShareText(article);

  try {
    await navigator.share({
      title: article.title,
      text: text,
      url: url,
    });
    return true;
  } catch (error) {
    console.error('Native share failed:', error);
    return false;
  }
}

/**
 * Handle share for a specific platform
 */
export async function shareToPlatform(
  platform: SharePlatform,
  article: Article
): Promise<boolean> {
  switch (platform) {
    case 'whatsapp':
      shareToWhatsApp(article);
      return true;
    
    case 'facebook':
      shareToFacebook(article);
      return true;
    
    case 'twitter':
      shareToTwitter(article);
      return true;
    
    case 'telegram':
      shareToTelegram(article);
      return true;
    
    case 'email':
      shareViaEmail(article);
      return true;
    
    case 'copy':
      return await copyLinkToClipboard(article);
    
    case 'native':
      return await shareNative(article);
    
    default:
      return false;
  }
}
