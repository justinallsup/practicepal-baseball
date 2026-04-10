import { Platform } from 'react-native'

// Only import expo-notifications on non-web platforms
// Web guard prevents import.meta crash in Expo web bundles
let Notifications: typeof import('expo-notifications') | null = null
if (Platform.OS !== 'web') {
  try {
    Notifications = require('expo-notifications')
  } catch {}
}

// Configure how notifications appear when app is foregrounded
if (Notifications) {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  })
}

export async function requestNotificationPermission(): Promise<boolean> {
  if (Platform.OS === 'web' || !Notifications) return false
  const { status: existing } = await Notifications.getPermissionsAsync()
  if (existing === 'granted') return true
  const { status } = await Notifications.requestPermissionsAsync()
  return status === 'granted'
}

export async function scheduleStreakReminder(opts: {
  rewardName?: string
  remainingPractices?: number
  currentStreak: number
  hour?: number   // default 18 (6pm)
  minute?: number // default 0
}): Promise<void> {
  if (Platform.OS === 'web' || !Notifications) return

  const { rewardName, remainingPractices, currentStreak, hour = 18, minute = 0 } = opts

  // Cancel existing streak reminders before scheduling new one
  await cancelStreakReminders()

  // Pick best copy
  let title = "Don't break your streak 🔥"
  let body = 'Log practice today and stay on track ⚾'

  if (rewardName && remainingPractices != null && remainingPractices > 0) {
    title = `${remainingPractices} more practice${remainingPractices === 1 ? '' : 's'} to earn ${rewardName} 🎯`
    body = "You're getting close — keep it up ⚾"
  } else if (currentStreak >= 3) {
    title = `Keep your ${currentStreak}-day streak alive 🔥`
    body = 'Log practice today to stay on track 💪'
  }

  await Notifications.scheduleNotificationAsync({
    identifier: 'streak-reminder',
    content: { title, body, data: { type: 'streak_reminder' } },
    trigger: {
      type: (Notifications.SchedulableTriggerInputTypes as any).DAILY,
      hour,
      minute,
    },
  })
}

export async function cancelStreakReminders(): Promise<void> {
  if (Platform.OS === 'web' || !Notifications) return
  try {
    await Notifications.cancelScheduledNotificationAsync('streak-reminder')
  } catch {}
}

export async function sendReEngagementNotification(): Promise<void> {
  if (Platform.OS === 'web' || !Notifications) return
  await Notifications.scheduleNotificationAsync({
    identifier: 're-engagement',
    content: {
      title: "Let's get practice back on track 💪",
      body: 'Jump back in today and start building again ⚾',
      data: { type: 're_engagement' },
    },
    trigger: null, // fire immediately
  })
}

// Day-specific onboarding notifications

export async function scheduleDay1Notification(): Promise<void> {
  if (Platform.OS === 'web' || !Notifications) return
  const trigger = new Date()
  trigger.setDate(trigger.getDate() + 1)
  trigger.setHours(10, 0, 0, 0)
  await Notifications.scheduleNotificationAsync({
    identifier: 'day1-reminder',
    content: {
      title: 'Quick 10-minute session today = progress ⚾',
      body: "Log practice and build the habit — they're counting on you!",
      data: { type: 'day1_reminder' },
    },
    trigger: { date: trigger } as any,
  })
}

export async function scheduleDay2Notification(): Promise<void> {
  if (Platform.OS === 'web' || !Notifications) return
  const trigger = new Date()
  trigger.setDate(trigger.getDate() + 2)
  trigger.setHours(10, 0, 0, 0)
  await Notifications.scheduleNotificationAsync({
    identifier: 'day2-reminder',
    content: {
      title: "They're close to their reward 👀",
      body: 'Keep logging practice to unlock that reward 🎯',
      data: { type: 'day2_reminder' },
    },
    trigger: { date: trigger } as any,
  })
}

export async function scheduleDay3Notification(): Promise<void> {
  if (Platform.OS === 'web' || !Notifications) return
  const trigger = new Date()
  trigger.setDate(trigger.getDate() + 3)
  trigger.setHours(10, 0, 0, 0)
  await Notifications.scheduleNotificationAsync({
    identifier: 'day3-reminder',
    content: {
      title: "Don't lose their progress ⚾",
      body: "Your free trial ends today — keep the momentum going!",
      data: { type: 'day3_reminder' },
    },
    trigger: { date: trigger } as any,
  })
}
