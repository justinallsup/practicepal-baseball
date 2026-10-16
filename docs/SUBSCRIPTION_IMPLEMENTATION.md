# PracticePal subscription integration — implementation specification

Status: **NOT ENABLED**. Do not advertise a purchasable subscription or free trial until purchase verification works on both platforms.

## Decision
Use RevenueCat Purchases for native StoreKit 2 and Google Play Billing. All paid entitlements must originate from verified platform purchases, never from `activateSubscription`, `setSubscriptionActive`, or mutable local AsyncStorage state.

## Setup (account owner)
1. Enroll in Apple Developer Program and Google Play Console. Complete banking, tax and agreements.
2. Register PracticePal with the existing identifiers `com.practicepal.baseball` for both platforms; check availability before finalizing.
3. Create monthly and annual auto-renewing subscription products, define any real trial eligibility, pricing and localization in each store.
4. Create a RevenueCat project, connect App Store Connect and Google Play, map both products to one `pro` entitlement.
5. Add platform-specific **public** RevenueCat SDK keys through EAS environment configuration. Keep store API credentials and private keys in provider dashboards/secrets, never in Git.
6. Use `react-native-purchases` with a compatible Expo development build (not Expo Go); install the RevenueCat config plugin only if needed by the supported SDK version.

## Required behavior
- On app startup: configure SDK, fetch CustomerInfo, derive entitlement from `entitlements.active.pro`, listen for updates.
- Paywall: fetch current offerings/prices from the SDK, show accurate localized period, trial, billing and cancellation terms; disable checkout if offerings unavailable.
- Purchase: call `purchasePackage`; only unlock after verified entitlement is active; handle cancellation without treating it as an error.
- Restore: provide a visible Restore Purchases action; update access from returned verified entitlement.
- Account and identity: define anonymous ID and migration policy; avoid collecting unnecessary child information.
- Lifecycle: verify expiration, renewal, refund, grace period, reinstall, offline access and switching devices. Do not rely on a local flag for paid status.
- Web: keep web checkout separate and policy-compliant; do not advertise native purchase buttons on the web build.
- Until ready: leave subscription checkout disabled and practice logging accessible.

## Test gates
- iOS sandbox and TestFlight purchase, renewal, cancellation, restore and refund.
- Google Play license testers/internal track purchase, renewal, cancellation, restore and refund.
- App review metadata, privacy disclosure and children's data safety checked.
- No production submission until owner signs off on real-device results.
