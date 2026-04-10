import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { Platform } from 'react-native'
import { getToday, getWeekDates, dateFromString } from './utils'

export type PracticeType = 'Pitching' | 'Hitting' | 'Fielding'

export type RewardTargetType = 'weekly_goal' | 'streak_goal'

export interface Reward {
  id: string
  childName: string // denormalized for display
  rewardName: string
  targetType: RewardTargetType
  targetValue: number // e.g. 5 (days streak) or 1 (complete weekly goal)
  earnedAt: string | null // ISO if earned, null if not yet
}

export interface Child {
  id: string
  name: string
  avatar: string // emoji
  goalPerWeek: 3 | 4 | 5 | 7
}

export interface PracticeLog {
  id: string
  childId: string
  date: string // YYYY-MM-DD
  types: PracticeType[]
  loggedAt: string // ISO
  feeling?: 'easy' | 'solid' | 'hard' | null
}

export interface RedemptionRequest {
  id: string
  itemName: string
  pointCost: number
  status: 'pending' | 'approved' | 'denied'
  requestedAt: string
}

export interface LeaderboardEntry {
  name: string
  practices: number
  isYou: boolean
}

export interface PointsHistoryEntry {
  date: string
  amount: number
  reason: string
}

export interface AppState {
  // Onboarding
  onboardingComplete: boolean

  // Onboarding answers
  practiceFrequency: 'rarely' | '1-2x' | '3x+' | null
  improvementGoals: string[]
  onboardingRewardSuggestion: string | null

  // Child
  child: Child | null

  // Logs
  logs: PracticeLog[]

  // Subscription
  subscriptionStatus: 'free' | 'trial' | 'expired' | 'active'
  trialStartDate: string | null
  trialStartedAt: string | null
  subscriptionPlan: 'monthly' | 'yearly' | null
  totalLogsCount: number

  // Reward
  reward: Reward | null

  // Points economy
  totalPoints: number
  pointsHistory: PointsHistoryEntry[]

  // Mode
  mode: 'parent' | 'kid'

  // Store / redemption requests
  redemptionRequests: RedemptionRequest[]

  // Leaderboard
  leaderboard: LeaderboardEntry[]

  // Invite
  inviteCode: string
  referralCount: number

  // Notifications
  notificationsEnabled: boolean
  notificationHour: number
  hasAskedNotificationPermission: boolean

  // Actions
  completeOnboarding: (child: Child) => void
  logPractice: (types: PracticeType[]) => { alreadyLoggedToday: boolean }
  updateLastLogFeeling: (feeling: 'easy' | 'solid' | 'hard') => void
  getCurrentStreak: () => number
  getBestStreak: () => number
  getWeekLogs: () => PracticeLog[]
  hasLoggedToday: () => boolean
  startTrial: () => void
  activateSubscription: (plan: 'monthly' | 'yearly') => void
  isTrialExpired: () => boolean
  setSubscriptionActive: () => void
  shouldShowPaywall: () => boolean
  reset: () => void
  setReward: (reward: Omit<Reward, 'id' | 'earnedAt'>) => void
  clearReward: () => void
  markRewardEarned: () => void
  getRewardProgress: () => number
  isRewardEarned: () => boolean
  setNotificationsEnabled: (enabled: boolean) => void
  setHasAskedNotificationPermission: (asked: boolean) => void

  // New actions
  setPracticeFrequency: (freq: 'rarely' | '1-2x' | '3x+') => void
  setImprovementGoals: (goals: string[]) => void
  setOnboardingRewardSuggestion: (reward: string) => void
  addPoints: (amount: number, reason: string) => void
  requestRedemption: (itemName: string, pointCost: number) => void
  approveRedemption: (id: string) => void
  denyRedemption: (id: string) => void
  setMode: (mode: 'parent' | 'kid') => void
  refreshLeaderboard: () => void
}

function generateInviteCode(): string {
  return 'BALL' + Math.floor(1000 + Math.random() * 9000)
}

