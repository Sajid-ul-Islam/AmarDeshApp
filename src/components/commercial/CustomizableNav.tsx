import React, { useState } from 'react';
import { GripVertical, Check, X } from 'lucide-react';
import { Home, Search, Sparkles, Bookmark, User, Video, Settings } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

interface NavItem {
  id: string;
  label: string;
  icon: any;
  enabled: boolean;
}

const ALL_NAV_ITEMS: NavItem[] = [
  { id: 'home', label: 'হোম', icon: Home, enabled: true },
  { id: 'search', label: 'খোঁজ', icon: Search, enabled: true },
  { id: 'foryou', label: 'আমার জন্য', icon: Sparkles, enabled: true },
  { id: 'bookmarks', label: 'সেভ', icon: Bookmark, enabled: true },
  { id: 'video', label: 'ভিডিও', icon: Video, enabled: false },
  { id: 'ai', label: 'AI', icon: Sparkles, enabled: false },
  { id: 'more', label: 'আরও', icon: User, enabled: true },
];

export const CustomizableNav: React.FC = () => {
  const { isDarkMode } = useAppStore();
  const [isOpen, setIsOpen] = useState(false);
  const [items, setItems] = useState<NavItem[]>(() => {
    const stored = localStorage.getItem('customNav');
    return stored ? JSON.parse(stored) : ALL_NAV_ITEMS;
  });

  const handleToggle = (id: string) => {
    const updated = items.map((item) =>
      item.id === id ? { ...item, enabled: !item.enabled } : item
    );
    setItems(updated);
    localStorage.setItem('customNav', JSON.stringify(updated));
  };

  const handleReset = () => {
    setItems(ALL_NAV_ITEMS);
    localStorage.setItem('customNav', JSON.stringify(ALL_NAV_ITEMS));
  };

  const enabledCount = items.filter((i) => i.enabled).length;

  return (
    <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className={`font-bold text-sm flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          <Settings size={16} />
          ন্যাভিগেশন কাস্টমাইজ
        </h3>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`text-xs px-3 py-1 rounded ${
            isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          {isOpen ? 'বন্ধ' : 'সম্পাদনা'}
        </button>
      </div>

      {isOpen && (
        <>
          <div className="space-y-2 mb-3">
            {items.map((item) => (
              <div
                key={item.id}
                className={`flex items-center justify-between p-2 rounded-lg ${
                  isDarkMode ? 'bg-gray-700' : 'bg-white'
                }`}
              >
                <div className="flex items-center gap-2">
                  <GripVertical size={14} className={isDarkMode ? 'text-gray-500' : 'text-gray-400'} />
                  <item.icon size={16} />
                  <span className={`text-sm ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                    {item.label}
                  </span>
                </div>
                <button
                  onClick={() => handleToggle(item.id)}
                  className={`w-10 h-6 rounded-full transition-colors ${
                    item.enabled ? 'bg-green-600' : isDarkMode ? 'bg-gray-600' : 'bg-gray-300'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${
                      item.enabled ? 'translate-x-4' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between">
            <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {enabledCount}টি ট্যাব সক্রিয়
            </span>
            <button
              onClick={handleReset}
              className={`text-xs px-3 py-1 rounded ${
                isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              রিসেট
            </button>
          </div>
        </>
      )}
    </div>
  );
};
