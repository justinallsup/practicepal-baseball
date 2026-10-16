# PracticePal — App Store release checklist

This branch prepares review-only release automation. Do not merge or submit until the checks below are complete.

## Verified from repository configuration
- Expo SDK 54 / React Native 0.81.5 with Expo Router.
- iOS bundle identifier: `com.practicepal.baseball`.
- Android application ID: `com.practicepal.baseball`.
- `eas.json` has development, preview and production build profiles.
- `eas.json` contains placeholder Apple credentials; replace using secure account setup, not committed secrets.
- `app.json` EAS project ID is `practicepal-baseball`; verify or replace with actual Expo UUID before building.

## Before first native build
- [ ] Confirm Apple Developer and Google Play Console enrollment.
- [ ] Run `npm ci`, `npx tsc --noEmit`, `npx expo-doctor`, and native preview builds.
- [ ] Confirm icon/splash assets exist and render correctly.
- [ ] Run `eas init` with the correct Expo account and inspect project linkage.
- [ ] Configure EAS signing credentials securely.
- [ ] Confirm app privacy policy, support contact, age rating, permissions and data safety disclosures.
- [ ] Test notifications, storage persistence, deep links, offline and foreground/background behavior on real devices.
- [ ] Review child-directed features, parental consent requirements and data collection before assigning store age ratings.
- [ ] Validate screenshots and store metadata against actual functionality.
- [ ] Upload to TestFlight and Google Play internal testing only after explicit approval.
- [ ] Keep production release manual until acceptance testing and account compliance are complete.

## Release gate
No automatic production submission or publication. Require human approval for signing, store upload, and production rollout.
