import React, { useRef, useState } from 'react';
import { MapPin, LayoutGrid } from 'lucide-react';
import { categories } from '../../data/mockData';
import { useAppStore } from '../../store/useAppStore';
import { useLayoutStore } from '../../store/useLayoutStore';
import { useLocationStore } from '../../store/useLocationStore';
import { DistrictPicker } from './DistrictPicker';
import { LocationBadge } from './LocationBadge';

interface CategoryTabsProps {
  onCategoryClick: (category: string) => void;
}

export const CategoryTabs: React.FC<CategoryTabsProps> = ({ onCategoryClick }) => {
  const { isDarkMode, features, selectedCategory, setSelectedCategory } = useAppStore();
  const { setEditMode } = useLayoutStore();
  const { selectedDistrict } = useLocationStore();
  const [showDistrictPicker, setShowDistrictPicker] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleCategoryClick = (name: string) => {
    setSelectedCategory(name);
    onCategoryClick(name);
  };

  return (
    <>
      <div className={`sticky top-14 z-40 ${isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'} border-b`}>
        <div
          ref={scrollRef}
          className="flex overflow-x-auto scrollbar-hide gap-1 px-3 py-2"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {/* Area Selector */}
          {features.hyperLocalFeed && (
            <button
              onClick={() => setShowDistrictPicker(true)}
              className={`flex items-center gap-1 whitespace-nowrap px-3 py-1.5 rounded-full text-sm font-medium transition-all flex-shrink-0 ${
                selectedDistrict
                  ? 'bg-blue-600 text-white'
                  : isDarkMode
                  ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <MapPin size={12} />
              <span>{selectedDistrict || 'এলাকা'}</span>
            </button>
          )}

          {/* Edit Layout Button */}
          {features.dragDropReorder && (
            <button
              onClick={() => setEditMode(true)}
              className={`flex items-center gap-1 whitespace-nowrap px-3 py-1.5 rounded-full text-sm font-medium transition-all flex-shrink-0 ${
                isDarkMode
                  ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              aria-label="লেআউট সম্পাদনা"
            >
              <LayoutGrid size={12} />
            </button>
          )}

          {/* Category Tabs */}
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryClick(cat.name)}
              className={`whitespace-nowrap px-3 py-1.5 rounded-full text-sm font-medium transition-all flex-shrink-0 ${
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

        {/* Location Badge */}
        {selectedDistrict && (
          <div className="px-3 pb-2">
            <LocationBadge />
          </div>
        )}
      </div>

      {/* District Picker Modal */}
      <DistrictPicker isOpen={showDistrictPicker} onClose={() => setShowDistrictPicker(false)} />
    </>
  );
};
