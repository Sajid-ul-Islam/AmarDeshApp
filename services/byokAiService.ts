import AsyncStorage from '@react-native-async-storage/async-storage';
import { Article } from '../data/mockData';

export type AiProvider = 'gemini' | 'openai' | 'groq' | 'deepseek';

export interface ByokAiConfig {
  provider: AiProvider;
  apiKey: string;
  model?: string;
  enabled: boolean;
}

const STORAGE_KEY = '@amar_desh_byok_ai_config';

export const PROVIDER_METADATA: Record<
  AiProvider,
  {
    name: string;
    defaultModel: string;
    description: string;
    freeTierAvailable: boolean;
    keyHelpUrl: string;
    placeholder: string;
  }
> = {
  gemini: {
    name: 'Google Gemini',
    defaultModel: 'gemini-1.5-flash',
    description: 'গুগলের শক্তিশালী বহুভাষিক মডেল। উচ্চমানের বাংলা সারসংক্ষেপ ও প্রশ্নের উত্তরের জন্য সর্বাধিক সুপারিশকৃত।',
    freeTierAvailable: true,
    keyHelpUrl: 'https://aistudio.google.com/app/apikey',
    placeholder: 'AIzaSy...',
  },
  groq: {
    name: 'Groq (Llama 3.3)',
    defaultModel: 'llama-3.3-70b-versatile',
    description: 'আল্ট্রা-ফাস্ট এলপিইউ ইনফারেন্স স্পিড। বিনামূল্যে ডেভেলপার টিয়ার উপলব্ধ।',
    freeTierAvailable: true,
    keyHelpUrl: 'https://console.groq.com/keys',
    placeholder: 'gsk_...',
  },
  deepseek: {
    name: 'DeepSeek AI',
    defaultModel: 'deepseek-chat',
    description: 'অত্যন্ত সাশ্রয়ী ও শক্তিশালী ডিপসিক ভি৩ মডেল। গভীর যৌক্তিক বিশ্লেষণ ও রাজনৈতিক প্রেক্ষাপট।',
    freeTierAvailable: false,
    keyHelpUrl: 'https://platform.deepseek.com/api_keys',
    placeholder: 'sk-...',
  },
  openai: {
    name: 'OpenAI (ChatGPT)',
    defaultModel: 'gpt-4o-mini',
    description: 'ওপেনএআই-এর নির্ভরযোগ্য জিপিটি-৪ও মিনি মডেল। স্পষ্ট এবং সাবলীল বাংলা আউটপুট।',
    freeTierAvailable: false,
    keyHelpUrl: 'https://platform.openai.com/api-keys',
    placeholder: 'sk-proj-...',
  },
};

const DEFAULT_CONFIG: ByokAiConfig = {
  provider: 'gemini',
  apiKey: '',
  model: 'gemini-1.5-flash',
  enabled: true,
};

/**
 * Get current BYOK AI Configuration from local device storage
 */
export async function getByokAiConfig(): Promise<ByokAiConfig> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_CONFIG;
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_CONFIG, ...parsed };
  } catch (error) {
    console.error('[BYOK AI] Failed to load config:', error);
    return DEFAULT_CONFIG;
  }
}

/**
 * Save BYOK AI Configuration to local device storage
 */
export async function saveByokAiConfig(config: ByokAiConfig): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch (error) {
    console.error('[BYOK AI] Failed to save config:', error);
  }
}

/**
 * Test API Key Connection with the selected provider
 */
