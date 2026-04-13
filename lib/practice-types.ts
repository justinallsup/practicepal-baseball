/**
 * Practice Session Types for Baseball Practice Pal (React Native)
 */

// Sentinel value: when an emoji field equals this, render the bat PNG image instead of a text emoji
export const BAT_IMAGE_SENTINEL = '__BAT_IMAGE__'

export type PracticeSessionState = 
  | 'not_started'
  | 'pre_practice'
  | 'in_progress'
  | 'completed'
  | 'early_finish'
  | 'partial'

export type PracticeDuration = 10 | 15 | 20 | 30 // minutes

export interface PracticeChallenge {
  id: string
  title: string
  description: string
  emoji: string
}

export interface DrillChip {
  id: string
  title: string
  emoji: string
}

export interface PracticeSession {
  id: string
  childId: string
  state: PracticeSessionState
  startedAt?: string // ISO timestamp
  completedAt?: string // ISO timestamp
  durationMinutes: PracticeDuration
  elapsedSeconds?: number
  selectedChallenge?: string // challenge id
  selectedDrills?: string[] // drill chip ids
  encouragementShown: number[] // milestones shown (25, 50, 75)
  completedChallenge: boolean
  pointsEarned?: number
}

export interface PracticeSettings {
  childId: string
  defaultDuration: PracticeDuration
  earlyFinishBehavior: 'count_full' | 'count_partial' | 'do_not_count'
  soundEnabled: boolean
  encouragementEnabled: boolean
}

export interface PracticeStats {
  childId: string
  totalSessions: number
  totalMinutes: number
  currentStreak: number
  longestStreak: number
  challengesCompleted: number
  lastPracticeDate?: string
}

// Predefined challenges
export const PRACTICE_CHALLENGES: PracticeChallenge[] = [
  {
    id: 'throw-25',
    title: 'Throw 25 balls',
    description: 'Practice your throwing accuracy',
    emoji: BAT_IMAGE_SENTINEL,
  },
  {
    id: 'hit-20',
    title: 'Hit 20 balls off tee',
    description: 'Work on your batting stance',
    emoji: BAT_IMAGE_SENTINEL,
  },
  {
    id: 'field-15',
    title: 'Field 15 ground balls',
    description: 'Improve your fielding skills',
    emoji: '🧤',
  },
  {
    id: 'catch-20',
    title: 'Catch 20 good throws',
    description: 'Practice catching fly balls',
    emoji: '🥎',
  },
  {
    id: 'quick-feet-5',
    title: 'Quick feet for 5 minutes',
    description: 'Build speed and agility',
    emoji: '👟',
  },
]

// Predefined drill chips
export const DRILL_CHIPS: DrillChip[] = [
  {
    id: 'throwing',
    title: 'Throwing',
    emoji: BAT_IMAGE_SENTINEL,
  },
  {
    id: 'ground-balls',
    title: 'Ground Balls',
    emoji: '🧤',
  },
  {
    id: 'batting-tee',
    title: 'Batting Tee',
    emoji: BAT_IMAGE_SENTINEL,
  },
  {
    id: 'catching',
    title: 'Catching',
    emoji: '🥎',
  },
  {
    id: 'quick-feet',
    title: 'Quick Feet',
    emoji: '👟',
  },
]

// Encouragement messages by milestone
export const ENCOURAGEMENT_MESSAGES: Record<number, string[]> = {
  25: [
    "Nice! Keep it up! 💪",
    "Great start! You're doing awesome! 🌟",
    "Looking good out there! 🔥",
    "Keep going strong! ⚡",
  ],
  50: [
    "You're on fire! 🔥",
    "Halfway there! You got this! 💪",
    "Amazing work! Keep pushing! 🌟",
    "You're crushing it! ⚾",
  ],
  75: [
    "Almost there! 🎯",
    "Final stretch! You're so close! 🏃",
    "Great hustle! Finish strong! 💪",
    "You're almost done! Keep it up! 🔥",
  ],
}

export function getRandomEncouragement(milestone: number): string {
  const messages = ENCOURAGEMENT_MESSAGES[milestone] || []
  return messages[Math.floor(Math.random() * messages.length)] || "Keep going!"
}

export function calculateProgress(elapsedSeconds: number, durationMinutes: number): number {
  const totalSeconds = durationMinutes * 60
  return Math.min(Math.round((elapsedSeconds / totalSeconds) * 100), 100)
}

export function getNextMilestone(progress: number, shown: number[]): number | null {
  const milestones = [25, 50, 75]
  for (const milestone of milestones) {
    if (progress >= milestone && !shown.includes(milestone)) {
      return milestone
    }
  }
  return null
}
