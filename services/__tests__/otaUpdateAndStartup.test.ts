import {
  getAppVersionInfo,
  checkForOtaUpdate,
  applyOtaUpdate,
  getLastOtaCheckTime,
} from '../otaUpdateService';
import { t } from '../i18n';

describe('OTA Update Service & AI Assistant Localization Tests', () => {
  it('returns valid app and runtime version details', () => {
    const info = getAppVersionInfo();
    expect(info.version).toBe('1.3.0');
    expect(info.runtimeVersion).toBeDefined();
    expect(info.channel).toBeDefined();
    expect(info.platform).toBeDefined();
  });

  it('checks for OTA updates and returns structured update info', async () => {
    const update = await checkForOtaUpdate();
    expect(update).toBeDefined();
    expect(typeof update.isAvailable).toBe('boolean');
    expect(update.currentVersion).toBe('1.3.0');
    expect(update.releaseNotes).toBeDefined();
    expect(update.lastChecked).toBeDefined();

    const lastTime = await getLastOtaCheckTime();
    expect(lastTime).toBeDefined();
  });

  it('applies update gracefully with status message', async () => {
    const result = await applyOtaUpdate();
    expect(result.success).toBe(true);
    expect(result.message).toBeDefined();
  });

  it('does not display BYOK technical jargon in user-facing i18n titles', () => {
    const bnTitle = t('ai_settings_title', 'bn');
    const enTitle = t('ai_settings_title', 'en');

    expect(bnTitle).toContain('এআই সহকারী');
    expect(bnTitle).not.toContain('BYOK');

    expect(enTitle).toContain('AI Assistant');
    expect(enTitle).not.toContain('BYOK');
  });
});
