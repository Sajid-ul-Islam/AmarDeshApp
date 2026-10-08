import {
  generateOfflineSummary,
  getByokAiConfig,
  saveByokAiConfig,
  testAiConnection,
  PROVIDER_METADATA,
  discoverGeminiModels,
  executeGeminiGenerateContent,
  finalizeBengaliResponse,
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

  it('discovers supported models dynamically from Google Gemini API', async () => {
    const mockFetch = jest.spyOn(global, 'fetch').mockImplementationOnce(async () => ({
      ok: true,
      json: async () => ({
        models: [
          {
            name: 'models/gemini-2.5-flash',
            supportedGenerationMethods: ['generateContent'],
          },
          {
            name: 'models/gemini-1.5-flash',
            supportedGenerationMethods: ['generateContent'],
          },
          {
            name: 'models/text-embedding-004',
            supportedGenerationMethods: ['embedContent'],
          },
        ],
      }),
    } as any));

    const models = await discoverGeminiModels('test_key');
    expect(models).toContain('gemini-2.5-flash');
    expect(models).toContain('gemini-1.5-flash');
    expect(models).not.toContain('text-embedding-004');
    expect(models[0]).toBe('gemini-2.5-flash'); // Preferred order

    mockFetch.mockRestore();
  });

  it('executes Gemini content generation and returns working model', async () => {
    const mockFetch = jest.spyOn(global, 'fetch').mockImplementation(async (url: any) => {
      if (typeof url === 'string' && url.includes('gemini-2.5-flash:generateContent')) {
        return {
          ok: true,
          json: async () => ({
            candidates: [
              {
                content: {
                  parts: [{ text: 'পরীক্ষামূলক বাংলা উত্তর' }],
                },
              },
            ],
          }),
        } as any;
      }
      return { ok: false, status: 404 } as any;
    });

    const result = await executeGeminiGenerateContent(
      'valid_test_api_key_12345',
      'gemini-2.5-flash',
      [{ role: 'user', parts: [{ text: 'হ্যালো' }] }]
    );

    expect(result).not.toBeNull();
    expect(result?.workingModel).toBe('gemini-2.5-flash');
    expect(result?.text).toBe('পরীক্ষামূলক বাংলা উত্তর');

    mockFetch.mockRestore();
  });

  describe('finalizeBengaliResponse', () => {
    it('preserves properly completed Bengali sentences', () => {
      const text = 'এই পদক্ষেপের ফলে অর্থনীতিতে স্থিতিশীলতা আসবে।';
      expect(finalizeBengaliResponse(text)).toBe(text);
    });

    it('safely trims trailing severed sentence back to last full stop', () => {
      const severed = 'প্রথম বাক্য সম্পূর্ণ হয়েছে। এরপর দ্বিতীয় বাক্যের কিছু অংশ এসে কেটে গে';
      const finalized = finalizeBengaliResponse(severed);
      expect(finalized).toBe('প্রথম বাক্য সম্পূর্ণ হয়েছে।');
    });

    it('appends Bengali punctuation if no previous punctuation exists', () => {
      const shortText = 'সংক্ষিপ্ত মন্তব্য';
      expect(finalizeBengaliResponse(shortText)).toBe('সংক্ষিপ্ত মন্তব্য।');
    });
  });
});

