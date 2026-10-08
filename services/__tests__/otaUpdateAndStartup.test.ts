import {
  getAppVersionInfo,
  checkForOtaUpdate,
  applyOtaUpdate,
  getLastOtaCheckTime,
  isOtaUpdateSupported,
} from '../otaUpdateService';
import { t } from '../i18n';

describe('OTA Update Service & AI Assistant Localization Tests', () => {
  it('returns valid app and runtime version details', () => {
    const info = getAppVersionInfo();
    expect(info.version).toBe('1.3.0');
    expect(info.runtimeVersion).toBeDefined();
    expect(info.channel).toBeDefined();
    expect(info.platform).toBeDefined();
    // Placeholder app.json ships no real EAS project id, so the service must
    // report it as unconfigured rather than inventing one.
    expect(info.projectId).toBe('not-configured');
  });

  it('checks for OTA updates and returns structured update info', async () => {
    const update = await checkForOtaUpdate();
    expect(update).toBeDefined();
    expect(typeof update.isAvailable).toBe('boolean');
    expect(typeof update.checked).toBe('boolean');
    expect(update.currentVersion).toBe('1.3.0');
    expect(update.releaseNotes).toBeDefined();
    expect(update.lastChecked).toBeDefined();

    const lastTime = await getLastOtaCheckTime();
    expect(lastTime).toBeDefined();
  });

  it('does not claim an update was applied when updates are not configured', async () => {
    // Regression guard: the app must never report OTA success it cannot verify.
    // With the placeholder project id there is no EAS backend to pull from.
    const result = await applyOtaUpdate();
    expect(result.success).toBe(false);
    expect(result.message).toBeDefined();

    // And the capability check must agree.
    expect(isOtaUpdateSupported()).toBe(false);
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
