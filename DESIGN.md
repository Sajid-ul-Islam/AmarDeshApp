# Design System Specification - Daily Amar Desh Mobile App

> **Source Project:** Stitch MCP — `Mobile News App` (`projects/14803972069666724044`)  
> **Aesthetic Theme:** Modern Editorial  
> **Target Form Factor:** Native Mobile (iOS & Android) with Responsive Tablet/Desktop support  
> **Last Synchronized:** October 2026

---

## 1. Design Philosophy & Brand Identity

The **Modern Editorial** design system translates the authority, intellectual rigor, and tactile prestige of legacy broadsheets into an immediate, responsive digital experience for **Daily Amar Desh (দৈনিক আমার দেশ)**. 

### Core Principles
- **Print Prestige Meets Modern Ergonomics:** Emulates the warm physical parchment, deep printer's ink, and strict typographical alignment of classic newspaper front pages.
- **Architectural Flatness (Zero Skeuomorphism):** Rejects artificial blur drop-shadows and neon novelty gradients. Elevation is achieved exclusively through **1px hairline rules (`#E5E0D8`)** and **tonal planar surfaces (`#F3EFEA` / `#EFEEEA`)**.
- **Sharpened Structural Corners:** Elements feature crisp, deliberate geometry (`borderRadius: 0` or micro-radii `4px`) reflecting letterpress galleys, column grids, and lead types.
- **Dual-Script Typographic Equilibrium:** Seamless pairing between Latin serif editorial typography (**Newsreader**) and Latin UI sans-serif (**Inter**), mirrored natively in Bengali (**Noto Serif Bengali** and **Noto Sans Bengali**).
- **Distraction-Free Immersion:** 60–75 characters-per-line reading measure with generous vertical line height to eliminate visual fatigue during long-form journalistic reading.

---

## 2. Color Palette & Design Tokens

### 2.1 Core Editorial Palette
The primary reading experience is grounded in authentic newsprint neutrals and high-contrast inking:

| Token Name | Hex Code | Purpose & Application |
|------------|----------|-----------------------|
| **Surface / Background** | `#FBF9F5` | Warm crisp parchment neutral. Softens eye strain during long sessions while preserving crisp contrast. |
| **Surface Muted** | `#F3EFEA` | Secondary breakout boxes, pull quotes, byline bars, prayer time cards, and search pill backgrounds. |
| **Ink Primary** | `#121212` / `#1B1C1A` | Deep charcoal printer's ink for headlines, body copy, and primary icons. |
| **Editorial Crimson** | `#BA131A` / `#91000D` | Amar Desh brand red. Applied to "ব্রেকিং নিউজ" (Breaking), "লাইভ" (Live) pulses, active tab states, and kicker badges. |
| **National Forest Green** | `#006B3F` | National heritage accent, verified source markers, bookmark flags, and division badges. |
| **Caption & Metadata** | `#595959` | Balanced neutral grey for publication dates, read times, photo credits, and secondary labels. |
| **Hairline Divider** | `#E5E0D8` | 1px solid structural rules separating stories, columns, and navigation bars. |

---

### 2.2 Material 3 / Stitch Design System Tokens

Extracted directly from Stitch Project `Mobile News App`:

```json
{
  "colors": {
    "primary": "#91000d",
    "on_primary": "#ffffff",
    "primary_container": "#ba131a",
    "on_primary_container": "#ffcac5",
    "primary_fixed": "#ffdad6",
    "primary_fixed_dim": "#ffb4ac",
    "on_primary_fixed": "#410002",
    "on_primary_fixed_variant": "#93000d",
    "secondary": "#5f5e5e",
    "on_secondary": "#ffffff",
    "secondary_container": "#e5e2e1",
    "on_secondary_container": "#656464",
    "secondary_fixed": "#e5e2e1",
    "secondary_fixed_dim": "#c8c6c5",
    "on_secondary_fixed": "#1c1b1b",
    "on_secondary_fixed_variant": "#474646",
    "tertiary": "#454646",
    "on_tertiary": "#ffffff",
    "tertiary_container": "#5d5d5d",
    "on_tertiary_container": "#d8d6d6",
    "tertiary_fixed": "#e4e2e2",
    "tertiary_fixed_dim": "#c7c6c6",
    "on_tertiary_fixed": "#1b1c1c",
    "on_tertiary_fixed_variant": "#464747",
    "surface": "#fbf9f5",
    "surface_dim": "#dbdad6",
    "surface_bright": "#fbf9f5",
    "surface_variant": "#e4e2de",
    "surface_container_lowest": "#ffffff",
    "surface_container_low": "#f5f3ef",
    "surface_container": "#efeeea",
    "surface_container_high": "#eae8e4",
    "surface_container_highest": "#e4e2de",
    "on_surface": "#1b1c1a",
    "on_surface_variant": "#5c403d",
    "outline": "#906f6c",
    "outline_variant": "#e5bdb9",
    "error": "#ba1a1a",
    "on_error": "#ffffff",
    "error_container": "#ffdad6",
    "on_error_container": "#93000a",
    "background": "#fbf9f5",
    "on_background": "#1b1c1a"
  }
}
```

