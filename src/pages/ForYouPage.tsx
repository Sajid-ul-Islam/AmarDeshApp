import React, { useState, useMemo } from 'react';
import { Sparkles, Settings, Bookmark } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { usePreferencesStore } from '../store/usePreferencesStore';
import { useArticles } from '../hooks/useArticles';
import { NewsCard } from '../components/common/NewsCard';
import { InterestPicker } from '../components/home/InterestPicker';
import { Article } from '../types';

interface ForYouPageProps {
  onArticleClick: (article: Article) => void;
}

export const ForYouPage: React.FC<ForYouPageProps> = ({ onArticleClick }) => {
  const { isDarkMode } = useAppStore();
  const { followedCategories } = usePreferencesStore();
  const { articles, loading } = useArticles();
  const [showInterestPicker, setShowInterestPicker] = useState(false);

  // Filter articles based on followed categories
  const filteredArticles = useMemo(() => {
    if (followedCategories.length === 0) return [];
    
    return articles.filter((article) => 
      followedCategories.includes(article.category)
    );
  }, [articles, followedCategories]);

  // Empty state - no categories followed
  if (followedCategories.length === 0) {
    return (
      <div className="px-4 py-8">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Sparkles size={32} className="text-white" />
          </div>
          <h1 className={`text-xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            আপনার জন্য
          </h1>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            আপনার পছন্দের বিভাগ নির্বাচন করুন
          </p>
        </div>

        <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
          <InterestPicker />
        </div>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="px-4 py-8">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-3 border-green-600 border-t-transparent rounded-full mx-auto mb-3" />
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            লোড হচ্ছে...
          </p>
        </div>
      </div>
    );
  }

  // No articles found
  if (filteredArticles.length === 0) {
    return (
      <div className="px-4 py-8">
        <div className="text-center mb-6">
          <h1 className={`text-xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            আপনার জন্য
          </h1>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            নির্বাচিত বিভাগে কোনো সংবাদ নেই
          </p>
        </div>

        <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm mb-4`}>
          <div className="flex items-center justify-between mb-3">
            <h3 className={`font-bold text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              বিভাগ পরিচালনা
            </h3>
            <button
              onClick={() => setShowInterestPicker(!showInterestPicker)}
              className="text-xs text-green-600 hover:underline"
            >
              {showInterestPicker ? 'লুকান' : 'সম্পাদনা'}
            </button>
          </div>
          {showInterestPicker && <InterestPicker />}
        </div>

        <div className={`p-6 rounded-xl text-center ${isDarkMode ? 'bg-yellow-900/20 border-yellow-800' : 'bg-yellow-50 border-yellow-200'} border`}>
          <p className={`text-sm ${isDarkMode ? 'text-yellow-300' : 'text-yellow-700'}`}>
            আরও বিভাগ অনুসরণ করে দেখুন
          </p>
        </div>
      </div>
    );
  }

  // Articles found
  return (
    <div className="px-4 py-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles size={20} className="text-green-600" />
          <h1 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            আপনার জন্য
          </h1>
        </div>
        <button
          onClick={() => setShowInterestPicker(!showInterestPicker)}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium ${
            isDarkMode ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <Settings size={14} />
          পরিচালনা
        </button>
      </div>

      {/* Interest Picker (collapsible) */}
      {showInterestPicker && (
        <div className={`p-4 rounded-xl mb-4 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
          <InterestPicker onClose={() => setShowInterestPicker(false)} />
        </div>
      )}

      {/* Info Banner */}
      <div className={`px-3 py-2 rounded-lg text-xs mb-4 ${
        isDarkMode ? 'bg-green-900/30 text-green-400' : 'bg-green-50 text-green-700'
      }`}>
        🔥 আপনার আগ্রহের উপর ভিত্তি করে — {followedCategories.length}টি বিভাগ
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-2 gap-3">
        {filteredArticles.slice(0, 10).map((article) => (
          <NewsCard key={article.id} article={article} variant="standard" onClick={onArticleClick} />
        ))}
      </div>

      {/* More Articles */}
      {filteredArticles.length > 10 && (
        <div className="mt-4">
          <h2 className={`text-base font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            আরও সংবাদ
          </h2>
          <div className="space-y-0">
            {filteredArticles.slice(10).map((article) => (
              <NewsCard key={article.id} article={article} variant="horizontal" onClick={onArticleClick} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
