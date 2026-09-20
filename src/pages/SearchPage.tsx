import React, { useState, useMemo } from 'react';
import { Search, X } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { useArticles } from '../hooks/useArticles';
import { NewsCard } from '../components/common/NewsCard';
import { Article } from '../types';

interface SearchPageProps {
  onArticleClick: (article: Article) => void;
}

export const SearchPage: React.FC<SearchPageProps> = ({ onArticleClick }) => {
  const { isDarkMode } = useAppStore();
  const { articles, loading, isLiveData } = useArticles();
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const lowerQuery = query.toLowerCase();
    return articles.filter(
      (a) =>
        a.title.toLowerCase().includes(lowerQuery) ||
        a.excerpt.toLowerCase().includes(lowerQuery) ||
        a.category.toLowerCase().includes(lowerQuery)
    );
  }, [query, articles]);

  return (
    <div className="px-4 py-4">
      {/* Search Input */}
      <div className={`flex items-center gap-2 px-4 py-3 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'} mb-4`}>
        <Search size={18} className={isDarkMode ? 'text-gray-400' : 'text-gray-500'} />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="সংবাদ খুঁজুন..."
          className={`flex-1 bg-transparent outline-none text-sm ${isDarkMode ? 'text-white placeholder:text-gray-500' : 'text-gray-900 placeholder:text-gray-400'}`}
          autoFocus
        />
        {query && (
          <button onClick={() => setQuery('')} className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>
            <X size={18} />
          </button>
        )}
      </div>

      {/* Data source indicator */}
      {!query && (
        <div className={`text-xs text-center mb-4 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
          {isLiveData ? '🟢 লাইভ ডেটা থেকে খুঁজছেন' : '🟡 ডেমো ডেটা থেকে খুঁজছেন'} • {articles.length}টি সংবাদ
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="text-center py-8">
          <div className="animate-spin h-6 w-6 border-2 border-green-600 border-t-transparent rounded-full mx-auto mb-2" />
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>সংবাদ লোড হচ্ছে...</p>
        </div>
      )}

      {/* Results */}
      {query && !loading && results.length === 0 && (
        <div className="text-center py-12">
          <p className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            কোনো ফলাফল পাওয়া যায়নি
          </p>
          <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            অন্য কিছু দিয়ে চেষ্টা করুন
          </p>
        </div>
      )}

      {results.length > 0 && (
        <div>
          <p className={`text-xs mb-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {results.length}টি ফলাফল পাওয়া গেছে
          </p>
          <div className="space-y-0">
            {results.map((article) => (
              <NewsCard key={article.id} article={article} variant="horizontal" onClick={onArticleClick} />
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {!query && !loading && (
        <div className="text-center py-12">
          <Search size={48} className={`mx-auto mb-3 ${isDarkMode ? 'text-gray-600' : 'text-gray-300'}`} />
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            সংবাদ খুঁজতে উপরে টাইপ করুন
          </p>
        </div>
      )}
    </div>
  );
};
