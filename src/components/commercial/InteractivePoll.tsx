import React from 'react';
import { BarChart3 } from 'lucide-react';
import { useAdsStore, Poll } from '../../store/useAdsStore';
import { useAppStore } from '../../store/useAppStore';

interface InteractivePollProps {
  pollId: string;
}

export const InteractivePoll: React.FC<InteractivePollProps> = ({ pollId }) => {
  const { isDarkMode } = useAppStore();
  const { polls, vote, hasVoted, getUserVote } = useAdsStore();

  const poll = polls.find((p) => p.id === pollId);
  if (!poll) return null;

  const userVote = getUserVote(pollId);
  const voted = hasVoted(pollId);

  const handleVote = (optionId: string) => {
    if (voted) return;
    vote(pollId, optionId);
  };

  return (
    <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
      <div className="flex items-center gap-2 mb-3">
        <BarChart3 size={16} className={isDarkMode ? 'text-blue-400' : 'text-blue-600'} />
        <h3 className={`font-bold text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          জরিপ
        </h3>
      </div>

      <p className={`text-sm font-medium mb-3 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
        {poll.question}
      </p>

      <div className="space-y-2">
        {poll.options.map((option) => {
          const percentage = poll.totalVotes > 0 ? (option.votes / poll.totalVotes) * 100 : 0;
          const isSelected = userVote === option.id;

          return (
            <button
              key={option.id}
              onClick={() => handleVote(option.id)}
              disabled={voted}
              className={`w-full relative overflow-hidden rounded-lg transition-all ${
                voted
                  ? 'cursor-default'
                  : isDarkMode
                  ? 'hover:bg-gray-700'
                  : 'hover:bg-gray-100'
              }`}
            >
              {/* Progress Bar Background */}
              {voted && (
                <div
                  className={`absolute inset-0 ${
                    isSelected
                      ? isDarkMode
                        ? 'bg-green-900/30'
                        : 'bg-green-100'
                      : isDarkMode
                      ? 'bg-gray-700'
                      : 'bg-gray-200'
                  }`}
                  style={{ width: `${percentage}%` }}
                />
              )}

              <div className="relative flex items-center justify-between px-4 py-3">
                <span
                  className={`text-sm ${
                    isSelected
                      ? isDarkMode
                        ? 'text-green-400 font-medium'
                        : 'text-green-700 font-medium'
                      : isDarkMode
                      ? 'text-gray-200'
                      : 'text-gray-800'
                  }`}
                >
                  {option.text}
                </span>
                {voted && (
                  <span className={`text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {percentage.toFixed(0)}%
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {voted && (
        <p className={`text-xs mt-3 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
          মোট {poll.totalVotes} ভোট
        </p>
      )}
    </div>
  );
};
