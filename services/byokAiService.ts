import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Article } from '../types';

export type AiProvider = 'gemini' | 'openai' | 'groq' | 'deepseek';

export interface ByokAiConfig {
  provider: AiProvider;
  apiKey: string;
  model?: string;
  enabled: boolean;
}

const STORAGE_KEY = '@amar_desh_byok_ai_config';

export interface SupportedModelInfo {
  id: string;
  name: string;
  description: string;
  isRecommended?: boolean;
}

export const PROVIDER_METADATA: Record<
  AiProvider,
  {
    name: string;
    portalName: string;
    defaultModel: string;
    supportedModels: SupportedModelInfo[];
    description: string;
    freeTierAvailable: boolean;
    freeTierNote: string;
    keyHelpUrl: string;
    placeholder: string;
    steps: string[];
  }
> = {
  gemini: {
    name: 'Google Gemini',
    portalName: 'Google AI Studio',
    defaultModel: 'gemini-2.5-flash',
    supportedModels: [
      {
        id: 'gemini-2.5-flash',
        name: 'Gemini 2.5 Flash (স্বয়ংক্রিয় / সুপারিশকৃত)',
        description: 'সর্বাধুনিক উচ্চগতির বহুভাষিক মডেল। বিদ্যুৎগতির প্রতিক্রিয়া ও ১০০% বিনামূল্যে।',
        isRecommended: true,
      },
      {
        id: 'gemini-flash-latest',
        name: 'Gemini Flash Latest',
        description: 'সর্বশেষ ফ্ল্যাশ ভার্সন। যেকোনো আপডেটে সর্বদা কার্যকর।',
      },
      {
        id: 'gemini-2.0-flash',
        name: 'Gemini 2.0 Flash',
        description: 'গুগলের জেমিনি ২.০ ফ্ল্যাশ মডেল। উন্নত বাংলা প্রসেসিং।',
      },
      {
        id: 'gemini-1.5-flash',
        name: 'Gemini 1.5 Flash',
        description: 'বহুভাষিক ১.৫ মডেল। সর্বাধিক কোটা সমর্থন।',
      },
      {
        id: 'gemini-2.5-pro',
        name: 'Gemini 2.5 Pro (গভীর বিশ্লেষণ)',
        description: 'জটিল ও দীর্ঘ সংবাদ বিশ্লেষণের জন্য সবচেয়ে উন্নত বুদ্ধিমত্তা।',
      },
    ],
    description: 'গুগলের শক্তিশালী বহুভাষিক মডেল। ক্রেডিট কার্ড ছাড়াই আপনার পার্সোনাল জিমেইল দিয়ে বিনামূল্যে API Key তৈরি করা যায়। যেকোনো মডেলের কি স্বয়ংক্রিয়ভাবে কাজ করবে।',
    freeTierAvailable: true,
    freeTierNote: 'ক্রেডিট কার্ডের প্রয়োজন নেই — ১০০% ফ্রি রেট লিমিট (১৫ RPM / ১,৫০০ RPD)',
    keyHelpUrl: 'https://aistudio.google.com/app/apikey',
    placeholder: 'AIzaSy...',
    steps: [
      'নিচের "সরাসরি API Key পেজে যান" বাটনে ট্যাপ করে Google AI Studio-তে যান।',
      'আপনার গুগল অ্যাকাউন্টে সাইন ইন করে "Create API key" বাটনে ক্লিক করুন।',
      'উৎপন্ন এপিআই কি কপি করে নিচের বক্সে পেস্ট করে সংরক্ষণ করুন (মডেল স্বয়ংক্রিয়ভাবে নির্ধারিত হবে)।',
    ],
  },
  groq: {
    name: 'Groq (Llama 3.3)',
    portalName: 'Groq Cloud Console',
    defaultModel: 'llama-3.3-70b-versatile',
    supportedModels: [
      {
        id: 'llama-3.3-70b-versatile',
        name: 'Llama 3.3 70B Versatile',
        description: 'ওপেন-সোর্স বিশ্বের শীর্ষস্থানীয় ৭০ বিলিয়ন প্যারামিটারের ক্ষমতাসম্পন্ন মডেল।',
        isRecommended: true,
      },
      {
        id: 'llama-3.1-8b-instant',
        name: 'Llama 3.1 8B Instant',
        description: 'অত্যন্ত হালকা ও চোখের পলকে উত্তর দেওয়ার উপযোগী আল্ট্রা-ফাস্ট মডেল।',
      },
    ],
    description: 'আল্ট্রা-ফাস্ট এলপিইউ ইনফারেন্স স্পিড। বিনামূল্যে ডেভেলপার টিয়ার উপলব্ধ।',
    freeTierAvailable: true,
    freeTierNote: 'বিনামূল্যে ডেভেলপার অ্যাকাউন্ট — সেকেন্ডে শত শত টোকেন স্পিড',
    keyHelpUrl: 'https://console.groq.com/keys',
    placeholder: 'gsk_...',
    steps: [
      '"সরাসরি API Key পেজে যান" বাটনে ক্লিক করে Groq Console ওপেন করুন।',
      'লগইন করে "Create API Key" নির্বাচন করুন এবং নাম দিন।',
      'প্রদর্শিত "gsk_..." কি-টি কপি করে এখানে পেস্ট করুন।',
    ],
  },
  deepseek: {
    name: 'DeepSeek AI',
    portalName: 'DeepSeek Platform',
    defaultModel: 'deepseek-chat',
    supportedModels: [
      {
        id: 'deepseek-chat',
        name: 'DeepSeek-V3 (Chat)',
        description: 'সাশ্রয়ী আন্তর্জাতিক মানের ডিপসিক ভি৩ মডেল। গভীর যৌক্তিক বিশ্লেষণ।',
        isRecommended: true,
      },
      {
        id: 'deepseek-reasoner',
        name: 'DeepSeek-R1 (Reasoner)',
        description: 'ম্যাথ ও জটিল লজিক্যাল রিজনিংয়ের জন্য ডিপসিক আর১ মডেল।',
      },
    ],
    description: 'অত্যন্ত সাশ্রয়ী ও শক্তিশালী ডিপসিক ভি৩ মডেল। গভীর যৌক্তিক বিশ্লেষণ ও রাজনৈতিক প্রেক্ষাপট।',
    freeTierAvailable: false,
    freeTierNote: 'অত্যন্ত সাশ্রয়ী পে-অ্যাজ-ইউ-গো মূল্য ($০.১৪ / ১M ইনপুট টোকেন)',
    keyHelpUrl: 'https://platform.deepseek.com/api_keys',
    placeholder: 'sk-...',
    steps: [
      '"সরাসরি API Key পেজে যান" বাটনে ট্যাপ করে DeepSeek প্ল্যাটফর্মে প্রবেশ করুন।',
      'অ্যাকাউন্টে লগইন করে "API Keys" সেকশন থেকে "Create new API key" দিন।',
      'প্রাপ্ত কি-টি কপি করে নিচের ঘরে সংরক্ষণ করুন।',
    ],
  },
  openai: {
    name: 'OpenAI (ChatGPT)',
    portalName: 'OpenAI Platform',
    defaultModel: 'gpt-4o-mini',
    supportedModels: [
      {
        id: 'gpt-4o-mini',
        name: 'GPT-4o Mini (সুপারিশকৃত)',
        description: 'সাশ্রয়ী, দ্রুত ও সাবলীল বাংলা আউটপুটের জন্য সবচেয়ে নির্ভরযোগ্য।',
        isRecommended: true,
      },
      {
        id: 'gpt-4o',
        name: 'GPT-4o (ফ্ল্যাগশিপ)',
        description: 'সর্বোচ্চ বুদ্ধিমত্তাসম্পন্ন বহুমুখী ফ্ল্যাগশিপ মডেল।',
      },
    ],
    description: 'ওপেনএআই-এর নির্ভরযোগ্য জিপিটি-৪ও মিনি মডেল। স্পষ্ট এবং সাবলীল বাংলা আউটপুট।',
    freeTierAvailable: false,
    freeTierNote: 'ওপেনএআই ডেভেলপার প্ল্যাটফর্ম — যেকোনো অ্যাক্টিভ অ্যাকাউন্টে কার্যকর',
    keyHelpUrl: 'https://platform.openai.com/api-keys',
    placeholder: 'sk-proj-...',
    steps: [
      '"সরাসরি API Key পেজে যান" বাটনে ক্লিক করে OpenAI ড্যাশবোর্ডে প্রবেশ করুন।',
      'লগইন করে "Create new secret key" বাটনে ক্লিক করুন।',
      'উৎপন্ন "sk-..." সিক্রেট কি কপি করে নিচের ঘরে পেস্ট করে সংরক্ষণ করুন।',
    ],
  },
};

