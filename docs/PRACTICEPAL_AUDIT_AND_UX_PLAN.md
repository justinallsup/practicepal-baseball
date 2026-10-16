# PracticePal — source audit and premium upgrade plan (2026-10-16)

## Scope and evidence
Reviewed: `package.json`, `app.json`, `eas.json`, `README.md`, `app/index.tsx`, `app/_layout.tsx`, `app/(home)/index.tsx`, `app/(home)/paywall.tsx`, `app/onboarding/welcome.tsx`, and relevant `lib/store.ts` excerpts.
The public domain baseballpracticepal.com could not be fetched in this audit. Visual recommendations are provisional until the live site and device layouts are tested. No build, device test, or store submission was run.

## P0 — must fix before monetized launch
1. `app/(home)/paywall.tsx` calls `activateSubscription(selectedPlan)` directly. There is no validated store transaction in this flow. Implement StoreKit/Google Play Billing via an approved integration (e.g., RevenueCat), restore purchases, entitlement reconciliation and cancellation management; do not grant paid access from a local button.
2. `lib/store.ts` holds subscription status in local persisted state. This is not authoritative purchase verification. Use verified entitlements; test reinstall, refund, expiration and offline scenarios.
3. `app/onboarding/welcome.tsx` asserts “Trusted by 1,000+ baseball families” and “Most kids improve in the first week.” Remove until substantiated. Paywall also says “Most kids increase practice in the first week”; remove unless supported.
4. Paywall says “Start Free Trial” and “Cancel anytime in 2 taps” without a real store trial/subscription management implementation. Replace with truthful copy until billing is implemented.
5. Paywall advertises leaderboard + teammates and parent dashboard. Verify each claim against actual shipped functionality.

## P1 — release quality
- Confirm app store accounts, EAS UUID, secure signing and real build/test results.
- Verify child privacy design: parent-managed profiles, minimum personal data, age rating, deletion/reset and privacy disclosure. Review COPPA and store family policies if directed to children.
- Test notification permission timing, scheduling and denial flows.
- Review streak date logic across midnight and time zones; current `getCurrentStreak` stops when no log exists today, potentially showing zero for a still-active yesterday streak.
- Verify no unearned points, rewards, or practice logs can be created by unintended UI flows.
- Test small phones, large text, screen readers, keyboard, safe areas, reduced motion and dark/light appearance.

## Premium UX proposal (requires design approval)
- Consistent visual system: deep navy, restrained baseball red/cream accents, high-contrast typography, real iconography rather than prominent emoji.
- Home hero: player name, weekly goal, current streak and one primary “Start practice” action; simplify secondary cards.
- Practice flow: 30–60 second quick log plus guided session option; show relevant drill recommendations only when supported.
- Progress: weekly calendar, skill distribution, streak history and a meaningful parent recap.
- Parent-approved rewards with transparent point balances and redemption status.
- Positive motivation without guilt-based streak loss or manipulative paywall language.
- Marketing landing page: credible product screenshots, a short how-it-works sequence, privacy-first positioning, clear download CTA, and factual testimonials only.

## Acceptance gates
- All P0 items resolved and independently verified.
- CI passes; native iOS/Android preview builds tested on devices.
- Privacy, payments, store listings, age classification and claims reviewed.
- TestFlight/Play internal testing approved by owner; production publication remains separately gated.