export async function testAiConnection(
  provider: AiProvider,
  apiKey: string,
  model?: string
): Promise<{ success: boolean; message: string }> {
  if (!apiKey || apiKey.trim().length < 8) {
    return {
      success: false,
      message: 'অনুগ্রহ করে একটি বৈধ এপিআই কি (API Key) প্রবেশ করান।',
    };
  }

  const selectedModel = model || PROVIDER_METADATA[provider].defaultModel;

  try {
    if (provider === 'gemini') {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${selectedModel}:generateContent?key=${apiKey.trim()}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: 'একটি শব্দে উত্তর দিন: "সফল"' }],
            },
          ],
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errMsg = errorData?.error?.message || `HTTP ত্রুটি: ${response.status}`;
        return { success: false, message: `জেমিনি সংযোগ ব্যর্থ: ${errMsg}` };
      }

      return { success: true, message: 'অভিনন্দন! গুগল জেমিনি এপিআই সফলভাবে সংযুক্ত হয়েছে।' };
    }

    if (provider === 'openai') {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey.trim()}`,
        },
        body: JSON.stringify({
          model: selectedModel,
          messages: [{ role: 'user', content: 'Say "OK"' }],
          max_tokens: 5,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errMsg = errorData?.error?.message || `HTTP ত্রুটি: ${response.status}`;
        return { success: false, message: `OpenAI সংযোগ ব্যর্থ: ${errMsg}` };
      }

      return { success: true, message: 'অভিনন্দন! OpenAI ChatGPT সফলভাবে সংযুক্ত হয়েছে।' };
    }

    if (provider === 'groq') {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey.trim()}`,
        },
        body: JSON.stringify({
          model: selectedModel,
          messages: [{ role: 'user', content: 'Say "OK"' }],
          max_tokens: 5,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errMsg = errorData?.error?.message || `HTTP ত্রুটি: ${response.status}`;
        return { success: false, message: `Groq সংযোগ ব্যর্থ: ${errMsg}` };
      }

      return { success: true, message: 'অভিনন্দন! Groq Llama 3.3 সফলভাবে সংযুক্ত হয়েছে।' };
    }

    if (provider === 'deepseek') {
      const response = await fetch('https://api.deepseek.com/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey.trim()}`,
        },
        body: JSON.stringify({
          model: selectedModel,
          messages: [{ role: 'user', content: 'Say "OK"' }],
          max_tokens: 5,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errMsg = errorData?.error?.message || `HTTP ত্রুটি: ${response.status}`;
        return { success: false, message: `DeepSeek সংযোগ ব্যর্থ: ${errMsg}` };
      }

      return { success: true, message: 'অভিনন্দন! DeepSeek সফলভাবে সংযুক্ত হয়েছে।' };
    }

    return { success: false, message: 'অজানা প্রোভাইডার নির্বাচন করা হয়েছে।' };
  } catch (error: any) {
    return {
      success: false,
      message: `ইন্টারনেট বা নেটওয়ার্ক সংযোগ ত্রুটি: ${error?.message || error}`,
    };
  }
}

/**
 * Intelligent Offline Bengali Extractive Fallback Summarizer
 * Provides instant 3-point summary when no BYOK key is configured
 */
export function generateOfflineSummary(title: string, content: string): string[] {
  const sentences = content
    .replace(/\r\n/g, ' ')
    .replace(/\n/g, ' ')
    .split(/([।!?])/)
    .reduce<string[]>((acc, part, idx, arr) => {
      if (idx % 2 === 0) {
        const punctuation = arr[idx + 1] || '।';
        const sentence = (part + punctuation).trim();
        if (sentence.length > 15) acc.push(sentence);
      }
      return acc;
    }, []);

  const point1 = `মূল ঘটনা: ${title}`;
  const point2 =
    sentences.length > 0
      ? `প্রতিবেদনের বিবরণ: ${sentences[0]}`
      : 'সংবাদ সংক্রান্ত প্রাথমিক তথ্যাবলি পর্যবেক্ষণ করা হচ্ছে।';
  const point3 =
    sentences.length > 1
      ? `গুরুত্বপূর্ণ দিক: ${sentences[Math.min(2, sentences.length - 1)]}`
      : 'সংশ্লিষ্ট কর্তৃপক্ষ বিষয়টি নিয়ে পর্যবেক্ষণ ও প্রয়োজনীয় ব্যবস্থা গ্রহণ করছে।';

  return [point1, point2, point3];
}

const SUMMARY_CACHE_PREFIX = '@amar_desh_ai_summary_cache_';
const SUMMARY_CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

/**
 * Generate 3-point Bengali Executive Summary for an Article (Cached with 7-day TTL)
 */
