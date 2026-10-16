import type { PracticeType } from './store'

export interface TrainingDrill {
  id: string
  title: string
  skill: PracticeType | 'Speed'
  minutes: number
  equipment: string
  instructions: string
  safety: string
}

export const TRAINING_DRILLS: TrainingDrill[] = [
  { id: 'tee-contact', title: 'Tee contact ladder', skill: 'Hitting', minutes: 10, equipment: 'Bat, helmet, tee, balls', instructions: 'Take 3 rounds of 8 controlled swings. Reset stance between rounds. Focus on balanced contact, not power.', safety: 'Use a clear hitting area and age-appropriate supervision.' },
  { id: 'soft-toss', title: 'Soft toss rhythm', skill: 'Hitting', minutes: 10, equipment: 'Bat, helmet, soft balls, net', instructions: 'Work through 3 sets of 6 tosses with a trusted adult. Pause and reset after each set.', safety: 'Keep everyone behind the hitter and use a safe net.' },
  { id: 'ground-ball', title: 'Ground-ball fundamentals', skill: 'Fielding', minutes: 12, equipment: 'Glove and soft baseball', instructions: 'Field 3 sets of 8 gentle ground balls. Start in an athletic stance and finish with a controlled throw.', safety: 'Start with gentle rolls on a level surface.' },
  { id: 'catching', title: 'Two-hand catch', skill: 'Fielding', minutes: 8, equipment: 'Glove and soft baseball', instructions: 'Catch 20 comfortable throws, using the throwing hand to secure the ball. Take breaks as needed.', safety: 'Keep throws within the player’s comfort and skill level.' },
  { id: 'target-throws', title: 'Throwing target game', skill: 'Pitching', minutes: 10, equipment: 'Ball and large target', instructions: 'Warm up, then complete 3 rounds of 6 comfortable throws toward a large target. Count accurate throws.', safety: 'Avoid maximum-effort throwing; follow age-appropriate pitch and rest guidance.' },
  { id: 'footwork', title: 'Quick feet and balance', skill: 'Speed', minutes: 8, equipment: 'Four cones', instructions: 'Walk the pattern first, then complete 4 controlled cone-shuffle rounds with rest between rounds.', safety: 'Use a flat, clear surface and stop if uncomfortable.' },
]

export function buildWeeklyPlan(goals: string[], days: number): TrainingDrill[][] {
  const normalized = goals.join(' ').toLowerCase()
  const priority: PracticeType = /pitch|throw/.test(normalized) ? 'Pitching' : /field|catch|glove/.test(normalized) ? 'Fielding' : 'Hitting'
  const first = TRAINING_DRILLS.filter(d => d.skill === priority)
  const others = TRAINING_DRILLS.filter(d => d.skill !== priority)
  const sequence = [...first, ...others]
  return Array.from({ length: Math.max(1, Math.min(7, days)) }, (_, index) => [
    sequence[index % sequence.length],
    sequence[(index + 3) % sequence.length],
  ])
}
