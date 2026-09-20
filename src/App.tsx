import React, { useState, useEffect } from 'react';
import { Header } from './components/common/Header';
import { CategoryTabs } from './components/common/CategoryTabs';
import { BottomNav } from './components/common/BottomNav';
import { Footer } from './components/common/Footer';
import { HomePage } from './pages/HomePage';
import { SearchPage } from './pages/SearchPage';
import { BookmarkPage } from './pages/BookmarkPage';
import { ForYouPage } from './pages/ForYouPage';
import { ArticleDetail } from './components/article/ArticleDetail';
import { AIChat } from './components/ai/AIChat';
import { AISettings } from './components/ai/AISettings';
import { MiniPlayer } from './components/media/MiniPlayer';
import { ListenMode } from './components/media/ListenMode';
import { VideoFeed } from './components/media/VideoFeed';
import { Article } from './types';
import { useAppStore } from './store/useAppStore';
import { useAIStore } from './store/useAIStore';
import { useLayoutStore } from './store/useLayoutStore';
import { usePreferencesStore } from './store/usePreferencesStore';
import { useLocationStore } from './store/useLocationStore';
import { usePlayerStore } from './store/usePlayerStore';
import { useReactionsStore } from './store/useReactionsStore';
import { useOfflineStore } from './store/useOfflineStore';
import { useReadingStore } from './store/useReadingStore';
import { useAdsStore } from './store/useAdsStore';
import { FontSizeControl } from './components/utility/FontSizeControl';
import { CustomizableNav } from './components/commercial/CustomizableNav';

