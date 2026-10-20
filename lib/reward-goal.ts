import { REWARDS } from "./progress";
import { useStore, type RedemptionRequest } from "./store";

export function rewardGoalState(
  name: string,
  points: number,
  requests: RedemptionRequest[],
  requestId: string | null,
) {
  const reward = REWARDS.find((r) => r.name === name) ?? REWARDS[0];
  const pending = requests.find(
    (r) => r.itemName === reward.name && r.status === "pending",
  );
  const tracked = requests.find(
    (r) => r.id === requestId && r.itemName === reward.name,
  );
  const status = pending
    ? "pending"
    : tracked?.status === "approved"
      ? "approved"
      : "saving";
  const remaining = Math.max(0, reward.cost - points);
  return {
    reward,
    status,
    remaining,
    daysLeft: Math.ceil(remaining / 10),
    progress: status === "saving" ? Math.min(points / reward.cost, 1) : 1,
    ready: status === "saving" && remaining === 0,
    index: REWARDS.indexOf(reward),
  };
}
export function useRewardGoal() {
  const name = useStore((s) => s.rewardGoalName);
  const points = useStore((s) => s.totalPoints);
  const requests = useStore((s) => s.redemptionRequests);
  const requestId = useStore((s) => s.rewardGoalRequestId);
  return rewardGoalState(name, points, requests, requestId);
}
