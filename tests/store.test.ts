import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { useStore } from "../lib/store";
import {
  REWARDS,
  currentStreak,
  bestStreak,
  achievements,
} from "../lib/progress";
import { buildWeeklyPlan } from "../lib/training-plan";
import { elapsedForSession } from "../lib/session-clock";
const child = {
  id: "player",
  name: "Sam",
  avatar: "⚾",
  goalPerWeek: 3 as const,
};
beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date(2026, 9, 16, 12));
  useStore.getState().reset();
  useStore.getState().completeOnboarding(child);
});
afterEach(() => vi.useRealTimers());
describe("practice credit", () => {
  it("awards daily credit once and normalizes legacy drill input", () => {
    const s = useStore.getState();
    s.logPractice(["Hitting", "Hitting", "batting-tee" as any]);
    s.logPractice(["Fielding"]);
    expect(useStore.getState().totalPoints).toBe(10);
    expect(useStore.getState().logs).toHaveLength(1);
    expect(useStore.getState().logs[0].types).toEqual(["Hitting"]);
  });
  it("does not record a playerless practice", () => {
    useStore.getState().reset();
    useStore.getState().logPractice(["Hitting"]);
    expect(useStore.getState().logs).toHaveLength(0);
  });
  it("finishes sessions idempotently and maps drills to skills", () => {
    const s = useStore.getState(),
      session = s.startPracticeSession(child.id, 10, undefined, [
        "tee-contact",
        "ground-ball",
      ]);
    s.updatePracticeElapsed(session.id, 90);
    expect(s.finishPracticeSession(session.id, true)?.pointsEarned).toBe(10);
    expect(s.finishPracticeSession(session.id, true)).toBeNull();
    expect(useStore.getState().practiceStats[child.id].totalSessions).toBe(1);
    expect(useStore.getState().logs[0].types).toEqual(["Hitting", "Fielding"]);
  });
  it("rejects zero-duration sessions and reuses active session", () => {
    const s = useStore.getState(),
      a = s.startPracticeSession(child.id, 15);
    expect(s.startPracticeSession(child.id, 10).id).toBe(a.id);
    expect(s.finishPracticeSession(a.id, true)).toBeNull();
    expect(useStore.getState().totalPoints).toBe(0);
  });
  it("honors do-not-count early finish setting", () => {
    const s = useStore.getState(),
      a = s.startPracticeSession(child.id, 10);
    s.updatePracticeSettings(child.id, { earlyFinishBehavior: "do_not_count" });
    s.updatePracticeElapsed(a.id, 80);
    expect(s.finishPracticeSession(a.id, true)).toBeNull();
    expect(useStore.getState().logs).toHaveLength(0);
  });
  it("does not duplicate daily points for a second timed session", () => {
    const s = useStore.getState();
    s.logPractice(["Hitting"]);
    const a = s.startPracticeSession(child.id, 10);
    s.updatePracticeElapsed(a.id, 90);
    expect(s.finishPracticeSession(a.id, true)?.pointsEarned).toBe(0);
    expect(useStore.getState().totalPoints).toBe(10);
  });
  it("canceling a session never earns credit", () => {
    const s = useStore.getState(),
      a = s.startPracticeSession(child.id, 10);
    s.updatePracticeElapsed(a.id, 600);
    s.cancelPracticeSession(a.id);
    expect(s.finishPracticeSession(a.id)).toBeNull();
    expect(useStore.getState().totalPoints).toBe(0);
  });
});
describe("rewards", () => {
  it("reserves points, blocks duplicate requests, refunds exactly once", () => {
    const s = useStore.getState(),
      r = REWARDS[0];
    s.addPoints(50, "test");
    s.requestRedemption(r.name, r.cost);
    s.requestRedemption(r.name, r.cost);
    expect(useStore.getState().redemptionRequests).toHaveLength(1);
    expect(useStore.getState().totalPoints).toBe(20);
    const id = useStore.getState().redemptionRequests[0].id;
    s.denyRedemption(id);
    s.denyRedemption(id);
    expect(useStore.getState().totalPoints).toBe(50);
  });
  it("cannot refund or change an approved request", () => {
    const s = useStore.getState(),
      r = REWARDS[0];
    s.addPoints(50, "test");
    s.requestRedemption(r.name, r.cost);
    const id = useStore.getState().redemptionRequests[0].id;
    s.approveRedemption(id);
    s.denyRedemption(id);
    expect(useStore.getState().totalPoints).toBe(20);
    expect(useStore.getState().redemptionRequests[0].status).toBe("approved");
  });
  it("rejects invalid price, item and insufficient funds", () => {
    const s = useStore.getState();
    s.requestRedemption("anything", -30);
    s.requestRedemption(REWARDS[0].name, 30);
    expect(useStore.getState().redemptionRequests).toHaveLength(0);
    expect(useStore.getState().totalPoints).toBe(0);
  });
});
describe("privacy and benchmarks", () => {
  it("validates benchmark ranges and whole numbers", () => {
    const s = useStore.getState();
    for (const v of [-1, 11, NaN, 4.5])
      expect(s.addBenchmark("contact", v, "")).toBe(false);
    expect(s.addBenchmark("bad" as any, 5, "")).toBe(false);
    expect(s.addBenchmark("contact", 0, " baseline ")).toBe(true);
    expect(useStore.getState().benchmarks[0].note).toBe("baseline");
  });
  it("resets every player data slice", () => {
    const s = useStore.getState();
    s.logPractice(["Hitting"]);
    s.addBenchmark("contact", 5, "note");
    const a = s.startPracticeSession(child.id, 10);
    s.updatePracticeSettings(child.id, { soundEnabled: false });
    s.updatePracticeElapsed(a.id, 90);
    s.finishPracticeSession(a.id, true);
    s.reset();
    const result = useStore.getState();
    for (const key of [
      "logs",
      "benchmarks",
      "practiceSessions",
      "redemptionRequests",
      "pointsHistory",
    ] as const)
      expect(result[key]).toEqual([]);
    expect(result.practiceStats).toEqual({});
    expect(result.practiceSettings).toEqual({});
    expect(result.activePracticeSessionId).toBeNull();
    expect(result.child).toBeNull();
    expect(result.totalPoints).toBe(0);
  });
  it("cannot activate payments or a trial locally", () => {
    const s = useStore.getState();
    s.activateSubscription("monthly");
    s.startTrial();
    s.setSubscriptionActive();
    expect(useStore.getState().subscriptionStatus).toBe("free");
    expect(s.shouldShowPaywall()).toBe(false);
  });
});
describe("time, training, milestones", () => {
  it("keeps yesterday streak alive and handles DST calendar days", () => {
    expect(currentStreak(["2026-10-14", "2026-10-15"], "2026-10-16")).toBe(2);
    expect(currentStreak(["2026-10-14"], "2026-10-16")).toBe(0);
    expect(
      bestStreak(["2026-03-07", "2026-03-08", "2026-03-09", "2026-03-09"]),
    ).toBe(3);
    expect(bestStreak(["2026-12-31", "2027-01-01"])).toBe(2);
  });
  it("uses elapsed wall time and excludes paused seconds", () => {
    const session = useStore.getState().startPracticeSession(child.id, 10);
    vi.advanceTimersByTime(120000);
    expect(elapsedForSession(session)).toBe(120);
    expect(elapsedForSession({ ...session, pausedSeconds: 30 })).toBe(90);
    expect(
      elapsedForSession({
        ...session,
        pausedAt: new Date(Date.now() - 60000).toISOString(),
      }),
    ).toBe(60);
    vi.advanceTimersByTime(1000000);
    expect(elapsedForSession(session)).toBe(600);
  });
  it("builds deterministic goal-aware bounded plans", () => {
    expect(buildWeeklyPlan(["Throwing"], 3)[0][0].skill).toBe("Pitching");
    expect(buildWeeklyPlan(["Footwork"], 3)[0][0].skill).toBe("Speed");
    expect(buildWeeklyPlan([], 30)).toHaveLength(7);
    expect(buildWeeklyPlan([], NaN)).toHaveLength(3);
    expect(buildWeeklyPlan([], 3)).toEqual(buildWeeklyPlan([], 3));
  });
  it("never earns achievements without recorded evidence", () => {
    expect(achievements([], 3, []).every((a) => !a.earned)).toBe(true);
    useStore.getState().logPractice(["Hitting"]);
    expect(achievements(useStore.getState().logs, 3, [])[0].earned).toBe(true);
  });
});

