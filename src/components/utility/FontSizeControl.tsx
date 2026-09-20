import React from 'react';
import { Type } from 'lucide-react';
import { useReadingStore, FontSize } from '../../store/useReadingStore';
import { useAppStore } from '../../store/useAppStore';

export const FontSizeControl: React.FC = () => {
  const { isDarkMode } = useAppStore();
  const { fontSize, setFontSize } = useReadingStore();

  const sizes: { value: FontSize; label: string; px: string }[] = [
    { value: 'S', label: 'ছোট', px: '14px' },
    { value: 'M', label: 'মাঝারি', px: '16px' },
    { value: 'L', label: 'বড়', px: '18px' },
    { value: 'XL', label: 'অতি বড়', px: '20px' },
  ];

  return (
    <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
      <h3 className={`font-bold text-sm mb-3 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
        <Type size={16} />
        ফন্ট সাইজ
      </h3>
      <div className="flex gap-2">
        {sizes.map((size) => (
          <button
            key={size.value}
            onClick={() => setFontSize(size.value)}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
              fontSize === size.value
                ? 'bg-green-600 text-white'
                : isDarkMode
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            <div style={{ fontSize: size.px }}>{size.label}</div>
            <div className="text-xs opacity-70">{size.value}</div>
          </button>
        ))}
      </div>
    </div>
  );
};
