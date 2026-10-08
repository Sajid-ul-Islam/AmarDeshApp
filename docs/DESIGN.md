# Design System Specification - Daily Amar Desh Mobile App
**ডিজাইন সিস্টেম নির্দেশিকা - দৈনিক আমার দেশ**

> **Aesthetic Theme:** Modern Editorial Broadsheet × Modern Curvy & Icon-First Ergonomics  
> **Source Project:** Stitch MCP — `Mobile News App` (`projects/14803972069666724044`)  
> **Target Form Factors:** Native Mobile (Android & iOS) + Tablet / Foldable Responsive  
> **Status:** Production Version 2.0.0  
> **Last Synchronized:** October 2026

---

## 1. Design Philosophy & Aesthetic Equilibrium

The Daily Amar Desh design system unifies two seemingly contradictory design languages into a harmonious, world-class mobile reading experience:

```
┌─────────────────────────────────┐       ┌─────────────────────────────────┐
│       MODERN EDITORIAL          │       │    ICON-FIRST & CURVY SYSTEM    │
│  - Warm Parchment Neutral       │   +   │  - Pill Chips & Action Badges   │
│  - Deep Printer's Charcoal Ink  │       │  - Curvy Cards (16px - 24px)    │
│  - 1px Hairline Structural Rules│       │  - Icon-Led Compact Footprints  │
│  - Authentic Broadsheet Type    │       │  - Diffused Ambient Soft Shadows│
└─────────────────────────────────┘       └─────────────────────────────────┘
                                   │
                                   ▼
          PRESTIGIOUS, RESPONSIVE & DISTRACTION-FREE READING
```

### 1.1 Core Principles
1. **Print Authority:** Recreates the prestige, intellectual gravity, and tactile reassurance of physical broadsheets without artificial retro clutter.
2. **Icon-Forward Precision:** Replaces cumbersome, multi-word Bengali buttons with concise, recognizable iconography paired with compact pill tags.
3. **Ergonomic Softness:** Elevated cards feature deliberate curvature (`radii.lg: 16px`, `radii['2xl']: 24px`, `radii.pill: 999px`) to eliminate harsh mobile edges and optimize one-handed thumb navigation.
4. **Dual-Script Optical Parity:** Simultaneous typographical harmony between Latin serif (**Newsreader**) / sans (**Inter**) and Bengali serif (**Noto Serif Bengali**) / sans (**Noto Sans Bengali**).
5. **Zero Visual Fatigue:** Warm neutral paper canvas in daytime; pure OLED black (`#0A0A0A`) with glare-free high contrast at night.

---

## 2. Color Tokens & Theme System

The design tokens are centralized in `theme/tokens.ts` and consumed dynamically via `useThemeTokens()` and `useThemedStyles()`.

### 2.1 Daytime Editorial Neutral Palette
| Token Path | Hex Value | Purpose & Application |
| :--- | :--- | :--- |
| `surface.base` | `#FBF9F5` | Warm crisp parchment background. Eliminates harsh blue-white glare. |
| `surface.subtle` | `#F3EFEA` | Secondary containers, byline chips, pull-quote boxes, prayer cards. |
| `surface.elevated` | `#FFFFFF` | Floating sheets, modals, elevated hero story cards. |
| `text.primary` | `#121212` | Deep charcoal printer's ink for headlines, body copy, and primary icons. |
| `text.secondary` | `#595959` | Editorial caption grey for timestamps, author titles, and read counts. |
| `brand.primary` | `#BA131A` | Iconic Amar Desh crimson. Applied to Breaking News badges, active indicators, and reading progress bars. |
| `brand.accent` | `#006B3F` | National Forest Green. Applied to verified badges, bookmark flags, and division indicators. |
| `border.subtle` | `#E5E0D8` | 1px hairline rules for column separation and card demarcation. |

