import React, { useRef } from 'react';
import { categories } from '../../data/mockData';
import { useAppStore } from '../../store/useAppStore';

interface CategoryTabsProps {
  onCategoryClick: (category: string) => void;
}

export const CategoryTabs: React.FC<CategoryTabsProps> = ({ onCategoryClick }) => {
  const { selectedCategory, setSelectedCategory, isDarkMode } = useAppStore();
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleCategoryClick = (name: string) => {
    setSelectedCategory(name);
    onCategoryClick(name);
  };

  return (
    <div className={`sticky top-14 z-40 ${isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'} border-b`}>
      <div
        ref={scrollRef}
        className="flex overflow-x-auto scrollbar-hide gap-1 px-3 py-2"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => handleCategoryClick(cat.name)}
            className={`whitespace-nowrap px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
              selectedCategory === cat.name
                ? 'bg-green-700 text-white'
                : isDarkMode
                ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>
    </div>
  );
};
