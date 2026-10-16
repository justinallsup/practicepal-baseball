import type { PracticeLog } from "./store";

export const METRICS = {
  contact: {
    label: "Tee contact",
    unit: "out of 10",
    max: 10,
    instruction:
      "Count solid contacts from 10 controlled tee swings. Keep the same setup each time.",
  },
  fielding: {
    label: "Clean ground balls",
    unit: "out of 10",
    max: 10,
    instruction:
      "Count cleanly fielded balls from 10 gentle rolls on the same surface.",
  },
  accuracy: {
    label: "Target accuracy",
    unit: "out of 10",
    max: 10,
    instruction:
      "Count target hits from 10 comfortable throws. Keep the target and distance consistent; follow your coach’s throwing and rest guidance.",
  },
} as const;
export type Metric = keyof typeof METRICS;
export interface Benchmark {
  id: string;
  metric: Metric;
  value: number;
  date: string;
  note: string;
}
export function dayNumber(value: string): number {
  const [year, month, day] = value.split("-").map(Number);
  return Date.UTC(year, month - 1, day) / 86400000;
}
export function bestStreak(dates: string[]): number {
  const days = [...new Set(dates.map(dayNumber))].sort((a, b) => a - b);
  let best = 0,
    run = 0,
    previous = -Infinity;
  for (const day of days) {
    run = day === previous + 1 ? run + 1 : 1;
    best = Math.max(best, run);
    previous = day;
  }
  return best;
}
export function currentStreak(dates: string[], today: string): number {
  const days = new Set(dates.map(dayNumber));
  let cursor = dayNumber(today);
  if (!days.has(cursor)) cursor--;
  let count = 0;
  while (days.has(cursor)) {
    count++;
    cursor--;
  }
  return count;
}
export function achievements(
  logs: PracticeLog[],
  goal: number,
  weekDates: string[],
) {
  const total = new Set(logs.map((l) => l.date)).size;
  const week = new Set(
    logs.filter((l) => weekDates.includes(l.date)).map((l) => l.date),
  ).size;
  const skills = new Set(logs.flatMap((l) => l.types));
  return [
    {
      title: "First step",
      detail: "Record your first practice day",
      earned: total >= 1,
    },
    {
      title: "Week complete",
      detail: "Meet this week’s practice goal",
      earned: week >= goal,
    },
    {
      title: "Finding a rhythm",
      detail: "Record 10 practice days",
      earned: total >= 10,
    },
    {
      title: "Well rounded",
      detail: "Practice hitting, fielding, and throwing",
      earned: ["Hitting", "Fielding", "Pitching"].every((s) =>
        skills.has(s as any),
      ),
    },
    {
      title: "Showing up",
      detail: "Record 25 practice days",
      earned: total >= 25,
    },
    {
      title: "Long game",
      detail: "Record 50 practice days",
      earned: total >= 50,
    },
  ];
}
export const REWARDS = [
  {
    name: "Choose family game night",
    cost: 30,
    detail: "You pick the game. Everyone plays.",
  },
  { name: "Pick a favorite dinner", cost: 50, detail: "Plan a meal together." },
  {
    name: "Trip to the batting cages",
    cost: 100,
    detail: "A family outing, approved by a parent.",
  },
  {
    name: "Choose a family adventure",
    cost: 150,
    detail: "Make a memory away from the screen.",
  },
];
