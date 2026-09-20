import { Article } from '../types';

// ============================================
// BYoak - Bring Your Own API Key AI System
// ============================================
// Users provide their own API keys. Keys are stored
// locally in the browser and NEVER sent to our servers.
// All API calls go directly from user's browser to the AI provider.

export type AIProvider = 'openai' | 'gemini' | 'anthropic' | 'openrouter';

export interface AIProviderConfig {
  id: AIProvider;
  name: string;
  displayName: string;
  baseUrl: string;
  modelOptions: string[];
  defaultModel: string;
  keyPlaceholder: string;
  getKeyUrl: string;
  icon: string;
}

export const AI_PROVIDERS: Record<AIProvider, AIProviderConfig> = {
  openai: {
    id: 'openai',
    name: 'openai',
    displayName: 'OpenAI (GPT)',
    baseUrl: 'https://api.openai.com/v1/chat/completions',
    modelOptions: ['gpt-4o-mini', 'gpt-4o', 'gpt-4-turbo', 'gpt-3.5-turbo'],
    defaultModel: 'gpt-4o-mini',
    keyPlaceholder: 'sk-...',
    getKeyUrl: 'https://platform.openai.com/api-keys',
    icon: '🟢',
  },
  gemini: {
    id: 'gemini',
    name: 'gemini',
    displayName: 'Google Gemini',
    baseUrl: 'https://generativelanguage.googleapis.com/v1beta/models',
    modelOptions: ['gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-1.5-pro'],
    defaultModel: 'gemini-2.0-flash',
    keyPlaceholder: 'AIza...',
    getKeyUrl: 'https://aistudio.google.com/apikey',
    icon: '🔵',
  },
  anthropic: {
    id: 'anthropic',
    name: 'anthropic',
    displayName: 'Anthropic (Claude)',
    baseUrl: 'https://api.anthropic.com/v1/messages',
    modelOptions: ['claude-3-5-haiku-20241022', 'claude-3-5-sonnet-20241022', 'claude-3-opus-20240229'],
    defaultModel: 'claude-3-5-haiku-20241022',
    keyPlaceholder: 'sk-ant-...',
    getKeyUrl: 'https://console.anthropic.com/settings/keys',
    icon: '🟠',
  },
  openrouter: {
    id: 'openrouter',
    name: 'openrouter',
    displayName: 'OpenRouter (Multi-Model)',
    baseUrl: 'https://openrouter.ai/api/v1/chat/completions',
    modelOptions: [
      'google/gemini-2.0-flash-exp:free',
      'meta-llama/llama-3-8b-instruct:free',
      'mistralai/mistral-7b-instruct:free',
      'openai/gpt-4o-mini',
      'anthropic/claude-3.5-sonnet',
    ],
    defaultModel: 'google/gemini-2.0-flash-exp:free',
    keyPlaceholder: 'sk-or-...',
    getKeyUrl: 'https://openrouter.ai/keys',
    icon: '🟣',
  },
};

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  articleContext?: Article;
}

// System prompt for the AI assistant
const SYSTEM_PROMPT = `তুমি "আমার দেশ" নিউজ অ্যাপের AI সহকারী। তোমার নাম "BYoak"।

তোমার কাজ:
১. সংবাদ সম্পর্কে প্রশ্নের উত্তর দেওয়া
২. সংবাদ সারসংক্ষেপ করা
৩. বাংলা ও ইংরেজির মধ্যে অনুবাদ করা
৪. বর্তমান ঘটনা ব্যাখ্যা করা
৫. সংবাদের প্রেক্ষাপট বোঝানো

নিয়ম:
- সবসময় বাংলায় উত্তর দাও (যদি ইংরেজিতে না চাওয়া হয়)
- সংক্ষিপ্ত ও স্পষ্ট উত্তর দাও
- নিরপেক্ষ থাকো, কোনো রাজনৈতিক মতামত দিও না
- তথ্য সঠিক না হলে বলো যে তুমি নিশ্চিত নও
- ব্যবহারকারীকে "আপনি" সম্বোধন করো
- Markdown ফরম্যাটে উত্তর দাও যেখানে প্রয়োজন`;

function buildContextPrompt(article?: Article): string {
  if (!article) return '';
  return `\n\nবর্তমান সংবাদ প্রসঙ্গ:\nশিরোনাম: ${article.title}\nবিভাগ: ${article.category}\nবিবরণ: ${article.excerpt}\n\nএই সংবাদ সম্পর্কে কোনো প্রশ্ন থাকলে উত্তর দাও।`;
}

