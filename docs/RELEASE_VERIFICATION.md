# Premium website release verification

Date: October 16, 2026
Repository: justinallsup/practicepal-baseball
Production: https://baseballpracticepal.com
Vercel project: practicepal-baseball / prj_v0TRiABO3iZf5jX0lWGRGhcCdseq
Team: bears-projects-30e04b92

## Acceptance paths
- Fresh visitor → parent-led setup → saved player → Today.
- Quick log → exactly one daily credit → reload → real progress and achievements.
- Guided practice → saved timer → pause → reload → resume → complete → actual elapsed record.
- Parent gate → benchmark → progress trend → export → confirmed complete local deletion.
- Legacy records → migration → reward request → parent decline → exactly one refund.
- Filter drills → guided instructions → privacy route; no horizontal document overflow at phone/desktop sizes.
- Payment screen discloses free use; purchase activation and trials cannot be triggered locally.

## Verification
- TypeScript source and tests checked with tsc; generated bundles excluded from source analysis.
- Vitest tests cover daily credit, duplicate completions, early finish settings, cancellations, reward reservation/refunds, invalid inputs, reset, billing hold, DST/year-boundary streaks, timer pause math, bounded plans, milestones, and family goals.
- Playwright runs the acceptance paths in desktop Chromium and a phone viewport. Local browser testing used Chromium 153. CI uses the Playwright-pinned browser.
- Web production export succeeded. Android and iOS Hermes/JS bundle exports succeeded; these are not signed native builds.
- Expo Doctor: 18/18 checks passed. Expo install --check reports dependencies are compatible.
- Visually reviewed desktop welcome and phone dashboard captures. No browser page errors on the full family journey.

## Dependency audit
The initial npm audit reported 43 findings (1 critical, 26 high, 15 moderate, 1 low). Applied compatible fixes, removed the critical shell-quote finding, and explicitly patched decode-uri-component to 0.5.0 and PostCSS to 8.5.30. Rebuilt afterward.

Remaining audit: 37 findings (0 critical, 22 high, 15 moderate), including dependency chains. Remaining roots include braces, node-forge, image-size, sprintf-js, and uuid in the Expo/Metro/Jest/native tooling. There is no deployed Node request handler, upload processing, or native signing workflow in this static web release. Do not represent this as a clean audit or native release approval. A forced npm audit fix proposed unrelated breaking/downgrade SDK changes and was not used.

## Release safeguards
- GitHub quality workflow has read-only contents permission, pinned actions, Node 24, type/unit/browser checks, web export, and native bundle compilation.
- Workflow cannot publish to app stores or activate payments and contains no credentials.
- Existing public domain and Vercel project must be verified against the released commit after deployment.
- Retain previous production deployment dpl_3ZgoCu28WDpUrvZxMD3T5zwT5Z1z as a rollback reference.

## Remaining external acceptance
Real billing setup/approval, Apple/Google/EAS registration, signed builds, physical iPhone/Android testing, notification delivery, coaching review, and store compliance review remain explicitly separate from the website release.
