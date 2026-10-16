import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Platform } from "react-native";
import { getToday, getWeekDates, dateFromString } from "./utils";
import { practiceStoreSlice, PracticeStoreState } from "./practice-store";
import {
  Benchmark,
  Metric,
  METRICS,
  REWARDS,
  bestStreak,
  currentStreak,
} from "./progress";

export type PracticeType = "Pitching" | "Hitting" | "Fielding";

export type RewardTargetType = "weekly_goal" | "streak_goal";

export interface Reward {
  id: string;
  childName: string; // denormalized for display
  rewardName: string;
  targetType: RewardTargetType;
  targetValue: number; // e.g. 5 (days streak) or 1 (complete weekly goal)
  earnedAt: string | null; // ISO if earned, null if not yet
}

export interface Child {
  id: string;
  name: string;
  avatar: string; // emoji
  goalPerWeek: 3 | 4 | 5 | 7;
}

export interface PracticeLog {
  id: string;
  childId: string;
  date: string; // YYYY-MM-DD
  types: PracticeType[];
  loggedAt: string; // ISO
  feeling?: "easy" | "solid" | "hard" | null;
}

export interface RedemptionRequest {
  id: string;
  itemName: string;
  pointCost: number;
  status: "pending" | "approved" | "denied";
  requestedAt: string;
}

export interface LeaderboardEntry {
  name: string;
  practices: number;
  isYou: boolean;
}

export interface PointsHistoryEntry {
  date: string;
  amount: number;
  reason: string;
}

export interface AppState extends PracticeStoreState {
  benchmarks: Benchmark[];
  addBenchmark: (metric: Metric, value: number, note: string) => boolean;
  removeBenchmark: (id: string) => void;
  updateChild: (updates: Partial<Pick<Child, "name" | "goalPerWeek">>) => void;
  // Onboarding
  onboardingComplete: boolean;

  // Onboarding answers
  practiceFrequency: "rarely" | "1-2x" | "3x+" | null;
  improvementGoals: string[];
  onboardingRewardSuggestion: string | null;

  // Child
  child: Child | null;

  // Logs
  logs: PracticeLog[];

  // Subscription
  subscriptionStatus: "free" | "trial" | "expired" | "active";
  trialStartDate: string | null;
  trialStartedAt: string | null;
  subscriptionPlan: "monthly" | "yearly" | null;
  totalLogsCount: number;

  // Reward
  reward: Reward | null;

  // Points economy
  totalPoints: number;
  pointsHistory: PointsHistoryEntry[];

  // Mode
  mode: "parent" | "kid";

  // Store / redemption requests
  redemptionRequests: RedemptionRequest[];

  // Leaderboard
  leaderboard: LeaderboardEntry[];

  // Invite
  inviteCode: string;
  referralCount: number;

  // Notifications
  notificationsEnabled: boolean;
  notificationHour: number;
  hasAskedNotificationPermission: boolean;

  // Actions
  completeOnboarding: (child: Child) => void;
  logPractice: (types: PracticeType[]) => { alreadyLoggedToday: boolean };
  updateLastLogFeeling: (feeling: "easy" | "solid" | "hard") => void;
  getCurrentStreak: () => number;
  getBestStreak: () => number;
  getWeekLogs: () => PracticeLog[];
  hasLoggedToday: () => boolean;
  startTrial: () => void;
  activateSubscription: (plan: "monthly" | "yearly") => void;
  isTrialExpired: () => boolean;
  setSubscriptionActive: () => void;
  shouldShowPaywall: () => boolean;
  reset: () => void;
  setReward: (reward: Omit<Reward, "id" | "earnedAt">) => void;
  clearReward: () => void;
  markRewardEarned: () => void;
  getRewardProgress: () => number;
  isRewardEarned: () => boolean;
  setNotificationsEnabled: (enabled: boolean) => void;
  setHasAskedNotificationPermission: (asked: boolean) => void;

  // New actions
  setPracticeFrequency: (freq: "rarely" | "1-2x" | "3x+") => void;
  setImprovementGoals: (goals: string[]) => void;
  setOnboardingRewardSuggestion: (reward: string) => void;
  addPoints: (amount: number, reason: string) => void;
  requestRedemption: (itemName: string, pointCost: number) => void;
  approveRedemption: (id: string) => void;
  denyRedemption: (id: string) => void;
  setMode: (mode: "parent" | "kid") => void;
  refreshLeaderboard: () => void;
}

