import React, { useState, useEffect } from 'react';
import { Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { useAIStore } from '../../store/useAIStore';
import { sendAIMessage } from '../../services/aiService';
import { Article } from '../../types';

interface SmartSummaryProps {
  article: Article;
}

export const SmartSummary: React.FC<SmartSummaryProps> = ({ article }) => {
  const { isDarkMode } = useAppStore();
  const { provider, apiKey, model, isConfigured } = useAIStore();
  const [summary, setSummary] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (!isConfigured || summary) return;

    const generateSummary = async () => {
      setIsLoading(true);
      try {
        const result = await sendAIMessage(
          provider,
          apiKey,
          model,
          [
            {
              id: '1',
              role: 'user',
              content: `এই সংবাদের একটি সংক্ষিপ্ত সারসংক্ষেপ দাও (২-৩ লাইন):\n\nশিরোনাম: ${article.title}\n\nবিবরণ: ${article.content}`,
              timestamp: Date.now(),
            },
          ],
          article
        );
        setSummary(result);
      } catch (error) {
        console.error('Failed to generate summary:', error);
      } finally {
        setIsLoading(false);
      }
    };

    generateSummary();
  }, [isConfigured, provider, apiKey, model, article, summary]);

  if (!isConfigured || isLoading || !summary) return null;

  return (
    <div className={`mb-4 p-4 rounded-xl ${isDarkMode ? 'bg-purple-900/20 border border-purple-800' : 'bg-purple-50 border border-purple-200'}`}>
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <Sparkles size={16} className={isDarkMode ? 'text-purple-400' : 'text-purple-600'} />
          <h3 className={`font-bold text-sm ${isDarkMode ? 'text-purple-300' : 'text-purple-800'}`}>
            AI সারসংক্ষেপ
          </h3>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`p-1 rounded ${isDarkMode ? 'hover:bg-purple-800' : 'hover:bg-purple-100'}`}
        >
          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      </div>
      
      <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-purple-200' : 'text-purple-900'} ${!isExpanded ? 'line-clamp-2' : ''}`}>
        {summary}
      </p>
      
      {!isExpanded && (
        <button
          onClick={() => setIsExpanded(true)}
          className={`mt-2 text-xs font-medium ${isDarkMode ? 'text-purple-400 hover:text-purple-300' : 'text-purple-600 hover:text-purple-700'}`}
        >
          আরও পড়ুন
        </button>
      )}
    </div>
  );
};
