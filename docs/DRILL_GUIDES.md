# PracticePal original animated guides

Created October 19, 2026 for the six existing PracticePal drills. Each is an
18-second, silent, 1280 × 720 H.264 MP4. These are simplified illustrated setup
and movement guides, not filmed instruction or a biomechanical model. No claim
of professional coach approval is made. A qualified coach should review the
teaching content before these are marketed as expert technique instruction.

## Asset provenance

- All figures, diagrams, movement paths, compositions, captions, and timing were
  created for this project in `scripts/render-drill-guides.py`.
- No third-party video, still frames, scripts, music, voice, likeness, logos, or
  animation was downloaded, traced, or reused. No external video embed loads.
- The existing self-hosted Barlow Condensed and Manrope fonts are used under their
  committed SIL Open Font Licenses in `public/fonts/`.
- Source and rendered assets are committed in the project repository. These are
  original PracticePal assets; this does not represent a legal determination of
  exclusive copyright protection for AI-assisted output.
- The external resources below informed general instructional concepts only.
  Their publishers have not endorsed PracticePal or licensed their videos to it.

## Reference resources reviewed

| Topic | Reference | Use |
| --- | --- | --- |
| Tee station | https://www.littleleague.org/university/articles/tee-ball-drills-tee-hitting/ | General equipment and supervised station setup |
| Soft toss | https://www.littleleague.org/university/articles/backyard-tip-soft-toss/ | Adult to the side, underhand soft toss, helmet, clear swing area |
| Ground balls | https://www.littleleague.org/university/articles/infield-drill-progression/ | Gentle rolls, low stance, open glove out front, secure the ball |
| Catching/throwing | https://www.littleleague.org/help-center/video-tutorials/ | Further learning reference; no footage reused |
| Footwork | https://www.mlb.com/video/shuffle-drill | Further learning reference; no footage reused |

YouTube's license guidance distinguishes ordinary uploads from explicitly CC BY
licensed reuse: https://support.google.com/youtube/answer/2797468?hl=en.
No reusable third-party video license was relied on for this release.

## Files and regeneration

`lib/drill-guides.json` is the shared caption/transcript source. Each ID maps to
`public/drills/v1/<id>.mp4`, `.jpg`, `.vtt`, and `-thumb.jpg`.

To regenerate, install Pillow and FFmpeg, then run:

```sh
python scripts/render-drill-guides.py
```

Use `--id tee-contact` for one guide or `--posters-only` for all still previews.
Assets are prebuilt and checked in; web deployment does not need Python/FFmpeg.
When revising published media, bump the media directory version and app source
path together so browsers and CDN caches cannot retain old video/caption pairs.

## Product behavior

- Cards load only thumbnail images. Video appears on an explicit Watch action;
  playback requires a Play action. No autoplay, external requests, or tracking.
- Web player has native controls/full screen, explicit pause/replay, 0.5× speed,
  burned-in captions, an English WebVTT track, and a readable transcript.
- Closing the guide unmounts and pauses playback. Failed media leaves the poster,
  transcript, equipment/practice guidance, and safety copy available.
- Guides are available in Training and in both practice setup and active sessions.
  Watching does not create practice records or earn points.
- Native builds open the first-party MP4 in the device's supported player;
  transcript and preview remain in the app. This is not an inline native player.
- Soft-toss safety copy now explicitly keeps helpers outside the swing and ball
  path. Existing rest and supervision guidance remains in place.

## Verification

The browser suite covers all six videos on desktop and phone viewports: lazy
loading, duration, actual playback, slow motion, pause, replay, closing, viewport
fit, zero practice credit, network-failure fallback, and nested practice dialogs.
Phone emulation is not physical iPhone or Safari QA.
