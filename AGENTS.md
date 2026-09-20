# AGENTS.md - Development Guide & Commands

## 🚀 Commands

### Development
```bash
# Start development server
npm run dev

# Build for production
npm run build

# Type checking (no emit)
npm run typecheck

# Preview production build
npm run preview
```

### Testing (To Be Implemented)
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- path/to/test.ts
```

### Linting & Formatting (To Be Implemented)
```bash
# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format
```

---

## 📁 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── common/          # Shared components (Header, Footer, NewsCard)
│   ├── article/         # Article-related components
│   └── ai/              # AI assistant components
├── pages/               # Page-level components
├── hooks/               # Custom React hooks
├── store/               # Zustand state stores
├── services/            # API & external service integrations
├── types/               # TypeScript type definitions
├── data/                # Mock data & constants
├── utils/               # Utility functions
└── App.tsx              # Root component

docs/                    # Documentation (root level)
├── architecture.md      # System architecture
├── DESIGN.md           # Design specifications
├── PRD.md              # Product requirements
├── RULES.md            # Coding rules
├── TEST_PLAN.md        # Testing strategy
├── CHANGELOG.md        # Version history
└── TODO.md             # Task tracking
```

---

## 🎨 Style Guide

### TypeScript
- **Strict mode enabled** - No `any` types allowed
- Use interfaces for component props and store shapes
- Export types from `src/types/index.ts`
- Use proper type annotations for all function parameters and returns

### React Components
```tsx
// ✅ Correct pattern
interface ComponentProps {
  prop1: string;
  prop2: (arg: Type) => void;
}

export const ComponentName: React.FC<ComponentProps> = ({ prop1, prop2 }) => {
  const { isDarkMode } = useAppStore();
  // ... logic
  return <div className="...">...</div>;
};

// ❌ Avoid
const Component = (props: any) => { ... }
```

### State Management (Zustand)
```tsx
// ✅ Correct pattern
interface AppState {
  field: type;
  action: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  field: initialValue,
  action: () => set((state) => ({ field: newValue })),
}));
```

### Styling
- **Tailwind CSS only** - No custom CSS files except `index.css`
- Use conditional classes for dark mode:
  ```tsx
  className={`base ${isDarkMode ? 'dark-variant' : 'light-variant'}`}
  ```
- Follow design tokens in DESIGN.md
- Spacing: multiples of 4px (p-4, m-2, gap-3, etc.)

### Bengali Language
- All UI text in Bengali (বাংলা)
- Use `toBengaliNumeral()` from `src/utils/bengali.ts` for numbers
- Use `formatRelativeTime()` for timestamps
- Category names must match dailyamardesh.com exactly

---

## 🚧 Guardrails

### DO ✅
- Follow existing patterns in the codebase
- Use TypeScript strict mode
- Write Bengali UI text
- Use Tailwind utility classes
- Implement dark mode support
- Add loading/error states
- Use lazy loading for images
- Keep components small and focused
- Extract reusable logic into custom hooks

### DON'T ❌
- Use `any` type
- Add inline styles (except dynamic values)
- Import from `/legacy` or `.env*` files
- Introduce new libraries without approval
- Change public API of existing services
- Commit directly to `main` branch
- Skip error handling
- Hardcode English text in UI
- Ignore accessibility (ARIA labels, contrast)

---

## 🎛️ Feature Flags

All new features MUST be behind feature flags.

### Feature Flag System
Location: `src/store/useAppStore.ts`

```tsx
interface AppState {
  // ... existing fields
  
  // Feature flags
  features: {
    dragDropReorder: boolean;
    swipeCardFeed: boolean;
    forYouTab: boolean;
    hyperLocalFeed: boolean;
    ttsListenMode: boolean;
    emojiReactions: boolean;
    readingStreak: boolean;
    offlineMode: boolean;
    continueReading: boolean;
    smartSummary: boolean;
    giftArticle: boolean;
    interactiveAds: boolean;
  };
  
  toggleFeature: (feature: keyof AppState['features']) => void;
}
```

### Usage Pattern
```tsx
const { features } = useAppStore();

{features.dragDropReorder && (
  <DragDropComponent />
)}
```

### Default Values
All features default to `false` (disabled) unless explicitly enabled.

---

## 🧪 Testing Requirements

### Setup (To Be Implemented)
```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom
```

### Test Structure
```
src/
├── components/
│   └── __tests__/
│       └── ComponentName.test.tsx
├── hooks/
│   └── __tests__/
│       └── useHookName.test.ts
└── utils/
    └── __tests__/
        └── utilName.test.ts
```

### Coverage Target
- **Minimum 70%** code coverage
- **100%** coverage for utility functions
- **80%** coverage for custom hooks
- **60%** coverage for components

### Test Types
1. **Unit tests** - Utility functions, pure logic
2. **Component tests** - Rendering, user interactions
3. **Integration tests** - Multi-component flows
4. **Hook tests** - Custom hook behavior

---

## 🌿 Branching Strategy

### Branch Naming
```
feat/<feature-slug>      # New features
fix/<bug-description>    # Bug fixes
docs/<doc-name>          # Documentation updates
refactor/<scope>         # Code refactoring
test/<test-scope>        # Test additions
```

### Examples
```
feat/drag-drop-reorder
feat/tts-listen-mode
fix/dark-mode-toggle
docs/update-architecture
```

### Workflow
1. Create feature branch from `main`
2. Implement with feature flag (default: off)
3. Write tests
4. Run `npm run typecheck`
5. Run `npm run build`
6. Create pull request
7. Get review
8. Merge to `main`

---

## 📦 Dependencies

