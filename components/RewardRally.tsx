import React, { useEffect, useRef, useState } from "react";
import {
  AccessibilityInfo,
  Animated,
  ImageBackground,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
  type ViewStyle,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  Star,
  Gamepad2,
  Utensils,
  Target,
  Trees,
  IceCreamBowl,
} from "lucide-react-native";
import { useRewardGoal } from "../lib/reward-goal";
import { useStore } from "../lib/store";
import { Button, C, S } from "./ui";

export const rewardRallyArt = require("../assets/editorial/reward-rally.jpg");
export const REWARD_COLORS = [
  C.violet,
  "#FFD3AC",
  C.electric,
  "#A8E3D7",
  "#FFC9D7",
  "#BBD7FF",
];
export function PointsPill({ points }: { points: number }) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 7,
        borderRadius: 24,
        backgroundColor: C.electric,
        paddingHorizontal: 14,
        paddingVertical: 10,
      }}
    >
      <Star size={17} color={C.navy} fill={C.navy} />
      <Text style={[S.h3, { fontSize: 14 }]}>{points} pts</Text>
    </View>
  );
}
export function RallyHero({
  title,
  subtitle,
  children,
  style,
}: React.PropsWithChildren<{
  title: string;
  subtitle: string;
  style?: ViewStyle;
}>) {
  const wide = useWindowDimensions().width >= 850;
  return (
    <View
      style={[
        {
          backgroundColor: C.navy,
          borderRadius: 26,
          overflow: "hidden",
          minHeight: wide ? 340 : 246,
        },
        style,
      ]}
    >
      <ImageBackground
        source={rewardRallyArt}
        accessible={false}
        testID="reward-rally-art"
        resizeMode="cover"
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          bottom: 0,
          width: "100%",
        }}
        imageStyle={{ width: "100%", height: "100%" }}
      />
      <LinearGradient
        colors={["rgba(9,37,28,.97)", "rgba(9,37,28,.77)", "rgba(9,37,28,.03)"]}
        locations={[0, 0.46, 1]}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={StyleSheet.absoluteFill}
      />
      <View
        style={{
          padding: wide ? 30 : 20,
          gap: wide ? 17 : 12,
          flex: 1,
          justifyContent: "space-between",
        }}
      >
        <Text style={[S.eyebrow, { color: C.electric }]}>{subtitle}</Text>
        <Text
          style={[
            S.display,
            {
              color: C.white,
              fontSize: wide ? 68 : 40,
              lineHeight: wide ? 63 : 40,
              maxWidth: wide ? "72%" : "88%",
            },
          ]}
        >
          {title}
        </Text>
        <View style={{ maxWidth: wide ? 290 : 240, gap: 10 }}>{children}</View>
      </View>
    </View>
  );
}
export function RewardIcon({
  index,
  size = 76,
}: {
  index: number;
  size?: number;
}) {
  const Icon = [Gamepad2, Utensils, Target, Trees, IceCreamBowl, Gamepad2][
    index % 6
  ];
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.26,
        backgroundColor: REWARD_COLORS[index % 6],
        borderWidth: 2,
        borderColor: "#FFFFFF88",
        alignItems: "center",
        justifyContent: "center",
        transform: [{ rotate: "-7deg" }],
      }}
    >
      <Icon size={size * 0.52} strokeWidth={1.8} color={C.navy} />
      <Star
        size={size * 0.22}
        fill={C.white}
        color={C.white}
        style={{ position: "absolute", right: -5, top: -5 }}
      />
    </View>
  );
}
export function RewardMeter({
  value,
  label,
  dark = false,
}: {
  value: number;
  label: string;
  dark?: boolean;
}) {
  return (
    <View
      accessibilityRole="progressbar"
      accessibilityLabel={label}
      accessibilityValue={{
        min: 0,
        max: 100,
        now: Math.round(value * 100),
        text: label,
      }}
      style={{
        height: 13,
        backgroundColor: dark ? "#345047" : "#DCE3CF",
        borderRadius: 8,
        overflow: "hidden",
      }}
    >
      <View
        style={{
          width: `${Math.max(0, Math.min(1, value)) * 100}%`,
          height: "100%",
          backgroundColor: dark ? C.electric : C.green,
          borderRadius: 8,
        }}
      />
    </View>
  );
}
export function RewardGoalCard({
  compact = false,
  onRewards,
}: {
  compact?: boolean;
  onRewards?: () => void;
}) {
  const goal = useRewardGoal();
  const points = useStore((s) => s.totalPoints);
  const headline =
    goal.status === "pending"
      ? "PARENT, YOU’RE UP!"
      : goal.status === "approved"
        ? "IT’S A YES!"
        : goal.ready
          ? "READY TO REQUEST!"
          : "YOU’RE PLAYING FOR";
  return (
    <View
      testID="reward-goal"
      style={{
        borderRadius: 24,
        backgroundColor: "#F2EDFF",
        borderWidth: 2,
        borderColor: "#D8CCFF",
        padding: compact ? 18 : 24,
        gap: 15,
        flex: compact ? undefined : 1,
      }}
    >
      <View style={[S.between, { flexWrap: "nowrap", gap: 12 }]}>
        <View style={{ flex: 1, gap: 8 }}>
          <Text style={[S.eyebrow, { color: "#5D4282", fontSize: 9 }]}>
            {headline}
          </Text>
          <Text style={[S.h2, { fontSize: compact ? 18 : 23 }]}>
            {goal.reward.name}
          </Text>
        </View>
        <RewardIcon index={goal.index} size={compact ? 48 : 64} />
      </View>
      <RewardMeter
        value={goal.progress}
        label={`${Math.round(goal.progress * 100)} percent toward ${goal.reward.name}`}
      />
      <View style={S.between}>
        <Text style={[S.h3, { fontSize: 14 }]}>
          {goal.status === "pending"
            ? "Points reserved"
            : goal.status === "approved"
              ? "Parent approved"
              : `${Math.min(points, goal.reward.cost)} / ${goal.reward.cost} points`}
        </Text>
        <Text style={[S.small, { color: "#5D4282", fontWeight: "800" }]}>
          {goal.status === "pending"
            ? "Waiting for parent"
            : goal.status === "approved"
              ? "Enjoy it together"
              : goal.ready
                ? "You have enough!"
                : `${goal.daysLeft} practice ${goal.daysLeft === 1 ? "day" : "days"} to go`}
        </Text>
      </View>
      {onRewards ? (
        <Button
          secondary
          title={
            goal.status === "pending"
              ? "View reward request"
              : goal.status === "approved"
                ? "Pick your next reward"
                : goal.ready
                  ? "Request your reward"
                  : "Choose my reward"
          }
          onPress={onRewards}
        />
      ) : null}
      {!compact ? (
        <Text style={S.small}>
          10 points per practice day. Your parent approves and arranges the
          reward.
        </Text>
      ) : null}
    </View>
  );
}

