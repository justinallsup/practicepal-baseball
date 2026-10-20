import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  ScrollView,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Timer, Star } from "lucide-react-native";
import { useStore, type PracticeType } from "../lib/store";
import type { PracticeDuration } from "../lib/practice-types";
import { elapsedForSession } from "../lib/session-clock";
import { TRAINING_DRILLS } from "../lib/training-plan";
import { getToday } from "../lib/utils";
import { useRewardGoal } from "../lib/reward-goal";
import { C, S, D, Card, Button, Chip, Heading } from "./ui";
import { RewardGoalCard, RewardMeter, VictoryBurst } from "./RewardRally";
import DrillGuide from "./DrillGuide";

export default function PracticeFlow({
  visible,
  onClose,
  drillIds = [],
}: {
  visible: boolean;
  onClose: () => void;
  drillIds?: string[];
}) {
  const child = useStore((s) => s.child),
    sessions = useStore((s) => s.practiceSessions),
    logs = useStore((s) => s.logs);
  const goal = useRewardGoal(),
    small = useWindowDimensions().width < 600;
  const active = sessions.find(
    (s) => s.childId === child?.id && s.state === "in_progress",
  );
  const doneToday = logs.some((l) => l.date === getToday());
  const [duration, setDuration] = useState<PracticeDuration>(10);
  const [types, setTypes] = useState<PracticeType[]>(["Hitting"]);
  const [elapsed, setElapsed] = useState(0),
    [saved, setSaved] = useState<number | null>(null);
  const [quick, setQuick] = useState(false),
    [details, setDetails] = useState(false),
    [error, setError] = useState("");
  const [feeling, setFeeling] = useState<"easy" | "solid" | "hard" | null>(
    null,
  );
  useEffect(() => {
    if (visible) {
      setSaved(null);
      setQuick(false);
      setDetails(false);
      setError("");
      setTypes(["Hitting"]);
      setFeeling(null);
    }
  }, [visible]);
  useEffect(() => {
    if (!active || !visible) return;
    const tick = () => {
      const seconds = elapsedForSession(active);
      setElapsed(seconds);
      useStore.getState().updatePracticeElapsed(active.id, seconds);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [active?.id, active?.pausedAt, active?.pausedSeconds, visible]);
  const drills = (active?.selectedDrills ?? drillIds)
    .map((id) => TRAINING_DRILLS.find((d) => d.id === id))
    .filter((d): d is NonNullable<typeof d> => !!d);
  const remaining = Math.max(
    0,
    (active?.durationMinutes ?? duration) * 60 - elapsed,
  );
  function start() {
    if (child)
      useStore
        .getState()
        .startPracticeSession(
          child.id,
          duration,
          undefined,
          drillIds.length ? drillIds : types,
        );
  }
  function pause() {
    if (!active) return;
    useStore.getState().updatePracticeSession(
      active.id,
      active.pausedAt
        ? {
            pausedAt: undefined,
            pausedSeconds:
              (active.pausedSeconds ?? 0) +
              (Date.now() - Date.parse(active.pausedAt)) / 1000,
          }
        : { pausedAt: new Date().toISOString() },
    );
  }
  function finish() {
    if (!active) return;
    const seconds = elapsedForSession(active);
    if (seconds < 60) {
      setError(
        "Practice for at least one minute before saving a timed session. You can also cancel it.",
      );
      return;
    }
    useStore.getState().updatePracticeElapsed(active.id, seconds);
    const result = useStore
      .getState()
      .finishPracticeSession(active.id, seconds < active.durationMinutes * 60);
    setSaved(result ? result.pointsEarned : -1);
  }
  function log() {
    const result = useStore.getState().logPractice(types);
    setSaved(result.alreadyLoggedToday ? 0 : 10);
  }
  function goRewards() {
    onClose();
    router.push("/(home)/store");
  }
  if (!visible) return null;
  const drillCards = drills.length ? (
    <Card>
      <Text style={S.eyebrow}>TODAY’S LINEUP</Text>
      {drills.map((d) => (
        <View key={d.id} style={{ gap: 10 }}>
          <Text style={S.h3}>{d.title}</Text>
          <DrillGuide drill={d} compact />
          {details ? (
            <View style={{ gap: 6 }}>
              <Text style={S.body}>{d.instructions}</Text>
              <Text style={S.small}>Bring: {d.equipment}</Text>
              <Text style={S.small}>{d.safety}</Text>
            </View>
          ) : null}
        </View>
      ))}
      <Button
        secondary
        title={details ? "Hide drill details" : "Show drill details"}
        onPress={() => setDetails(!details)}
      />
    </Card>
  ) : null;
  return (
    <Modal visible animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={S.page}>
        <ScrollView
          contentContainerStyle={[
            S.content,
            { maxWidth: 720 },
            small && { padding: 18 },
          ]}
        >
          <View style={S.between}>
            <Text style={S.eyebrow}>
              {saved !== null ? "THE VICTORY LAP" : "LET’S GET AFTER IT"}
            </Text>
            <Button
              title={active ? "Save timer & close" : "Close"}
              secondary
              onPress={onClose}
            />
          </View>
          {saved !== null ? (
            <>
              <View
                style={[
                  S.hero,
                  { alignItems: "center", padding: small ? 20 : 24, gap: 10 },
                ]}
              >
                {saved > 0 ? (
                  <VictoryBurst />
                ) : (
                  <Star size={44} color={C.electric} />
                )}
                <Text
                  role="heading"
                  aria-level={1}
                  style={[
                    S.display,
                    {
                      fontSize: small ? 48 : 66,
                      lineHeight: small ? 48 : 64,
                      color: C.white,
                      textAlign: "center",
                    },
                  ]}
                >
                  {saved > 0
                    ? "YOU SHOWED UP!"
                    : saved === 0
                      ? "NICE WORK!"
                      : "TIME SAVED."}
                </Text>
                {saved > 0 ? (
                  <Text
                    style={{
                      fontFamily: D,
                      fontSize: 64,
                      lineHeight: 70,
                      fontWeight: "700",
                      color: C.electric,
                    }}
                  >
                    +{saved} POINTS
                  </Text>
                ) : null}
                <Text
                  role="status"
                  style={[S.body, { color: "#E1EBD9", textAlign: "center" }]}
                >
                  {saved > 0
                    ? "That’s effort you can be proud of. Your points are in."
                    : saved === 0
                      ? "Practice recorded. You already collected today’s 10 points."
                      : "This early finish did not earn practice credit under your parent’s settings."}
                </Text>
              </View>
              <RewardGoalCard compact />
              <Button
                gold
                title={
                  goal.ready ? "See my reward — it’s ready!" : "See my rewards"
                }
                onPress={goRewards}
              />
              <Text style={[S.body, { textAlign: "center" }]}>
                You’ve put in the work. Grab some water and enjoy the win.
              </Text>
              {saved >= 0 ? (
                <Card>
                  <Text style={S.h3}>
                    How did it feel? <Text style={S.small}>(optional)</Text>
                  </Text>
                  <View style={S.row}>
                    {(["easy", "solid", "hard"] as const).map((f) => (
                      <Chip
                        key={f}
                        title={f[0].toUpperCase() + f.slice(1)}
                        selected={feeling === f}
                        onPress={() => {
                          useStore.getState().updateLastLogFeeling(f);
                          setFeeling(f);
                        }}
                      />
                    ))}
                  </View>
                </Card>
              ) : null}
              <Button
                secondary
                title="Back to today"
                onPress={() => {
                  onClose();
                  router.push("/(home)");
                }}
              />
            </>
          ) : active ? (
            <>
              <Heading
                eyebrow={
                  active.pausedAt
                    ? "TAKE A BREATHER"
                    : remaining === 0
                      ? "YOU PUT IN THE TIME"
                      : "YOU’RE IN PLAY"
                }
                title={
                  active.pausedAt
                    ? "Ready when you are."
                    : remaining === 0
                      ? "Bring it home."
                      : "Make some moves."
                }
              />
              <View style={[S.hero, { alignItems: "center", gap: 12 }]}>
                <Text style={[S.eyebrow, { color: C.electric }]}>
                  {doneToday
                    ? "TODAY’S POINTS ALREADY COLLECTED"
                    : "+10 POINTS FOR TODAY’S PRACTICE"}
                </Text>
                <Text
                  accessibilityLabel="Time remaining"
                  style={{
                    fontFamily: D,
                    fontSize: 100,
                    lineHeight: 112,
                    color: C.white,
                    fontWeight: "800",
                    fontVariant: ["tabular-nums"],
                  }}
                >
                  {Math.floor(remaining / 60)}:
                  {String(remaining % 60).padStart(2, "0")}
                </Text>
                <Text style={[S.body, S.light]}>
                  {active.durationMinutes} minutes ·{" "}
                  {active.pausedAt
                    ? "Paused"
                    : remaining === 0
                      ? "Ready to finish"
                      : "Your pace. Your game."}
                </Text>
                <View style={{ width: "100%" }}>
                  <RewardMeter
                    dark
                    value={elapsed / (active.durationMinutes * 60)}
                    label="Session progress"
                  />
                </View>
              </View>
              {error ? (
                <Text role="alert" style={S.error}>
                  {error}
                </Text>
              ) : null}
              <Button gold title="Finish practice" onPress={finish} />
              <Button
                title={active.pausedAt ? "Resume timer" : "Pause timer"}
                secondary
                onPress={pause}
              />
              <Text style={[S.h3, { textAlign: "center" }]}>
                Playing for: {goal.reward.name}
              </Text>
              {drillCards}
              <Button
                title="Cancel without saving"
                secondary
                onPress={() => {
                  useStore.getState().cancelPracticeSession(active.id);
                  onClose();
                }}
              />
              <Text style={S.small}>
                Pause for breaks. Stop if anything hurts. Your timer stays saved
                on this device.
              </Text>
            </>
          ) : (
            <>
              <Heading
                eyebrow={
                  quick ? "ALREADY PLAYED?" : "YOUR NEXT WIN STARTS HERE"
                }
                title={quick ? "Put it on the board." : "Game on."}
                detail={
                  quick
                    ? "Only log practice you’ve already completed."
                    : "Pick a time, grab your gear, and let’s play."
                }
              />
              <View
                style={{
                  backgroundColor: C.electric,
                  borderRadius: 18,
                  padding: 18,
                  gap: 6,
                }}
              >
                <Text style={S.h3}>
                  {doneToday
                    ? "Today’s 10 points are already yours."
                    : "Today’s practice = 10 points"}
                </Text>
                <Text style={[S.small, { color: C.navy }]}>
                  Your goal: {goal.reward.name}
                </Text>
              </View>
              {!quick ? (
                <View style={{ gap: 12 }}>
                  <Text style={S.h3}>How long have you got?</Text>
                  <View style={S.row}>
                    {([10, 15, 20, 30] as const).map((d) => (
                      <Chip
                        key={d}
                        title={`${d} min`}
                        selected={duration === d}
                        onPress={() => setDuration(d)}
                      />
                    ))}
                  </View>
                </View>
              ) : null}
              {!drillIds.length || quick ? (
                <View style={{ gap: 12 }}>
                  <Text style={S.h3}>What’s your game?</Text>
                  <View style={S.row}>
                    {(["Hitting", "Fielding", "Pitching"] as const).map((t) => (
                      <Chip
                        key={t}
                        title={t === "Pitching" ? "Throwing" : t}
                        selected={types.includes(t)}
                        onPress={() =>
                          setTypes((p) =>
                            p.includes(t)
                              ? p.filter((x) => x !== t)
                              : [...p, t],
                          )
                        }
                      />
                    ))}
                  </View>
                </View>
              ) : null}
              <Button
                gold
                title={quick ? "Save completed practice" : "Start timer"}
                disabled={(quick || !drillIds.length) && types.length === 0}
                onPress={quick ? log : start}
              />
              <Text style={S.small}>
                Clear your space and practice with an adult. Use a helmet for
                hitting and follow your coach’s throwing limits.
              </Text>
              {!quick ? drillCards : null}
              <Button
                title={
                  quick ? "Use a timer instead" : "Already practiced? Quick log"
                }
                secondary
                onPress={() => setQuick(!quick)}
              />
            </>
          )}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}
