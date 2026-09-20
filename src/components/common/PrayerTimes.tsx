import React from 'react';
import { prayerTimes } from '../../data/mockData';
import { useAppStore } from '../../store/useAppStore';
import { getBengaliDayName, getBengaliDate } from '../../utils/bengali';

export const PrayerTimes: React.FC = () => {
  const { isDarkMode } = useAppStore();

  return (
    <div className={`rounded-xl p-4 ${isDarkMode ? 'bg-gray-800' : 'bg-green-50'} border ${isDarkMode ? 'border-gray-700' : 'border-green-100'}`}>
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-green-800'}`}>
            🕌 নামাজের সময়
          </h3>
          <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-green-600'}`}>
            {getBengaliDayName()}, {getBengaliDate()}
          </p>
        </div>
      </div>
      <div className="grid grid-cols-5 gap-1">
        {prayerTimes.map((prayer) => (
          <div key={prayer.name} className="text-center">
            <p className={`text-[10px] font-medium ${isDarkMode ? 'text-gray-400' : 'text-green-700'}`}>
              {prayer.name}
            </p>
            <p className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-green-900'}`}>
              {prayer.time}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
