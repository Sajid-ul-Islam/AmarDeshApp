import React, { useEffect } from 'react';
import { Flame } from 'lucide-react';
import { useReactionsStore } from '../../store/useReactionsStore';
import { useAppStore } from '../../store/useAppStore';
import confetti from 'canvas-confetti';

export const ReadingStreak: React.FC = () => {
  const { isDarkMode } = useAppStore();
  const { streak, points, incrementStreak } = useReactionsStore();

  useEffect(() => {
    // Increment streak when component mounts (user is reading)
    incrementStreak();
  }, [incrementStreak]);

  // Celebration on milestones
  useEffect(() => {
    if (streak > 0 && streak % 7 === 0) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  }, [streak]);

  if (streak === 0) return null;

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${
      isDarkMode ? 'bg-orange-900/30' : 'bg-orange-50'
    }`}>
      <Flame size={16} className="text-orange-500" />
      <div className="flex items-center gap-1">
        <span className={`text-sm font-bold ${isDarkMode ? 'text-orange-400' : 'text-orange-700'}`}>
          {streak}
        </span>
        <span className={`text-xs ${isDarkMode ? 'text-orange-400' : 'text-orange-600'}`}>
          দিন
        </span>
      </div>
      <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
        • {points} পয়েন্ট
      </span>
    </div>
  );
};
