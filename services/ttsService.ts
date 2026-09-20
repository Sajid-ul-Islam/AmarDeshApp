import * as Speech from 'expo-speech';
import { Article } from '../data/mockData';

export interface TTSOptions {
  rate?: number; // 0.1 to 10 (1 is normal speed)
  pitch?: number; // 0 to 2 (1 is normal pitch)
  volume?: number; // 0 to 1
  language?: string;
}

const DEFAULT_OPTIONS: TTSOptions = {
  rate: 1.0,
  pitch: 1.0,
  volume: 1.0,
  language: 'bn-BD', // Bengali (Bangladesh)
};

// Speak text
export const speak = (text: string, options: TTSOptions = {}): void => {
  const mergedOptions = { ...DEFAULT_OPTIONS, ...options };
  
  Speech.speak(text, {
    rate: mergedOptions.rate,
    pitch: mergedOptions.pitch,
    volume: mergedOptions.volume,
    language: mergedOptions.language,
  });
};

// Speak article
export const speakArticle = (article: Article, options: TTSOptions = {}): void => {
  const fullText = `${article.title}। ${article.excerpt}। ${article.content}`;
  speak(fullText, options);
};

// Stop speaking
export const stopSpeaking = (): void => {
  Speech.stop();
};

// Pause speaking (not supported on all platforms)
export const pauseSpeaking = (): void => {
  Speech.pause();
};

// Resume speaking (not supported on all platforms)
export const resumeSpeaking = (): void => {
  Speech.resume();
};

// Check if speaking
export const isSpeaking = (): Promise<boolean> => {
  return Speech.isSpeakingAsync();
};

// Get available voices/languages
export const getAvailableVoices = async (): Promise<any[]> => {
  try {
    // Note: expo-speech doesn't have a direct method to get voices
    // We'll return a list of supported languages
    return [
      { language: 'bn-BD', name: 'বাংলা (বাংলাদেশ)' },
      { language: 'bn-IN', name: 'বাংলা (ভারত)' },
      { language: 'en-US', name: 'English (US)' },
      { language: 'en-GB', name: 'English (UK)' },
      { language: 'hi-IN', name: 'हिंदी' },
    ];
  } catch (error) {
    console.error('Error getting available voices:', error);
    return [];
  }
};

// Estimate reading time (in seconds)
export const estimateReadingTime = (text: string, rate: number = 1.0): number => {
  // Average reading speed: 150 words per minute
  const words = text.split(/\s+/).length;
  const minutes = words / 150;
  const seconds = Math.ceil(minutes * 60 / rate);
  return seconds;
};

// Format time in Bengali
export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  
  const toBengali = (num: number): string => {
    const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return num.toString().split('').map(d => bengaliDigits[parseInt(d)]).join('');
  };
  
  return `${toBengali(mins)}:${toBengali(secs).padStart(2, '০')}`;
};

// Speed options
export const SPEED_OPTIONS = [
  { value: 0.5, label: '০.৫x' },
  { value: 0.75, label: '০.৭৫x' },
  { value: 1.0, label: '১x' },
  { value: 1.25, label: '১.২৫x' },
  { value: 1.5, label: '১.৫x' },
  { value: 2.0, label: '২x' },
];
