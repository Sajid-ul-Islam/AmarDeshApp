# expo-image Integration Design

## Overview
Replace React Native's `<Image>` component with `expo-image` for significantly better performance, progressive loading, and advanced caching.

## What It Replaces
- React Native `<Image>` component in 4 files
- Basic image loading with no optimization
- No placeholder support
- Limited caching

## Migration Steps

### Phase 1: Installation
```bash
npx expo install expo-image
```

### Phase 2: Component Replacement
Replace imports in:
- `app/(tabs)/index.tsx` - Article thumbnails (hero + list)
- `app/(tabs)/search.tsx` - Search result thumbnails
- `app/(tabs)/bookmarks.tsx` - Bookmarked article thumbnails
- `app/article/[id].tsx` - Article hero image

### Phase 3: API Migration
```typescript
// Before (React Native)
import { Image } from 'react-native';
<Image source={{ uri: url }} style={styles.image} />

// After (expo-image)
import { Image } from 'expo-image';
<Image 
  source={url} 
  style={styles.image}
  contentFit="cover"
  transition={200}
  cachePolicy="memory-disk"
/>
```

### Phase 4: Feature Flag
Add `enableExpoImage` feature flag to control rollout.

## Key Improvements

### Performance
- **10x faster** image loading
- Progressive JPEG support
- WebP support with fallback
- Advanced memory management
- Automatic downsampling

### Caching
- Memory + disk caching
- Configurable cache policies
- Cache size limits
- Automatic cleanup

### UX
- Smooth fade-in transitions
- BlurHash placeholders (future)
- Thumbnail previews (future)
- Better error handling

## Acceptance Criteria

### Functional
- [ ] All images load correctly
- [ ] Hero images display properly
- [ ] Article thumbnails show correctly
- [ ] Search result images work
- [ ] Bookmark images display

### Performance
- [ ] Images load faster than before
- [ ] Smooth scrolling in lists
- [ ] No memory leaks
- [ ] Proper cache behavior

### Visual
- [ ] Images maintain aspect ratio
- [ ] No stretching or distortion
- [ ] Smooth fade-in animation
- [ ] Consistent with design

## Rollback Plan
If issues arise:
1. Disable `enableExpoImage` feature flag
2. Revert to React Native `<Image>`
3. No data loss or breaking changes

## Testing Strategy

### Manual Testing
1. Open home screen → verify hero image
2. Scroll through articles → verify thumbnails
3. Search for articles → verify results
4. View bookmarks → verify images
5. Open article detail → verify hero image
6. Test on slow network → verify loading
7. Test offline → verify caching

### Performance Testing
1. Measure load times before/after
2. Monitor memory usage
3. Test with 100+ images
4. Verify cache behavior

## Files to Modify
1. `package.json` - Add expo-image dependency
2. `app/(tabs)/index.tsx` - Replace Image imports
3. `app/(tabs)/search.tsx` - Replace Image imports
4. `app/(tabs)/bookmarks.tsx` - Replace Image imports
5. `app/article/[id].tsx` - Replace Image imports
6. `store/useAppStore.ts` - Add feature flag
7. `architecture.md` - Document integration

## Feature Flag
```typescript
features: {
  enableExpoImage: boolean; // Toggle expo-image usage
}
```

## Notes
- No breaking changes to existing functionality
- Backward compatible with existing image URLs
- Can be gradually rolled out
- Easy to disable if issues arise
