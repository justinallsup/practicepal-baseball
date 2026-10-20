import React, { useState } from "react";
import { View, Text, useWindowDimensions } from "react-native";
import { router } from "expo-router";
import { Check, Gift, Star } from "lucide-react-native";
import { useStore } from "../../lib/store";
import { REWARDS } from "../../lib/progress";
import { useRewardGoal } from "../../lib/reward-goal";
import { Screen, Heading, Card, Button, C, D, S } from "../../components/ui";
import {
  RallyHero,
  RewardGoalCard,
  RewardIcon,
  RewardMeter,
  REWARD_COLORS,
} from "../../components/RewardRally";

export default function Rewards() {
  const points = useStore((s) => s.totalPoints),
    requests = useStore((s) => s.redemptionRequests);
  const reward = useStore((s) => s.reward),
    logs = useStore((s) => s.logs);
  const goal = useRewardGoal(),
    wide = useWindowDimensions().width >= 850;
  const rewardProgress = useStore((s) => s.getRewardProgress)();
  const [message, setMessage] = useState("");
  return (
    <Screen>
      <Heading
        eyebrow="THE REWARD CLUB"
        title="Put your points to play."
        detail="Pick your favorite. Put in the practice. Look forward to the fun."
      />
      <View
        testID="rewards-overview"
        style={[S.grid, { alignItems: "stretch" }]}
      >
        <RallyHero
          title={`${points}\nPOINTS TO PLAY.`}
          subtitle="EARNED BY YOU"
          style={{
            flex: wide ? 1.5 : undefined,
            width: wide ? undefined : "100%",
            minHeight: wide ? 300 : 246,
          }}
        >
          <Text style={[S.h3, S.white]}>{points} points to use</Text>
          <Text style={[S.small, S.light]}>
            10 points each practice day. Parents approve and arrange all
            rewards.
          </Text>
        </RallyHero>
        <View
          style={{
            flex: wide ? 1 : undefined,
            width: wide ? undefined : "100%",
          }}
        >
          <RewardGoalCard compact />
        </View>
      </View>
      {message ? (
        <Text
          role="status"
          style={[S.body, { color: C.green, fontWeight: "700" }]}
        >
          {message}
        </Text>
      ) : null}
      <View style={{ gap: 5 }}>
        <Text style={S.eyebrow}>PICK SOMETHING WORTH PLAYING FOR</Text>
        <Text style={S.h2}>Your reward lineup</Text>
      </View>
      <View style={S.grid}>
        {REWARDS.map((r, i) => {
          const pending = requests.some(
            (q) => q.itemName === r.name && q.status === "pending",
          );
          const selected =
            goal.reward.name === r.name && goal.status !== "approved";
          const remaining = Math.max(0, r.cost - points);
          return (
            <Card
              key={r.name}
              style={{
                flexGrow: 1,
                flexBasis: wide ? "30%" : "44%",
                minWidth: 250,
                padding: 0,
                overflow: "hidden",
                borderWidth: selected ? 2 : 1,
                borderColor: selected ? C.navy : C.line,
              }}
            >
              <View
                style={{
                  padding: 22,
                  backgroundColor: REWARD_COLORS[i],
                  gap: 24,
                  minHeight: 165,
                }}
              >
                <View style={S.between}>
                  <Text style={[S.eyebrow, { color: C.navy, fontSize: 9 }]}>
                    {
                      [
                        "YOUR CALL",
                        "GOOD EATS",
                        "MORE BASEBALL",
                        "GO EXPLORE",
                        "SWEET VICTORY",
                        "LEVEL UP YOUR DOWNTIME",
                      ][i]
                    }
                  </Text>
                  {selected ? (
                    <Check size={18} color={C.navy} />
                  ) : (
                    <Star size={18} color={C.navy} />
                  )}
                </View>
                <View style={S.between}>
                  <RewardIcon index={i} size={66} />
                  <View style={{ alignItems: "flex-end" }}>
                    <Text
                      style={{
                        fontFamily: D,
                        fontSize: 58,
                        lineHeight: 60,
                        color: C.navy,
                        fontWeight: "700",
                      }}
                    >
                      {r.cost}
                    </Text>
                    <Text style={[S.eyebrow, { color: C.navy }]}>POINTS</Text>
                  </View>
                </View>
              </View>
              <View style={{ padding: 20, gap: 14, flex: 1 }}>
                <Text style={[S.h2, { fontSize: 21 }]}>{r.name}</Text>
                <Text style={S.body}>{r.detail}</Text>
                <View style={{ flex: 1 }} />
                <RewardMeter
                  value={pending ? 1 : Math.min(points / r.cost, 1)}
                  label={`Progress toward ${r.name}`}
                />
                <Text style={[S.small, { fontWeight: "800", color: C.green }]}>
                  {pending
                    ? "Points reserved · parent’s turn"
                    : remaining
                      ? `${remaining} more points · ${Math.ceil(remaining / 10)} practice days`
                      : "You’ve got the points. Ask your parent!"}
                </Text>
                <Button
                  secondary
                  title={selected ? "Your current goal" : "Make this my goal"}
                  accessibilityLabel={`Set goal: ${r.name}`}
                  disabled={selected || pending}
                  onPress={() => {
                    useStore.getState().setRewardGoal(r.name);
                    setMessage(
                      `You’re playing for: ${r.name}. Choosing a goal doesn’t spend points.`,
                    );
                  }}
                />
                {pending || !remaining ? (
                  <Button
                    title={
                      pending
                        ? "Awaiting parent approval"
                        : "Ask parent for this reward"
                    }
                    accessibilityLabel={
                      pending
                        ? `Awaiting parent approval: ${r.name}`
                        : `Request: ${r.name}`
                    }
                    disabled={pending}
                    onPress={() => {
                      useStore.getState().requestRedemption(r.name, r.cost);
                      setMessage(
                        "Request sent to Parent on this device. Points are reserved until a parent decides.",
                      );
                    }}
                  />
                ) : null}
              </View>
            </Card>
          );
        })}
      </View>
      <Button
        title="Let’s go practice"
        onPress={() => router.push("/(home)")}
      />
      {reward ? (
        <Card style={{ backgroundColor: "#FFF0D5" }}>
          <Gift color={C.gold} size={30} />
          <Text style={S.eyebrow}>YOUR FAMILY BONUS GOAL</Text>
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
      ) : null}
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
                      fontWeight: "800",
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
            Your first reward story starts here. Pick a goal and go have some
            fun.
          </Text>
        )}
      </Card>
      <Text style={S.small}>
        Family rewards have no cash value. Choosing a goal is free; requesting a
        reward reserves its points until your parent decides.
      </Text>
    </Screen>
  );
}