describe("family goal rewards", () => {
  it("earns an existing parent goal only after enough practice", () => {
    const s = useStore.getState();
    s.setReward({
      childName: "Sam",
      rewardName: "Park trip",
      targetType: "weekly_goal",
      targetValue: 1,
    });
    s.markRewardEarned();
    expect(useStore.getState().reward?.earnedAt).toBeNull();
    s.logPractice(["Hitting"]);
    expect(useStore.getState().reward?.earnedAt).toBeTruthy();
  });
  it("rejects invalid family goal targets", () => {
    useStore
      .getState()
      .setReward({
        childName: "Sam",
        rewardName: "Park trip",
        targetType: "weekly_goal",
        targetValue: 0,
      });
    expect(useStore.getState().reward).toBeNull();
  });
});

describe("chosen reward goals", () => {
  it("lets a player change goals without spending points and rejects unknown rewards", () => {
    const s = useStore.getState();
    s.addPoints(20, "practice");
    s.setRewardGoal("Pick a favorite treat");
    expect(useStore.getState().rewardGoalName).toBe("Pick a favorite treat");
    expect(useStore.getState().totalPoints).toBe(20);
    expect(useStore.getState().redemptionRequests).toEqual([]);
    s.setRewardGoal("Unlisted prize");
    expect(useStore.getState().rewardGoalName).toBe("Pick a favorite treat");
  });
  it("tracks the selected reward request and allows choosing the same goal again after approval", () => {
    const s = useStore.getState();
    s.setRewardGoal("Pick a favorite treat");
    s.addPoints(20, "practice");
    s.requestRedemption("Pick a favorite treat", 20);
    const id = useStore.getState().redemptionRequests[0].id;
    expect(useStore.getState().rewardGoalRequestId).toBe(id);
    s.approveRedemption(id);
    s.setRewardGoal("Pick a favorite treat");
    expect(useStore.getState().rewardGoalRequestId).toBeNull();
    expect(useStore.getState().totalPoints).toBe(0);
    expect(useStore.getState().redemptionRequests[0].status).toBe("approved");
  });
  it("resets the goal and linked request with all other local records", () => {
    useStore.getState().setRewardGoal("Pick a favorite treat");
    useStore.getState().reset();
    expect(useStore.getState().rewardGoalName).toBe(REWARDS[0].name);
    expect(useStore.getState().rewardGoalRequestId).toBeNull();
  });
});
