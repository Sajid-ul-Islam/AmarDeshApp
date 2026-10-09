# UI/UX & Brand Experience Specification
## Building Daily Amar Desh as a Modern, Fluid, and Culturally Resonant Mobile Flagship

**Publication:** Daily Amar Desh (দৈনিক আমার দেশ)  
**Editorial Motto:** "স্বাধীনতার কথা বলে" (Speaks of Independence)  
**Engineering & Design Agency:** CybrCraft (https://cybrcraft.com/)  
**Platform:** React Native (Expo SDK 57+, TypeScript Strict Mode)  
**Document Classification:** Design System & UI/UX Experience Blueprint  

---

## 1. Brand Identity & Design Philosophy

### 1.1 The Brand Soul: "স্বাধীনতার কথা বলে"
Daily Amar Desh is not just another news portal; it is an institution known for fearless editorial courage, deep national roots, and an unwavering commitment to truth and independence. The mobile experience must reflect these core values across every pixel and interaction:

1. **Authoritative & Dignified (মর্যাদাপূর্ণ ও বলিষ্ঠ):**  
   Clean typography, high-contrast readability, absence of tacky tabloid clutter or intrusive clickbait pop-ups.
2. **Culturally Grounded (জাতীয় চেতনা ও ঐতিহ্য):**  
   Bengali numerals (`১২৩৪৫৬৭৮৯০`), Hijri lunar dates, real-time prayer timetables for 8 divisions, and solemn reverence for the July 2024 Revolution (জুলাই বিপ্লব).
3. **Cutting-Edge Modernity (বিশ্বমানের আধুনিক প্রযুক্তি):**  
   Ultra-smooth 60fps native feel, OLED-optimized dark mode, hardware-accelerated image caching, fluid gesture physics, and distraction-free commuter audio news.

---

## 2. Visual Design System & Semantic Color Tokens

### 2.1 The Quad-Color Brand Palette
The color system honors Amar Desh’s historic print masthead while offering digital-native clarity:

```
┌────────────────────────────────────────────────────────────────────────┐
│                   AMAR DESH CORE COLOR SYNERGY                         │
├─────────────────────┬───────────────────┬──────────────────────────────┤
│ Brand Crimson       │ #DC2626 / #B91C1C │ Breaking News, Live Tickers, │
│ (স্বাধীনতার প্রতীক) │                   │ Active Accents, Lead Badges  │
├─────────────────────┼───────────────────┼──────────────────────────────┤
│ Deep Forest Green   │ #006B3F / #166534 │ ePaper Accents, National     │
│ (বাংলাদেশী ঐতিহ্য) │                   │ Badges, Verified Highlights  │
├─────────────────────┼───────────────────┼──────────────────────────────┤
│ Editorial Ink       │ #0F172A / #1E293B │ Headlines, Primary Text,     │
│ (মুদ্রণ কালি)       │                   │ Light Mode Cards & Borders   │
├─────────────────────┼───────────────────┼──────────────────────────────┤
│ OLED Deep Black     │ #0A0A0A / #18181B │ Night Mode Background,       │
│ (ডার্ক মোড)         │                   │ High-Contrast Contrast       │
└─────────────────────┴───────────────────┴──────────────────────────────┘
```

### 2.2 Typography Hierarchy
- **Primary Bengali Display Typeface:** Custom *AmarDesh_Bold* and *AmarDesh_Medium* for headlines, lead titles, and masthead branding.
- **Body & Longform Reading Typeface:** *Noto Serif Bengali* and *AmarDesh_Regular* with optimal leading (1.75 line-height) to prevent eye strain during deep reading.
- **In-App Dynamic Font Scaling:**
  - `Small (ছোট)`: 14px body / 18px headline
  - `Normal (স্বাভাবিক)`: 16px body / 22px headline (Default)
  - `Large (বড়)`: 18px body / 26px headline
  - `Extra Large (অত্যন্ত বড়)`: 21px body / 30px headline (Specially designed for senior readers)
- **Bengali Numeral Formatting:** Every timestamp, page number, prayer time, and view count passes through `toBengaliNumeral()` (`১০ মিনিট আগে`, `১ম পাতা`).

---

## 3. Screen-by-Screen UI/UX Experience Design

### 3.1 The Home Feed (হোম)
- **Glassmorphism Header:** Floating top bar with subtle blur backdrop (`rgba(255, 255, 255, 0.9)` in light mode, `rgba(10, 10, 10, 0.9)` in dark mode).
- **Dual Date Banner:** Displaying the full Gregorian date in Bengali (`বুধবার, ০৭ অক্টোবর ২০২৬`) alongside the Islamic Hijri calendar date.
- **Breaking News Marquee:** Crimson red pulsating beacon with smooth horizontal scrolling text for urgent national developments.
- **Interactive Prayer Timetable Bar:** Division-customized prayer widget showing current prayer, next prayer countdown, and a single-tap division switcher modal.
- **Lead Hero Article Card:** Edge-to-edge high-resolution image with gradient vignette overlay (`rgba(0,0,0,0.85)`), prominent category tag, and relative time pill.
- **Taxonomy Carousel Chips:** Horizontal sliding pills for all 14 categories with active spring feedback and red bottom indicator.
- **Featured July Revolution Banner:** Specially styled memorial card honoring the July 2024 uprising with commemorative photography and dedicated portal link.

### 3.2 The Article Reader (সংবাদ বিস্তারিত)
- **Ergonomic Reading Experience:** Distraction-free article container with generous lateral padding (18px) and comfortable line spacing.
- **Sticky Audio News Bar (বাংলা অডিও সংবাদ):**
  - Floating pill at the bottom with play, pause, progress slider, and 1.0x/1.25x/1.5x speed multiplier.
  - Allows commuting readers in Dhaka traffic to listen to longform editorials hands-free.
- **Interactive Reader Customizer Modal:**
  - Single tap opens sheet with font size slider (A- / A+), light/dark/sepia theme toggles, and line spacing adjustments.
- **Social & WhatsApp Sharing:** One-tap native share sheet generating formatted previews with article headline and canonical link.

### 3.3 The ePaper Gallery (ই-পেপার)
- **Print Nostalgia on Glass:** Replicates the physical newspaper reading ritual.
- **Page-Turn Strip:** Bottom thumbnail rail showing pages `১ম পাতা` through `৮ম পাতা` with active page indicator.
- **Smooth Pinch-to-Zoom & Pan:** Dual-finger pinch-to-zoom powered by `expo-image` with zero blur or lag, accompanied by double-tap 2.5x magnification.
- **Offline Save Button:** Single tap downloads the full edition to device storage for offline reading during flights or rural travel.

### 3.4 The July 2024 Revolution Memorial Portal (জুলাই বিপ্লব)
- **Solemn Memorial Aesthetics:** Deep crimson and charcoal aesthetic with historical imagery.
- **Chronological Archive:** Timeline of the movement, martyrs' tributes, student-mass uprising chronicles, and post-movement national reform analysis.
- **Curated Video Bulletins:** Investigative documentaries and video speeches from the frontlines.

### 3.5 The Multimedia Video Hub (ভিডিও)
- **Native Video Feed:** Pulls verified broadcasts and talk shows directly from Amar Desh’s YouTube desk.
- **Inline High-Definition Playback:** Zero third-party ad interruptions; video plays directly inside the native layout.
- **Category Filter Pills:** National News, Political Analysis, Interviews, and Investigative Reports.

---

## 4. Micro-Interactions & "60fps Smoothness" Engineering

To make the app feel noticeably smoother than clunky webviews, the following native interaction principles are strictly enforced:

### 4.1 Tactile Touch Feedback
- Every card, category chip, bookmark icon, and tab button uses `activeOpacity={0.7}` or subtle scale transform (`0.98` on press down).
- Buttons provide immediate visual confirmation within 16ms of user touch.

### 4.2 Skeleton Shimmer Loaders
- Zero blank screens or spinning wheels during initial loads.
- Content placeholders render animated gradient shimmers matching the exact shape of headlines, images, and author metadata.

### 4.3 Hardware-Accelerated Image Caching
- Powered by `expo-image` with disk caching and WebP optimization.
- Progressive image decoding: Low-res thumbnail dissolves into high-resolution imagery with a smooth 200ms crossfade.

### 4.4 7-Day Smart Offline SQLite Synchronization
- Articles are cached locally in SQLite relational tables with full-text indexing.
- Readers can swipe through hundreds of news stories with instant (<50ms) rendering even when offline.

---

## 5. Implementation & Antigravity Workflow Checklist

```
┌────────────────────────────────────────────────────────────────────────┐
│             ANTIGRAVITY SMOOTH UI/UX EXECUTION ROADMAP                 │
├────────────────────────────────────────────────────────────────────────┤
│ [✓] 1. Theme Tokens: tokens.ts with Crimson, Deep Green & OLED Dark    │
│ [✓] 2. Native Typography: Custom font scaling (A- / A+) & Bengali font │
│ [✓] 3. Audio News Bar: expo-speech floating player with speed controls │
│ [✓] 4. Breaking Ticker: Animated marquee with pulsating crimson beacon │
│ [✓] 5. ePaper Gesture Engine: Hardware-accelerated pinch-zoom & pan    │
│ [✓] 6. Hyperlocal Switcher: 8-division selector + division prayer times│
│ [✓] 7. July Revolution Portal: Dedicated memorial archive portal       │
│ [✓] 8. Performance Validation: 0 TypeScript errors, 100% tests passing │
└────────────────────────────────────────────────────────────────────────┘
```