function App() {
  const { isDarkMode, features, loadFromStorage: loadAppStorage } = useAppStore();
  const { loadFromStorage: loadAIStorage } = useAIStore();
  const { loadFromStorage: loadLayoutStorage } = useLayoutStore();
  const { loadFromStorage: loadPreferencesStorage } = usePreferencesStore();
  const { loadFromStorage: loadLocationStorage } = useLocationStore();
  const { loadFromStorage: loadReactionsStorage } = useReactionsStore();
  const { loadFromStorage: loadOfflineStorage } = useOfflineStore();
  const { loadFromStorage: loadReadingStorage } = useReadingStore();
  const { loadFromStorage: loadAdsStorage } = useAdsStore();

  const [activeTab, setActiveTab] = useState('home');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [showAISettings, setShowAISettings] = useState(false);
  const [showAIChat, setShowAIChat] = useState(false);
  const [showListenMode, setShowListenMode] = useState(false);
  const [showVideoFeed, setShowVideoFeed] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Load all stores from storage on mount
  useEffect(() => {
    loadAppStorage();
    loadAIStorage();
    loadLayoutStorage();
    loadPreferencesStorage();
    loadLocationStorage();
    loadReactionsStorage();
    loadOfflineStorage();
    loadReadingStorage();
    loadAdsStorage();
  }, [loadAppStorage, loadAIStorage, loadLayoutStorage, loadPreferencesStorage, loadLocationStorage, loadReactionsStorage, loadOfflineStorage, loadReadingStorage, loadAdsStorage]);

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
    setShowAIChat(false);
  };

  // Handle "Listen" from article
  const handleListen = (article: Article) => {
    setSelectedArticle(null);
    usePlayerStore.getState().play(article);
    setShowListenMode(true);
  };

  // If Video Feed is shown
  if (showVideoFeed && features.verticalVideo) {
    return <VideoFeed onBack={() => setShowVideoFeed(false)} />;
  }

  // If Listen Mode is shown
  if (showListenMode && features.ttsListenMode) {
    return <ListenMode onClose={() => setShowListenMode(false)} />;
  }

  // If AI settings is shown
  if (showAISettings) {
    return (
      <div className={`${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-50'} min-h-screen`}>
        <AISettings onBack={() => setShowAISettings(false)} />
      </div>
    );
  }

  // If AI chat is shown (from More menu)
  if (showAIChat) {
    return (
      <div className={`${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-50'} h-screen flex flex-col`}>
        <div className="flex items-center gap-3 px-4 py-3 bg-white dark:bg-gray-800 border-b dark:border-gray-700">
          <button
            onClick={() => setShowAIChat(false)}
            className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
          >
            ←
          </button>
          <h1 className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>AI সহকারী</h1>
        </div>
        <div className="flex-1">
          <AIChat onSettingsClick={() => setShowAISettings(true)} />
        </div>
      </div>
    );
  }

  // If article is selected, show article detail
  if (selectedArticle) {
    return (
      <div className={`${isDarkMode ? 'dark bg-gray-900' : 'bg-white'} min-h-screen`}>
        <ArticleDetail
          article={selectedArticle}
          onBack={handleBackFromArticle}
          onAskAI={() => {
            setSelectedArticle(null);
            setShowAIChat(true);
          }}
          onListen={features.ttsListenMode ? handleListen : undefined}
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

      {/* Category Tabs (only on home) */}
      {activeTab === 'home' && (
        <CategoryTabs onCategoryClick={() => {}} />
      )}

      {/* Main Content */}
      <main className={`${activeTab === 'ai' || activeTab === 'foryou' ? '' : ''} pt-14`}>
        {activeTab === 'home' && <HomePage onArticleClick={handleArticleClick} />}
        {activeTab === 'search' && <SearchPage onArticleClick={handleArticleClick} />}
        {activeTab === 'bookmarks' && <BookmarkPage onArticleClick={handleArticleClick} />}
        {activeTab === 'foryou' && features.forYouTab && (
          <ForYouPage onArticleClick={handleArticleClick} />
        )}
        {activeTab === 'ai' && !features.forYouTab && (
          <div className="h-[calc(100vh-120px)]">
            <AIChat onSettingsClick={() => setShowAISettings(true)} />
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

                {/* AI Assistant */}
                <div className={`border-t pt-3 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  <h3 className={`font-bold text-sm mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>AI সহকারী</h3>
                  <p className={`text-xs mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    BYoak - Bring Your Own API Key
                  </p>
                  <button
                    onClick={() => setShowAIChat(true)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm mb-2 ${isDarkMode ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                  >
                    💬 AI চ্যাট খুলুন
                  </button>
                  <button
                    onClick={() => setShowAISettings(true)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm ${isDarkMode ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                  >
                    ⚙️ AI সেটিংস
                  </button>
                </div>

                {/* Video Feed */}
                {features.verticalVideo && (
                  <div className={`border-t pt-3 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <h3 className={`font-bold text-sm mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>ভিডিও</h3>
                    <button
                      onClick={() => setShowVideoFeed(true)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm ${isDarkMode ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    >
                      ▶️ ভিডিও ফিড
                    </button>
                  </div>
                )}

                {/* Font Size Control (D3) */}
                {features.fontSizeControl && (
                  <div className={`border-t pt-3 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <FontSizeControl />
                  </div>
                )}

                {/* Customizable Nav (E3) */}
                {features.customizableNav && (
                  <div className={`border-t pt-3 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <CustomizableNav />
                  </div>
                )}

                {/* Feature Flags (Developer) */}
                <div className={`border-t pt-3 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  <h3 className={`font-bold text-sm mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    🚩 ফিচার ফ্ল্যাগ
                  </h3>
                  <div className="space-y-2">
                    {Object.entries(features).map(([key, value]) => (
                      <label key={key} className="flex items-center justify-between">
                        <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {key}
                        </span>
                        <input
                          type="checkbox"
                          checked={value}
                          onChange={() => useAppStore.getState().toggleFeature(key as any)}
                          className="rounded text-green-600"
                        />
                      </label>
                    ))}
                  </div>
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
                    সংস্করণ ১.३.० (Groups A-E)
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      {activeTab === 'home' && <Footer />}

      {/* Mini Player */}
      {features.miniPlayer && (
        <MiniPlayer onExpand={() => setShowListenMode(true)} />
      )}

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