// One short celebration, never a loop. Motion preferences apply on web and native.
export function VictoryBurst() {
  const [reduced, setReduced] = useState(true);
  const progress = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    let mounted = true;
    AccessibilityInfo.isReduceMotionEnabled()
      .then((v) => {
        if (mounted) setReduced(v);
      })
      .catch(() => {});
    const subscription = AccessibilityInfo.addEventListener(
      "reduceMotionChanged",
      setReduced,
    );
    return () => {
      mounted = false;
      subscription.remove();
    };
  }, []);
  useEffect(() => {
    if (reduced) {
      progress.setValue(1);
      return;
    }
    progress.setValue(0);
    const animation = Animated.timing(progress, {
      toValue: 1,
      duration: 1800,
      useNativeDriver: true,
    });
    animation.start();
    return () => animation.stop();
  }, [reduced, progress]);
  return (
    <View
      testID={reduced ? "celebration-still" : "celebration-motion"}
      pointerEvents="none"
      accessible={false}
      style={{
        height: 90,
        width: "100%",
        maxWidth: 360,
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      {Array.from({ length: 14 }, (_, i) => (
        <Animated.View
          key={i}
          style={{
            position: "absolute",
            left: `${5 + i * 6.5}%`,
            top: 14 + (i % 4) * 20,
            width: 8,
            height: 13,
            borderRadius: 2,
            backgroundColor: [C.electric, C.coral, C.violet][i % 3],
            transform: [
              { rotate: `${i * 31}deg` },
              {
                translateY: reduced
                  ? 0
                  : progress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [-70, 0],
                    }),
              },
            ],
            opacity: reduced ? 0.75 : progress,
          }}
        />
      ))}
      <View
        style={{
          backgroundColor: C.electric,
          width: 86,
          height: 86,
          borderRadius: 28,
          alignItems: "center",
          justifyContent: "center",
          transform: [{ rotate: "-8deg" }],
        }}
      >
        <Star size={50} fill={C.navy} color={C.navy} />
      </View>
    </View>
  );
}
