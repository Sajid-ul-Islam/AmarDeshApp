import React from 'react';
import { Article } from '../types';
import { articles, mostReadArticles } from '../data/mockData';
import { useAppStore } from '../store/useAppStore';
import { NewsCard } from '../components/common/NewsCard';
import { PrayerTimes } from '../components/common/PrayerTimes';
import { formatRelativeTime } from '../utils/bengali';

interface HomePageProps {
  onArticleClick: (article: Article) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onArticleClick }) => {
  const { isDarkMode, selectedCategory } = useAppStore();

  const filteredArticles = selectedCategory === 'সর্বশেষ'
    ? articles
    : articles.filter((a) => a.category === selectedCategory);

  const heroArticle = filteredArticles[0];
  const restArticles = filteredArticles.slice(1);

  return (
    <div className="px-4 py-4 space-y-5">
      {/* Prayer Times Widget */}
      <PrayerTimes />

      {/* Hero Article */}
      {heroArticle && (
        <NewsCard article={heroArticle} variant="hero" onClick={onArticleClick} />
      )}

      {/* News Grid */}
      <div className="grid grid-cols-2 gap-3">
        {restArticles.slice(0, 4).map((article) => (
          <NewsCard key={article.id} article={article} variant="standard" onClick={onArticleClick} />
        ))}
      </div>

      {/* Most Read Section */}
      <div className={`rounded-xl p-4 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
        <h2 className={`text-base font-bold mb-3 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          <span className="text-red-500">🔥</span> সর্বাধিক পঠিত
        </h2>
        <div className="space-y-1">
          {mostReadArticles.slice(0, 5).map((article, index) => (
            <div
              key={article.id}
              onClick={() => onArticleClick(article)}
              className={`flex items-center gap-3 py-2 border-b last:border-b-0 cursor-pointer ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`}
            >
              <span className={`text-sm font-bold w-5 text-center ${isDarkMode ? 'text-green-400' : 'text-green-700'}`}>
                {index + 1}
              </span>
              <div className="flex-1 min-w-0">
                <h4 className={`text-sm line-clamp-1 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                  {article.title}
                </h4>
                <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                  {formatRelativeTime(article.publishedAt)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* More Articles */}
      {restArticles.length > 4 && (
        <div>
          <h2 className={`text-base font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            আরও সংবাদ
          </h2>
          <div className="space-y-0">
            {restArticles.slice(4).map((article) => (
              <NewsCard key={article.id} article={article} variant="horizontal" onClick={onArticleClick} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
