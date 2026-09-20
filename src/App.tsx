import React, { useState, useEffect } from 'react';
import { Header } from './components/common/Header';
import { CategoryTabs } from './components/common/CategoryTabs';
import { BottomNav } from './components/common/BottomNav';
import { Footer } from './components/common/Footer';
import { HomePage } from './pages/HomePage';
import { SearchPage } from './pages/SearchPage';
import { BookmarkPage } from './pages/BookmarkPage';
import { ArticleDetail } from './components/article/ArticleDetail';
import { AIChat } from './components/ai/AIChat';
import { AISettings } from './components/ai/AISettings';
import { Article } from './types';
import { useAppStore } from './store/useAppStore';
import { useAIStore } from './store/useAIStore';

function App() {
  const { isDarkMode } = useAppStore();
  const { loadFromStorage } = useAIStore();
  const [activeTab, setActiveTab] = useState('home');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [showAISettings, setShowAISettings] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Load AI config from storage on mount
  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  const handleArticleClick = (article: Article) => {
    setSelectedArticle(article);
  };

  const handleBackFromArticle = () => {
    setSelectedArticle(null);
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setSelectedArticle(null);
    setShowAISettings(false);
  };

  // If AI settings is shown
  if (showAISettings) {
    return (
      <div className={`${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-50'} min-h-screen`}>
        <AISettings onBack={() => setShowAISettings(false)} />
      </div>
    );
  }

  // Handle "Ask AI" from article
  const handleAskAI = (_article: Article) => {
    setSelectedArticle(null);
    setActiveTab('ai');
  };

  // If article is selected, show article detail
  if (selectedArticle) {
    return (
      <div className={`${isDarkMode ? 'dark bg-gray-900' : 'bg-white'} min-h-screen`}>
        <ArticleDetail
          article={selectedArticle}
          onBack={handleBackFromArticle}
          onAskAI={handleAskAI}
        />
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
      <main className={`${activeTab === 'ai' ? 'h-screen pt-14' : 'pt-14'}`}>
        {activeTab === 'home' && <HomePage onArticleClick={handleArticleClick} />}
        {activeTab === 'search' && <SearchPage onArticleClick={handleArticleClick} />}
        {activeTab === 'bookmarks' && <BookmarkPage onArticleClick={handleArticleClick} />}
        {activeTab === 'ai' && (
          <div className="h-full">
            <AIChat
              articleContext={undefined}
              onSettingsClick={() => setShowAISettings(true)}
            />
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
                  <h3 className={`font-bold text-sm mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>AI সহকারী</h3>
                  <p className={`text-xs mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    BYoak - Bring Your Own API Key
                  </p>
                  <button
                    onClick={() => setShowAISettings(true)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm ${isDarkMode ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                  >
                    ⚙️ AI সেটিংস
                  </button>
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
