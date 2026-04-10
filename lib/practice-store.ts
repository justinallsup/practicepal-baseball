/**
 * Practice Session Store Extension
 * Adds practice flow state management to the main store
 */

import {
  PracticeSession,
  PracticeSettings,
  PracticeStats,
  PracticeDuration,
  PRACTICE_CHALLENGES,
  getRandomEncouragement,
  calculateProgress,
  getNextMilestone,
} from './practice-types'

export interface PracticeStoreState {
  // Practice state
  practiceSessions: PracticeSession[]
  practiceSettings: Record<string, PracticeSettings> // keyed by childId
  practiceStats: Record<string, PracticeStats> // keyed by childId
  activePracticeSessionId: string | null

  // Practice actions
  startPracticeSession: (
    childId: string,
    durationMinutes: PracticeDuration,
    challengeId?: string,
    drillIds?: string[]
  ) => PracticeSession

  updatePracticeSession: (sessionId: string, updates: Partial<PracticeSession>) => void

  finishPracticeSession: (
    sessionId: string,
    earlyFinish?: boolean
  ) => { stats: PracticeStats; pointsEarned: number } | null

  cancelPracticeSession: (sessionId: string) => void

  updatePracticeElapsed: (sessionId: string, elapsedSeconds: number) => void

  checkMilestoneEncouragement: (sessionId: string) => {
    shouldShow: boolean
    message: string
    milestone: number
  } | null

  // Selectors
  getActivePracticeSession: (childId: string) => PracticeSession | undefined
  getTodaysPracticeSession: (childId: string) => PracticeSession | undefined
  getPracticeSettings: (childId: string) => PracticeSettings
  updatePracticeSettings: (childId: string, settings: Partial<PracticeSettings>) => void
  getPracticeStats: (childId: string) => PracticeStats
  hasPracticedToday: (childId: string) => boolean
}