export const GEMINI_CANDIDATE_MODELS = [
  'gemini-2.5-flash',
  'gemini-flash-latest',
  'gemini-2.0-flash',
  'gemini-2.5-flash-lite',
  'gemini-1.5-flash',
  'gemini-1.5-flash-latest',
  'gemini-1.5-flash-8b',
  'gemini-2.5-pro',
  'gemini-pro-latest',
  'gemini-1.5-pro',
  'gemini-pro',
];

/**
 * Default AI configuration.
 *
 * SECURITY: this deliberately ships **no** API key. `EXPO_PUBLIC_*` values are
 * inlined into the JavaScript bundle by Metro, so any key referenced here would
 * be readable by anyone who unzips the shipped app and could be spent by every
 * installation. AI features therefore start disabled and require the user to
 * paste their own key in Settings → AI (BYOK).
 *
 * Never reintroduce a bundled key. If an operator wants to offer a hosted key,
 * it must be proxied through a server with per-user rate limiting, not inlined.
 */
const DEFAULT_CONFIG: ByokAiConfig = {
  provider: 'gemini',
  apiKey: '',
  model: 'gemini-2.5-flash',
  enabled: false,
};

/**
 * Dynamically queries Google Generative AI models API to find which models
 * are supported by this specific user API key.
 */
