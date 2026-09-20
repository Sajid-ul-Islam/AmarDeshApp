import React from 'react';
import { Play, Clock } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { usePlayerStore } from '../../store/usePlayerStore';
import { useArticles } from '../../hooks/useArticles';
import { Article } from '../../types';

export const ThreeMinUpdate: React.FC = () => {
  const { isDarkMode } = useAppStore();
  const { articles } = useArticles();
  const { addToQueue, play, currentArticle, isPlaying } = usePlayerStore();

  // Get top 5 breaking/important articles
  const topArticles = articles
    .filter((a) => a.isBreaking || articles.indexOf(a) < 5)
    .slice(0, 5);

  const handlePlayAll = () => {
    if (topArticles.length === 0) return;
    
    // Add all to queue
    topArticles.forEach((article) => addToQueue(article));
    
    // Start playing first
    play(topArticles[0]);
  };

  if (topArticles.length === 0) return null;

  return (
    <div className={`rounded-xl p-4 ${isDarkMode ? 'bg-gradient-to-br from-purple-900/40 to-blue-900/40 border-purple-800' : 'bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200'} border`}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className={`text-base font-bold flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            <Clock size={16} className="text-purple-600" />
            ৩ মিনিট আপডেট
          </h3>
          <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            আজকের গুরুত্বপূর্ণ সংবাদ
          </p>
        </div>
        <button
          onClick={handlePlayAll}
          className="flex items-center gap-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors"
        >
          <Play size={14} fill="currentColor" />
          চালান
        </button>
      </div>

      {/* Article List */}
      <div className="space-y-2">
        {topArticles.map((article, index) => (
          <div
            key={article.id}
            className={`flex items-center gap-2 text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}
          >
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
              isDarkMode ? 'bg-purple-800 text-purple-300' : 'bg-purple-100 text-purple-700'
            }`}>
              {index + 1}
            </span>
            <span className="flex-1 truncate">{article.title}</span>
          </div>
        ))}
      </div>

      <p className={`text-[10px] mt-3 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
        মোট {topArticles.length}টি সংবাদ • আনুমানিক ৩ মিনিট
      </p>
    </div>
  );
};