### 2.2 Night Edition Palette (Pure OLED Black)
| Token Path | Hex Value | Purpose & Application |
| :--- | :--- | :--- |
| `dark.surface.base` | `#0A0A0A` | Pure pitch OLED black. Zero battery draw on OLED pixels. |
| `dark.surface.subtle`| `#141414` | Subdued dark container for secondary cards and list tiles. |
| `dark.surface.elevated`| `#1C1C1E` | Elevated bottom sheets, action pickers, and modals. |
| `dark.text.primary` | `#F5F5F7` | Soft off-white high contrast readable text. |
| `dark.text.secondary`| `#A1A1A6` | Muted cool grey for metadata and secondary labels. |
| `dark.brand.primary` | `#EF4444` | High-vibrancy safety crimson for high-contrast dark reading. |
| `dark.brand.accent` | `#10B981` | Emerald green confirmation accent. |
| `dark.border.subtle`| `#27272A` | Subdued hairline divider rules. |

---

## 3. Curvy Geometry & Shadow Tokens

Defined centrally in `theme/tokens.ts`:

### 3.1 Border Radius Tokens (`radii`)
```typescript
export const radii = {
  none: 0,
  xs: 4,      // Micro tags, badge corners
  sm: 8,      // Inner button padding, compact image thumbnails
  md: 12,     // Medium input fields, floating mini-player
  lg: 16,     // Standard article cards, prayer widget, continue reading card
  xl: 20,     // Hero story cards, multimedia cards
  '2xl': 24,  // Bottom sheets, modal dialog containers
  pill: 999,  // Action pills, search bars, category rail chips, reaction pills
};
```

### 3.2 Shadow Tokens (`shadows`)
```typescript
export const shadows = {
  none: {},
  sm: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  card: {
    shadowColor: '#1B1C1A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  elevated: {
    shadowColor: '#1B1C1A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 6,
  },
  floating: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 8,
  },
};
```

---

## 4. Typography Scale & Bengali Optical Adjustments

### 4.1 Typography Scale
| Token Level | Font Family | Size | Weight | Line Height | Tracking | Usage |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `headline-xl` | Noto Serif / Newsreader | 32px | 700 (Bold) | 42px | -0.015em | Lead hero headline on mobile |
| `headline-lg` | Noto Serif / Newsreader | 26px | 600 (SemiBold) | 34px | -0.01em | Standard article detail headline |
| `headline-md` | Noto Serif / Newsreader | 20px | 600 (SemiBold) | 28px | -0.005em | Feed card headlines |
| `headline-sm` | Noto Serif / Newsreader | 16px | 600 (SemiBold) | 22px | 0 | Compact list items, related articles |
| `body-lg` | Noto Serif / Newsreader | 18px | 400 (Regular) | 30px | 0 | Long-form article reading prose |
| `body-md` | Noto Sans / Inter | 15px | 400 (Regular) | 24px | 0 | Summaries, excerpts, search input |
| `body-sm` | Noto Sans / Inter | 13px | 400 (Regular) | 18px | 0 | Captions, bylines, disclaimers |
| `label-md` | Noto Sans / Inter | 12px | 600 (SemiBold) | 16px | +0.04em | Category badges, pill chips |
| `label-sm` | Noto Sans / Inter | 11px | 500 (Medium) | 14px | +0.02em | Timestamps, read times, prayer items |

### 4.2 Bengali Optical Line-Height Rules
- **Ascender & Ligature Space:** Bengali complex ligatures (*যুক্তবর্ণ*) require **15–20% higher line-height** than Latin scripts to prevent ascenders and descenders from overlapping.
- **Numeral Formatting:** Latin digits (`0-9`) automatically translate to Bengali numerals (`০-৯`) in UI surfaces via `toBengaliNumeral()`.

---

## 5. Component Library Specifications

### 5.1 Masthead & Brand Identity (`AmarDeshLogo.tsx`)
- High-precision SVG/vector rendering with dual-language capability.
- Includes tagline: *« স্বাধীনতার কথা বলে »*.
- Features dynamic theme switching between printer's ink (`#121212`) and pure white (`#FFFFFF`).

### 5.2 Breaking News Ticker (`BreakingNewsTicker.tsx`)
- Pulsing red pill badge (`#BA131A`, `radii.pill`) labeled `"ব্রেকিং নিউজ"`.
- Real-time animated ticker text transition.
- Hairline top and bottom borders (`#E5E0D8` / `#27272A`).