---

### 2.3 Dark Theme Palette (OLED Night Edition)

Engineered for zero battery drain on OLED mobile displays and glare-free nighttime reading:

| Element | Dark Token | RGB / Hex Value | Role |
|---------|------------|-----------------|------|
| **Background** | `dark.background` | `#0A0A0A` | Pure pitch OLED black |
| **Surface Card** | `dark.surface` | `#141414` | Neutral deep container |
| **Surface Elevated** | `dark.surfaceElevated`| `#1C1C1E` | Modal overlays & action sheets |
| **Primary Text** | `dark.textPrimary` | `#F5F5F7` | High contrast off-white |
| **Secondary Text**| `dark.textSecondary` | `#A1A1A6` | Muted subtitle & caption text |
| **Border / Divider** | `dark.border` | `#27272A` | Subdued 1px hairline separation |
| **Accent Red** | `dark.primary` | `#EF4444` | High-vibrancy contrast crimson |
| **Accent Green** | `dark.accent` | `#10B981` | Emerald contrast confirmation |

---

## 3. Typography System

The typography scale harmonizes **Newsreader** (headline and literary narrative) with **Inter** (scannable UI interface elements, metrics, and labels). In Bengali locales, **Noto Serif Bengali** and **Noto Sans Bengali** provide exact optical weight parity.

### 3.1 Typographic Scale

| Level | Font Family | Size | Weight | Line Height | Tracking | Usage & Context |
|-------|-------------|------|--------|-------------|----------|-----------------|
| **`headline-xl`** | Newsreader / Noto Serif | `44px` | SemiBold (600) | `52px` | `-0.02em` | Desktop lead story splash banner |
| **`headline-xl-mobile`** | Newsreader / Noto Serif | `32px` | SemiBold (600) | `38px` | `-0.015em` | Lead hero article headline on phone |
| **`headline-lg`** | Newsreader / Noto Serif | `32px` | Medium (500) | `40px` | `-0.015em` | Section splash & lead category headers |
| **`headline-lg-mobile`** | Newsreader / Noto Serif | `26px` | Medium (500) | `32px` | `-0.01em` | Standard article detail headline |
| **`headline-md`** | Newsreader / Noto Serif | `22px` | Medium (500) | `28px` | `-0.01em` | Grid cards, spotlight stories |
| **`headline-sm`** | Newsreader / Noto Serif | `18px` | SemiBold (600) | `24px` | `0` | List cards, compact feeds |
| **`body-lg`** | Newsreader / Noto Serif | `19px` | Regular (400) | `30px` | `0` | Long-form article reading prose |
| **`body-md`** | Inter / Noto Sans | `15px` | Regular (400) | `24px` | `0` | Article teaser decks, summaries, inputs |
| **`body-sm`** | Inter / Noto Sans | `13px` | Regular (400) | `20px` | `0` | Disclaimers, author byline affiliations |
| **`label-md`** | Inter / Noto Sans | `12px` | SemiBold (600) | `16px` | `+0.06em` | Uppercase section kickers, category badges |
| **`label-sm`** | Inter / Noto Sans | `11px` | Medium (500) | `14px` | `+0.04em` | Timestamps, reading streak counters |

### 3.2 Bengali Script Typography Guidelines
- **Optical Line-Height Compensation:** Bengali ligatures (*যুক্তবর্ণ*) and ascenders/descenders require 15–20% higher line height than Latin fonts to avoid clashing (e.g., `body-lg` uses `30px` for `19px` font size).
- **Numerals:** Formatted through `formatLocalizedNumeral()` (`১২৩৪` in Bengali mode, `1234` in English mode).
- **Font Fallbacks:**  
  `fontFamily: 'NotoSerifBengali', 'Newsreader', serif;`  
  `fontFamily: 'NotoSansBengali', 'Inter', -apple-system, sans-serif;`

---

## 4. Spacing, Grid & Layout Metrics

The layout enforces a strictly disciplined rhythmic grid:

### 4.1 Spacing Tokens
- **`space-xs`**: `4px` (`0.25rem`) — Gap between kicker and headline
- **`space-sm`**: `8px` (`0.5rem`) — Gap between headline and deck, button padding vertical
- **`space-md`**: `16px` (`1.0rem`) — Standard screen gutter, card inner padding, button padding horizontal
- **`space-lg`**: `24px` (`1.5rem`) — Section vertical spacing, hero card margin
- **`space-xl`**: `40px` (`2.5rem`) — Major chapter transitions and footer clearance

