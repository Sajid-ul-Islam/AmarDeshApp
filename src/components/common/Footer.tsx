import React from 'react';
import { useAppStore } from '../../store/useAppStore';

export const Footer: React.FC = () => {
  const { isDarkMode } = useAppStore();

  return (
    <footer className={`mt-8 py-6 px-4 border-t ${isDarkMode ? 'bg-gray-900 border-gray-700 text-gray-400' : 'bg-gray-50 border-gray-200 text-gray-600'}`}>
      <div className="max-w-lg mx-auto text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <div className="bg-green-700 text-white font-bold text-sm px-2 py-0.5 rounded">
            আ.দে
          </div>
          <span className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            আমার দেশ
          </span>
        </div>
        <p className="text-xs mb-2">স্বাধীনতার কথা বলে</p>
        <p className="text-xs mb-3">সম্পাদক ও প্রকাশক: মাহমুদুর রহমান</p>
        <div className="flex flex-wrap justify-center gap-3 text-xs mb-3">
          <span>জাতীয়</span>
          <span>রাজনীতি</span>
          <span>সারা দেশ</span>
          <span>বাণিজ্য</span>
          <span>বিনোদন</span>
          <span>বিশ্ব</span>
          <span>খেলা</span>
        </div>
        <p className="text-[10px]">স্বত্ব: ©️ ২০০৪-২০২৬ আমার দেশ। সর্বস্বত্ব সংরক্ষিত।</p>
      </div>
    </footer>
  );
};