### 5.3 Prayer Times Widget (`PrayerTimesWidget.tsx`)
- Curvy container (`radii.lg: 16px`, `shadows.card`).
- 5 prayer timing columns (ফজর, যোহর, আসর, মাগরিব, ইশা) with active prayer pill badge.
- Icon-led GPS accuracy link (`<Ionicons name="navigate" />`).

### 5.4 District Picker Modal (`DistrictPickerModal.tsx`)
- Curvy bottom sheet (`radii['2xl']: 24px`).
- Division horizontal pill rail (৮টি বিভাগ).
- Searchable district grid with instant live filter.

### 5.5 AI Summary Card (`AiSummaryCard.tsx`)
- Tonal card container (`surface.subtle`, `radii.lg: 16px`).
- Header pill badge with AI spark icon (`<Ionicons name="sparkles" />`).
- 3 key bullet points with custom bullet disc indicators in crimson.
- Icon-first regenerate and expand controls.

### 5.6 Conversational AI Assistant (`AiAssistantModal.tsx`)
- Slide-up bottom sheet with spring physics.
- Rounded chat bubbles (`radii.lg`) with user vs. AI color distinctiveness.
- Suggested prompt pill chips for immediate 1-tap inquiries.

### 5.7 Audio News Bar (`AudioNewsBar.tsx`)
- Floating docked player bar (`radii.pill: 999px`, `shadows.floating`).
- Play/Pause toggle, 10s back seek icon button.
- Compact speed toggle pill (`0.75x`, `1.0x`, `1.25x`, `1.5x`).
- Integrated playback progress indicator.

### 5.8 Video Player & Floating PiP (`YouTubePlayer.tsx` & `FloatingVideoPlayer.tsx`)
- 16:9 responsive video frame with rounded borders (`radii.lg`).
- Floating mini-player (`200x112px`, `radii.md: 12px`, `shadows.floating`) allowing continuous playback while reading news.

### 5.9 Article Reactions (`ArticleReactions.tsx`)
- Curvy horizontal container (`radii.lg: 16px`).
- 5 rounded emoji reaction pills (❤️ পছন্দ, 👍 গুরুত্বপূর্ণ, 💡 তথ্যবহুল, 😢 দুঃখজনক, 😡 ক্ষোভ).
- Selected reaction highlights with theme border and Bengali count increments.

### 5.10 Reading Streak & Analytics (`ReadingStreak.tsx`)
- Curvy flame container (`radii.lg: 16px`).
- Bengali numeral streak count (e.g., `৭ দিনের স্ট্রিক! 🔥`).

### 5.11 Interactive e-Paper Canvas (`app/(tabs)/epaper.tsx`)
- Deep-zoom gesture canvas with boundary clipping.
- Dynamic bounding box column hotspots tagged with `"কলাম পাঠ"` pills.
- Crop modal bottom sheet with high-resolution sharing.

---

## 6. Gesture, Motion & Micro-Interactions

1. **Pull-to-Refresh:** Smooth elastic pull with native spinner indicator matching brand crimson.
2. **Horizontal Article Swipe:** Native PanResponder / GestureHandler swipe on reader screen flipping smoothly between next and previous news stories.
3. **Modal Sheets:** Spring-damped slide-up transitions (`duration: 250ms`, `damping: 20`) with backdrop dimming (`rgba(0,0,0,0.4)`).
4. **Haptic Feedback:** Light tactile tick on bookmark toggles, reaction taps, and category tab switches.
5. **Hit Slop Padding:** All icon-only action targets enforce minimum **44×44px** hit slop bounds to eliminate missed taps.

---

## 7. Accessibility (a11y) & Contrast Compliance

- **Color Contrast:** All body text on surface tokens exceeds WCAG AAA standard (`> 7:1`).
- **Secondary Elements:** Caption text and metadata badges exceed WCAG AA standard (`> 4.5:1`).
- **Semantic Roles:** Native buttons configure `accessibilityRole="button"` and `accessibilityLabel` in clear Bengali.
- **Dynamic Text Support:** Interface gracefully scales with system font size up to `150%` without clipping or overflow.