// ============================================
// OpenAI-compatible API call
// ============================================
async function callOpenAICompatible(
  baseUrl: string,
  apiKey: string,
  model: string,
  messages: { role: string; content: string }[],
  provider: AIProvider
): Promise<string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (provider === 'openrouter') {
    headers['Authorization'] = `Bearer ${apiKey}`;
    headers['HTTP-Referer'] = window.location.origin;
    headers['X-Title'] = 'Amar Desh AI Assistant';
  } else {
    headers['Authorization'] = `Bearer ${apiKey}`;
  }

  const response = await fetch(baseUrl, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      model,
      messages,
      max_tokens: 1024,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData?.error?.message || `API Error: ${response.status} ${response.statusText}`
    );
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || 'উত্তর পাওয়া যায়নি';
}

// ============================================
// Google Gemini API call
// ============================================
async function callGemini(
  apiKey: string,
  model: string,
  messages: { role: string; content: string }[]
): Promise<string> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  // Convert messages to Gemini format
  const contents = messages
    .filter((m) => m.role !== 'system')
    .map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

  // Add system instruction
  const systemInstruction = messages.find((m) => m.role === 'system');

  const body: Record<string, unknown> = {
    contents,
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 1024,
    },
  };

  if (systemInstruction) {
    body.systemInstruction = {
      parts: [{ text: systemInstruction.content }],
    };
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData?.error?.message || `Gemini API Error: ${response.status}`
    );
  }

  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || 'উত্তর পাওয়া যায়নি';
}

// ============================================
// Anthropic Claude API call
// ============================================
async function callAnthropic(
  apiKey: string,
  model: string,
  messages: { role: string; content: string }[]
): Promise<string> {
  const systemMsg = messages.find((m) => m.role === 'system');
  const chatMessages = messages.filter((m) => m.role !== 'system');

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model,
      max_tokens: 1024,
      system: systemMsg?.content || '',
      messages: chatMessages.map((m) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })),
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData?.error?.message || `Anthropic API Error: ${response.status}`
    );
  }

  const data = await response.json();
  return data.content?.[0]?.text || 'উত্তর পাওয়া যায়নি';
}

// ============================================
// Main AI Service
// ============================================
export async function sendAIMessage(
  provider: AIProvider,
  apiKey: string,
  model: string,
  messages: ChatMessage[],
  articleContext?: Article
): Promise<string> {
  if (!apiKey) {
    throw new Error('API key প্রদান করা হয়নি। অনুগ্রহ করে সেটিংস থেকে API key দিন।');
  }

  // Build message history
  const apiMessages: { role: string; content: string }[] = [
    {
      role: 'system',
      content: SYSTEM_PROMPT + buildContextPrompt(articleContext),
    },
  ];

  // Add conversation history (last 10 messages)
  const history = messages.slice(-10);
  for (const msg of history) {
    if (msg.role !== 'system') {
      apiMessages.push({
        role: msg.role,
        content: msg.content,
      });
    }
  }

  // Route to correct provider
  switch (provider) {
    case 'gemini':
      return callGemini(apiKey, model, apiMessages);

    case 'anthropic':
      return callAnthropic(apiKey, model, apiMessages);

    case 'openai':
      return callOpenAICompatible(
        AI_PROVIDERS.openai.baseUrl,
        apiKey,
        model,
        apiMessages,
        'openai'
      );

    case 'openrouter':
      return callOpenAICompatible(
        AI_PROVIDERS.openrouter.baseUrl,
        apiKey,
        model,
        apiMessages,
        'openrouter'
      );

    default:
      throw new Error(`অজানা প্রোভাইডার: ${provider}`);
  }
}

// Quick actions
export const QUICK_ACTIONS = [
  {
    id: 'summarize',
    label: '📝 সারসংক্ষেপ',
    prompt: 'এই সংবাদটি সংক্ষেপে বলো।',
  },
  {
    id: 'explain',
    label: '💡 ব্যাখ্যা করো',
    prompt: 'এই সংবাদের প্রেক্ষাপট কী? সহজ ভাষায় বুঝিয়ে বলো।',
  },
  {
    id: 'translate',
    label: '🌐 ইংরেজিতে অনুবাদ',
    prompt: 'এই সংবাদটি ইংরেজিতে অনুবাদ করো।',
  },
  {
    id: 'impact',
    label: '📊 প্রভাব বিশ্লেষণ',
    prompt: 'এই সংবাদের ফলে দেশে কী প্রভাব পড়তে পারে? বিশ্লেষণ করো।',
  },
  {
    id: 'related',
    label: '🔗 সম্পর্কিত তথ্য',
    prompt: 'এই বিষয়ে আরও কী জানা দরকার? প্রাসঙ্গিক তথ্য দাও।',
  },
];