export async function generateArticleSummary(
  article: Article,
  fullText?: string,
  forceRefresh: boolean = false
): Promise<{
  points: string[];
  isAiGenerated: boolean;
  providerUsed?: string;
  cachedAt?: number;
}> {
  const cacheKey = `${SUMMARY_CACHE_PREFIX}${article.id}`;

  // Check persistent cache if not forcing refresh
  if (!forceRefresh) {
    try {
      const cachedRaw = await AsyncStorage.getItem(cacheKey);
      if (cachedRaw) {
        const cached = JSON.parse(cachedRaw);
        if (
          cached?.points?.length >= 2 &&
          Date.now() - (cached.cachedAt || 0) < SUMMARY_CACHE_TTL_MS
        ) {
          return {
            points: cached.points,
            isAiGenerated: cached.isAiGenerated ?? true,
            providerUsed: cached.providerUsed,
            cachedAt: cached.cachedAt,
          };
        }
      }
    } catch (e) {
      // Ignore cache read error and proceed
    }
  }

  const config = await getByokAiConfig();
  const textContent = fullText || article.content || article.excerpt;

  // Fallback to offline summary if BYOK is disabled or no key provided
  if (!config.enabled || !config.apiKey || config.apiKey.trim().length < 8) {
    const offlinePoints = generateOfflineSummary(article.title, textContent);
    return {
      points: offlinePoints,
      isAiGenerated: false,
    };
  }

  const prompt = `তুমি "দৈনিক আমার দেশ"-এর একজন অভিজ্ঞ সিনিয়র সহকারী সম্পাদক। নিচে প্রদত্ত বাংলা সংবাদ প্রতিবেদনটি পড়ো এবং সাধারণ পাঠকদের দ্রুত বোঝার সুবিধার্থে ৩টি সুস্পষ্ট বুলেট পয়েন্টে (১, ২, ৩) একটি আকর্ষণীয় ও ভারসাম্যপূর্ণ সারসংক্ষেপ তৈরি করো।

নিয়মাবলী:
১. প্রতিটি পয়েন্ট সর্বোচ্চ এক থেকে দুই বাক্যের মধ্যে সীমাবদ্ধ রাখো।
২. ভাষা হবে খাঁটি ও মার্জিত বাংলা।
৩. শুধু ৩টি পয়েন্ট আউটপুট দাও (১., ২., ৩. ফরম্যাটে), কোনো ভূমিকা বা উপসংহার দেবে না।

সংবাদ শিরোনাম: ${article.title}
ক্যাটাগরি: ${article.category}
সংবাদ বিবরণ:
${textContent.slice(0, 3000)}`;

  try {
    let resultText = '';

    if (config.provider === 'gemini') {
      const model = config.model || 'gemini-1.5-flash';
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${config.apiKey.trim()}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.2, maxOutputTokens: 500 },
        }),
      });

      if (response.ok) {
        const data = await response.json();
        resultText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
      }
    } else {
      // OpenAI, Groq, DeepSeek compatible chat endpoint
      const endpoint =
        config.provider === 'groq'
          ? 'https://api.groq.com/openai/v1/chat/completions'
          : config.provider === 'deepseek'
          ? 'https://api.deepseek.com/chat/completions'
          : 'https://api.openai.com/v1/chat/completions';

      const model = config.model || PROVIDER_METADATA[config.provider].defaultModel;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${config.apiKey.trim()}`,
        },
        body: JSON.stringify({
          model,
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.2,
          max_tokens: 500,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        resultText = data?.choices?.[0]?.message?.content || '';
      }
    }

    if (resultText) {
      // Parse into array of points
      const lines = resultText
        .split('\n')
        .map((l) => l.trim())
        .filter((l) => l.length > 0);

      const points = lines
        .map((l) => l.replace(/^[০-৯1-9*•\-–.]+\s*/, '').trim())
        .filter((l) => l.length > 5)
        .slice(0, 3);

      if (points.length >= 2) {
        const result = {
          points,
          isAiGenerated: true,
          providerUsed: PROVIDER_METADATA[config.provider].name,
          cachedAt: Date.now(),
        };

        // Cache result persistently
        AsyncStorage.setItem(cacheKey, JSON.stringify(result)).catch(() => {});

        return result;
      }
    }
  } catch (error) {
    console.warn('[BYOK AI] Failed to generate AI summary, using offline fallback:', error);
  }

  // Graceful fallback
  return {
    points: generateOfflineSummary(article.title, textContent),
    isAiGenerated: false,
  };
}

/**
 * Ask AI Questions about an Article (Interactive News Assistant)
 */
export async function askArticleAiQuestion(
  article: Article,
  question: string,
  chatHistory: Array<{ role: 'user' | 'assistant'; text: string }> = []
): Promise<{ answer: string; isAiGenerated: boolean }> {
  const config = await getByokAiConfig();
  const textContent = article.content || article.excerpt;

  if (!config.enabled || !config.apiKey || config.apiKey.trim().length < 8) {
    return {
      answer:
        'AI সংবাদ সহকারীর সম্পূর্ণ সুবিধা উপভোগ করতে সেটিংস থেকে আপনার নিজস্ব API কি (যেমন বিনামূল্যে Google Gemini কি) যুক্ত করুন। আপনি অ্যাপের সেটিংস > "AI সহকারী (BYOK)" মেনু থেকে সহজেই এটি যুক্ত করতে পারেন।',
      isAiGenerated: false,
    };
  }

  const systemInstructions = `তুমি "দৈনিক আমার দেশ"-এর ভার্চুয়াল এআই সংবাদ বিশ্লেষক। পাঠকের প্রশ্নের উত্তর দাও প্রদত্ত সংবাদের পটভূমি ও তথ্যের ওপর ভিত্তি করে।
তোমার বৈশিষ্ট্য:
- উত্তর হবে সম্পূর্ণ নিরপেক্ষ, ভারসাম্যপূর্ণ ও তথ্যভিত্তিক।
- ভাষা হবে অত্যন্ত সাবলীল ও মর্যাদাপূর্ণ বাংলা।
- অতিরঞ্জিত বা ভিত্তিহীন তথ্য পরিহার করো। যদি তথ্যের অভাব থাকে, তা বিনীতভাবে স্বীকার করো।
- উত্তর সংক্ষিপ্ত ও প্রাঞ্জল রাখো (২ থেকে ৪ অনুচ্ছেদের মধ্যে)।

সংবাদ শিরোনাম: ${article.title}
সংবাদ বিভাগ: ${article.category}
মূল সংবাদ:
${textContent.slice(0, 3000)}`;

  try {
    if (config.provider === 'gemini') {
      const model = config.model || 'gemini-1.5-flash';
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${config.apiKey.trim()}`;

      const contents = [
        {
          role: 'user',
          parts: [{ text: `${systemInstructions}\n\nপাঠকের প্রশ্ন: ${question}` }],
        },
      ];

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents,
          generationConfig: { temperature: 0.3, maxOutputTokens: 800 },
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (reply) {
          return { answer: reply.trim(), isAiGenerated: true };
        }
      }
    } else {
      const endpoint =
        config.provider === 'groq'
          ? 'https://api.groq.com/openai/v1/chat/completions'
          : config.provider === 'deepseek'
          ? 'https://api.deepseek.com/chat/completions'
          : 'https://api.openai.com/v1/chat/completions';

      const model = config.model || PROVIDER_METADATA[config.provider].defaultModel;

      const messages = [
        { role: 'system', content: systemInstructions },
        ...chatHistory.map((h) => ({ role: h.role, content: h.text })),
        { role: 'user', content: question },
      ];

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${config.apiKey.trim()}`,
        },
        body: JSON.stringify({
          model,
          messages,
          temperature: 0.3,
          max_tokens: 800,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const reply = data?.choices?.[0]?.message?.content;
        if (reply) {
          return { answer: reply.trim(), isAiGenerated: true };
        }
      }
    }
  } catch (error: any) {
    return {
      answer: `দুঃখিত, এআই সার্ভারের সাথে সংযোগ করতে ত্রুটি হয়েছে: ${error?.message || error}`,
      isAiGenerated: false,
    };
  }

  return {
    answer: 'দুঃখিত, এই মুহূর্তে উত্তর তৈরি করা সম্ভব হয়নি। অনুগ্রহ করে আপনার এপিআই কি যাচাই করুন।',
    isAiGenerated: false,
  };
}
