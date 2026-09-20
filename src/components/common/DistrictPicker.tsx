import React, { useState } from 'react';
import { X, MapPin, ChevronRight } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { useLocationStore } from '../../store/useLocationStore';
import { divisions } from '../../data/districts';

interface DistrictPickerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DistrictPicker: React.FC<DistrictPickerProps> = ({ isOpen, onClose }) => {
  const { isDarkMode } = useAppStore();
  const { selectedDivision, selectedDistrict, setLocation, clearLocation } = useLocationStore();
  const [activeDivision, setActiveDivision] = useState<string | null>(selectedDivision);

  if (!isOpen) return null;

  const currentDivision = divisions.find((d) => d.id === activeDivision);

  const handleDivisionClick = (divisionId: string) => {
    setActiveDivision(divisionId);
  };

  const handleDistrictClick = (districtName: string) => {
    if (currentDivision) {
      setLocation(currentDivision.id, districtName);
      onClose();
    }
  };

  const handleClear = () => {
    clearLocation();
    setActiveDivision(null);
    onClose();
  };

  const handleBack = () => {
    setActiveDivision(null);
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Modal */}
      <div className={`relative w-full max-w-md max-h-[80vh] rounded-t-2xl sm:rounded-2xl overflow-hidden ${isDarkMode ? 'bg-gray-900' : 'bg-white'} shadow-2xl`}>
        {/* Header */}
        <div className={`flex items-center justify-between px-4 py-3 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex items-center gap-2">
            <MapPin size={18} className="text-green-600" />
            <h2 className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              এলাকা নির্বাচন
            </h2>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-600'}`}
            aria-label="বন্ধ করুন"
          >
            <X size={18} />
          </button>
        </div>

        {/* Breadcrumb */}
        {activeDivision && (
          <div className={`flex items-center gap-2 px-4 py-2 text-xs ${isDarkMode ? 'bg-gray-800 text-gray-400' : 'bg-gray-50 text-gray-500'}`}>
            <button onClick={handleBack} className="hover:underline">
              বিভাগ
            </button>
            <ChevronRight size={12} />
            <span className={isDarkMode ? 'text-white' : 'text-gray-900'}>
              {currentDivision?.name}
            </span>
          </div>
        )}

        {/* Content */}
        <div className="overflow-y-auto max-h-[60vh] p-4">
          {!activeDivision ? (
            // Division List
            <div className="grid grid-cols-2 gap-2">
              {divisions.map((division) => (
                <button
                  key={division.id}
                  onClick={() => handleDivisionClick(division.id)}
                  className={`p-4 rounded-xl text-left font-medium transition-all ${
                    isDarkMode
                      ? 'bg-gray-800 text-gray-200 hover:bg-gray-700'
                      : 'bg-gray-50 text-gray-800 hover:bg-gray-100'
                  } ${selectedDivision === division.id ? 'ring-2 ring-green-500' : ''}`}
                >
                  <div className="text-sm font-bold">{division.name}</div>
                  <div className={`text-xs mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                    {division.districts.length}টি জেলা
                  </div>
                </button>
              ))}
            </div>
          ) : (
            // District List
            <div className="space-y-1">
              {currentDivision?.districts.map((district) => (
                <button
                  key={district.id}
                  onClick={() => handleDistrictClick(district.name)}
                  className={`w-full flex items-center justify-between p-3 rounded-lg text-left transition-all ${
                    isDarkMode
                      ? 'hover:bg-gray-800 text-gray-200'
                      : 'hover:bg-gray-50 text-gray-800'
                  } ${selectedDistrict === district.name ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400' : ''}`}
                >
                  <span className="text-sm font-medium">{district.name}</span>
                  {selectedDistrict === district.name && (
                    <span className="text-xs text-green-600">✓ নির্বাচিত</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {(selectedDistrict || selectedDivision) && (
          <div className={`px-4 py-3 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <button
              onClick={handleClear}
              className={`w-full py-2 rounded-lg text-sm font-medium ${
                isDarkMode ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              ফিল্টার মুছুন
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
