import React from 'react';
import { Gift, Share2, Copy, Check } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { Article } from '../../types';

interface GiftArticleProps {
  article: Article;
}

export const GiftArticle: React.FC<GiftArticleProps> = ({ article }) => {
  const { isDarkMode } = useAppStore();
  const [copied, setCopied] = React.useState(false);

  const shareUrl = `${window.location.origin}?article=${article.id}&shared=true`;

  const handleShare = async () => {
    const shareData = {
      title: article.title,
      text: `আমার দেশ থেকে একটি সংবাদ: ${article.title}`,
      url: shareUrl,
    };

    // Try Web Share API first
    if (navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch (err) {
        console.log('Share cancelled or failed');
      }
    }

    // Fallback: copy to clipboard
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <button
      onClick={handleShare}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
        isDarkMode
          ? 'bg-pink-900/30 text-pink-400 hover:bg-pink-900/50'
          : 'bg-pink-50 text-pink-700 hover:bg-pink-100'
      }`}
    >
      {copied ? (
        <>
          <Check size={16} />
          <span>কপি হয়েছে!</span>
        </>
      ) : (
        <>
          <Gift size={16} />
          <span>উপহার দিন</span>
        </>
      )}
    </button>
  );
};
