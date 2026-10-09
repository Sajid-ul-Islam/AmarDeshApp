/**
 * Typography
 *
 * Daily Amar Desh's website ships its own Bengali typeface family, `amdFont`,
 * served as three TTF weights plus an italic:
 *
 *   @font-face { font-family: amdFont; src: url(AmarDesh_Regular…ttf); font-weight: 400 }
 *   @font-face { font-family: amdFont; src: url(AmarDesh_Medium…ttf);  font-weight: 500 }
 *   @font-face { font-family: amdFont; src: url(AmarDesh_Bold…ttf);    font-weight: 700 }
 *   @font-face { font-family: amdFont; src: url(AmarDesh_Italic…ttf);  font-style: italic }
 *   --font-amd: "amdFont", "amdFont Fallback"
 *
 * and a second family for menu headings:
 *
 *   @font-face { font-family: menuFontEn; src: url(NotoSerifBengali_Regular…ttf) }
 *
 * Those exact files are bundled under `assets/fonts/` (Apache/OFL-compatible
 * Noto plus the publisher's own AmarDesh family, which the app is entitled to
 * ship). `amdFont` is the site's default body font, so it is this app's default
 * too — until now the app fell back to the platform serif for headlines and the
 * system sans for body text, which never matched the newspaper's typography.
 *
 * Weights are registered as separate family names because React Native does not
 * synthesise weights for a single custom family reliably across platforms; a
 * style picks the weight by name instead.
 */

/** The publisher's own family, by registered weight name. */
export const AMAR_DESH_FONT = {
  regular: 'AmarDesh-Regular',
  medium: 'AmarDesh-Medium',
  bold: 'AmarDesh-Bold',
  italic: 'AmarDesh-Italic',
} as const;

/** Site `menuFontEn`. */
export const NOTO_SERIF_BENGALI = 'NotoSerifBengali-Regular';

/**
 * Font modules for `expo-font`'s `loadAsync`/`useFonts`.
 * Keys are the family names used in styles.
 */
export const FONT_ASSETS = {
  [AMAR_DESH_FONT.regular]: require('../assets/fonts/AmarDesh-Regular.ttf'),
  [AMAR_DESH_FONT.medium]: require('../assets/fonts/AmarDesh-Medium.ttf'),
  [AMAR_DESH_FONT.bold]: require('../assets/fonts/AmarDesh-Bold.ttf'),
  [AMAR_DESH_FONT.italic]: require('../assets/fonts/AmarDesh-Italic.ttf'),
  [NOTO_SERIF_BENGALI]: require('../assets/fonts/NotoSerifBengali-Regular.ttf'),
} as const;

export type FontPreference = 'amardesh' | 'notoSerif' | 'system';

export interface FontOption {
  key: FontPreference;
  /** Bengali label, shown in Settings. */
  labelBn: string;
  /** English label, shown when the app language is English. */
  labelEn: string;
  /** Short Bengali description of the look. */
  descriptionBn: string;
  /**
   * Family used for body copy. `undefined` means "platform default", which is
   * how the system option is expressed.
   */
  body: string | undefined;
  /** Family used for headlines/masthead. */
  heading: string | undefined;
  /** Family used for the app's Latin numerals where a serif is wanted. */
  latin: string | undefined;
}

/**
 * The three selectable typography profiles.
 *
 * Order matters: `amardesh` is first and is the default, matching the site.
 */
export const FONT_OPTIONS: readonly FontOption[] = [
  {
    key: 'amardesh',
    labelBn: 'আমার দেশ (মূল ফন্ট)',
    labelEn: 'Amar Desh (site default)',
    descriptionBn: 'দৈনিক আমার দেশ ওয়েবসাইটে ব্যবহৃত মূল ফন্ট',
    body: AMAR_DESH_FONT.regular,
    heading: AMAR_DESH_FONT.bold,
    latin: AMAR_DESH_FONT.regular,
  },
  {
    key: 'notoSerif',
    labelBn: 'নোটো সেরিফ বাংলা',
    labelEn: 'Noto Serif Bengali',
    descriptionBn: 'ওয়েবসাইটের মেনু শিরোনামে ব্যবহৃত সেরিফ ফন্ট',
    body: NOTO_SERIF_BENGALI,
    heading: NOTO_SERIF_BENGALI,
    latin: NOTO_SERIF_BENGALI,
  },
  {
    key: 'system',
    labelBn: 'ডিভাইসের ফন্ট',
    labelEn: 'Device default',
    descriptionBn: 'ফোনের নিজস্ব ফন্ট — দ্রুততম ও সবচেয়ে পরিচিত',
    body: undefined,
    heading: undefined,
    latin: undefined,
  },
];

export const DEFAULT_FONT_PREFERENCE: FontPreference = 'amardesh';

/** Look up an option, falling back to the default for unknown values. */
export function getFontOption(preference: FontPreference): FontOption {
  return (
    FONT_OPTIONS.find((option) => option.key === preference) ??
    FONT_OPTIONS[0]
  );
}

/**
 * Resolve the family for a text role.
 *
 * Returns `undefined` for the system profile so callers can omit `fontFamily`
 * entirely (React Native then applies the platform default).
 */
export function resolveFontFamily(
  preference: FontPreference,
  role: 'body' | 'heading' | 'latin'
): string | undefined {
  return getFontOption(preference)[role];
}

/** Registered names of every bundled family, for diagnostics/tests. */
export const BUNDLED_FONT_FAMILIES: readonly string[] = Object.keys(FONT_ASSETS);
