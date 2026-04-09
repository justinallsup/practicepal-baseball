import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'
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
}

export interface AppState {
  // Onboarding
  onboardingComplete: boolean

  // Child
  child: Child | null

  // Logs
  logs: PracticeLog[]

  // Subscription
  subscriptionStatus: 'free' | 'trial' | 'active'
  trialStartDate: string | null
  totalLogsCount: number

  // Reward
  reward: Reward | null

  // Actions
  completeOnboarding: (child: Child) => void
  logPractice: (types: PracticeType[]) => { alreadyLoggedToday: boolean }
  getCurrentStreak: () => number
  getBestStreak: () => number
  getWeekLogs: () => PracticeLog[]
  hasLoggedToday: () => boolean
  startTrial: () => void
  setSubscriptionActive: () => void
  shouldShowPaywall: () => boolean
  reset: () => void
  setReward: (reward: Omit<Reward, 'id' | 'earnedAt'>) => void
  clearReward: () => void
  markRewardEarned: () => void
  getRewardProgress: () => number
  isRewardEarned: () => boolean
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      onboardingComplete: false,
      child: null,
      logs: [],
      subscriptionStatus: 'free',
      trialStartDate: null,
      totalLogsCount: 0,
      reward: null,

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
        }
        set(s => ({
          logs: [...s.logs, newLog],
          totalLogsCount: s.totalLogsCount + 1,
        }))
        return { alreadyLoggedToday: false }
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
        set({
          subscriptionStatus: 'trial',
          trialStartDate: new Date().toISOString(),
        })
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
          child: null,
          logs: [],
          subscriptionStatus: 'free',
          trialStartDate: null,
          totalLogsCount: 0,
          reward: null,
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
    }),
    {
      name: 'practicepal-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
)
