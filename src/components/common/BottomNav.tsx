import React from 'react';
import { Home, Search, Sparkles, Bookmark, User } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  const { isDarkMode, features } = useAppStore();

  // Determine tabs based on feature flags
  const tabs = [
    { id: 'home', label: 'হোম', icon: Home },
    { id: 'search', label: 'খোঁজ', icon: Search },
    // Replace AI with For You if feature is enabled
    ...(features.forYouTab
      ? [{ id: 'foryou', label: 'আমার জন্য', icon: Sparkles }]
      : [{ id: 'ai', label: 'AI', icon: Sparkles }]),
    { id: 'bookmarks', label: 'সেভ', icon: Bookmark },
    { id: 'more', label: 'আরও', icon: User },
  ];

  return (
    <nav className={`fixed bottom-0 left-0 right-0 z-50 ${isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'} border-t`}>
      <div className="flex items-center justify-around h-14">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center gap-0.5 px-3 py-1 rounded-lg transition-colors ${
                isActive
                  ? 'text-green-700'
                  : isDarkMode
                  ? 'text-gray-400 hover:text-gray-200'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              aria-label={tab.label}
            >
              <Icon size={20} />
              <span className="text-[10px] font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
