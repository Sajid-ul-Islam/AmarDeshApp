// Share Image Service - Generate shareable images for social media stories

import { Article } from '../types';

/**
 * Generate a shareable image for an article (for Instagram/Facebook stories)
 * Returns a data URL that can be downloaded or shared
 */
export async function generateShareImage(article: Article): Promise<string> {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  if (!ctx) {
    throw new Error('Failed to get canvas context');
  }

  // Set canvas size (Instagram story aspect ratio: 9:16)
  canvas.width = 1080;
  canvas.height = 1920;

  // Draw gradient background
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, '#006B3F'); // Brand green
  gradient.addColorStop(1, '#004D2C'); // Darker green
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw decorative elements
  ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.beginPath();
  ctx.arc(200, 300, 400, 0, Math.PI * 2);
  ctx.fill();
  
  ctx.beginPath();
  ctx.arc(900, 1600, 300, 0, Math.PI * 2);
  ctx.fill();

  // Draw logo/brand name at top
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 80px "Noto Sans Bengali", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('আমার দেশ', canvas.width / 2, 200);

  // Draw category badge
  ctx.font = 'bold 40px "Noto Sans Bengali", sans-serif';
  const categoryWidth = ctx.measureText(article.category).width + 60;
  const categoryX = (canvas.width - categoryWidth) / 2;
  
  ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
  ctx.fillRect(categoryX, 350, categoryWidth, 80);
  
  ctx.fillStyle = '#FFFFFF';
  ctx.textAlign = 'center';
  ctx.fillText(article.category, canvas.width / 2, 405);

  // Draw article title (with word wrap)
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 60px "Noto Sans Bengali", sans-serif';
  ctx.textAlign = 'center';
  
  const titleLines = wrapText(ctx, article.title, canvas.width - 200);
  let titleY = 600;
  const lineHeight = 80;
  
  titleLines.forEach((line, index) => {
    if (index < 6) { // Limit to 6 lines
      ctx.fillText(line, canvas.width / 2, titleY + (index * lineHeight));
    }
  });

  // Draw article image if available
  if (article.imageUrl) {
    try {
      const img = await loadImage(article.imageUrl);
      const imgWidth = 800;
      const imgHeight = 450;
      const imgX = (canvas.width - imgWidth) / 2;
      const imgY = titleY + (titleLines.length * lineHeight) + 100;
      
      // Draw image with rounded corners
      ctx.save();
      roundRect(ctx, imgX, imgY, imgWidth, imgHeight, 20);
      ctx.clip();
      ctx.drawImage(img, imgX, imgY, imgWidth, imgHeight);
      ctx.restore();
    } catch (error) {
      console.warn('Failed to load article image:', error);
    }
  }

  // Draw footer with tagline
  ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
  ctx.font = '40px "Noto Sans Bengali", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('স্বাধীনতার কথা বলে', canvas.width / 2, canvas.height - 200);

  // Draw "Swipe up" indicator
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 50px "Noto Sans Bengali", sans-serif';
  ctx.fillText('↑ সোয়াইপ আপ', canvas.width / 2, canvas.height - 100);

  // Convert to data URL
  return canvas.toDataURL('image/png');
}

/**
 * Helper: Wrap text to fit within a width
 */
function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = words[0];

  for (let i = 1; i < words.length; i++) {
    const word = words[i];
    const width = ctx.measureText(currentLine + ' ' + word).width;
    
    if (width < maxWidth) {
      currentLine += ' ' + word;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }
  
  lines.push(currentLine);
  return lines;
}

/**
 * Helper: Load image from URL
 */
function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous'; // Enable CORS
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}

/**
 * Helper: Draw rounded rectangle
 */
function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

/**
 * Download generated image
 */
export function downloadShareImage(dataUrl: string, filename: string = 'share-image.png'): void {
  const link = document.createElement('a');
  link.download = filename;
  link.href = dataUrl;
  link.click();
}
