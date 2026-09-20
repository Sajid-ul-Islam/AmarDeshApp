import React from 'react';
import { Article } from '../../types';
import { useAppStore } from '../../store/useAppStore';
import { formatRelativeTime } from '../../utils/bengali';
import { ArrowLeft, Clock, Share2, Bookmark, ExternalLink, Sparkles } from 'lucide-react';

interface ArticleDetailProps {
  article: Article;
  onBack: () => void;
  onAskAI?: (article: Article) => void;
}

export const ArticleDetail: React.FC<ArticleDetailProps> = ({ article, onBack, onAskAI }) => {
  const { isDarkMode, bookmarks, addBookmark, removeBookmark } = useAppStore();
  const isBookmarked = bookmarks.includes(article.id);

  const handleBookmark = () => {
    if (isBookmarked) {
      removeBookmark(article.id);
    } else {
      addBookmark(article.id);
    }
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
      {/* Top Bar */}
      <div className={`sticky top-0 z-50 flex items-center justify-between px-4 h-12 ${isDarkMode ? 'bg-gray-900' : 'bg-white'} border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <button onClick={onBack} className={`p-2 rounded-full ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
          <ArrowLeft size={20} className={isDarkMode ? 'text-white' : 'text-gray-800'} />
        </button>
        <div className="flex items-center gap-2">
          <button onClick={handleBookmark} className={`p-2 rounded-full ${isBookmarked ? 'text-green-600' : isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            <Bookmark size={20} fill={isBookmarked ? 'currentColor' : 'none'} />
          </button>
          <button className={`p-2 rounded-full ${isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'}`}>
            <Share2 size={20} />
          </button>
        </div>
      </div>

      {/* Article Content */}
      <article className="px-4 py-4">
        <img
          src={article.imageUrl}
          alt={article.title}
          className="w-full h-52 object-cover rounded-xl mb-4"
        />
        
        <span className={`text-xs font-medium ${isDarkMode ? 'text-green-400' : 'text-green-700'}`}>
          {article.category}
        </span>
        
        <h1 className={`text-xl font-bold mt-2 leading-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          {article.title}
        </h1>

        <div className={`flex items-center gap-3 mt-3 text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          <span>{article.author}</span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Clock size={12} />
            {formatRelativeTime(article.publishedAt)}
          </span>
        </div>

        <div className={`mt-4 text-base leading-7 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
          <p className="font-medium mb-3">{article.excerpt}</p>
          <p>{article.content}</p>
          <p className="mt-3">
            সংবাদটি গুরুত্বপূর্ণ কারণ এটি দেশের বর্তমান পরিস্থিতি তুলে ধরে। পাঠকদের এই বিষয়ে সচেতন থাকা জরুরি। 
            বিভিন্ন মহল থেকে এই ঘটনাকে নিয়ে বিভিন্ন প্রতিক্রিয়া আসছে।
          </p>
          <p className="mt-3">
            বিশেষজ্ঞরা বলছেন, এই ঘটনার প্রভাব দীর্ঘমেয়াদে দেশের রাজনৈতিক ও সামাজিক ক্ষেত্রে পড়বে। 
            সরকারি পর্যায়ে ইতোমধ্যে পদক্ষেপ নেওয়া শুরু হয়েছে।
          </p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mt-6">
          {article.category && (
            <span className={`text-xs px-2 py-1 rounded-full ${isDarkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
              #{article.category}
            </span>
          )}
        </div>

        {/* Ask AI about this article */}
        {onAskAI && (
          <div className={`mt-6 p-4 rounded-xl ${isDarkMode ? 'bg-purple-900/20 border-purple-800' : 'bg-purple-50 border-purple-200'} border`}>
            <button
              onClick={() => onAskAI(article)}
              className="flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg font-medium text-sm transition-all"
            >
              <Sparkles size={16} />
              AI সহকারীকে জিজ্ঞেস করুন
            </button>
            <p className={`text-xs text-center mt-2 ${isDarkMode ? 'text-purple-300' : 'text-purple-600'}`}>
              এই সংবাদ সম্পর্কে প্রশ্ন করুন
            </p>
          </div>
        )}

        {/* Read Full Article on Website */}
        {article.sourceUrl && (
          <div className={`mt-4 p-4 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-green-50'} border ${isDarkMode ? 'border-gray-700' : 'border-green-200'}`}>
            <a
              href={article.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 bg-green-700 hover:bg-green-800 text-white rounded-lg font-medium text-sm transition-colors"
            >
              <ExternalLink size={16} />
              আমার দেশ ওয়েবসাইটে পড়ুন
            </a>
          </div>
        )}

        {/* Source Credit */}
        <div className={`mt-4 text-center text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
          উৎস: dailyamardesh.com
        </div>
      </article>
    </div>
  );
};
