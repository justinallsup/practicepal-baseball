# PracticePal Baseball ⚾

> Build a consistent practice habit. Track your child's baseball practice in seconds.

A production-ready Expo mobile app that helps parents track their youth baseball player's practice consistency with streak tracking, weekly summaries, and a freemium paywall.

---

## Quick Start

```bash
npm install
npx expo start
```

Scan the QR code with **Expo Go** (iOS/Android) to run immediately.

---

## Project Structure

```
practicepal/
├── app/
│   ├── _layout.tsx          # Root layout with SafeAreaProvider + Stack
│   ├── index.tsx            # Redirect: onboarding or home
│   ├── onboarding/
│   │   ├── _layout.tsx      # Onboarding stack
│   │   ├── welcome.tsx      # Welcome screen (blue gradient)
│   │   ├── add-child.tsx    # Player name + avatar picker
│   │   └── set-goal.tsx     # Weekly practice goal selector
│   └── (home)/
│       ├── _layout.tsx      # Home stack
│       ├── index.tsx        # Home screen — streak, log button, success state
│       ├── weekly.tsx       # Weekly breakdown & progress
│       └── paywall.tsx      # Subscription paywall (3-day free trial)
├── components/
│   ├── StreakBadge.tsx       # 🔥 X-day streak | 🏆 Best: X days
│   ├── WeeklyTracker.tsx    # Mon–Sun practice boxes
│   └── PracticeTypeSelector.tsx  # Pitching / Hitting / Fielding chips
├── lib/
│   ├── store.ts             # Zustand store with AsyncStorage persistence
│   └── utils.ts             # Date helpers: getToday(), getWeekDates(), etc.
└── assets/                  # Icons and splash screen
```

---

## Stack

| Tool | Version | Purpose |
|------|---------|---------|
| Expo SDK | ~54 | Managed workflow |
| React Native | 0.81 | UI framework |
| TypeScript | ~5.9 | Type safety |
| Zustand | ^5 | State management |
| AsyncStorage | ^2 | Local persistence |
| expo-router | ~6 | File-based navigation |
| react-native-reanimated | ~4 | Animations |
| expo-haptics | ~15 | Haptic feedback |

---

## iOS Build (TestFlight)

### Prerequisites

```bash
npm install -g eas-cli
eas login
```

### Development Build

```bash
eas build --platform ios --profile development
```

### Preview / TestFlight

```bash
eas build --platform ios --profile preview
```

Upload to TestFlight in App Store Connect after build completes.

### Production Build

```bash
eas build --platform ios --profile production
```

---

## Submit to App Store

```bash
eas submit --platform ios --profile production
```

Update `eas.json` with your real Apple credentials:
```json
{
  "submit": {
    "production": {
      "ios": {
        "appleId": "your@email.com",
        "ascAppId": "your-app-store-connect-app-id",
        "appleTeamId": "YOUR_TEAM_ID"
      }
    }
  }
}
```

---

## Android Build

```bash
eas build --platform android --profile preview
eas submit --platform android --profile production
```

---

## Environment

No `.env` needed for V1. All data is stored locally via AsyncStorage.

Future integrations can be added via `.env.local`:

```bash
# .env.local (future)
EXPO_PUBLIC_SUPABASE_URL=...
EXPO_PUBLIC_SUPABASE_ANON_KEY=...
EXPO_PUBLIC_REVENUECAT_API_KEY=...
```

---

## Data Model

All state is managed in `lib/store.ts` with Zustand + AsyncStorage persistence:

- **Child**: name, avatar (emoji), weekly practice goal
- **PracticeLog**: date, practice types (Pitching/Hitting/Fielding)
- **Subscription**: free → trial → active
- **Paywall trigger**: after 3 total log sessions

### Key Logic

- **Streak**: counts consecutive days backward from today with at least one log
- **Paywall**: shows when `subscriptionStatus === 'free'` AND `totalLogsCount >= 3`
- **Trial**: sets status to `'trial'` with full app access

---

## Customization

- **Colors**: Edit `#1e40af` (primary blue) in any screen's `StyleSheet`
- **Paywall price**: Update `paywall.tsx` offer card text
- **Practice types**: Edit `TYPES` array in `PracticeTypeSelector.tsx`
- **Goal options**: Edit `GOALS` in `set-goal.tsx`

---

## License

MIT — build something great.
