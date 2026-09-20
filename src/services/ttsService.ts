// Text-to-Speech Service using Web Speech API
// Free, no API key needed, works offline

export interface TTSService {
  speak: (text: string, onEnd?: () => void) => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  setRate: (rate: number) => void;
  getVoices: () => SpeechSynthesisVoice[];
  isSpeaking: () => boolean;
  isPaused: () => boolean;
}

let currentRate = 1.0;
let bengaliVoice: SpeechSynthesisVoice | null = null;

// Find Bengali voice
function findBengaliVoice(): SpeechSynthesisVoice | null {
  const voices = window.speechSynthesis.getVoices();
  
  // Prefer bn-BD (Bangladesh Bengali)
  let voice = voices.find(v => v.lang === 'bn-BD');
  if (voice) return voice;
  
  // Fall back to any Bengali
  voice = voices.find(v => v.lang.startsWith('bn'));
  if (voice) return voice;
  
  // Fall back to Hindi (similar script)
  voice = voices.find(v => v.lang.startsWith('hi'));
  if (voice) return voice;
  
  return null;
}

// Initialize voices (async in some browsers)
export function initializeTTS(): Promise<void> {
  return new Promise((resolve) => {
    if (window.speechSynthesis.getVoices().length > 0) {
      bengaliVoice = findBengaliVoice();
      resolve();
    } else {
      window.speechSynthesis.onvoiceschanged = () => {
        bengaliVoice = findBengaliVoice();
        resolve();
      };
      // Timeout fallback
      setTimeout(resolve, 1000);
    }
  });
}

export function speak(
  text: string,
  onEnd?: () => void,
  onBoundary?: (charIndex: number) => void
): void {
  // Stop any current speech
  window.speechSynthesis.cancel();
  
  // Clean text for TTS (remove URLs, special chars)
  const cleanText = text
    .replace(/https?:\/\/[^\s]+/g, '') // Remove URLs
    .replace(/\[.*?\]/g, '') // Remove brackets
    .replace(/[০-৯]/g, (digit) => {
      // Convert Bengali numerals to English for better pronunciation
      const bengaliToEnglish = { '০': '0', '১': '1', '২': '2', '৩': '3', '৪': '4', '৫': '5', '৬': '6', '৭': '7', '৮': '8', '৯': '9' };
      return bengaliToEnglish[digit as keyof typeof bengaliToEnglish] || digit;
    });
  
  const utterance = new SpeechSynthesisUtterance(cleanText);
  
  // Set voice
  if (bengaliVoice) {
    utterance.voice = bengaliVoice;
  }
  
  // Set language
  utterance.lang = 'bn-BD';
  utterance.rate = currentRate;
  utterance.pitch = 1.0;
  utterance.volume = 1.0;
  
  // Event handlers
  if (onEnd) {
    utterance.onend = onEnd;
  }
  
  if (onBoundary) {
    utterance.onboundary = (event) => {
      onBoundary(event.charIndex);
    };
  }
  
  utterance.onerror = (event) => {
    console.error('TTS Error:', event.error);
    if (onEnd) onEnd();
  };
  
  window.speechSynthesis.speak(utterance);
}

export function pause(): void {
  window.speechSynthesis.pause();
}

export function resume(): void {
  window.speechSynthesis.resume();
}

export function stop(): void {
  window.speechSynthesis.cancel();
}

export function setRate(rate: number): void {
  currentRate = rate;
}

export function getRate(): number {
  return currentRate;
}

export function isSpeaking(): boolean {
  return window.speechSynthesis.speaking && !window.speechSynthesis.paused;
}

export function isPaused(): boolean {
  return window.speechSynthesis.paused;
}

// Estimate reading time (Bengali: ~150 words per minute)
export function estimateReadingTime(text: string): number {
  const words = text.split(/\s+/).length;
  const minutes = words / 150;
  return Math.ceil(minutes);
}

// Format time in Bengali
export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  const toBengali = (num: number) => num.toString().replace(/[0-9]/g, (d) => '০১২৩৪৫৬৭৮৯'[parseInt(d)]);
  return `${toBengali(mins)}:${toBengali(secs).padStart(2, '০')}`;
}
