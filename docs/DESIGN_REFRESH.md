# PracticePal editorial design refresh

October 16, 2026

The previous layout relied on similar white cards and explanatory copy. This revision establishes an athletic visual identity across the public welcome, setup, Today, Training, Progress, Rewards, and Parent screens.

- Forest green, ivory, and warm gold design tokens; custom baseball monogram.
- Self-hosted Barlow Condensed display type and Manrope body type, with system font fallbacks on native. Google Fonts SIL Open Font Licenses are retained in public/fonts.
- Photographic practice features with readable gradient overlays and a separate mobile focal position.
- Actual-data weekly progress rings, styled calendars, milestone medals with earned/locked states, illustrated family reward cards, and dark drill diagrams.
- Responsive typography, consistent touch targets, visible keyboard focus, and reduced-motion support retained.
- No persistence schema, reward scoring, payment status, or app-store publication changes.

## Artwork provenance

Generated specifically for this project using the built-in image generation tool, then compressed to JPEG for delivery. These depict illustrative scenes, not customers or endorsements. Both original generated files are retained in the working session; deployable files are committed to this repository.

- assets/editorial/batting-golden-hour.jpg — prompt: photorealistic editorial youth baseball batting-tee practice, player in cream pants and forest-green jersey/helmet photographed from behind on the right, empty community field, golden-hour rim light, dark green negative space on the left, authentic equipment and balanced follow-through, no text/logos/watermarks.
- assets/editorial/glove-detail.jpg — prompt: premium editorial close-up of worn caramel leather baseball glove cradling a white ball with red stitches on dark green grass, wooden bat softly out of focus, warm late-afternoon light, tactile leather and subtle grain, no people/logos/text/watermarks.

The photographs total about 380 KiB. Font files total about 268 KiB. Assets are served by the app, without external font/CDN dependencies.

## Validation

- TypeScript and 19 unit tests.
- Existing 8 desktop/phone browser behavior tests.
- Additional desktop/phone rendering tests verify local font availability, successfully loaded photo assets, rendered image bounds, and document width on Today, Training, Progress, and Rewards.
- Manual screenshot review found and corrected React Native Web ImageBackground intrinsic sizing and refined phone typography/photo cropping.
- Production build and GitHub CI required before merge; Vercel production alias verified after release.

Previous native-release and dependency-audit limitations remain documented in RELEASE_VERIFICATION.md.
