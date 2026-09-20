import React from 'react';
import { MapPin, X } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { useLocationStore } from '../../store/useLocationStore';

export const LocationBadge: React.FC = () => {
  const { isDarkMode } = useAppStore();
  const { selectedDistrict, clearLocation } = useLocationStore();

  if (!selectedDistrict) return null;

  return (
    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
      isDarkMode ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-50 text-blue-700'
    }`}>
      <MapPin size={10} />
      <span>{selectedDistrict}</span>
      <button
        onClick={clearLocation}
        className={`ml-0.5 p-0.5 rounded-full ${isDarkMode ? 'hover:bg-blue-800' : 'hover:bg-blue-100'}`}
        aria-label="এলাকা ফিল্টার মুছুন"
      >
        <X size={10} />
      </button>
    </div>
  );
};
