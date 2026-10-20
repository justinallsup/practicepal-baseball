import { describe, it, expect } from "vitest";
import { rewardGoalState } from "../lib/reward-goal";
import type { RedemptionRequest } from "../lib/store";
const request: RedemptionRequest = {
  id: "request-1",
  itemName: "Pick a favorite treat",
  pointCost: 20,
  status: "pending",
  requestedAt: "2026-10-20T12:00:00Z",
};
describe("reward progress", () => {
  it("shows days and readiness from available points, not lifetime points", () => {
    expect(rewardGoalState(request.itemName, 10, [], null)).toMatchObject({
      remaining: 10,
      daysLeft: 1,
      progress: 0.5,
      ready: false,
    });
    expect(rewardGoalState(request.itemName, 20, [], null)).toMatchObject({
      remaining: 0,
      daysLeft: 0,
      progress: 1,
      ready: true,
    });
  });
  it("shows a pending request as reserved instead of losing reward progress", () => {
    expect(
      rewardGoalState(request.itemName, 0, [request], request.id),
    ).toMatchObject({ status: "pending", progress: 1, ready: false });
  });
  it("shows approval only for the tracked request and returns refunded goals to saving", () => {
    expect(
      rewardGoalState(
        request.itemName,
        0,
        [{ ...request, status: "approved" }],
        request.id,
      ).status,
    ).toBe("approved");
    expect(
      rewardGoalState(
        request.itemName,
        0,
        [{ ...request, status: "approved" }],
        null,
      ).status,
    ).toBe("saving");
    expect(
      rewardGoalState(
        request.itemName,
        20,
        [{ ...request, status: "denied" }],
        request.id,
      ),
    ).toMatchObject({ status: "saving", ready: true, progress: 1 });
  });
});
