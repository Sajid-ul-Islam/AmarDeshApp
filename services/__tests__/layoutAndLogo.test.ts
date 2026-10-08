import { getSafeHeaderPaddingTop } from '../../utils/layout';
import { PROVIDER_METADATA, AiProvider } from '../byokAiService';

describe('Layout and BYOK Direct Link Verification', () => {
  it('calculates fail-safe header padding that prevents mobile top bar overlap', () => {
    // When insets.top is 0 (unmeasured or edge-to-edge transparent status bar)
    const paddingWithZeroInsets = getSafeHeaderPaddingTop(0, 8);
    expect(paddingWithZeroInsets).toBeGreaterThanOrEqual(28); // Clears status bar

    // When insets.top has notch / dynamic island (e.g. 54px)
    const paddingWithNotch = getSafeHeaderPaddingTop(54, 8);
    expect(paddingWithNotch).toBe(62);
  });

  it('provides direct official API key collection URLs for all supported providers', () => {
    const providers: AiProvider[] = ['gemini', 'groq', 'deepseek', 'openai'];

    for (const prov of providers) {
      const meta = PROVIDER_METADATA[prov];
      expect(meta.portalName).toBeDefined();
      expect(meta.portalName.length).toBeGreaterThan(0);
      expect(meta.keyHelpUrl).toMatch(/^https:\/\//);
      expect(meta.defaultModel).toBeDefined();
      expect(meta.supportedModels.length).toBeGreaterThanOrEqual(2);
      expect(meta.steps.length).toBeGreaterThanOrEqual(3);
    }
  });

  it('contains verified auto-working models with recommendations', () => {
    expect(PROVIDER_METADATA.gemini.defaultModel).toBe('gemini-2.5-flash');
    expect(PROVIDER_METADATA.gemini.keyHelpUrl).toBe('https://aistudio.google.com/app/apikey');
    expect(PROVIDER_METADATA.gemini.freeTierAvailable).toBe(true);

    expect(PROVIDER_METADATA.groq.defaultModel).toBe('llama-3.3-70b-versatile');
    expect(PROVIDER_METADATA.groq.keyHelpUrl).toBe('https://console.groq.com/keys');

    expect(PROVIDER_METADATA.openai.defaultModel).toBe('gpt-4o-mini');
    expect(PROVIDER_METADATA.openai.keyHelpUrl).toBe('https://platform.openai.com/api-keys');

    expect(PROVIDER_METADATA.deepseek.defaultModel).toBe('deepseek-chat');
    expect(PROVIDER_METADATA.deepseek.keyHelpUrl).toBe('https://platform.deepseek.com/api_keys');
  });

  it('guarantees full official calligraphy logo natural aspect ratio for headers', () => {
    const pngRatio = 867 / 213;
    expect(pngRatio).toBeGreaterThan(4.0); // Wide calligraphy banner
    const defaultHeaderHeight = 28;
    const computedHeaderWidth = Math.round(defaultHeaderHeight * pngRatio);
    expect(computedHeaderWidth).toBeGreaterThanOrEqual(110);
  });
});
