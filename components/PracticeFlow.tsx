import React, { useState, useEffect } from "react";
import { View, Text, Modal, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Timer, CheckCircle2 } from "lucide-react-native";
import { useStore, type PracticeType } from "../lib/store";
import type { PracticeDuration } from "../lib/practice-types";
import { elapsedForSession } from "../lib/session-clock";
import { TRAINING_DRILLS } from "../lib/training-plan";
import { C, S, Card, Button, Chip, Heading } from "./ui";

export default function PracticeFlow({
  visible,
  onClose,
  drillIds = [],
}: {
  visible: boolean;
  onClose: () => void;
  drillIds?: string[];
}) {
  const child = useStore((s) => s.child);
  const sessions = useStore((s) => s.practiceSessions);
  const active = sessions.find(
    (s) => s.childId === child?.id && s.state === "in_progress",
  );
  const [duration, setDuration] = useState<PracticeDuration>(15);
  const [types, setTypes] = useState<PracticeType[]>(["Hitting"]);
  const [elapsed, setElapsed] = useState(0);
  const [saved, setSaved] = useState<number | null>(null);
  const [quick, setQuick] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    if (visible) {
      setSaved(null);
      setQuick(false);
      setError("");
      setTypes(["Hitting"]);
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
    const now = Date.now();
    useStore
      .getState()
      .updatePracticeSession(
        active.id,
        active.pausedAt
          ? {
              pausedAt: undefined,
              pausedSeconds:
                (active.pausedSeconds ?? 0) +
                (now - Date.parse(active.pausedAt)) / 1000,
            }
          : { pausedAt: new Date(now).toISOString() },
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
    setSaved(result?.pointsEarned ?? 0);
  }
  function log() {
    const result = useStore.getState().logPractice(types);
    setSaved(result.alreadyLoggedToday ? 0 : 10);
  }
  if (!visible) return null;
  return (
    <Modal visible animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={S.page}>
        <ScrollView contentContainerStyle={[S.content, { maxWidth: 720 }]}>
          <View style={S.between}>
            <Text style={S.eyebrow}>PRACTICE TIME</Text>
            <Button
              title={active ? "Save timer & close" : "Close"}
              secondary
              onPress={onClose}
            />
          </View>
          {saved !== null ? (
            <>
              <CheckCircle2 size={50} color={C.green} />
              <Heading
                eyebrow="ANOTHER STEP FORWARD"
                title="Practice recorded."
                detail={
                  saved
                    ? "+10 points for showing up today."
                    : "Today’s practice is saved. Daily points are awarded once."
                }
              />
              <Card>
                <Text style={S.h3}>How did it feel?</Text>
                <View style={S.row}>
                  {(["easy", "solid", "hard"] as const).map((f) => (
                    <Chip
                      key={f}
                      title={f[0].toUpperCase() + f.slice(1)}
                      selected={false}
                      onPress={() => {
                        useStore.getState().updateLastLogFeeling(f);
                        onClose();
                      }}
                    />
                  ))}
                </View>
                <Text style={S.body}>
                  Rest, hydrate, and celebrate the effort. You’re done for today
                  if you want to be.
                </Text>
              </Card>
              <Button title="Back to today" onPress={onClose} />
            </>
          ) : active ? (
            <>
              <Heading
                eyebrow={active.pausedAt ? "PAUSED" : "FOCUS ON THE NEXT REP"}
                title={
                  remaining === 0
                    ? "Time well spent."
                    : "One good rep at a time."
                }
              />
              <View style={[S.hero, { alignItems: "center" }]}>
                <Timer color="#E9AF92" size={30} />
                <Text
                  accessibilityLabel="Time remaining"
                  style={{
                    fontSize: 72,
                    color: C.white,
                    fontWeight: "800",
                    fontVariant: ["tabular-nums"],
                  }}
                >
                  {Math.floor(remaining / 60)}:
                  {String(remaining % 60).padStart(2, "0")}
                </Text>
                <Text style={[S.body, S.light]}>
                  {active.durationMinutes}-minute session ·{" "}
                  {active.pausedAt
                    ? "Paused"
                    : remaining === 0
                      ? "Ready to save"
                      : "In progress"}
                </Text>
              </View>
              {drills.map((d) => (
                <Card key={d.id}>
                  <Text style={S.h3}>{d.title}</Text>
                  <Text style={S.body}>{d.instructions}</Text>
                  <Text style={S.small}>{d.safety}</Text>
                </Card>
              ))}
              {error ? (
                <Text role="alert" style={S.error}>
                  {error}
                </Text>
              ) : null}
              <Button
                title={active.pausedAt ? "Resume timer" : "Pause timer"}
                secondary
                onPress={pause}
              />
              <Button title="Finish & save practice" onPress={finish} />
              <Button
                title="Cancel without saving"
                secondary
                onPress={() => {
                  useStore.getState().cancelPracticeSession(active.id);
                  onClose();
                }}
              />
              <Text style={S.small}>
                The timer is saved on this device. Pause it for breaks. Stop if
                anything hurts; a timer never overrides rest needs.
              </Text>
            </>
          ) : (
            <>
              <Heading
                eyebrow={
                  quick ? "ALREADY PUT IN THE WORK?" : "YOUR TIME TO GROW"
                }
                title={quick ? "Log a practice." : "Make a little time."}
                detail={
                  quick
                    ? "Record practice you have already completed. One practice day earns 10 points."
                    : "Pick a comfortable duration. You can pause or finish early."
                }
              />
              {!quick && (
                <Card>
                  <Text style={S.h3}>Session length</Text>
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
                </Card>
              )}
              {(!drillIds.length || quick) && (
                <Card>
                  <Text style={S.h3}>Practice focus</Text>
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
                </Card>
              )}
              {!quick &&
                drills.map((d) => (
                  <Card key={d.id}>
                    <Text style={S.h3}>{d.title}</Text>
                    <Text style={S.body}>{d.instructions}</Text>
                    <Text style={S.small}>Bring: {d.equipment}</Text>
                    <Text style={S.small}>{d.safety}</Text>
                  </Card>
                ))}
              <Button
                title={quick ? "Save completed practice" : "Start timer"}
                disabled={(quick || !drillIds.length) && types.length === 0}
                onPress={quick ? log : start}
              />
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
