import React from 'react';
import { Article } from '../types';
import { useAppStore } from '../store/useAppStore';
import { useArticles } from '../hooks/useArticles';
import { NewsCard } from '../components/common/NewsCard';
import { PrayerTimes } from '../components/common/PrayerTimes';
import { CardFeed } from '../components/home/CardFeed';
import { EditLayoutMode } from '../components/home/EditLayoutMode';
import { formatRelativeTime } from '../utils/bengali';
import { RefreshCw, Wifi, WifiOff, List, Layers } from 'lucide-react';

interface HomePageProps {
  onArticleClick: (article: Article) => void;
}

// Skeleton loader component
const SkeletonCard: React.FC = () => {
  const { isDarkMode } = useAppStore();
  return (
    <div className={`rounded-xl overflow-hidden ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm animate-pulse`}>
      <div className={`w-full h-40 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`} />
      <div className="p-3 space-y-2">
        <div className={`h-3 w-16 rounded ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`} />
        <div className={`h-4 w-full rounded ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`} />
        <div className={`h-4 w-3/4 rounded ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`} />
        <div className={`h-3 w-20 rounded ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`} />
      </div>
    </div>
  );
};

export const HomePage: React.FC<HomePageProps> = ({ onArticleClick }) => {
  const { isDarkMode, selectedCategory, feedMode, setFeedMode, features } = useAppStore();
  const { articles, loading, error, refresh, isLiveData } = useArticles(selectedCategory);

  const heroArticle = articles[0];
  const restArticles = articles.slice(1);

  // Card mode view
  if (feedMode === 'cards' && features.swipeCardFeed) {
    return (
      <div className="py-4">
        {/* Mode Toggle */}
        <div className="flex items-center justify-between px-4 mb-3">
          <div className={`flex items-center gap-1.5 text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            <Layers size={12} />
            <span>কার্ড মোড</span>
          </div>
          <button
            onClick={() => setFeedMode('list')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium ${
              isDarkMode ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <List size={12} />
            তালিকা
          </button>
        </div>
        <CardFeed articles={articles} onArticleClick={onArticleClick} />
      </div>
    );
  }

  // List mode view (with optional edit layout)
  const homeContent = (
    <div className="px-4 py-4 space-y-5">
      {/* Live Data Indicator + Mode Toggle */}
      <div className="flex items-center justify-between">
        <div className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs ${
          isLiveData 
            ? isDarkMode ? 'bg-green-900/30 text-green-400' : 'bg-green-50 text-green-700'
            : isDarkMode ? 'bg-yellow-900/30 text-yellow-400' : 'bg-yellow-50 text-yellow-700'
        }`}>
          {isLiveData ? <Wifi size={12} /> : <WifiOff size={12} />}
          <span>{isLiveData ? 'লাইভ' : 'ডেমো'}</span>
          <button
            onClick={refresh}
            disabled={loading}
            className={`ml-1 p-1 rounded ${loading ? 'opacity-50' : ''}`}
          >
            <RefreshCw size={10} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>

        {/* Card Mode Toggle */}
        {features.swipeCardFeed && (
          <button
            onClick={() => setFeedMode('cards')}
            className={`flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-medium ${
              isDarkMode ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Layers size={12} />
            কার্ড
          </button>
        )}
      </div>

      {/* Prayer Times Widget */}
      <PrayerTimes />

      {/* Loading State */}
      {loading && articles.length === 0 && (
        <div className="space-y-4">
          <div className={`rounded-xl overflow-hidden ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-md animate-pulse`}>
            <div className={`w-full h-56 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className={`p-3 rounded-lg text-sm text-center ${isDarkMode ? 'bg-red-900/30 text-red-400' : 'bg-red-50 text-red-600'}`}>
          {error}
        </div>
      )}

      {/* Hero Article */}
      {heroArticle && !loading && (
        <NewsCard article={heroArticle} variant="hero" onClick={onArticleClick} />
      )}

      {/* News Grid */}
      {!loading && restArticles.length > 0 && (
        <div className="grid grid-cols-2 gap-3">
          {restArticles.slice(0, 4).map((article) => (
            <NewsCard key={article.id} article={article} variant="standard" onClick={onArticleClick} />
          ))}
        </div>
      )}

      {/* Most Read Section */}
      {!loading && articles.length > 5 && (
        <div className={`rounded-xl p-4 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
          <h2 className={`text-base font-bold mb-3 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            <span className="text-red-500">🔥</span> সর্বাধিক পঠিত
          </h2>
          <div className="space-y-1">
            {articles.slice(0, 5).map((article, index) => (
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
      )}

      {/* More Articles */}
      {!loading && restArticles.length > 4 && (
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

      {/* Empty State */}
      {!loading && articles.length === 0 && (
        <div className="text-center py-12">
          <p className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            কোনো সংবাদ পাওয়া যায়নি
          </p>
          <button
            onClick={refresh}
            className="mt-3 px-4 py-2 bg-green-700 text-white rounded-lg text-sm"
          >
            আবার চেষ্টা করুন
          </button>
        </div>
      )}
    </div>
  );

  // Wrap in EditLayoutMode if feature is enabled
  if (features.dragDropReorder) {
    return <EditLayoutMode>{homeContent}</EditLayoutMode>;
  }

  return homeContent;
};