export async function discoverGeminiModels(apiKey: string): Promise<string[]> {
  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey.trim()}`;
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data?.models)) {
        const supported = (data.models as Array<{ name?: string; supportedGenerationMethods?: string[] }>)
          .filter((m) => {
            const methods = m?.supportedGenerationMethods || [];
            return methods.includes('generateContent');
          })
          .map((m) => (m.name || '').replace(/^models\//, ''))
          .filter((name: string) => name.length > 0);

        if (supported.length > 0) {
          const preferredOrder = [
            'gemini-2.5-flash',
            'gemini-flash-latest',
            'gemini-2.0-flash',
            'gemini-2.5-flash-lite',
            'gemini-1.5-flash',
            'gemini-1.5-flash-latest',
            'gemini-1.5-flash-8b',
            'gemini-2.5-pro',
            'gemini-pro-latest',
            'gemini-1.5-pro',
            'gemini-pro',
          ];
          supported.sort((a: string, b: string) => {
            const idxA = preferredOrder.indexOf(a);
            const idxB = preferredOrder.indexOf(b);
            if (idxA !== -1 && idxB !== -1) return idxA - idxB;
            if (idxA !== -1) return -1;
            if (idxB !== -1) return 1;
            return a.localeCompare(b);
          });
          return supported;
        }
      }
    }
  } catch (e) {
    console.warn('[Gemini Discovery] Error checking models endpoint:', e);
  }
  return [];
}

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
 * Test API Key Connection with the selected provider, auto-detecting working model
 */
export async function testAiConnection(
  provider: AiProvider,
  apiKey: string,
  model?: string
): Promise<{ success: boolean; message: string; detectedModel?: string }> {
  if (!apiKey || apiKey.trim().length < 8) {
    return {
      success: false,
      message: 'অনুগ্রহ করে একটি বৈধ এপিআই কি (API Key) প্রবেশ করান।',
    };
  }

  const selectedModel = model || PROVIDER_METADATA[provider].defaultModel;

  try {
    if (provider === 'gemini') {
      // 1. Try dynamic model discovery first to see what this specific key supports
      const discovered = await discoverGeminiModels(apiKey);
      const candidatesToTry = discovered.length > 0
        ? discovered
        : [selectedModel, ...GEMINI_CANDIDATE_MODELS].filter(
            (v, i, a) => a.indexOf(v) === i
          );

      let lastError = '';
      for (const candidate of candidatesToTry) {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${candidate}:generateContent?key=${apiKey.trim()}`;
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

        if (response.ok) {
          // Success! Save working model as preference
          return {
            success: true,
            message: `অভিনন্দন! গুগল জেমিনি এপিআই সফলভাবে সংযুক্ত হয়েছে (${candidate})।`,
            detectedModel: candidate,
          };
        }

        const errorData = await response.json().catch(() => ({}));
        const errMsg = errorData?.error?.message || `HTTP ${response.status}`;
        lastError = errMsg;

        // If key is invalid (not a 404 model mismatch), abort immediately
        if (response.status === 400 && errMsg.toLowerCase().includes('api_key_invalid')) {
          return { success: false, message: `ভুল এপিআই কি: ${errMsg}` };
        }
        if (response.status === 403) {
          return { success: false, message: `অনুমতি নেই বা কি নিষিদ্ধ: ${errMsg}` };
        }
      }

      return {
        success: false,
        message: `জেমিনি সংযোগ ব্যর্থ: কোনো সমর্থিত মডেল পাওয়া যায়নি (${lastError})`,
      };
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

      return { success: true, message: `অভিনন্দন! OpenAI (${selectedModel}) সফলভাবে সংযুক্ত হয়েছে।` };
    }

    if (provider === 'groq') {
      let activeModel = selectedModel;
      let response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey.trim()}`,
        },
        body: JSON.stringify({
          model: activeModel,
          messages: [{ role: 'user', content: 'Say "OK"' }],
          max_tokens: 5,
        }),
      });

      // Auto-fallback for Groq if 70b has model error
      if (!response.ok && activeModel !== 'llama-3.1-8b-instant') {
        activeModel = 'llama-3.1-8b-instant';
        response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey.trim()}`,
          },
          body: JSON.stringify({
            model: activeModel,
            messages: [{ role: 'user', content: 'Say "OK"' }],
            max_tokens: 5,
          }),
        });
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errMsg = errorData?.error?.message || `HTTP ত্রুটি: ${response.status}`;
        return { success: false, message: `Groq সংযোগ ব্যর্থ: ${errMsg}` };
      }

      return { success: true, message: `অভিনন্দন! Groq (${activeModel}) সফলভাবে সংযুক্ত হয়েছে।` };
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
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : String(error);
    return {
      success: false,
      message: `ইন্টারনেট বা নেটওয়ার্ক সংযোগ ত্রুটি: ${errMessage}`,
    };
  }
}