export const practiceStoreSlice = (set: any, get: any): PracticeStoreState => ({
  practiceSessions: [],
  practiceSettings: {},
  practiceStats: {},
  activePracticeSessionId: null,

  startPracticeSession: (childId, durationMinutes, challengeId, drillIds) => {
    const session: PracticeSession = {
      id: Date.now().toString() + Math.random(),
      childId,
      state: 'in_progress',
      startedAt: new Date().toISOString(),
      durationMinutes,
      elapsedSeconds: 0,
      selectedChallenge: challengeId,
      selectedDrills: drillIds || [],
      encouragementShown: [],
      completedChallenge: false,
    }
    set((state: any) => ({
      practiceSessions: [...state.practiceSessions, session],
      activePracticeSessionId: session.id,
    }))
    return session
  },

  updatePracticeSession: (sessionId, updates) => {
    set((state: any) => ({
      practiceSessions: state.practiceSessions.map((s: PracticeSession) =>
        s.id === sessionId ? { ...s, ...updates } : s
      ),
    }))
  },

  finishPracticeSession: (sessionId, earlyFinish = false) => {
    const state = get()
    const session = state.practiceSessions.find((s: PracticeSession) => s.id === sessionId)
    if (!session) return null

    const settings = get().getPracticeSettings(session.childId)
    const shouldCount = !earlyFinish || settings.earlyFinishBehavior !== 'do_not_count'

    if (!shouldCount) {
      get().updatePracticeSession(sessionId, {
        state: 'early_finish',
        completedAt: new Date().toISOString(),
      })
      set({ activePracticeSessionId: null })
      return null
    }

    const completionState =
      earlyFinish && settings.earlyFinishBehavior === 'count_partial' ? 'partial' : 'completed'

    get().updatePracticeSession(sessionId, {
      state: completionState,
      completedAt: new Date().toISOString(),
      completedChallenge: session.selectedChallenge ? true : false,
    })

    // Update stats
    const stats = get().getPracticeStats(session.childId)
    const durationMinutes = session.elapsedSeconds
      ? Math.round(session.elapsedSeconds / 60)
      : session.durationMinutes

    const today = new Date().toDateString()
    const lastPracticeDate = stats.lastPracticeDate
      ? new Date(stats.lastPracticeDate).toDateString()
      : null
    const yesterday = new Date(Date.now() - 86400000).toDateString()

    let newStreak = stats.currentStreak
    if (!lastPracticeDate || lastPracticeDate === today) {
      newStreak = stats.currentStreak || 1
    } else if (lastPracticeDate === yesterday) {
      newStreak = stats.currentStreak + 1
    } else {
      newStreak = 1
    }

    const updatedStats: PracticeStats = {
      ...stats,
      totalSessions: stats.totalSessions + 1,
      totalMinutes: stats.totalMinutes + durationMinutes,
      currentStreak: newStreak,
      longestStreak: Math.max(stats.longestStreak, newStreak),
      challengesCompleted: stats.challengesCompleted + (session.completedChallenge ? 1 : 0),
      lastPracticeDate: new Date().toISOString(),
    }

    set((state: any) => ({
      practiceStats: {
        ...state.practiceStats,
        [session.childId]: updatedStats,
      },
      activePracticeSessionId: null,
    }))

    // Calculate points earned (base 10 + bonus for challenge)
    const pointsEarned = 10 + (session.completedChallenge ? 5 : 0)

    // Log practice in the main system
    get().logPractice(session.selectedDrills || [])

    return { stats: updatedStats, pointsEarned }
  },

  cancelPracticeSession: (sessionId) => {
    set((state: any) => ({
      practiceSessions: state.practiceSessions.filter((s: PracticeSession) => s.id !== sessionId),
      activePracticeSessionId: null,
    }))
  },

  updatePracticeElapsed: (sessionId, elapsedSeconds) => {
    get().updatePracticeSession(sessionId, { elapsedSeconds })
  },

  checkMilestoneEncouragement: (sessionId) => {
    const state = get()
    const session = state.practiceSessions.find((s: PracticeSession) => s.id === sessionId)
    if (!session || !session.elapsedSeconds) return null

    const settings = get().getPracticeSettings(session.childId)
    if (!settings.encouragementEnabled) return null

    const progress = calculateProgress(session.elapsedSeconds, session.durationMinutes)
    const milestone = getNextMilestone(progress, session.encouragementShown)

    if (milestone !== null) {
      const message = getRandomEncouragement(milestone)
      get().updatePracticeSession(sessionId, {
        encouragementShown: [...session.encouragementShown, milestone],
      })
      return { shouldShow: true, message, milestone }
    }

    return null
  },

  getActivePracticeSession: (childId) => {
    const state = get()
    return state.practiceSessions.find(
      (s: PracticeSession) => s.childId === childId && s.state === 'in_progress'
    )
  },

  getTodaysPracticeSession: (childId) => {
    const state = get()
    const today = new Date().toDateString()
    return state.practiceSessions.find(
      (s: PracticeSession) =>
        s.childId === childId &&
        s.completedAt &&
        new Date(s.completedAt).toDateString() === today &&
        (s.state === 'completed' || s.state === 'partial')
    )
  },

  getPracticeSettings: (childId) => {
    const state = get()
    return (
      state.practiceSettings[childId] || {
        childId,
        defaultDuration: 15,
        earlyFinishBehavior: 'count_full',
        soundEnabled: true,
        encouragementEnabled: true,
      }
    )
  },

  updatePracticeSettings: (childId, settings) => {
    set((state: any) => ({
      practiceSettings: {
        ...state.practiceSettings,
        [childId]: {
          ...get().getPracticeSettings(childId),
          ...settings,
        },
      },
    }))
  },

  getPracticeStats: (childId) => {
    const state = get()
    return (
      state.practiceStats[childId] || {
        childId,
        totalSessions: 0,
        totalMinutes: 0,
        currentStreak: 0,
        longestStreak: 0,
        challengesCompleted: 0,
      }
    )
  },

  hasPracticedToday: (childId) => {
    return get().getTodaysPracticeSession(childId) !== undefined
  },
})