function generateLeaderboard(yourPractices: number): LeaderboardEntry[] {
  const names = ['Jake', 'Tyler', 'Mason', 'Aiden', 'Liam', 'Noah', 'Ethan']
  const others = names
    .map(name => ({
      name,
      practices: Math.max(0, yourPractices + Math.floor(Math.random() * 5) - 2),
      isYou: false,
    }))
    .filter(e => e.practices !== yourPractices)
    .slice(0, 4)

  const you: LeaderboardEntry = {
    name: 'You',
    practices: yourPractices,
    isYou: true,
  }
  const all = [...others, you].sort((a, b) => b.practices - a.practices)
  return all
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      onboardingComplete: false,
      practiceFrequency: null,
      improvementGoals: [],
      onboardingRewardSuggestion: null,
      child: null,
      logs: [],
      subscriptionStatus: 'free',
      trialStartDate: null,
      trialStartedAt: null,
      subscriptionPlan: null,
      totalLogsCount: 0,
      reward: null,
      totalPoints: 0,
      pointsHistory: [],
      mode: 'parent',
      redemptionRequests: [],
      leaderboard: generateLeaderboard(0),
      inviteCode: generateInviteCode(),
      referralCount: 0,
      notificationsEnabled: false,
      notificationHour: 18,
      hasAskedNotificationPermission: false,

      completeOnboarding: (child: Child) => {
        set({ onboardingComplete: true, child })
      },

      logPractice: (types: PracticeType[]) => {
        const state = get()
        const today = getToday()
        const alreadyLogged = state.logs.some(l => l.date === today)
        if (alreadyLogged) {
          return { alreadyLoggedToday: true }
        }
        const childId = state.child?.id ?? ''
        const newLog: PracticeLog = {
          id: Date.now().toString(),
          childId,
          date: today,
          types,
          loggedAt: new Date().toISOString(),
          feeling: null,
        }
        set(s => ({
          logs: [...s.logs, newLog],
          totalLogsCount: s.totalLogsCount + 1,
        }))
        // Add 10 points for logging practice
        get().addPoints(10, 'Practice logged')
        return { alreadyLoggedToday: false }
      },

      updateLastLogFeeling: (feeling: 'easy' | 'solid' | 'hard') => {
        const { logs } = get()
        if (logs.length === 0) return
        const updated = [...logs]
        updated[updated.length - 1] = { ...updated[updated.length - 1], feeling }
        set({ logs: updated })
      },

      hasLoggedToday: () => {
        const { logs } = get()
        const today = getToday()
        return logs.some(l => l.date === today)
      },

      getCurrentStreak: () => {
        const { logs } = get()
        if (logs.length === 0) return 0

        const loggedDates = new Set(logs.map(l => l.date))
        let streak = 0
        const today = new Date()

        for (let i = 0; i < 365; i++) {
          const d = new Date(today)
          d.setDate(today.getDate() - i)
          const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
          if (loggedDates.has(dateStr)) {
            streak++
          } else {
            break
          }
        }
        return streak
      },

      getBestStreak: () => {
        const { logs } = get()
        if (logs.length === 0) return 0

        const loggedDates = Array.from(new Set(logs.map(l => l.date))).sort()
        if (loggedDates.length === 0) return 0

        let best = 1
        let current = 1

        for (let i = 1; i < loggedDates.length; i++) {
          const prev = dateFromString(loggedDates[i - 1])
          const curr = dateFromString(loggedDates[i])
          const diffMs = curr.getTime() - prev.getTime()
          const diffDays = diffMs / (1000 * 60 * 60 * 24)
          if (diffDays === 1) {
            current++
            if (current > best) best = current
          } else {
            current = 1
          }
        }
        return best
      },

      getWeekLogs: () => {
        const { logs } = get()
        const weekDates = getWeekDates()
        return logs.filter(l => weekDates.includes(l.date))
      },

      startTrial: () => {
        const now = new Date().toISOString()
        set({
          subscriptionStatus: 'trial',
          trialStartDate: now,
          trialStartedAt: now,
        })
      },

      activateSubscription: (plan: 'monthly' | 'yearly') => {
        set({
          subscriptionStatus: 'active',
          subscriptionPlan: plan,
        })
      },

      isTrialExpired: () => {
        const { trialStartedAt, subscriptionStatus } = get()
        if (subscriptionStatus === 'active') return false
        if (!trialStartedAt) return false
        const trialStart = new Date(trialStartedAt)
        const expiryDate = new Date(trialStart.getTime() + 3 * 24 * 60 * 60 * 1000)
        return new Date() > expiryDate
      },

      setSubscriptionActive: () => {
        set({ subscriptionStatus: 'active' })
      },

      shouldShowPaywall: () => {
        const { subscriptionStatus, totalLogsCount } = get()
        return subscriptionStatus === 'free' && totalLogsCount >= 3
      },

      reset: () => {
        set({
          onboardingComplete: false,
          practiceFrequency: null,
          improvementGoals: [],
          onboardingRewardSuggestion: null,
          child: null,
          logs: [],
          subscriptionStatus: 'free',
          trialStartDate: null,
          trialStartedAt: null,
          subscriptionPlan: null,
          totalLogsCount: 0,
          reward: null,
          totalPoints: 0,
          pointsHistory: [],
          mode: 'parent',
          redemptionRequests: [],
          leaderboard: generateLeaderboard(0),
          inviteCode: generateInviteCode(),
          referralCount: 0,
          notificationsEnabled: false,
          notificationHour: 18,
          hasAskedNotificationPermission: false,
        })
      },

      setReward: (rewardData: Omit<Reward, 'id' | 'earnedAt'>) => {
        set({
          reward: {
            ...rewardData,
            id: Date.now().toString(),
            earnedAt: null,
          },
        })
      },

      clearReward: () => {
        set({ reward: null })
      },

      markRewardEarned: () => {
        const { reward } = get()
        if (!reward) return
        set({ reward: { ...reward, earnedAt: new Date().toISOString() } })
      },

      getRewardProgress: () => {
        const state = get()
        const { reward } = state
        if (!reward) return 0
        if (reward.targetType === 'streak_goal') {
          return state.getCurrentStreak()
        }
        // weekly_goal: count unique days with logs this week
        const weekLogs = state.getWeekLogs()
        const uniqueDays = new Set(weekLogs.map(l => l.date))
        return uniqueDays.size
      },

      isRewardEarned: () => {
        const { reward } = get()
        return reward?.earnedAt !== null && reward?.earnedAt !== undefined
      },

      setNotificationsEnabled: (enabled: boolean) => {
        set({ notificationsEnabled: enabled })
      },

      setHasAskedNotificationPermission: (asked: boolean) => {
        set({ hasAskedNotificationPermission: asked })
      },

      // New actions
      setPracticeFrequency: (freq: 'rarely' | '1-2x' | '3x+') => {
        set({ practiceFrequency: freq })
      },

      setImprovementGoals: (goals: string[]) => {
        set({ improvementGoals: goals })
      },

      setOnboardingRewardSuggestion: (reward: string) => {
        set({ onboardingRewardSuggestion: reward })
      },

      addPoints: (amount: number, reason: string) => {
        const today = getToday()
        set(s => ({
          totalPoints: s.totalPoints + amount,
          pointsHistory: [
            ...s.pointsHistory,
            { date: today, amount, reason },
          ],
        }))
      },

      requestRedemption: (itemName: string, pointCost: number) => {
        const state = get()
        if (state.totalPoints < pointCost) return
        const id = Date.now().toString()
        set(s => ({
          totalPoints: s.totalPoints - pointCost,
          redemptionRequests: [
            ...s.redemptionRequests,
            {
              id,
              itemName,
              pointCost,
              status: 'pending',
              requestedAt: new Date().toISOString(),
            },
          ],
        }))
      },

      approveRedemption: (id: string) => {
        set(s => ({
          redemptionRequests: s.redemptionRequests.map(r =>
            r.id === id ? { ...r, status: 'approved' } : r
          ),
        }))
      },

      denyRedemption: (id: string) => {
        // Refund points on denial
        const req = get().redemptionRequests.find(r => r.id === id)
        if (req) {
          set(s => ({
            totalPoints: s.totalPoints + req.pointCost,
            redemptionRequests: s.redemptionRequests.map(r =>
              r.id === id ? { ...r, status: 'denied' } : r
            ),
          }))
        }
      },

      setMode: (mode: 'parent' | 'kid') => {
        set({ mode })
      },

      refreshLeaderboard: () => {
        const state = get()
        const weekLogs = state.getWeekLogs()
        const yourPractices = new Set(weekLogs.map(l => l.date)).size
        set({ leaderboard: generateLeaderboard(yourPractices) })
      },
    }),
    {
      name: 'practicepal-storage',
      storage: createJSONStorage(() => {
        if (Platform.OS === 'web') {
          return localStorage
        }
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        return require('@react-native-async-storage/async-storage').default
      }),
    }
  )
)
