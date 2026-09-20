import React, { useState } from 'react';
import { Header } from './components/common/Header';
import { CategoryTabs } from './components/common/CategoryTabs';
import { BottomNav } from './components/common/BottomNav';
import { Footer } from './components/common/Footer';
import { HomePage } from './pages/HomePage';
import { SearchPage } from './pages/SearchPage';
import { BookmarkPage } from './pages/BookmarkPage';
import { ArticleDetail } from './components/article/ArticleDetail';
import { Article } from './types';
import { useAppStore } from './store/useAppStore';

function App() {
  const { isDarkMode } = useAppStore();
  const [activeTab, setActiveTab] = useState('home');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleArticleClick = (article: Article) => {
    setSelectedArticle(article);
  };

  const handleBackFromArticle = () => {
    setSelectedArticle(null);
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setSelectedArticle(null);
  };

  // If article is selected, show article detail
  if (selectedArticle) {
    return (
      <div className={`${isDarkMode ? 'dark bg-gray-900' : 'bg-white'} min-h-screen`}>
        <ArticleDetail article={selectedArticle} onBack={handleBackFromArticle} />
      </div>
    );
  }

  return (
    <div className={`${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-50'} min-h-screen pb-16`}>
      {/* Header */}
      <Header
        onMenuToggle={() => setIsMenuOpen(!isMenuOpen)}
        onSearchClick={() => setActiveTab('search')}
      />

      {/* Category Tabs */}
      {activeTab === 'home' && (
        <CategoryTabs onCategoryClick={() => {}} />
      )}

      {/* Main Content */}
      <main className="pt-14">
        {activeTab === 'home' && <HomePage onArticleClick={handleArticleClick} />}
        {activeTab === 'search' && <SearchPage onArticleClick={handleArticleClick} />}
        {activeTab === 'bookmarks' && <BookmarkPage onArticleClick={handleArticleClick} />}
        {activeTab === 'categories' && (
          <div className="px-4 py-4">
            <h1 className={`text-lg font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              সকল বিভাগ
            </h1>
            <div className="grid grid-cols-2 gap-3">
              {[
                'জাতীয়', 'রাজনীতি', 'সারা দেশ', 'বাণিজ্য', 'বিনোদন', 'বিশ্ব',
                'খেলা', 'ইসলাম ও জীবন', 'ফিচার', 'মতামত', 'আইন-আদালত',
                'ভিডিও', 'সাহিত্য', 'শিক্ষা', 'স্বাস্থ্য', 'তথ্য-প্রযুক্তি',
                'প্রকৃতি ও পরিবেশ', 'প্রবাস', 'চাকরি', 'কর্পোরেট'
              ].map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    useAppStore.getState().setSelectedCategory(cat);
                    setActiveTab('home');
                  }}
                  className={`p-4 rounded-xl text-left font-medium text-sm transition-all ${
                    isDarkMode
                      ? 'bg-gray-800 text-gray-200 hover:bg-gray-700'
                      : 'bg-white text-gray-800 hover:bg-gray-50 shadow-sm'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        )}
        {activeTab === 'more' && (
          <div className="px-4 py-4">
            <h1 className={`text-lg font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              আরও
            </h1>
            <div className={`rounded-xl p-4 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
              <div className="space-y-4">
                <div>
                  <h3 className={`font-bold text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>আমার দেশ</h3>
                  <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    স্বাধীনতার কথা বলে। জনপ্রিয় বাংলা নিউজ পেপার।
                  </p>
                </div>
                <div className={`border-t pt-3 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  <h3 className={`font-bold text-sm mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>সম্পাদক ও প্রকাশক</h3>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>মাহমুদুর রহমান</p>
                </div>
                <div className={`border-t pt-3 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  <h3 className={`font-bold text-sm mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>লিংকসমূহ</h3>
                  <div className="space-y-2">
                    <a href="https://www.dailyamardesh.com" target="_blank" rel="noopener noreferrer" className="block text-sm text-green-600 hover:underline">
                      🌐 ওয়েবসাইট
                    </a>
                    <a href="https://eamardesh.com" target="_blank" rel="noopener noreferrer" className="block text-sm text-green-600 hover:underline">
                      📰 ই-পেপার
                    </a>
                  </div>
                </div>
                <div className={`border-t pt-3 text-center ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                    সংস্করণ ১.০.০
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      {activeTab === 'home' && <Footer />}

      {/* Bottom Navigation */}
      <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />

      {/* Side Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[60]" onClick={() => setIsMenuOpen(false)}>
          <div className="absolute inset-0 bg-black/50" />
          <div
            className={`absolute right-0 top-0 bottom-0 w-72 ${isDarkMode ? 'bg-gray-900' : 'bg-white'} shadow-xl p-6`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2 mb-6">
              <div className="bg-green-700 text-white font-bold text-lg px-2 py-1 rounded">
                আ.দে
              </div>
              <div>
                <h2 className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>আমার দেশ</h2>
                <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>স্বাধীনতার কথা বলে</p>
              </div>
            </div>
            <nav className="space-y-1">
              {['হোম', 'সর্বশেষ', 'ইপেপার', 'জুলাই বিপ্লব', 'আমার দেশ স্পেশাল'].map((item) => (
                <button
                  key={item}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block w-full text-left px-3 py-2 rounded-lg text-sm ${
                    isDarkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {item}
                </button>
              ))}
            </nav>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
