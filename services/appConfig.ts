/**
 * App Configuration Resolution
 *
 * Single place that decides whether an EAS-backed capability (OTA updates,
 * remote push tokens) can actually run on this device.
 *
 * Why this exists: `app.json` ships a placeholder `extra.eas.projectId`
 * ("your-project-id") until the project is linked to a real Expo account.
 * Both expo-updates and `getExpoPushTokenAsync()` fail (or silently no-op)
 * when handed a placeholder, so every consumer must gate on
 * `isEasProjectConfigured()` instead of assuming success.
 *
 * To enable OTA updates and remote push:
 *   1. `eas init` (or create the project on expo.dev) and copy the real id
 *      into `expo.extra.eas.projectId` in app.json, and
 *   2. set `expo.updates.enabled` to true and add
 *      `"url": "https://u.expo.dev/<project-id>"`, or
 *   3. set EXPO_PUBLIC_EAS_PROJECT_ID in the EAS build profile env.
 */

import Constants from 'expo-constants';

/** Value shipped in app.json until the project is linked to Expo. */
export const EAS_PROJECT_PLACEHOLDER = 'your-project-id';

/**
 * Resolve the EAS project id from app config, falling back to the
 * EXPO_PUBLIC_EAS_PROJECT_ID environment variable for EAS build profiles.
 */
export function getEasProjectId(): string | null {
  const fromConfig = Constants.expoConfig?.extra?.eas?.projectId;
  const fromEnv = process.env.EXPO_PUBLIC_EAS_PROJECT_ID;
  const candidate = (fromConfig || fromEnv || '').trim();

  if (!candidate || candidate === EAS_PROJECT_PLACEHOLDER) {
    return null;
  }

  return candidate;
}

/** Whether a real EAS project id is available for updates and push. */
export function isEasProjectConfigured(): boolean {
  return getEasProjectId() !== null;
}

/**
 * The update manifest URL derived from the project id.
 * `null` when the project is not linked, so callers can skip the check
 * entirely rather than reporting a false "up to date".
 */
export function getUpdatesUrl(): string | null {
  const projectId = getEasProjectId();
  return projectId ? `https://u.expo.dev/${projectId}` : null;
}
