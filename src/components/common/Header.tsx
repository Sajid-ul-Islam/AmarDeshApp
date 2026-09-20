import React from 'react';
import { Search, Menu, Moon, Sun } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

interface HeaderProps {
  onMenuToggle: () => void;
  onSearchClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuToggle, onSearchClick }) => {
  const { isDarkMode, toggleDarkMode } = useAppStore();

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 ${isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'} border-b shadow-sm`}>
      <div className="flex items-center justify-between px-4 h-14">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="bg-green-700 text-white font-bold text-lg px-2 py-1 rounded">
            আ.দে
          </div>
          <h1 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            আমার দেশ
          </h1>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onSearchClick}
            className={`p-2 rounded-full ${isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'}`}
            aria-label="খুঁজুন"
          >
            <Search size={20} />
          </button>
          <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-full ${isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'}`}
            aria-label="থিম পরিবর্তন"
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button
            onClick={onMenuToggle}
            className={`p-2 rounded-full ${isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'}`}
            aria-label="মেনু"
          >
            <Menu size={20} />
          </button>
        </div>
      </div>
    </header>
  );
};
