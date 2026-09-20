# Rules & Guidelines - Daily Amar Desh Mobile App

## Code Rules

### General
1. **Language:** All UI text must be in Bengali (বাংলা)
2. **Numbers:** Use Bengali numerals (০১২৩৪৫৬৭৮৯) in UI, English in code
3. **Date Format:** Bengali date format (দিন, তারিখ মাস বছর)
4. **RTL:** Not required - Bengali is LTR language
5. **Encoding:** UTF-8 for all files

### React/TypeScript
1. Use functional components with hooks
2. TypeScript strict mode enabled
3. No `any` types - use proper interfaces
4. Components must be pure when possible
5. Use `React.memo` for expensive components
6. Custom hooks for reusable logic
7. Props must be typed with interfaces

### Styling
1. Use Tailwind CSS utility classes
2. No inline styles except for dynamic values
3. Mobile-first approach in all styles
4. Use design tokens from DESIGN.md
5. Consistent spacing (multiples of 4px)
6. Images must have alt text in Bengali

### Performance
1. Lazy load images with loading="lazy"
2. Code split by route
3. Debounce search input (300ms)
4. Virtualize long lists (>20 items)
5. Cache API responses
6. Minimize re-renders with proper state management

### Accessibility
1. All interactive elements must have ARIA labels
2. Minimum touch target: 44x44px
3. Color contrast ratio: 4.5:1 minimum
4. Focus states must be visible
5. Screen reader compatible markup

### Content
1. Article titles: Max 2 lines (truncate with ellipsis)
2. Article excerpts: Max 3 lines
3. Image aspect ratio: 16:9 for hero, 1:1 for thumbnails
4. Time format: Relative (e.g., "২ ঘণ্টা আগে")
5. Category names: Use Bengali names from the website

### Git/Version Control
1. Commit messages in English
2. Branch naming: feature/, fix/, docs/
3. PR must include description of changes
4. No console.log in production code

### Testing
1. Unit tests for utility functions
2. Component tests for critical UI
3. Integration tests for user flows
4. Minimum 70% code coverage

## Bengali Number Conversion
```
English → Bengali
0 → ০, 1 → ১, 2 → ২, 3 → ৩, 4 → ৪
5 → ৫, 6 → ৬, 7 → ৭, 8 → ৮, 9 → ৯
```

## Category Mapping
Always use the exact Bengali names from the original website:
- জাতীয় (not national)
- রাজনীতি (not politics)
- সারা দেশ (not bangladesh)
- বিনোদন (not entertainment)
- etc.
