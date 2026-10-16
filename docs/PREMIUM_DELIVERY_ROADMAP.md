# PracticePal Premium — delivery roadmap and release gates

## Implemented in this draft PR
- CI preflight, TypeScript fixes, notification type fix, basic weekly progress refinements.
- Disabled nonfunctional subscription activation and associated trial redirect; tracking stays accessible.
- Removed unverified marketing claims.
- Curated six drill instructions and a goal-aware weekly training screen; training tab replaces simulated leaderboard tab.

## Remaining work (not complete)
### 1. Reliability
- Resolve Expo SDK package mismatch using `npx expo install --fix`, commit lockfile and verify CI.
- Triage npm audit advisories; do not blindly force breaking upgrades.
- Test full onboarding, sessions, notification flows and navigation on actual devices.
- Review training-plan progression and youth throwing guidance with a qualified coach.

### 2. Product
- Build parent-controlled skill benchmarks and longitudinal charts; track objective metrics rather than fabricated scores.
- Add achievement cards tied to actual practice records; keep rewards parent-approved.
- Create guided drill illustrations or original licensed videos; current library is text-only.
- Improve visual consistency and accessibility across all screens, not just weekly/training.
- Remove/replace remaining synthetic leaderboard data, referral claims and nonfunctional controls.

### 3. Billing
- Register Apple/Google developer accounts, Expo EAS project, RevenueCat project and actual subscription products.
- Implement native purchase SDK with verified entitlements, restore purchases and cancellation/error handling.
- Ensure a functional free tier and truthful purchase/trial disclosures. No live checkout before sandbox tests.

### 4. Privacy and compliance
- Determine parent-directed versus child-directed classification; implement parental gates for purchases, external links, sharing.
- Publish accurate privacy policy and data deletion guidance. Review COPPA and store policies.
- Validate analytics, notifications, SDKs, and any future video storage against disclosed practices.

### 5. Launch
- Generate production app assets/screenshots from tested builds, prepare listings and metadata.
- TestFlight and Play internal testing, manual acceptance signoff, then production submission only with owner approval.

## Acceptance
CI green, native builds green, test purchases green, no unresolved critical release blockers, owner approval. No production changes from this branch without review.
