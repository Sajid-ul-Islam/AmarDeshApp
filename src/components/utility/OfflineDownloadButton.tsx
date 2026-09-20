import React from 'react';
import { Download, Check, Loader } from 'lucide-react';
import { useOfflineStore } from '../../store/useOfflineStore';
import { useAppStore } from '../../store/useAppStore';
import { Article } from '../../types';

interface OfflineDownloadButtonProps {
  article: Article;
}

export const OfflineDownloadButton: React.FC<OfflineDownloadButtonProps> = ({ article }) => {
  const { isDarkMode } = useAppStore();
  const { downloadArticle, removeArticle, isArticleDownloaded, isDownloading } = useOfflineStore();

  const isDownloaded = isArticleDownloaded(article.id);

  const handleToggle = async () => {
    if (isDownloaded) {
      removeArticle(article.id);
    } else {
      await downloadArticle(article);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isDownloading}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
        isDownloaded
          ? isDarkMode
            ? 'bg-green-900/30 text-green-400 hover:bg-green-900/50'
            : 'bg-green-50 text-green-700 hover:bg-green-100'
          : isDarkMode
          ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      } disabled:opacity-50`}
    >
      {isDownloading ? (
        <>
          <Loader size={16} className="animate-spin" />
          <span>ডাউনলোড হচ্ছে...</span>
        </>
      ) : isDownloaded ? (
        <>
          <Check size={16} />
          <span>ডাউনলোড করা আছে</span>
        </>
      ) : (
        <>
          <Download size={16} />
          <span>অফলাইনে পড়ুন</span>
        </>
      )}
    </button>
  );
};
