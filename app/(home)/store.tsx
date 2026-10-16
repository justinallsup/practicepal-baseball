import React, { useState } from "react";
import { View, Text } from "react-native";
import { Gift, Star } from "lucide-react-native";
import { useStore } from "../../lib/store";
import { REWARDS } from "../../lib/progress";
import { Screen, Heading, Card, Button, C, S } from "../../components/ui";
export default function Rewards() {
  const points = useStore((s) => s.totalPoints),
    requests = useStore((s) => s.redemptionRequests);
  const reward = useStore((s) => s.reward),
    logs = useStore((s) => s.logs);
  const rewardProgress = useStore((s) => s.getRewardProgress)();
  const [message, setMessage] = useState("");
  return (
    <Screen>
      <Heading
        eyebrow="EFFORT WORTH CELEBRATING"
        title="Good habits. Shared rewards."
        detail="Choose something to look forward to. Parents approve every request and arrange the reward."
      />
      <View style={S.hero}>
        <Star color="#E9AF92" size={25} />
        <Text style={[S.title, S.white]}>{points} points to use</Text>
        <Text style={[S.body, S.light]}>
          Each practice day earns 10 points. Points have no cash value. These
          are family rewards, not purchases.
        </Text>
      </View>
      {message ? (
        <Text role="status" style={[S.body, { color: C.green }]}>
          {message}
        </Text>
      ) : null}
      {reward && (
        <Card>
          <Text style={S.eyebrow}>YOUR FAMILY GOAL</Text>
          <Text style={S.h2}>{reward.rewardName}</Text>
          <Text style={S.body}>
            {reward.earnedAt
              ? "Goal reached! Celebrate together and ask your parent to arrange it."
              : `${Math.min(rewardProgress, reward.targetValue)} / ${reward.targetValue} ${reward.targetType === "streak_goal" ? "consecutive practice days" : "practice days this week"}`}
          </Text>
          <Text style={S.small}>
            Chosen by your parent · Separate from point rewards
          </Text>
        </Card>
      )}
      <View style={S.grid}>
        {REWARDS.map((r) => {
          const pending = requests.some(
            (q) => q.itemName === r.name && q.status === "pending",
          );
          return (
            <Card key={r.name} style={{ flex: 1, minWidth: 260 }}>
              <Gift color={C.red} size={28} />
              <Text style={S.eyebrow}>{r.cost} POINTS</Text>
              <Text style={S.h2}>{r.name}</Text>
              <Text style={S.body}>{r.detail}</Text>
              <Button
                title={
                  pending
                    ? "Awaiting parent approval"
                    : points < r.cost
                      ? `${r.cost - points} more points to go`
                      : `Request: ${r.name}`
                }
                disabled={pending || points < r.cost}
                onPress={() => {
                  useStore.getState().requestRedemption(r.name, r.cost);
                  setMessage(
                    "Request sent to Parent on this device. Points are reserved until a parent decides.",
                  );
                }}
              />
            </Card>
          );
        })}
      </View>
      <Card>
        <Text style={S.h2}>Your reward requests</Text>
        {requests.length ? (
          requests
            .slice()
            .reverse()
            .map((r) => (
              <View key={r.id} style={S.between}>
                <View style={{ flex: 1, gap: 4 }}>
                  <Text style={S.h3}>{r.itemName}</Text>
                  <Text style={S.small}>{r.pointCost} points</Text>
                </View>
                <Text
                  style={[
                    S.small,
                    {
                      color: r.status === "approved" ? C.green : C.muted,
                      fontWeight: "700",
                    },
                  ]}
                >
                  {r.status === "pending"
                    ? "Awaiting parent"
                    : r.status === "approved"
                      ? "Approved"
                      : "Declined · refunded"}
                </Text>
              </View>
            ))
        ) : (
          <Text style={S.body}>
            No requests yet. Choose a reward together and start building toward
            it.
          </Text>
        )}
      </Card>
    </Screen>
  );
}
