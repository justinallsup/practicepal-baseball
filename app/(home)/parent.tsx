import React, { useState } from "react";
import { View, Text, Platform, Share } from "react-native";
import { router } from "expo-router";
import { useStore, type Child } from "../../lib/store";
import { METRICS, type Metric } from "../../lib/progress";
import { getWeekDates } from "../../lib/utils";
import {
  cancelStreakReminders,
  cancelAllPracticeReminders,
  requestNotificationPermission,
  scheduleStreakReminder,
} from "../../lib/notifications";
import ParentGate from "../../components/ParentGate";
import {
  Screen,
  Heading,
  Card,
  Field,
  Button,
  Chip,
  S,
  C,
} from "../../components/ui";
import { Ring } from "../../components/ClubVisuals";
function Controls() {
  const state = useStore();
  const [name, setName] = useState(state.child?.name ?? ""),
    [goal, setGoal] = useState<Child["goalPerWeek"]>(
      state.child?.goalPerWeek ?? 3,
    );
  const [metric, setMetric] = useState<Metric>("contact"),
    [value, setValue] = useState(""),
    [note, setNote] = useState(""),
    [message, setMessage] = useState(""),
    [error, setError] = useState("");
  const [familyReward, setFamilyReward] = useState(
    state.reward?.rewardName ?? "",
  );
  const [deleteText, setDeleteText] = useState(""),
    [confirmReset, setConfirmReset] = useState(false),
    [busy, setBusy] = useState(false);
  const week = new Set(
    state.logs
      .filter((l) => getWeekDates().includes(l.date))
      .map((l) => l.date),
  ).size;
  async function notify() {
    setBusy(true);
    setError("");
    try {
      if (state.notificationsEnabled) {
        await cancelStreakReminders();
        state.setNotificationsEnabled(false);
        setMessage("Daily reminders turned off.");
      } else if (await requestNotificationPermission()) {
        await scheduleStreakReminder({
          currentStreak: state.getCurrentStreak(),
        });
        state.setNotificationsEnabled(true);
        setMessage("Reminder scheduled for 6pm on this device.");
      } else
        setError(
          "Notifications are not allowed. You can enable them in device settings.",
        );
    } catch {
      setError("The reminder could not be updated. Please try again.");
    } finally {
      setBusy(false);
    }
  }
  async function exportData() {
    const data = JSON.stringify(
      {
        format: "PracticePal export",
        version: 1,
        exportedAt: new Date().toISOString(),
        child: state.child,
        logs: state.logs,
        practiceSessions: state.practiceSessions,
        benchmarks: state.benchmarks,
        reward: state.reward,
        rewards: state.redemptionRequests,
        rewardGoal: {
          name: state.rewardGoalName,
          requestId: state.rewardGoalRequestId,
        },
        practiceSettings: state.practiceSettings,
        points: state.totalPoints,
        pointsHistory: state.pointsHistory,
        goals: state.improvementGoals,
      },
      null,
      2,
    );
    try {
      if (Platform.OS === "web") {
        const url = URL.createObjectURL(
          new Blob([data], { type: "application/json" }),
        );
        const a = document.createElement("a");
        a.href = url;
        a.download = "practicepal-records.json";
        a.click();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
        setMessage("Your records have been exported.");
      } else {
        await Share.share({ message: data });
        setMessage("Export opened in your device’s share sheet.");
      }
    } catch {
      setError("Could not export. Please try again.");
    }
  }
  function saveBenchmark() {
    setError("");
    if (
      value.trim() === "" ||
      !state.addBenchmark(metric, Number(value), note)
    ) {
      setError("Enter a whole number from 0 to 10.");
      return;
    }
    setValue("");
    setNote("");
    setMessage("Benchmark saved. View the trend in Progress.");
  }
  async function reset() {
    if (deleteText !== "DELETE") return;
    await cancelAllPracticeReminders();
    state.reset();
    router.replace("/onboarding");
  }
  return (
    <Screen>
      <Heading
        eyebrow="IN THEIR CORNER"
        title="The parent dugout."
        detail="Set a realistic goal, celebrate the effort, and keep the experience right for your family."
      />
      {message ? (
        <Text role="status" style={[S.body, { color: C.green }]}>
          {message}
        </Text>
      ) : null}
      {error ? (
        <Text role="alert" style={S.error}>
          {error}
        </Text>
      ) : null}
      <View style={S.hero}>
        <View
          style={{ position: "absolute", right: 22, top: 20, opacity: 0.16 }}
        >
          <Ring value={week} total={goal} size={160} dark />
        </View>
        <Text style={[S.eyebrow, { color: C.lime }]}>THIS WEEK’S RECAP</Text>
        <Text style={[S.h2, S.white]}>
          {state.child?.name} practiced on {week} {week === 1 ? "day" : "days"}.
        </Text>
        <Text style={[S.body, S.light]}>
          {week >= goal
            ? "The weekly goal is complete. Celebrate the effort together."
            : `${Math.max(0, goal - week)} more days toward the goal. Adjust it if your family needs a lighter week.`}
        </Text>
        <Text style={[S.small, S.light]}>
          Rest days count as looking after your player, even when they don’t add
          points.
        </Text>
      </View>
      <Card>
        <Text style={S.h2}>Reward approvals</Text>
        {state.redemptionRequests.filter((r) => r.status === "pending")
          .length === 0 ? (
          <Text style={S.body}>
            You’re all caught up. New requests will appear here on this device.
          </Text>
        ) : (
          state.redemptionRequests
            .filter((r) => r.status === "pending")
            .map((r) => (
              <View key={r.id} style={{ gap: 12 }}>
                <Text style={S.h3}>
                  {r.itemName} · {r.pointCost} points
                </Text>
                <View style={S.row}>
                  <Button
                    title={`Approve ${r.itemName}`}
                    onPress={() => {
                      state.approveRedemption(r.id);
                      setMessage(
                        "Reward approved. Arrange it together as a family.",
                      );
                    }}
                  />
                  <Button
                    secondary
                    title={`Decline ${r.itemName}`}
                    onPress={() => {
                      state.denyRedemption(r.id);
                      setMessage("Request declined and points refunded.");
                    }}
                  />
                </View>
              </View>
            ))
        )}
      </Card>
      <Card>
        <Text style={S.h2}>A family goal reward</Text>
        <Text style={S.body}>
          Choose something together for completing the weekly practice goal.
          This is separate from points rewards.
        </Text>
        <Field
          label="Family reward"
          value={familyReward}
          onChangeText={setFamilyReward}
          maxLength={80}
          placeholder="A picnic at the park"
        />
        <Button
          title="Set family goal reward"
          disabled={!familyReward.trim()}
          onPress={() => {
            state.setReward({
              childName: state.child?.name ?? "Player",
              rewardName: familyReward,
              targetType: "weekly_goal",
              targetValue: goal,
            });
            state.markRewardEarned();
            setMessage("Family reward saved. Track it in Rewards.");
          }}
        />
        {state.reward && (
          <Button
            secondary
            title="Clear family goal reward"
            onPress={() => {
              state.clearReward();
              setFamilyReward("");
            }}
          />
        )}
      </Card>
      <View style={S.grid}>
        <Card style={{ flex: 1, minWidth: 260 }}>
          <Text style={S.h2}>Their plan, your call</Text>
          <Field
            label="Player nickname"
            value={name}
            onChangeText={setName}
            maxLength={30}
          />
          <Text style={S.h3}>Weekly practice goal</Text>
          <View style={S.row}>
            {([3, 4, 5, 7] as const).map((d) => (
              <Chip
                key={d}
                title={`${d} days`}
                selected={goal === d}
                onPress={() => setGoal(d)}
              />
            ))}
          </View>
          <Text style={S.h3}>Training focus</Text>
          <View style={S.row}>
            {["Hitting", "Fielding", "Throwing", "Footwork"].map((g) => (
              <Chip
                key={g}
                title={g}
                selected={state.improvementGoals.includes(g)}
                onPress={() =>
                  state.setImprovementGoals(
                    state.improvementGoals.includes(g)
                      ? state.improvementGoals.filter((x) => x !== g)
                      : [...state.improvementGoals, g],
                  )
                }
              />
            ))}
          </View>
          <Button
            title="Save player settings"
            disabled={!name.trim()}
            onPress={() => {
              state.updateChild({ name, goalPerWeek: goal });
              setMessage(
                "Player settings saved. Your training plan is updated.",
              );
            }}
          />
        </Card>
        <Card style={{ flex: 1, minWidth: 260 }}>
          <Text style={S.h2}>Record a skill benchmark</Text>
          <View style={S.row}>
            {(Object.keys(METRICS) as Metric[]).map((m) => (
              <Chip
                key={m}
                title={METRICS[m].label}
                selected={metric === m}
                onPress={() => setMetric(m)}
              />
            ))}
          </View>
          <Text style={S.body}>{METRICS[metric].instruction}</Text>
          <Field
            label="Successful attempts (0–10)"
            value={value}
            onChangeText={setValue}
            keyboardType="number-pad"
            maxLength={2}
          />
          <Field
            label="Setup note (optional)"
            value={note}
            onChangeText={setNote}
            maxLength={160}
            placeholder="Same tee height, same bat"
          />
          <Button title="Save benchmark" onPress={saveBenchmark} />
          <Text style={S.small}>
            Only measure when your player is comfortable and ready. These
            observations are not medical advice or an assessment of talent.
          </Text>
        </Card>
      </View>
      {state.benchmarks.length > 0 && (
        <Card>
          <Text style={S.h2}>Manage benchmark entries</Text>
          {state.benchmarks
            .slice(-6)
            .reverse()
            .map((b) => (
              <View key={b.id} style={S.between}>
                <Text style={[S.body, { flex: 1 }]}>
                  {METRICS[b.metric]?.label}: {b.value}/10 · {b.date}
                </Text>
                <Button
                  secondary
                  title={`Remove ${METRICS[b.metric]?.label} ${b.value}/10`}
                  onPress={() => {
                    state.removeBenchmark(b.id);
                    setMessage("Benchmark removed.");
                  }}
                />
              </View>
            ))}
        </Card>
      )}
      <Card>
        <Text style={S.h2}>Practice reminders</Text>
        {Platform.OS === "web" ? (
          <Text style={S.body}>
            Daily notifications aren’t available in this web version. Try a
            recurring reminder in your phone’s calendar for a time that works
            for your family.
          </Text>
        ) : (
          <>
            <Text style={S.body}>
              Optional daily reminder at 6pm in your device’s local time.
            </Text>
            <Button
              title={
                state.notificationsEnabled
                  ? "Turn reminders off"
                  : "Enable reminders"
              }
              disabled={busy}
              onPress={notify}
            />
          </>
        )}
      </Card>
      <Card>
        <Text style={S.h2}>Your family’s data</Text>
        <Text style={S.body}>
          Records are stored on this device only. They don’t sync between
          browsers or phones. Export a copy before clearing site data or
          changing devices. Exports are for your records; importing is not
          currently supported.
        </Text>
        <View style={S.row}>
          <Button
            title="Export practice records"
            secondary
            onPress={exportData}
          />
          <Button
            title="Read privacy & data"
            secondary
            onPress={() => router.push("/privacy")}
          />
        </View>
        <View style={S.rule} />
        {confirmReset ? (
          <>
            <Text style={S.error}>
              Delete this player and all practice, benchmark, timer, reward, and
              points history on this device? This cannot be undone.
            </Text>
            <Field
              label="Type DELETE to confirm"
              value={deleteText}
              onChangeText={setDeleteText}
            />
            <Button
              title="Delete all local data"
              disabled={deleteText !== "DELETE"}
              onPress={reset}
            />
            <Button
              title="Keep my data"
              secondary
              onPress={() => setConfirmReset(false)}
            />
          </>
        ) : (
          <Button
            title="Delete local data…"
            secondary
            onPress={() => setConfirmReset(true)}
          />
        )}
      </Card>
      <Text style={S.small}>
        PracticePal is currently free. No checkout or subscription is active.
      </Text>
    </Screen>
  );
}
export default function Parent() {
  return (
    <ParentGate>
      <Controls />
    </ParentGate>
  );
}
