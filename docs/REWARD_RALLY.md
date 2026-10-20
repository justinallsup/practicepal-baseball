# Reward-first experience

The kid-facing loop is: choose something to play for, start a short practice, see the points earned, and request a parent-arranged reward when enough points are available.

## Product behavior

- Today leads with original reward artwork, a prominent play button, and the chosen reward's progress. The Play tab offers short drill combinations and individual drills. Detailed coaching stays available on demand.
- A child can choose any catalog reward as their goal without spending points. Goals persist on this device. Treats (20 points) and parent-agreed bonus game time (40 points) join the existing family rewards.
- Practice still earns 10 points at most once per calendar day. Extra same-day sessions celebrate effort without displaying another points award. Early finishes that do not count under parent settings say so explicitly.
- The finish screen celebrates earned points, updates the chosen goal, and offers a direct route to Rewards. The single short confetti animation respects reduced-motion preferences and never plays sound.
- Requesting a reward reserves its points. Pending goals continue to show a full meter and “Points reserved”; parent approval shows the completed goal, while a decline refunds points through the existing exactly-once store action. A child can choose the same goal again after approval.
- Parent-arranged family rewards remain separate from the points catalog. There are no purchases, randomized rewards, cash value, or app-store publication changes.
- Persistence schema version 2 adds the goal name and tracked request ID. Migration retains existing practice records, points, rewards, and the payment locks. Parent export includes the new goal; device-data deletion resets it.

## Original artwork

Asset: `assets/editorial/reward-rally.jpg` (1536 × 1024, optimized JPEG).

Created with the built-in `image_gen` tool for this project. The tool's PNG output was converted to JPEG for delivery. No reference photo or third-party video was used. This asset is decorative illustration, not a demonstration of baseball mechanics.

Generation prompt:

> Use case: stylized-concept. Create a premium playful 3D illustration asset for PracticePal Baseball, a children's baseball practice rewards app. This is illustration artwork, NOT a UI screenshot. Landscape 3:2 composition. Against a rich very dark forest green (#102F29) seamless background, a dynamic floating arrangement of a chunky polished golden star-shaped sports award, a cream baseball with coral stitching, a deep teal and cream generic video-game controller, two golden blank admission tickets and a small ice cream cone. All objects clustered in the RIGHT TWO THIRDS of the frame with generous dark negative space on the LEFT for UI typography. Energetic diagonal composition, depth and occlusion, soft realistic material detail, bright studio rim lighting, a few coral and electric lime confetti shapes. Sophisticated tactile collectible-toy render, appealing to ages 8–13, sporty and cool rather than toddler/cartoon. No people, no text, no logos, no currency symbols, no coins, no treasure chests, no slot-machine or gambling imagery. Clean high-quality edges. This illustration celebrates predictable parent-arranged rewards for practice.

## Verification

Unit coverage includes goal selection without spending points, invalid goal rejection, request tracking, approval/reset behavior, reserved points, refunds, and remaining practice days. Browser coverage exercises persisted goal selection, two days of timed practice, the reduced-motion celebration, request reservation and parent approval on desktop and phone. A migrated version-1 profile verifies that extra same-day practice never awards another 10 points. Existing timer, guide, family reward, export, deletion, and viewport checks remain in the suite.

The GitHub quality workflow also checks TypeScript, Expo compatibility, the production web build, both native bundles, and native metadata. These checks do not sign or publish a native app.
