import React, { useState } from 'react';
import { ArrowLeft, ExternalLink, Shield, Key, Check } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { useAIStore } from '../../store/useAIStore';
import { AI_PROVIDERS, AIProvider } from '../../services/aiService';

interface AISettingsProps {
  onBack: () => void;
}

export const AISettings: React.FC<AISettingsProps> = ({ onBack }) => {
  const { isDarkMode } = useAppStore();
  const { provider, apiKey, model, setProvider, setApiKey, setModel } = useAIStore();
  const [showKey, setShowKey] = useState(false);

  const currentProvider = AI_PROVIDERS[provider];

  const handleProviderChange = (newProvider: AIProvider) => {
    setProvider(newProvider);
    setModel(AI_PROVIDERS[newProvider].defaultModel);
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <div className={`sticky top-0 z-10 flex items-center gap-3 px-4 py-3 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b`}>
        <button
          onClick={onBack}
          className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
          aria-label="ফিরে যান"
        >
          <ArrowLeft size={20} className={isDarkMode ? 'text-white' : 'text-gray-800'} />
        </button>
        <h1 className={`font-bold text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          BYoak সেটিংস
        </h1>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Privacy Notice */}
        <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-green-900/20 border-green-800' : 'bg-green-50 border-green-200'} border`}>
          <div className="flex items-start gap-3">
            <Shield size={20} className={isDarkMode ? 'text-green-400' : 'text-green-600'} />
            <div>
              <h3 className={`font-bold text-sm mb-1 ${isDarkMode ? 'text-green-300' : 'text-green-800'}`}>
                আপনার গোপনীয়তা সুরক্ষিত
              </h3>
              <p className={`text-xs ${isDarkMode ? 'text-green-400' : 'text-green-700'}`}>
                আপনার API Key শুধুমাত্র আপনার ব্রাউজারে সংরক্ষিত থাকে। এটি কখনো কোনো সার্ভারে পাঠানো হয় না। 
                সব AI কল সরাসরি আপনার ব্রাউজার থেকে AI প্রোভাইডারে যায়।
              </p>
            </div>
          </div>
        </div>

        {/* Provider Selection */}
        <div>
          <label className={`block text-sm font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            AI প্রোভাইডার নির্বাচন করুন
          </label>
          <div className="grid grid-cols-2 gap-3">
            {Object.values(AI_PROVIDERS).map((p) => (
              <button
                key={p.id}
                onClick={() => handleProviderChange(p.id)}
                className={`p-4 rounded-xl border-2 transition-all ${
                  provider === p.id
                    ? 'border-green-600 bg-green-50 dark:bg-green-900/20'
                    : isDarkMode
                    ? 'border-gray-700 bg-gray-800 hover:border-gray-600'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="text-2xl mb-2">{p.icon}</div>
                <div className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {p.displayName}
                </div>
                {provider === p.id && (
                  <Check size={16} className="text-green-600 mt-1" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* API Key Input */}
        <div>
          <label className={`block text-sm font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            API Key
          </label>
          <div className={`flex items-center gap-2 px-4 py-3 rounded-xl ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border`}>
            <Key size={16} className={isDarkMode ? 'text-gray-400' : 'text-gray-500'} />
            <input
              type={showKey ? 'text' : 'password'}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder={currentProvider.keyPlaceholder}
              className={`flex-1 bg-transparent outline-none text-sm ${isDarkMode ? 'text-white placeholder:text-gray-500' : 'text-gray-900 placeholder:text-gray-400'}`}
            />
            <button
              onClick={() => setShowKey(!showKey)}
              className={`text-xs px-2 py-1 rounded ${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}
            >
              {showKey ? 'লুকান' : 'দেখান'}
            </button>
          </div>
          <a
            href={currentProvider.getKeyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-1 mt-2 text-xs ${isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}
          >
            <ExternalLink size={12} />
            {currentProvider.displayName} থেকে API Key নিন
          </a>
        </div>

        {/* Model Selection */}
        <div>
          <label className={`block text-sm font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            মডেল নির্বাচন করুন
          </label>
          <select
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className={`w-full px-4 py-3 rounded-xl border ${
              isDarkMode
                ? 'bg-gray-800 border-gray-700 text-white'
                : 'bg-white border-gray-200 text-gray-900'
            }`}
          >
            {currentProvider.modelOptions.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        {/* Status */}
        <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <h3 className={`font-bold text-sm mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            স্থিতি
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>প্রোভাইডার:</span>
              <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {currentProvider.displayName}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>মডেল:</span>
              <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {model}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>API Key:</span>
              <span className={`font-medium ${apiKey ? 'text-green-600' : 'text-red-600'}`}>
                {apiKey ? '✓ সেট করা আছে' : '✗ সেট করা হয়নি'}
              </span>
            </div>
          </div>
        </div>

        {/* How to Get API Keys */}
        <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-blue-900/20 border-blue-800' : 'bg-blue-50 border-blue-200'} border`}>
          <h3 className={`font-bold text-sm mb-3 ${isDarkMode ? 'text-blue-300' : 'text-blue-800'}`}>
            💡 ফ্রি API Key কীভাবে পাবেন?
          </h3>
          <div className="space-y-3 text-xs">
            <div>
              <p className={`font-bold mb-1 ${isDarkMode ? 'text-blue-300' : 'text-blue-700'}`}>
                🔵 Google Gemini (সবচেয়ে সহজ - ফ্রি)
              </p>
              <p className={isDarkMode ? 'text-blue-400' : 'text-blue-600'}>
                1. Google AI Studio-তে যান<br />
                2. Google দিয়ে লগইন করুন<br />
                3. "Get API Key" ক্লিক করুন<br />
                4. Key কপি করে এখানে পেস্ট করুন
              </p>
            </div>
            <div>
              <p className={`font-bold mb-1 ${isDarkMode ? 'text-blue-300' : 'text-blue-700'}`}>
                🟣 OpenRouter (ফ্রি মডেল আছে)
              </p>
              <p className={isDarkMode ? 'text-blue-400' : 'text-blue-600'}>
                1. openrouter.ai-এ সাইন আপ করুন<br />
                2. "Keys" পেজে যান<br />
                3. নতুন Key তৈরি করুন<br />
                4. ফ্রি মডেল ব্যবহার করুন
              </p>
            </div>
          </div>
        </div>

        {/* Info */}
        <div className={`text-center text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
          <p>BYoak = Bring Your Own API Key</p>
          <p className="mt-1">সংস্করণ ১.০.০</p>
        </div>
      </div>
    </div>
  );
};
