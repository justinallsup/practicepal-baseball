# PracticePal premium web release — October 16, 2026

## Delivered for the website
- Cohesive navy, cream, and baseball-red visual system, responsive desktop/phone layouts, accessible controls, and simplified five-tab navigation.
- New parent-led welcome and one-screen player setup. Nicknames only; no registration or payment required.
- Today dashboard, weekly calendar, realistic goals, saved/pauseable timers, quick logging, feelings, and drill-driven practice.
- Goal-aware weekly plan, six illustrated drills with equipment and safety guidance, skill filtering, and session launch.
- Eight-week practice history, evidence-based achievements, and parent-entered skill benchmarks with trend charts and removable entries.
- Parent-chosen family goals and point rewards with approval/decline, reservation, and exactly-once refunds. Existing family rewards remain visible.
- Parent gate, settings, weekly recap, supported native reminder controls, JSON export, complete local reset, and accurate local-data disclosures.
- Removed synthetic competitors, fake referrals, unverified improvement claims, unsupported affiliate prices, duplicate app routes, and purchase/trial activation.
- Legacy local records migrate; returning users bypass setup. One practice day awards points once; timed sessions cannot be completed repeatedly.
- SDK 54 compatibility repaired; web and native JS bundles compile. TypeScript, Vitest, and Playwright checks included in CI.
- SEO/share metadata, focus outlines, reduced-motion rules, and security response headers.

## Website release authorization
The owner authorized routine tested website deployment to baseballpracticepal.com on October 16, 2026. Website deployment does not authorize real payments or store publication.

## Held for owner approval and setup
- Real billing remains disabled in both UI and state actions. No live checkout, trial, entitlement, or charge is enabled. Billing integration requirements are in SUBSCRIPTION_IMPLEMENTATION.md.
- Apple and Google developer accounts and Expo EAS project registration are not complete. Fake EAS IDs and placeholder submit credentials were removed.
- Signed iOS/Android builds, physical-device acceptance testing, store privacy/age classification review, screenshots/listings, and actual submissions remain outstanding. Native JavaScript compilation is not a signed build or device test.
- Obtain qualified coaching review before making performance claims or introducing throwing workloads, age-specific pitch limits, or paid coaching programs.

## Deliberate current limits
- Single player per browser/device; no backend, accounts, cloud sync, multiplayer, push notifications on web, or online reward fulfillment.
- Export is a readable JSON record, not an import/restore feature. Deletion is irreversible. Parent gate is a deterrent to accidental changes, not authentication.
- Weekly plans are deterministic suggestions, not AI-generated coaching. Illustrations explain setup; they are not videos or biomechanical instruction.
- Toolchain dependency advisories remain; see RELEASE_VERIFICATION.md. A future SDK upgrade must be independently tested before native store release.
