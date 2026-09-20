import React, { useState, useRef, useEffect } from 'react';
import { Send, Settings, Trash2, Bot, User, Sparkles } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { useAIStore } from '../../store/useAIStore';
import { sendAIMessage, QUICK_ACTIONS, AI_PROVIDERS } from '../../services/aiService';
import { Article } from '../../types';

interface AIChatProps {
  articleContext?: Article;
  onSettingsClick: () => void;
}

export const AIChat: React.FC<AIChatProps> = ({ articleContext, onSettingsClick }) => {
  const { isDarkMode } = useAppStore();
  const {
    provider,
    apiKey,
    model,
    isConfigured,
    messages,
    isLoading,
    error,
    addMessage,
    clearMessages,
    setLoading,
    setError,
  } = useAIStore();

  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (messageText?: string) => {
    const text = messageText || input.trim();
    if (!text || isLoading) return;

    if (!isConfigured) {
      setError('অনুগ্রহ করে প্রথমে API Key সেট করুন।');
      return;
    }

    // Add user message
    const userMessage = {
      id: `user-${Date.now()}`,
      role: 'user' as const,
      content: text,
      timestamp: Date.now(),
      articleContext,
    };
    addMessage(userMessage);
    setInput('');
    setError(null);
    setLoading(true);

    try {
      // Get all messages including the new one
      const allMessages = [...messages, userMessage];

      // Call AI
      const response = await sendAIMessage(provider, apiKey, model, allMessages, articleContext);

      // Add AI response
      const aiMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant' as const,
        content: response,
        timestamp: Date.now(),
      };
      addMessage(aiMessage);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'একটি ত্রুটি ঘটেছে';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAction = (prompt: string) => {
    handleSend(prompt);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className={`flex flex-col h-full ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <div className={`sticky top-0 z-10 flex items-center justify-between px-4 py-3 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b`}>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center">
            <Sparkles size={16} className="text-white" />
          </div>
          <div>
            <h2 className={`font-bold text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              BYoak AI সহকারী
            </h2>
            <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {AI_PROVIDERS[provider].displayName}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {messages.length > 0 && (
            <button
              onClick={clearMessages}
              className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-600'}`}
              aria-label="চ্যাট মুছুন"
            >
              <Trash2 size={18} />
            </button>
          )}
          <button
            onClick={onSettingsClick}
            className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-600'}`}
            aria-label="সেটিংস"
          >
            <Settings size={18} />
          </button>
        </div>
      </div>

      {/* Article Context Banner */}
      {articleContext && (
        <div className={`px-4 py-2 ${isDarkMode ? 'bg-blue-900/20 border-blue-800' : 'bg-blue-50 border-blue-200'} border-b`}>
          <p className={`text-xs ${isDarkMode ? 'text-blue-300' : 'text-blue-700'}`}>
            📰 প্রসঙ্গ: {articleContext.title.substring(0, 60)}...
          </p>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bot size={32} className="text-white" />
            </div>
            <h3 className={`font-bold text-lg mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              BYoak AI সহকারী
            </h3>
            <p className={`text-sm mb-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              সংবাদ সম্পর্কে যেকোনো প্রশ্ন করুন
            </p>

            {/* Quick Actions */}
            {articleContext && (
              <div className="space-y-2">
                <p className={`text-xs font-medium ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                  দ্রুত কাজ:
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {QUICK_ACTIONS.map((action) => (
                    <button
                      key={action.id}
                      onClick={() => handleQuickAction(action.prompt)}
                      disabled={isLoading || !isConfigured}
                      className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                        isDarkMode
                          ? 'bg-gray-800 text-gray-300 hover:bg-gray-700 disabled:opacity-50'
                          : 'bg-white text-gray-700 hover:bg-gray-100 shadow-sm disabled:opacity-50'
                      }`}
                    >
                      {action.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {!isConfigured && (
              <div className={`mt-6 p-4 rounded-lg ${isDarkMode ? 'bg-yellow-900/20 border-yellow-800' : 'bg-yellow-50 border-yellow-200'} border`}>
                <p className={`text-sm ${isDarkMode ? 'text-yellow-300' : 'text-yellow-700'}`}>
                  ⚠️ শুরু করতে সেটিংস থেকে API Key দিন
                </p>
                <button
                  onClick={onSettingsClick}
                  className="mt-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium"
                >
                  সেটিংস খুলুন
                </button>
              </div>
            )}
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.role === 'assistant' && (
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                <Bot size={16} className="text-white" />
              </div>
            )}
            <div
              className={`max-w-[80%] px-4 py-3 rounded-2xl ${
                msg.role === 'user'
                  ? 'bg-green-600 text-white'
                  : isDarkMode
                  ? 'bg-gray-800 text-gray-200'
                  : 'bg-white text-gray-800 shadow-sm'
              }`}
            >
              <div className="text-sm whitespace-pre-wrap">{msg.content}</div>
            </div>
            {msg.role === 'user' && (
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                <User size={16} className={isDarkMode ? 'text-gray-300' : 'text-gray-600'} />
              </div>
            )}
          </div>
        ))}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
              <Bot size={16} className="text-white" />
            </div>
            <div className={`px-4 py-3 rounded-2xl ${isDarkMode ? 'bg-gray-800' : 'bg-white shadow-sm'}`}>
              <div className="flex gap-1">
                <div className={`w-2 h-2 rounded-full animate-bounce ${isDarkMode ? 'bg-gray-500' : 'bg-gray-400'}`} style={{ animationDelay: '0ms' }} />
                <div className={`w-2 h-2 rounded-full animate-bounce ${isDarkMode ? 'bg-gray-500' : 'bg-gray-400'}`} style={{ animationDelay: '150ms' }} />
                <div className={`w-2 h-2 rounded-full animate-bounce ${isDarkMode ? 'bg-gray-500' : 'bg-gray-400'}`} style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-red-900/20 text-red-400' : 'bg-red-50 text-red-600'}`}>
            <p className="text-sm">{error}</p>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className={`sticky bottom-0 px-4 py-3 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-t`}>
        <div className={`flex items-center gap-2 px-4 py-2 rounded-xl ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={isConfigured ? 'আপনার প্রশ্ন লিখুন...' : 'প্রথমে API Key সেট করুন'}
            disabled={!isConfigured || isLoading}
            className={`flex-1 bg-transparent outline-none text-sm ${
              isDarkMode ? 'text-white placeholder:text-gray-500' : 'text-gray-900 placeholder:text-gray-400'
            } disabled:opacity-50`}
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || isLoading || !isConfigured}
            className="p-2 bg-green-600 hover:bg-green-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="পাঠান"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