### 4.2 Breakpoints & Column Measures
- **Mobile (`< 768px`)**: Single column layout with `16px` outer margins.
- **Tablet (`768px – 1024px`)**: 2-column editorial split with `32px` outer margins.
- **Desktop / Foldable (`> 1024px`)**: Multi-column editorial spread with `680px` maximum article reading width.

---

## 5. Component Specifications & UI Patterns

### 5.1 Masthead & Header
```
┌─────────────────────────────────────────────────────────────┐
│  [ঢাকা ২৮° সে. ⛅]      বুধবার, ৭ অক্টোবর      [বাংলা | EN]  │
├─────────────────────────────────────────────────────────────┤
│                    দৈনিক আমার দেশ                           │
│                 « স্বাধীনতার কথা বলে »                     │
├─────────────────────────────────────────────────────────────┤
│ [সর্বশেষ] [জুলাই বিপ্লব] [জাতীয়] [রাজনীতি] [অর্থনীতি] ... │
└─────────────────────────────────────────────────────────────┘
```
- **Language Switcher Pill**: Quick 1-tap toggle (`[বাংলা | EN]`) located in the masthead header bar.
- **Ticker Bar**: High-contrast ticker with `#BA131A` badge for `"ব্রেকিং নিউজ"`.

---

### 5.2 Article Cards

#### Lead Hero Card
- Full-width hero image with 16:9 ratio, bordered by a bottom 1px rule (`#E5E0D8`).
- Category kicker in `label-md` (`#BA131A`).
- Headline set in `headline-xl-mobile` (`32px` / `Newsreader`).
- Author byline with reading time and published date in `label-sm`.

#### Compact Horizontal List Card
```
┌─────────────────────────────────────────────────────────────┐
│ ┌──────────┐  যুক্তরাষ্ট্রের নতুন নীতিমালায় বাংলাদেশের     │
│ │          │  রপ্তানি বাজারে সুবাতাস                       │
│ │   1:1    │                                                │
│ │ (80x80)  │  জাতীয় • ২০ মিনিট আগে                        │
│ └──────────┘                                                │
├─────────────────────────────────────────────────────────────┤ (1px #E5E0D8)
```

---

### 5.3 Article Detail Reader Screen
- **Reading Progress Bar**: 2px `#BA131A` progress strip pinned to top viewport.
- **Smart AI Summary Card**: Tonal surface (`#F3EFEA` light / `#1C1C1E` dark) featuring 3 crisp key takeaways.
- **Audio Listen Mode**: Floating player dock with play/pause and progress bar.
- **Article Reactions**: 5-reaction emoji strip with Bengali numeral counter aggregates.
- **Swipe Navigation**: Native PanResponder gesture support for horizontal story flipping with previous/next headline previews.

---

### 5.4 ePaper Interactive Column Reader
- High-resolution print replica canvas with zoom/pan capabilities.
- **Column Hotspots**: Interactive bounding boxes tagged with `"কলাম পাঠ"` badges.
- **Clipping Bottom Sheet**: Bottom sheet modal showing cropped column clipping, typography deck, and deep link to digitized full reader view.

---

### 5.5 Multimedia Video Hub
- 16:9 responsive video card with view counters and duration pills.
- **Floating PiP Mini-Player**: Bottom-right floating overlay (`200x112px`) allowing continuous video listening while browsing news.

---

## 6. Stitch Project Screen Catalog

The Stitch project (`projects/14803972069666724044`) contains 8 generated core screens:

1. **`0e712e7e83b34262a1bf84bcbbe7c436`**: আমার দেশ - শীর্ষ সংবাদ ও প্রচ্ছদ (Top Stories & Front Page)
2. **`693e409a7323405b94ad547619731093`**: Top Stories & Home Feed
3. **`cfad55c29aa24365a2816384e010092d`**: Article Reader View
4. **`7fedea470a064098910f48d097f92a33`**: আমার দেশ - প্রতিবেদন বিস্তারিত (Full Story Detail)
5. **`43c4bacb8697499c9a8c7a57a14a752e`**: আমার দেশ - সংরক্ষিত ও ই-পেপার (Saved & ePaper)
6. **`658869d33093420ab1a147a93c2310c3`**: Saved & Daily Briefing
7. **`831d866f5d8f48ae841185978121d978`**: আমার দেশ - বিষয় ও বিভাগসমূহ (Sections & Explore)
8. **`b2ef2c895b73438193c66c5d9ce4d4d2`**: Explore & Topics Hub

---

## 7. Accessibility & Performance Benchmarks

- **Color Contrast:** All body copy against backgrounds satisfies WCAG AAA (> 7:1); metadata copy satisfies WCAG AA (> 4.5:1).
- **Minimum Touch Targets:** All buttons, chips, and navigational tabs adhere to a minimum 44×44px hit slop.
- **Haptic Feedback:** Native light haptic ticks on bookmarking, reaction toggles, and tab switches.
- **Offline Performance:** Cached typography and local storage ensuring zero-layout-shift (CLS = 0) upon offline launch.
