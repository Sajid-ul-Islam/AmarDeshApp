import React, { useState } from 'react';
import { X, Copy, Check, Share2, Instagram, Facebook, Twitter, Mail, MessageCircle } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { Article } from '../../types';
import { SharePlatform, shareToPlatform, generateShareText } from '../../services/socialShareService';
import { generateShareImage, downloadShareImage } from '../../services/shareImageService';

interface ShareSheetProps {
  isOpen: boolean;
  onClose: () => void;
  article: Article;
}

interface ShareOption {
  id: SharePlatform;
  label: string;
  icon: any;
  color: string;
  bgColor: string;
}

const shareOptions: ShareOption[] = [
  {
    id: 'whatsapp',
    label: 'WhatsApp',
    icon: MessageCircle,
    color: 'text-white',
    bgColor: 'bg-green-500',
  },
  {
    id: 'facebook',
    label: 'Facebook',
    icon: Facebook,
    color: 'text-white',
    bgColor: 'bg-blue-600',
  },
  {
    id: 'twitter',
    label: 'Twitter',
    icon: Twitter,
    color: 'text-white',
    bgColor: 'bg-sky-500',
  },
  {
    id: 'telegram',
    label: 'Telegram',
    icon: Share2,
    color: 'text-white',
    bgColor: 'bg-blue-500',
  },
  {
    id: 'email',
    label: 'ইমেইল',
    icon: Mail,
    color: 'text-white',
    bgColor: 'bg-gray-600',
  },
  {
    id: 'copy',
    label: 'লিংক কপি',
    icon: Copy,
    color: 'text-gray-700',
    bgColor: 'bg-gray-200',
  },
];

export const ShareSheet: React.FC<ShareSheetProps> = ({ isOpen, onClose, article }) => {
  const { isDarkMode, features } = useAppStore();
  const [copied, setCopied] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);

  if (!isOpen) return null;

  const handleShare = async (platform: SharePlatform) => {
    if (platform === 'copy') {
      const success = await shareToPlatform('copy', article);
      if (success) {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } else {
      await shareToPlatform(platform, article);
    }
    onClose();
  };

  const handleGenerateStoryImage = async () => {
    setIsGeneratingImage(true);
    try {
      const imageUrl = await generateShareImage(article);
      downloadShareImage(imageUrl, `${article.id}-story.png`);
      onClose();
    } catch (error) {
      console.error('Failed to generate story image:', error);
    } finally {
      setIsGeneratingImage(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50"
        onClick={onClose}
      />

      {/* Share Sheet */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl ${
          isDarkMode ? 'bg-gray-900' : 'bg-white'
        } shadow-2xl max-h-[80vh] overflow-y-auto`}
      >
        {/* Header */}
        <div className={`sticky top-0 ${isDarkMode ? 'bg-gray-900' : 'bg-white'} p-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex items-center justify-between mb-2">
            <h2 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              শেয়ার করুন
            </h2>
            <button
              onClick={onClose}
              className={`p-2 rounded-full ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
            >
              <X size={20} className={isDarkMode ? 'text-gray-400' : 'text-gray-600'} />
            </button>
          </div>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} line-clamp-2`}>
            {article.title}
          </p>
        </div>

        {/* Share Options Grid */}
        <div className="p-4">
          <div className="grid grid-cols-4 gap-4 mb-6">
            {shareOptions.map((option) => {
              const Icon = option.icon;
              return (
                <button
                  key={option.id}
                  onClick={() => handleShare(option.id)}
                  className="flex flex-col items-center gap-2"
                >
                  <div className={`w-14 h-14 rounded-full ${option.bgColor} flex items-center justify-center`}>
                    {option.id === 'copy' && copied ? (
                      <Check size={24} className="text-green-600" />
                    ) : (
                      <Icon size={24} className={option.color} />
                    )}
                  </div>
                  <span className={`text-xs text-center ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {option.id === 'copy' && copied ? 'কপি হয়েছে!' : option.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Story Sharing (if enabled) */}
          {features.enableStorySharing && (
            <div className={`border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} pt-4`}>
              <h3 className={`text-sm font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                স্টোরিতে শেয়ার করুন
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleGenerateStoryImage}
                  disabled={isGeneratingImage}
                  className={`flex items-center justify-center gap-2 p-3 rounded-xl ${
                    isDarkMode ? 'bg-gradient-to-r from-purple-600 to-pink-600' : 'bg-gradient-to-r from-purple-500 to-pink-500'
                  } text-white font-medium disabled:opacity-50`}
                >
                  <Instagram size={20} />
                  <span>{isGeneratingImage ? 'তৈরি হচ্ছে...' : 'Instagram Story'}</span>
                </button>
                <button
                  onClick={handleGenerateStoryImage}
                  disabled={isGeneratingImage}
                  className={`flex items-center justify-center gap-2 p-3 rounded-xl ${
                    isDarkMode ? 'bg-blue-600' : 'bg-blue-500'
                  } text-white font-medium disabled:opacity-50`}
                >
                  <Facebook size={20} />
                  <span>{isGeneratingImage ? 'তৈরি হচ্ছে...' : 'Facebook Story'}</span>
                </button>
              </div>
              <p className={`text-xs mt-2 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                ইমেজ ডাউনলোড হবে, তারপর ম্যানুয়ালি আপলোড করুন
              </p>
            </div>
          )}

          {/* Native Share (if available) */}
          {'share' in navigator && (
            <div className={`border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} pt-4 mt-4`}>
              <button
                onClick={() => handleShare('native')}
                className={`w-full flex items-center justify-center gap-2 p-3 rounded-xl ${
                  isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'
                } font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
              >
                <Share2 size={20} />
                <span>আরও শেয়ার অপশন</span>
              </button>
            </div>
          )}
        </div>

        {/* Bottom Safe Area */}
        <div className="h-6" />
      </div>
    </>
  );
};
