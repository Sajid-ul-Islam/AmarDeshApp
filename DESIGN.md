# Design Document - Daily Amar Desh Mobile App

## Design Philosophy
- **Mobile-first** responsive design
- **Clean & readable** Bengali typography
- **Fast loading** with optimized images
- **Intuitive navigation** for news consumption
- **Accessible** with proper contrast and font sizes

## Color Palette

### Primary Colors
| Color | Hex | Usage |
|-------|-----|-------|
| Primary Green | #006B3F | Brand color, headers, CTAs |
| Dark Green | #004D2C | Hover states, accents |
| White | #FFFFFF | Backgrounds, cards |
| Dark Text | #1A1A1A | Primary text |
| Gray Text | #666666 | Secondary text |
| Light Gray | #F5F5F5 | Backgrounds, dividers |

### Semantic Colors
| Color | Hex | Usage |
|-------|-----|-------|
| Breaking Red | #DC2626 | Breaking news badge |
| Video Blue | #2563EB | Video section |
| Sports Orange | #EA580C | Sports category |
| Link Blue | #1D4ED8 | Links |

## Typography

### Font Family
- **Primary:** Noto Sans Bengali (Google Fonts)
- **Fallback:** system-ui, sans-serif

### Type Scale
| Level | Size | Weight | Usage |
|-------|------|--------|-------|
| H1 | 24px | 700 | Page titles |
| H2 | 20px | 600 | Section headers |
| H3 | 18px | 600 | Article titles |
| Body | 16px | 400 | Article content |
| Small | 14px | 400 | Metadata, timestamps |
| Caption | 12px | 400 | Labels, badges |

## Layout

### Screen Breakpoints
| Breakpoint | Width | Target |
|------------|-------|--------|
| Mobile | 320-480px | Phone portrait |
| Mobile L | 481-768px | Phone landscape |
| Tablet | 769-1024px | Tablet |
| Desktop | 1025px+ | Desktop (responsive fallback) |

### Grid System
- **Mobile:** Single column
- **Tablet:** 2 columns
- **Desktop:** 3-4 columns

## Component Specifications

### Header
- Fixed top navigation
- Logo (left) + Menu icon (right)
- Category scroll bar below
- Height: 56px

### News Card (Standard)
```
┌─────────────────────────┐
│ ┌─────────────────────┐ │
│ │                     │ │
│ │    Image (16:9)     │ │
│ │                     │ │
│ └─────────────────────┘ │
│                         │
│ Article Title (2 lines) │
│                         │
│ Category • Time ago     │
└─────────────────────────┘
```

### News Card (Compact/Horizontal)
```
┌─────────────────────────────┐
│ ┌──────────┐  Article Title │
│ │  Image   │  (2-3 lines)   │
│ │  (1:1)   │                │
│ │          │  Category•Time │
│ └──────────┘                │
└─────────────────────────────┘
```

### Hero Section
```
┌─────────────────────────────┐
│                             │
│      Large Image            │
│      (16:9 or 2:1)          │
│                             │
│ ┌─────────────────────────┐ │
│ │ Breaking News Badge     │ │
│ │                         │ │
│ │ Main Headline           │ │
│ │ (2-3 lines)             │ │
│ └─────────────────────────┘ │
└─────────────────────────────┘
```

### Prayer Times Widget
```
┌─────────────────────────────┐
│ 🕌 নামাজের সময়              │
│ ┌───┬───┬───┬───┬───┐      │
│ │ফজর│জোহর│আসর│মাগরি│এশা│     │
│ │4:32│11:56│4:17│6:03│7:16│ │
│ └───┴───┴───┴───┴───┘      │
└─────────────────────────────┘
```

### Bottom Navigation (Mobile)
```
┌─────────────────────────────┐
│  🏠    🔍    📑    🔖    👤  │
│  হোম   খোঁজ   ক্যাটা  সেভ  আরও │
└─────────────────────────────┘
```

## Interactions & Animations
- **Card tap:** Subtle scale (0.98) + ripple
- **Page transitions:** Slide from right
- **Pull to refresh:** Loading spinner
- **Infinite scroll:** Skeleton loader
- **Category switch:** Horizontal slide animation

## Dark Mode
- Background: #121212
- Card: #1E1E1E
- Text: #E0E0E0
- Secondary: #A0A0A0
- Accent: #4CAF50

## Accessibility
- Minimum touch target: 44x44px
- Contrast ratio: 4.5:1 minimum
- Focus indicators for keyboard navigation
- Screen reader support with ARIA labels
