import React from 'react';
import { Check } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { usePreferencesStore } from '../../store/usePreferencesStore';
import { categories } from '../../data/mockData';

interface InterestPickerProps {
  onClose?: () => void;
}

export const InterestPicker: React.FC<InterestPickerProps> = ({ onClose }) => {
  const { isDarkMode } = useAppStore();
  const { followedCategories, followCategory, unfollowCategory } = usePreferencesStore();

  const handleToggle = (categoryName: string) => {
    if (followedCategories.includes(categoryName)) {
      unfollowCategory(categoryName);
    } else {
      followCategory(categoryName);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className={`font-bold text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          আপনার পছন্দের বিভাগ
        </h3>
        {onClose && (
          <button
            onClick={onClose}
            className="text-xs text-green-600 hover:underline"
          >
            সম্পন্ন
          </button>
        )}
      </div>
      <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
        যে বিভাগগুলো পড়তে চান সেগুলো নির্বাচন করুন
      </p>
      <div className="flex flex-wrap gap-2">
        {categories
          .filter((c) => c.name !== 'সর্বশেষ')
          .map((category) => {
            const isFollowed = followedCategories.includes(category.name);
            return (
              <button
                key={category.id}
                onClick={() => handleToggle(category.name)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-medium transition-all ${
                  isFollowed
                    ? 'bg-green-600 text-white'
                    : isDarkMode
                    ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {isFollowed && <Check size={12} />}
                {category.name}
              </button>
            );
          })}
      </div>
      <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
        {followedCategories.length}টি বিভাগ নির্বাচিত
      </p>
    </div>
  );
};
