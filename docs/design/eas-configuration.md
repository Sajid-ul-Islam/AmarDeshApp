# EAS Configuration Design

## Overview
Set up Expo Application Services (EAS) for build profiles, update channels, and deployment workflow.

## What It Adds
- Build profiles (development, preview, production)
- Update channels (production, staging)
- Environment variables management
- EAS Submit configuration
- Automated build workflow

## Implementation Steps

### Phase 1: Create eas.json
Define build profiles for different environments:
- **development** - Debug builds with dev client
- **preview** - Internal testing builds
- **production** - App Store / Play Store builds

### Phase 2: Configure Update Channels
Set up EAS Update channels:
- **production** - Live app updates
- **staging** - Test updates before production
- **dev** - Development updates

### Phase 3: Environment Variables
Configure environment-specific variables:
- API endpoints
- Feature flags
- Analytics keys
- Push notification keys

### Phase 4: EAS Submit
Configure automatic submission:
- iOS App Store Connect
- Google Play Console
- API keys for submission

### Phase 5: Build Scripts
Add npm scripts for common tasks:
- `eas build:dev` - Development build
- `eas build:preview` - Preview build
- `eas build:prod` - Production build
- `eas submit:ios` - Submit to iOS
- `eas submit:android` - Submit to Android

## Acceptance Criteria

### Functional
- [ ] eas.json created with all profiles
- [ ] Update channels configured
- [ ] Environment variables set up
- [ ] Build scripts work correctly
- [ ] EAS Submit configured
- [ ] OTA updates work

### Build Profiles
- [ ] Development profile builds
- [ ] Preview profile builds
- [ ] Production profile builds
- [ ] Each profile has correct settings

### Update Channels
- [ ] Production channel works
- [ ] Staging channel works
- [ ] Dev channel works
- [ ] Updates deploy correctly

## Rollback Plan
EAS configuration is additive:
- No breaking changes
- Can be removed anytime
- Doesn't affect app functionality
- Only affects build/deploy workflow

## Files to Create/Modify

### New Files
1. `eas.json` - EAS configuration
2. `.env.production` - Production environment variables
3. `.env.staging` - Staging environment variables
4. `.env.development` - Development environment variables

### Modified Files
1. `package.json` - Add EAS scripts
2. `app.json` - Update with EAS project ID
3. `architecture.md` - Document EAS setup

## Notes
- EAS Build requires EAS account
- EAS Update requires EAS subscription
- Environment variables are encrypted
- Build profiles can be customized per platform
- Submit configuration requires API keys