/**
 * Executes a Gemini generateContent call with resilient auto-discovery and candidate model fallback
 */
export interface GeminiContentPart {
  text: string;
}

export interface GeminiContentItem {
  role?: string;
  parts: GeminiContentPart[];
}

export async function executeGeminiGenerateContent(
  apiKey: string,
  contents: GeminiContentItem[],
  preferredModel: string = 'gemini-2.5-flash',
  generationConfig: { temperature?: number; maxOutputTokens?: number } = {}
): Promise<{ text: string; workingModel: string } | null> {
  const cleanKey = apiKey.trim();
  const modelsToTry = [
    preferredModel,
    ...GEMINI_CANDIDATE_MODELS,
  ].filter((v, i, a) => a.indexOf(v) === i);

  for (const candidate of modelsToTry) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${candidate}:generateContent?key=${cleanKey}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents,
          generationConfig: {
            temperature: generationConfig.temperature ?? 0.2,
            maxOutputTokens: generationConfig.maxOutputTokens ?? 1000,
          },
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) {
          if (candidate !== preferredModel) {
            getByokAiConfig().then((cfg) => {
              if (cfg.provider === 'gemini') {
                saveByokAiConfig({ ...cfg, model: candidate });
              }
            }).catch(() => {});
          }
          return { text, workingModel: candidate };
        }
      }

      if (response.status === 400 || response.status === 403) {
        const errorData = await response.json().catch(() => ({}));
        const errMsg = errorData?.error?.message || '';
        if (errMsg.toLowerCase().includes('api_key_invalid')) {
          break;
        }
      }
    } catch {
      // Continue to next candidate
    }
  }

  // Attempt discovery if not found yet
  try {
    const discovered = await discoverGeminiModels(cleanKey);
    for (const model of discovered) {
      if (modelsToTry.includes(model)) continue;
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${cleanKey}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents,
          generationConfig,
        }),
      });
      if (response.ok) {
        const data = await response.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) {
          getByokAiConfig().then((cfg) => {
            if (cfg.provider === 'gemini') {
              saveByokAiConfig({ ...cfg, model });
            }
          }).catch(() => {});
          return { text, workingModel: model };
        }
      }
    }
  } catch {
    // Ignore
  }

  return null;
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
    let usedProvider = PROVIDER_METADATA[config.provider].name;

    if (config.provider === 'gemini') {
      const preferred = config.model || 'gemini-2.5-flash';
      const geminiRes = await executeGeminiGenerateContent(
        config.apiKey,
        [{ role: 'user', parts: [{ text: prompt }] }],
        preferred,
        { temperature: 0.2, maxOutputTokens: 500 }
      );
      if (geminiRes) {
        resultText = geminiRes.text;
        usedProvider = `Google Gemini (${geminiRes.workingModel})`;
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
          providerUsed: usedProvider,
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
 * Ensures AI Bengali responses always finish with a completed sentence
 * and never display severed words or trailing fragments.
 */
export function finalizeBengaliResponse(rawText: string): string {
  const trimmed = rawText.trim();
  if (!trimmed) return trimmed;

  // If response ends with standard closing punctuation or quotation
  if (/[।!?”"’)\]]$/.test(trimmed)) {
    return trimmed;
  }

  // If the model cut off mid-sentence, find the last complete sentence
  const lastPunctuation = Math.max(
    trimmed.lastIndexOf('।'),
    trimmed.lastIndexOf('!'),
    trimmed.lastIndexOf('?')
  );

  // If there is at least one complete sentence before the severed fragment, slice cleanly to it
  if (lastPunctuation >= 0) {
    return trimmed.slice(0, lastPunctuation + 1).trim();
  }

  // Otherwise append Bengali dari to cleanly close the statement
  return `${trimmed}।`;
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
        'AI সংবাদ সহকারীর সম্পূর্ণ সুবিধা উপভোগ করতে সেটিংস থেকে আপনার নিজস্ব API কি (যেমন বিনামূল্যে Google Gemini কি) যুক্ত করুন। আপনি অ্যাপের সেটিংস > "AI সহকারী" মেনু থেকে সহজেই এটি যুক্ত করতে পারেন।',
      isAiGenerated: false,
    };
  }

  const systemInstructions = `তুমি "দৈনিক আমার দেশ"-এর ভার্চুয়াল এআই সংবাদ বিশ্লেষক। পাঠকের প্রশ্নের উত্তর দাও প্রদত্ত সংবাদের পটভূমি ও তথ্যের ওপর ভিত্তি করে।
তোমার আবশ্যকীয় নীতি ও নির্দেশনা:
১. নিরপেক্ষতা ও বস্তুনিষ্ঠতা: উত্তর হবে সম্পূর্ণ নিরপেক্ষ, তথ্যভিত্তিক ও মর্যাদাপূর্ণ খাঁটি বাংলায়।
২. পরিমিত শব্দসীমা: উত্তরটি অবশ্যই ১০০ থেকে ১৫০ শব্দের মধ্যে (বা সর্বোচ্চ ২টি পরিচ্ছন্ন অনুচ্ছেদ অথবা ৩-৪টি সুস্পষ্ট বুলেট পয়েন্টে) সীমাবদ্ধ রাখো। অনর্থক দীর্ঘ ভূমিকা পরিহার করে সরাসরি মূল বিষয়ে আসো।
৩. আবশ্যিক সমাপ্তি নিয়ম: উত্তরকে অবশ্যই এই সীমিত শব্দসীমার ভেতরেই সম্পূর্ণ সমাপ্ত করতে হবে। কোনো বাক্য বা বক্তব্য কখনো অসমাপ্ত বা মাঝপথে কাটা রাখা যাবে না; অবশ্যই পূর্ণাঙ্গ সমাপ্তিসূচক বাক্য ('।') দিয়ে বক্তব্য শেষ করো।

সংবাদ শিরোনাম: ${article.title}
সংবাদ বিভাগ: ${article.category}
মূল সংবাদ:
${textContent.slice(0, 3500)}`;

  try {
    if (config.provider === 'gemini') {
      const preferred = config.model || 'gemini-2.5-flash';
      const geminiRes = await executeGeminiGenerateContent(
        config.apiKey,
        [
          {
            role: 'user',
            parts: [{ text: `${systemInstructions}\n\nপাঠকের প্রশ্ন: ${question}` }],
          },
        ],
        preferred,
        { temperature: 0.3, maxOutputTokens: 1000 }
      );

      if (geminiRes && geminiRes.text) {
        return { answer: finalizeBengaliResponse(geminiRes.text), isAiGenerated: true };
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
          max_tokens: 1000,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const reply = data?.choices?.[0]?.message?.content;
        if (reply) {
          return { answer: finalizeBengaliResponse(reply), isAiGenerated: true };
        }
      }
    }
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : String(error);
    return {
      answer: `দুঃখিত, এআই সার্ভারের সাথে সংযোগ করতে ত্রুটি হয়েছে: ${errMessage}`,
      isAiGenerated: false,
    };
  }

  return {
    answer: 'দুঃখিত, এই মুহূর্তে উত্তর তৈরি করা সম্ভব হয়নি। অনুগ্রহ করে আপনার এপিআই কি যাচাই করুন।',
    isAiGenerated: false,
  };
}
