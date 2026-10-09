import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import {
  getEasProjectId,
  isEasProjectConfigured,
  getUpdatesUrl,
} from './appConfig';

export interface OtaUpdateInfo {
  isAvailable: boolean;
  currentVersion: string;
  latestVersion: string;
  releaseChannel: string;
  publishedAt?: string;
  releaseNotes?: string;
  lastChecked?: string;
  /**
   * True when the update check actually ran against EAS. When false, the other
   * fields describe nothing and the UI must say "not configured" rather than
   * claim the app is up to date.
   */
  checked: boolean;
}

const LAST_CHECK_KEY = '@amar_desh_last_ota_check';
const CURRENT_APP_VERSION = Constants.expoConfig?.version || '1.3.0';

/**
 * Get current installed app and runtime version details
 */
export function getAppVersionInfo() {
  const runtime = Constants.expoConfig?.runtimeVersion;
  const runtimeVersion = typeof runtime === 'string' ? runtime : 'sdk:57';
  const projectId = getEasProjectId();

  return {
    version: CURRENT_APP_VERSION,
    runtimeVersion,
    projectId: projectId ?? 'not-configured',
    channel: __DEV__ ? 'development' : 'production',
    platform: Platform.OS,
  };
}

/**
 * Format timestamp into Bengali readable date-time
 */
function formatBengaliTimestamp(date: Date): string {
  const hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const period = hours >= 12 ? 'বিকাল/সন্ধ্যা' : 'সকাল';
  const displayHours = hours % 12 || 12;

  return `${period} ${displayHours}:${minutes} মিনিট`;
}

/**
 * Whether OTA updates can run at all on this build.
 *
 * `expo-updates` is only useful once the project is linked to EAS *and* the
 * native module is present in the binary (it is absent in Expo Go and in any
 * build made before `expo-updates` was installed).
 */
export function isOtaUpdateSupported(): boolean {
  if (!isEasProjectConfigured()) return false;

  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const Updates = require('expo-updates');
    return Boolean(Updates?.isEnabled);
  } catch {
    return false;
  }
}

/**
 * Check for Over-The-Air (OTA) application updates.
 *
 * Never reports a false success: when updates are not configured or the native
 * module is unavailable, `checked` is false so the UI can say so explicitly.
 */
export async function checkForOtaUpdate(): Promise<OtaUpdateInfo> {
  const checkTimestamp = formatBengaliTimestamp(new Date());

  try {
    await AsyncStorage.setItem(LAST_CHECK_KEY, checkTimestamp);
  } catch {
    // Non-fatal if storage fails
  }

  const base = {
    currentVersion: CURRENT_APP_VERSION,
    latestVersion: CURRENT_APP_VERSION,
    releaseChannel: __DEV__ ? 'development' : 'production',
    lastChecked: checkTimestamp,
  };

  if (!isEasProjectConfigured()) {
    return {
      ...base,
      isAvailable: false,
      checked: false,
      releaseNotes:
        'এই বিল্ডে ওটিএ আপডেট সক্রিয় নেই (EAS প্রজেক্ট সংযুক্ত নয়)। নতুন সংস্করণের জন্য স্টোর থেকে আপডেট করুন।',
    };
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const Updates = require('expo-updates');
    if (!Updates?.isEnabled) {
      return {
        ...base,
        isAvailable: false,
        checked: false,
        releaseNotes:
          'এই বিল্ডে ওটিএ আপডেট উপলব্ধ নয়। নতুন সংস্করণের জন্য স্টোর থেকে আপডেট করুন।',
      };
    }

    if (__DEV__) {
      // expo-updates is disabled in development builds by design.
      return {
        ...base,
        isAvailable: false,
        checked: false,
        releaseNotes: 'ডেভেলপমেন্ট মোডে ওটিএ আপডেট পরীক্ষা করা যায় না।',
      };
    }

    const update = await Updates.checkForUpdateAsync();
    if (update.isAvailable) {
      return {
        ...base,
        isAvailable: true,
        checked: true,
        latestVersion: `${CURRENT_APP_VERSION} (OTA Patch)`,
        releaseChannel: Updates.channel || base.releaseChannel,
        publishedAt: update.manifest?.createdAt
          ? new Date(update.manifest.createdAt).toLocaleDateString('bn-BD')
          : checkTimestamp,
        releaseNotes: 'নতুন আপডেট পাওয়া গেছে — এখনই ইনস্টল করুন।',
      };
    }

    return {
      ...base,
      isAvailable: false,
      checked: true,
      releaseNotes: 'আপনার অ্যাপটি সর্বশেষ সংস্করণে আছে।',
    };
  } catch (error) {
    console.warn('[OTA] Update check failed:', error);
    return {
      ...base,
      isAvailable: false,
      checked: false,
      releaseNotes: 'আপডেট পরীক্ষা করা যায়নি। ইন্টারনেট সংযোগ পরীক্ষা করে আবার চেষ্টা করুন।',
    };
  }
}

/**
 * Download and apply an OTA update.
 * Returns `{ success: false }` when updates are not available so the caller
 * never shows a false "applied" confirmation.
 */
export async function applyOtaUpdate(): Promise<{
  success: boolean;
  message: string;
}> {
  if (!isEasProjectConfigured()) {
    return {
      success: false,
      message: 'এই বিল্ডে ওটিএ আপডেট সক্রিয় নেই।',
    };
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const Updates = require('expo-updates');
    if (!Updates?.isEnabled) {
      return {
        success: false,
        message: 'এই বিল্ডে ওটিএ আপডেট উপলব্ধ নয়।',
      };
    }

    await Updates.fetchUpdateAsync();
    await Updates.reloadAsync();
    return { success: true, message: 'আপডেট সফলভাবে প্রয়োগ করা হয়েছে।' };
  } catch (error) {
    console.error('[OTA] Failed to apply update:', error);
    return {
      success: false,
      message: 'আপডেট ইনস্টল করা যায়নি। আবার চেষ্টা করুন।',
    };
  }
}

/**
 * Get recorded time of last update check
 */
export async function getLastOtaCheckTime(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(LAST_CHECK_KEY);
  } catch {
    return null;
  }
}

/** The update manifest URL, or null when the project is not linked. */
export function getConfiguredUpdatesUrl(): string | null {
  return getUpdatesUrl();
}
