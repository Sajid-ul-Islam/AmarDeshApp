# expo-notifications Integration Design

## Overview
Implement push notifications for breaking news alerts, daily briefings, and user engagement using expo-notifications.

## What It Adds
- Breaking news push notifications
- Daily news briefings
- Category-specific notifications
- Notification preferences UI
- Deep linking from notifications
- Android notification channels

## Implementation Steps

### Phase 1: Permission Handling
- Request notification permission on first launch
- Show permission explanation before requesting
- Handle permission denial gracefully
- Store permission status

### Phase 2: Notification Channels (Android)
Create channels for different notification types:
- **Breaking News** - Urgent alerts (high priority)
- **Daily Briefing** - Morning news summary (default priority)
- **Category Updates** - Category-specific news (low priority)
- **General** - Other notifications (default priority)

### Phase 3: Push Token Management
- Register for push notifications
- Store device push token
- Send token to backend (future)
- Handle token refresh

### Phase 4: Notification Handlers
- Handle foreground notifications
- Handle background notifications
- Handle notification taps → deep link to article
- Track notification interactions

### Phase 5: Notification Preferences UI
- Settings screen for notification preferences
- Toggle notifications on/off
- Select categories to follow
- Choose notification types
- Set quiet hours

### Phase 6: Notification Scheduling
- Schedule daily briefings
- Schedule category updates
- Handle local notifications
- Cancel scheduled notifications

## Acceptance Criteria

### Functional
- [ ] Permission request shows on first launch
- [ ] Permission status persists
- [ ] Android channels created correctly
- [ ] Push token registered
- [ ] Foreground notifications display
- [ ] Background notifications display
- [ ] Notification tap navigates to article
- [ ] Preferences UI works correctly
- [ ] Category filtering works
- [ ] Quiet hours respected

### Visual
- [ ] Permission dialog looks native
- [ ] Settings UI matches design
- [ ] Notification badges show correctly
- [ ] Channel settings visible in OS

### Performance
- [ ] No impact on app startup time
- [ ] Token registration is fast
- [ ] Notification handling is instant
- [ ] No memory leaks

## Rollback Plan
If issues arise:
1. Disable `enableNotifications` feature flag
2. Skip permission request
3. Don't register for push
4. No notifications sent
5. No breaking changes

## Files to Create/Modify

### New Files
1. `services/notificationService.ts` - Notification logic
2. `app/settings/notifications.tsx` - Preferences UI
3. `hooks/useNotifications.ts` - Notification hook

### Modified Files
1. `app/_layout.tsx` - Initialize notifications
2. `app/(tabs)/profile.tsx` - Add settings link
3. `store/useAppStore.ts` - Add notification preferences
4. `app.json` - Add notification permissions

## Feature Flags
```typescript
features: {
  enableNotifications: boolean; // Master toggle
  enableBreakingNews: boolean;  // Breaking news alerts
  enableDailyBriefing: boolean; // Daily summary
  enableCategoryUpdates: boolean; // Category-specific
}
```

## Testing Strategy

### Manual Testing
1. First launch → permission dialog
2. Grant permission → token registered
3. Send test notification → displays correctly
4. Tap notification → navigates to article
5. Change preferences → settings persist
6. Test each notification type
7. Test quiet hours
8. Test on both iOS and Android

### Automated Testing
1. Permission flow tests
2. Token registration tests
3. Notification handling tests
4. Deep linking tests
5. Preference persistence tests

## Notes
- expo-notifications already installed (~0.27.0)
- Need to configure app.json permissions
- Android requires channel configuration
- iOS requires entitlements
- Backend needed for actual push sending (future)
- For now, focus on local notifications and setup