### Already Installed
- React 18, TypeScript 5, Vite 6
- Tailwind CSS 4, Zustand 5
- React Router DOM 6, Lucide React
- Framer Motion 11, @dnd-kit/core 6
- Supabase 2 (not integrated yet)
- date-fns 2, uuid 9

### Adding New Dependencies
**MUST get approval before adding:**
```bash
# Ask first: "Can I add <package> for <purpose>?"
npm install <package>
```

**Never add:**
- Alternative state management (Redux, MobX)
- Alternative styling (styled-components, Emotion)
- Heavy libraries without justification

---

## 🔒 Security

### API Keys
- **NEVER** commit API keys to git
- Use environment variables: `VITE_API_KEY`
- Store in `.env.local` (gitignored)
- BYoak AI keys stored in localStorage (user's browser only)

### User Data
- Bookmarks: localStorage only
- AI chat history: localStorage only
- No user data sent to our servers
- All AI calls go directly from browser to provider

---

## 📊 Performance Guidelines

### Bundle Size
- Keep main bundle < 200KB gzipped
- Lazy load routes and heavy components
- Use dynamic imports: `React.lazy()`

### Rendering
- Use `React.memo` for expensive components
- Avoid inline object/array creation in render
- Use `useCallback` for event handlers passed as props
- Use `useMemo` for expensive computations

### Images
- Always use `loading="lazy"`
- Provide width/height to prevent layout shift
- Use WebP format when available
- CDN URLs from dailyamardesh.com

### Network
- Cache API responses (5-minute TTL)
- Debounce search input (300ms)
- Show loading skeletons during fetch
- Graceful fallback to mock data

---

## 🌐 Accessibility (a11y)

### Requirements
- All interactive elements need ARIA labels
- Minimum touch target: 44x44px
- Color contrast ratio: 4.5:1 minimum
- Visible focus states
- Keyboard navigation support
- Screen reader compatible

### Checklist
- [ ] Images have `alt` text (in Bengali)
- [ ] Buttons have `aria-label`
- [ ] Form inputs have `label` or `aria-labelledby`
- [ ] Focus visible with `focus:ring-2`
- [ ] Color not sole indicator (use icons/text too)

---

## 📝 Documentation Updates

### When to Update
- **architecture.md**: Add new module or change data flow
- **CHANGELOG.md**: Every feature/fix under "Unreleased"
- **README.md**: Major feature additions
- **DESIGN.md**: New components or design patterns
- **PRD.md**: New requirements or user stories

### Format
```markdown
## [Feature Name]

### Added
- Description of what was added
- Files created/modified
- Feature flag name

### Testing
- Test coverage percentage
- Manual testing steps

### Notes
- Any deviations from plan
- Known limitations
- Future improvements
```

---

## 🤖 AI Agent Behavior

### When Working on This Codebase

1. **Read First**
   - Always read existing code before writing
   - Check for similar patterns to follow
   - Understand the data flow

2. **Small Diffs**
   - Prefer small, reviewable changes
   - One feature per commit
   - Don't refactor unrelated code

3. **Ask Questions**
   - If requirement is ambiguous, propose 2 options
   - Ask before adding new dependencies
   - Clarify edge cases

4. **Test Everything**
   - Run `npm run typecheck` after changes
   - Run `npm run build` before committing
   - Test dark mode toggle
   - Test mobile responsiveness

5. **Document Changes**
   - Update CHANGELOG.md
   - Update architecture.md if adding modules
   - Add JSDoc comments for complex logic

### Common Tasks

**Adding a new feature:**
1. Create feature flag in useAppStore
2. Create branch: `feat/<feature-slug>`
3. Write design doc: `docs/design/<feature>.md`
4. Implement with flag (default: off)
5. Write tests
6. Update CHANGELOG.md
7. Create PR

**Fixing a bug:**
1. Create branch: `fix/<description>`
2. Reproduce the issue
3. Fix the code
4. Add regression test
5. Update CHANGELOG.md
6. Create PR

**Adding a component:**
1. Check if similar component exists
2. Follow existing component pattern
3. Add TypeScript interfaces
4. Support dark mode
5. Add ARIA labels
6. Write component test

---

## 🚨 Emergency Procedures

### Build Fails
```bash
# Check TypeScript errors
npm run typecheck

# Check for missing dependencies
npm install

# Clear cache and rebuild
rm -rf node_modules/.vite
npm run build
```

### Type Errors
```bash
# See all type errors
npm run typecheck

# Fix common issues:
# - Missing type imports
# - Incorrect prop types
# - Zustand store shape mismatch
```

### Styling Issues
```bash
# Tailwind not working?
# Check: tailwind.config.js exists
# Check: @tailwind directives in index.css
# Check: PostCSS config
```

---

## 📞 Support & Resources

### Internal Docs
- `architecture.md` - System design
- `DESIGN.md` - UI/UX specs
- `PRD.md` - Product requirements
- `RULES.md` - Coding rules
- `TEST_PLAN.md` - Testing strategy

### External Resources
- React: https://react.dev
- TypeScript: https://www.typescriptlang.org
- Tailwind: https://tailwindcss.com
- Zustand: https://github.com/pmndrs/zustand
- Vite: https://vitejs.dev

---

## ✅ Pre-Commit Checklist

Before every commit:
- [ ] `npm run typecheck` passes
- [ ] `npm run build` succeeds
- [ ] Feature flag added (if new feature)
- [ ] Dark mode tested
- [ ] Mobile responsive tested
- [ ] Bengali text correct
- [ ] ARIA labels added
- [ ] CHANGELOG.md updated
- [ ] No console.log in production code
- [ ] No hardcoded English in UI

---

**Last Updated:** 2026-09-20
**Version:** 1.0.0
