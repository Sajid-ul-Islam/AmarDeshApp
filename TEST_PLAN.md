# Test Plan - Daily Amar Desh Mobile App

## Testing Strategy Overview

### Testing Levels
| Level | Scope | Tools |
|-------|-------|-------|
| Unit | Functions, hooks, utils | Vitest |
| Component | UI components | Vitest + Testing Library |
| Integration | User flows | Vitest + Testing Library |
| E2E | Full app flows | Playwright (future) |
| Visual | UI consistency | Chromatic (future) |

## Test Categories

### 1. Unit Tests

#### Utility Functions
- [ ] `bengaliNumeral()` - English to Bengali number conversion
- [ ] `formatRelativeTime()` - Relative time formatting in Bengali
- [ ] `formatDate()` - Bengali date formatting
- [ ] `truncateText()` - Text truncation with ellipsis
- [ ] `getCategorySlug()` - Category name to URL slug mapping

#### Hooks
- [ ] `useArticles()` - Article fetching and caching
- [ ] `useBookmarks()` - Bookmark add/remove/toggle
- [ ] `useCategories()` - Category list management
- [ ] `useTheme()` - Dark/light mode toggle

### 2. Component Tests

#### Common Components
- [ ] `Header` - Renders logo, menu, search
- [ ] `NewsCard` - Displays article thumbnail, title, time
- [ ] `CategoryTabs` - Horizontal scrollable categories
- [ ] `PrayerTimes` - Prayer time display
- [ ] `BottomNav` - Bottom navigation bar

#### Page Components
- [ ] `HomePage` - Hero section + news feed
- [ ] `CategoryPage` - Category-filtered articles
- [ ] `ArticlePage` - Full article content
- [ ] `SearchPage` - Search results
- [ ] `BookmarkPage` - Saved articles list

### 3. Integration Tests

#### User Flows
- [ ] Navigate from home to article
- [ ] Switch between categories
- [ ] Search and view results
- [ ] Bookmark and view bookmarks
- [ ] Toggle dark mode
- [ ] Pull to refresh (simulated)

### 4. Responsive Tests

| Device | Width | Test |
|--------|-------|------|
| iPhone SE | 320px | Layout doesn't break |
| iPhone 14 | 390px | Proper spacing |
| iPad Mini | 768px | 2-column layout |
| iPad Pro | 1024px | 3-column layout |
| Desktop | 1440px | Max-width container |

### 5. Performance Tests

| Metric | Target | Method |
|--------|--------|--------|
| First Contentful Paint | < 1.5s | Lighthouse |
| Largest Contentful Paint | < 2.5s | Lighthouse |
| Time to Interactive | < 3.5s | Lighthouse |
| Bundle Size | < 200KB | Build analysis |
| Image Loading | Lazy load | Manual check |

### 6. Accessibility Tests

- [ ] All images have alt text
- [ ] Color contrast meets WCAG AA
- [ ] Touch targets >= 44x44px
- [ ] Keyboard navigation works
- [ ] Screen reader announces content
- [ ] Focus indicators visible

### 7. Cross-Browser Tests

| Browser | Version | Priority |
|---------|---------|----------|
| Chrome (Android) | Latest | P0 |
| Safari (iOS) | Latest | P0 |
| Samsung Internet | Latest | P1 |
| Firefox | Latest | P2 |
| Edge | Latest | P2 |

## Test Data

### Mock Articles
```typescript
const mockArticle = {
  id: 'amd-test-001',
  title: 'পরীক্ষা সংবাদ শিরোনাম',
  excerpt: 'এটি একটি পরীক্ষা সংবাদের বিবরণ',
  category: 'জাতীয়',
  imageUrl: 'https://via.placeholder.com/480x270',
  publishedAt: '2026-09-20T10:00:00Z',
  author: 'পরীক্ষা লেখক'
};
```

## CI/CD Integration

### Pre-commit
- TypeScript compilation check
- ESLint validation
- Unit tests

### Pre-push
- Component tests
- Build verification

### On PR
- Full test suite
- Lighthouse audit
- Bundle size check

## Bug Reporting Template
```
**Bug Title:** [Brief description]
**Device:** [Device model]
**Browser:** [Browser + version]
**Steps to Reproduce:**
1. Step 1
2. Step 2
**Expected:** [What should happen]
**Actual:** [What actually happens]
**Screenshot:** [If applicable]
```