function generateInviteCode(): string {
  return "BALL" + Math.floor(1000 + Math.random() * 9000);
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      benchmarks: [],
      addBenchmark: (metric, value, note) => {
        if (
          !Object.hasOwn(METRICS, metric) ||
          !Number.isInteger(value) ||
          value < 0 ||
          value > METRICS[metric].max
        )
          return false;
        set((s) => ({
          benchmarks: [
            ...s.benchmarks,
            {
              id: Date.now().toString() + Math.random(),
              metric,
              value,
              date: getToday(),
              note: note.trim().slice(0, 160),
            },
          ],
        }));
        return true;
      },
      removeBenchmark: (id) =>
        set((s) => ({ benchmarks: s.benchmarks.filter((b) => b.id !== id) })),
      updateChild: (updates) => {
        const child = get().child;
        if (!child) return;
        const name = updates.name?.trim().slice(0, 30) || child.name;
        const goalPerWeek = [3, 4, 5, 7].includes(updates.goalPerWeek ?? 0)
          ? updates.goalPerWeek!
          : child.goalPerWeek;
        set({ child: { ...child, name, goalPerWeek } });
      },
      onboardingComplete: false,
      practiceFrequency: null,
      improvementGoals: [],
      onboardingRewardSuggestion: null,
      child: null,
      logs: [],
      subscriptionStatus: "free",
      trialStartDate: null,
      trialStartedAt: null,
      subscriptionPlan: null,
      totalLogsCount: 0,
      reward: null,
      totalPoints: 0,
      pointsHistory: [],
      mode: "parent",
      redemptionRequests: [],
      leaderboard: [],
      inviteCode: generateInviteCode(),
      referralCount: 0,
      notificationsEnabled: false,
      notificationHour: 18,
      hasAskedNotificationPermission: false,

      // Merge practice store slice
      ...practiceStoreSlice(set, get),

      completeOnboarding: (child: Child) => {
        set({ onboardingComplete: true, child });
      },

      logPractice: (types: PracticeType[]) => {
        const state = get();
        const today = getToday();
        const alreadyLogged = state.logs.some((l) => l.date === today);
        if (alreadyLogged) {
          return { alreadyLoggedToday: true };
        }
        if (!state.child) return { alreadyLoggedToday: true };
        const childId = state.child.id;
        const newLog: PracticeLog = {
          id: Date.now().toString(),
          childId,
          date: today,
          types: [
            ...new Set(
              types.filter((t) =>
                ["Hitting", "Fielding", "Pitching"].includes(t),
              ),
            ),
          ],
          loggedAt: new Date().toISOString(),
          feeling: null,
        };
        set((s) => ({
          logs: [...s.logs, newLog],
          totalLogsCount: s.totalLogsCount + 1,
        }));
        // Add 10 points for logging practice
        get().addPoints(10, "Practice logged");
        get().markRewardEarned();
        return { alreadyLoggedToday: false };
      },

      updateLastLogFeeling: (feeling: "easy" | "solid" | "hard") => {
        const { logs } = get();
        if (logs.length === 0) return;
        const updated = [...logs];
        updated[updated.length - 1] = {
          ...updated[updated.length - 1],
          feeling,
        };
        set({ logs: updated });
      },

      hasLoggedToday: () => {
        const { logs } = get();
        const today = getToday();
        return logs.some((l) => l.date === today);
      },

      getCurrentStreak: () =>
        currentStreak(
          get().logs.map((l) => l.date),
          getToday(),
        ),
      getBestStreak: () => bestStreak(get().logs.map((l) => l.date)),

      getWeekLogs: () => {
        const { logs } = get();
        const weekDates = getWeekDates();
        return logs.filter((l) => weekDates.includes(l.date));
      },

      // Billing is deliberately unavailable until owner approval and verified entitlements.
      startTrial: () => {},
      activateSubscription: () => {},
      isTrialExpired: () => false,
      setSubscriptionActive: () => {},

      shouldShowPaywall: () => {
        // Until verified native billing is implemented, do not lock families
        // out of practice tracking behind a non-functional purchase screen.
        return false;
      },

      reset: () => {
        set({
          benchmarks: [],
          practiceSessions: [],
          practiceSettings: {},
          practiceStats: {},
          activePracticeSessionId: null,
          onboardingComplete: false,
          practiceFrequency: null,
          improvementGoals: [],
          onboardingRewardSuggestion: null,
          child: null,
          logs: [],
          subscriptionStatus: "free",
          trialStartDate: null,
          trialStartedAt: null,
          subscriptionPlan: null,
          totalLogsCount: 0,
          reward: null,
          totalPoints: 0,
          pointsHistory: [],
          mode: "parent",
          redemptionRequests: [],
          leaderboard: [],
          inviteCode: generateInviteCode(),
          referralCount: 0,
          notificationsEnabled: false,
          notificationHour: 18,
          hasAskedNotificationPermission: false,
        });
      },

      setReward: (rewardData: Omit<Reward, "id" | "earnedAt">) => {
        if (
          !rewardData.rewardName.trim() ||
          !Number.isInteger(rewardData.targetValue) ||
          rewardData.targetValue < 1 ||
          rewardData.targetValue > 7
        )
          return;
        set({
          reward: {
            ...rewardData,
            rewardName: rewardData.rewardName.trim().slice(0, 80),
            id: Date.now().toString(),
            earnedAt: null,
          },
        });
      },

      clearReward: () => {
        set({ reward: null });
      },

      markRewardEarned: () => {
        const { reward } = get();
        if (
          !reward ||
          reward.earnedAt ||
          get().getRewardProgress() < reward.targetValue
        )
          return;
        set({ reward: { ...reward, earnedAt: new Date().toISOString() } });
      },

      getRewardProgress: () => {
        const state = get();
        const { reward } = state;
        if (!reward) return 0;
        if (reward.targetType === "streak_goal") {
          return state.getCurrentStreak();
        }
        // weekly_goal: count unique days with logs this week
        const weekLogs = state.getWeekLogs();
        const uniqueDays = new Set(weekLogs.map((l) => l.date));
        return uniqueDays.size;
      },

      isRewardEarned: () => {
        const { reward } = get();
        return reward?.earnedAt !== null && reward?.earnedAt !== undefined;
      },

      setNotificationsEnabled: (enabled: boolean) => {
        set({ notificationsEnabled: enabled });
      },

      setHasAskedNotificationPermission: (asked: boolean) => {
        set({ hasAskedNotificationPermission: asked });
      },

      // New actions
      setPracticeFrequency: (freq: "rarely" | "1-2x" | "3x+") => {
        set({ practiceFrequency: freq });
      },

      setImprovementGoals: (goals: string[]) => {
        set({ improvementGoals: goals });
      },

      setOnboardingRewardSuggestion: (reward: string) => {
        set({ onboardingRewardSuggestion: reward });
      },

      addPoints: (amount: number, reason: string) => {
        if (!Number.isFinite(amount) || amount <= 0) return;
        const today = getToday();
        set((s) => ({
          totalPoints: s.totalPoints + amount,
          pointsHistory: [...s.pointsHistory, { date: today, amount, reason }],
        }));
      },

      requestRedemption: (itemName: string, pointCost: number) => {
        const state = get();
        if (
          !REWARDS.some((r) => r.name === itemName && r.cost === pointCost) ||
          state.totalPoints < pointCost ||
          state.redemptionRequests.some(
            (r) => r.itemName === itemName && r.status === "pending",
          )
        )
          return;
        const id = Date.now().toString() + Math.random();
        set((s) => ({
          totalPoints: s.totalPoints - pointCost,
          redemptionRequests: [
            ...s.redemptionRequests,
            {
              id,
              itemName,
              pointCost,
              status: "pending",
              requestedAt: new Date().toISOString(),
            },
          ],
        }));
      },

      approveRedemption: (id: string) => {
        set((s) => ({
          redemptionRequests: s.redemptionRequests.map((r) =>
            r.id === id && r.status === "pending"
              ? { ...r, status: "approved" }
              : r,
          ),
        }));
      },

      denyRedemption: (id: string) => {
        // Refund points on denial
        const req = get().redemptionRequests.find((r) => r.id === id);
        if (req?.status === "pending") {
          set((s) => ({
            totalPoints: s.totalPoints + req.pointCost,
            redemptionRequests: s.redemptionRequests.map((r) =>
              r.id === id ? { ...r, status: "denied" } : r,
            ),
          }));
        }
      },

      setMode: (mode: "parent" | "kid") => {
        set({ mode });
      },

      refreshLeaderboard: () => set({ leaderboard: [] }),
    }),
    {
      name: "practicepal-storage",
      version: 1,
      migrate: (persisted: any) => ({
        ...persisted,
        leaderboard: [],
        subscriptionStatus: "free",
        subscriptionPlan: null,
        trialStartedAt: null,
        trialStartDate: null,
        benchmarks: persisted?.benchmarks ?? [],
      }),
      storage: createJSONStorage(() => {
        if (Platform.OS === "web") {
          return typeof localStorage === "undefined"
            ? { getItem: () => null, setItem: () => {}, removeItem: () => {} }
            : localStorage;
        }
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        return require("@react-native-async-storage/async-storage").default;
      }),
    },
  ),
);
