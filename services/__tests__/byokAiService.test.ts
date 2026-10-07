import {
  generateOfflineSummary,
  getByokAiConfig,
  saveByokAiConfig,
  testAiConnection,
  PROVIDER_METADATA,
} from '../byokAiService';

describe('ByokAiService', () => {
  it('generates 3-point offline Bengali summary from article content', () => {
    const title = 'সংস্কার ও জাতীয় পুনর্গঠনে বিশেষ রোডম্যাপ ঘোষণা';
    const content =
      'অন্তর্বর্তীকালীন সরকার সংস্কার কার্যক্রমের ধারাবাহিকতায় আজ নতুন রোডম্যাপ ঘোষণা করেছে। বিভিন্ন রাজনৈতিক দল ও নাগরিক সমাজের প্রতিনিধিদের সাথে আলোচনা সাপেক্ষে এই রূপরেখা প্রস্তুত করা হয়েছে। আগামী ডিসেম্বরের মধ্যে প্রথম ধাপের প্রতিবেদন প্রকাশের আশা করা হচ্ছে।';

    const points = generateOfflineSummary(title, content);
    expect(points).toHaveLength(3);
    expect(points[0]).toContain(title);
    expect(points[1]).toBeDefined();
    expect(points[2]).toBeDefined();
  });

  it('rejects empty or invalid API key during connection test', async () => {
    const result = await testAiConnection('gemini', '');
    expect(result.success).toBe(false);
    expect(result.message).toContain('বৈধ এপিআই কি');

    const shortResult = await testAiConnection('gemini', '123');
    expect(shortResult.success).toBe(false);
  });

  it('provides metadata for all 4 supported providers', () => {
    expect(PROVIDER_METADATA.gemini.name).toBe('Google Gemini');
    expect(PROVIDER_METADATA.gemini.freeTierAvailable).toBe(true);

    expect(PROVIDER_METADATA.groq.name).toBe('Groq (Llama 3.3)');
    expect(PROVIDER_METADATA.groq.freeTierAvailable).toBe(true);

    expect(PROVIDER_METADATA.deepseek.name).toBe('DeepSeek AI');
    expect(PROVIDER_METADATA.openai.name).toBe('OpenAI (ChatGPT)');
  });

  it('saves and retrieves BYOK AI configuration', async () => {
    await saveByokAiConfig({
      provider: 'groq',
      apiKey: 'gsk_test123456789',
      model: 'llama-3.3-70b-versatile',
      enabled: true,
    });

    const config = await getByokAiConfig();
    expect(config.provider).toBe('groq');
    expect(config.apiKey).toBe('gsk_test123456789');
    expect(config.enabled).toBe(true);
  });
});
