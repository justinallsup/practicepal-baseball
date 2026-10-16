import React, { useState } from "react";
import { View, Text } from "react-native";
import { router } from "expo-router";
import {
  Target,
  ArrowUpRight,
  Check,
  Flame,
  CircleDot,
} from "lucide-react-native";
import { useStore } from "../../lib/store";
import { buildWeeklyPlan } from "../../lib/training-plan";
import { dayLabel, getToday, getWeekDates } from "../../lib/utils";
import {
  Screen,
  Brand,
  Heading,
  Card,
  Button,
  Stat,
  C,
  S,
} from "../../components/ui";
import PracticeFlow from "../../components/PracticeFlow";
export default function Today() {
  const state = useStore();
  const [practice, setPractice] = useState(false);
  const [guided, setGuided] = useState(false);
  const dates = getWeekDates(),
    today = getToday();
  const weekDays = new Set(
    state.logs.filter((l) => dates.includes(l.date)).map((l) => l.date),
  );
  const goal = state.child?.goalPerWeek ?? 3;
  const done = weekDays.has(today);
  const active = state.getActivePracticeSession(state.child?.id ?? "");
  const plan = buildWeeklyPlan(state.improvementGoals, goal);
  const next = plan[weekDays.size % plan.length];
  return (
    <Screen>
      <View style={S.between}>
        <Brand />
        <Text style={S.small}>
          {new Date().toLocaleDateString(undefined, {
            weekday: "long",
            month: "short",
            day: "numeric",
          })}
        </Text>
      </View>
      <Heading
        eyebrow="WELCOME TO YOUR DUGOUT"
        title={`Let’s go, ${state.child?.name ?? "player"}.`}
        detail={
          done
            ? "You showed up today. That’s something to be proud of."
            : "A little focus today. A habit that lasts all season."
        }
      />
      <View style={S.grid}>
        <View style={[S.hero, { flex: 1.4, minWidth: 260 }]}>
          <View style={S.between}>
            <Text style={[S.eyebrow, { color: "#E9AF92" }]}>
              {done ? "TODAY’S WIN" : "YOUR NEXT SESSION"}
            </Text>
            {done ? (
              <Check color="#E9AF92" size={24} />
            ) : (
              <Target color="#E9AF92" size={24} />
            )}
          </View>
          <Text style={[S.title, S.white, { fontSize: 30, lineHeight: 36 }]}>
            {done
              ? "Good work.\nKeep the good feeling."
              : "The next good rep\nstarts here."}
          </Text>
          <Text style={[S.body, S.light]}>
            {active
              ? "Your saved timer is ready when you are."
              : done
                ? "Rest is part of getting better. Explore your progress or plan your next session."
                : "Follow your plan, start a timer, or log a session you’ve already completed."}
          </Text>
          <Button
            title={
              active
                ? "Resume practice"
                : done
                  ? "Practice again"
                  : "Start practice"
            }
            onPress={() => {
              setGuided(false);
              setPractice(true);
            }}
          />
          <Text style={[S.small, S.light]}>
            10 points per practice day · Your pace. Your progress.
          </Text>
        </View>
        <Card style={{ flex: 1, minWidth: 260 }}>
          <View style={S.between}>
            <Text style={S.h3}>This week</Text>
            <Text style={S.eyebrow}>
              {weekDays.size} / {goal} DAYS
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              gap: 5,
              paddingVertical: 10,
            }}
          >
            {dates.map((d) => (
              <View key={d} style={{ alignItems: "center", gap: 9 }}>
                <Text style={[S.small, { fontSize: 10 }]}>
                  {dayLabel(d)[0]}
                </Text>
                <View
                  accessibilityLabel={`${dayLabel(d)} ${weekDays.has(d) ? "practiced" : "not logged"}${d === today ? ", today" : ""}`}
                  style={{
                    width: 30,
                    height: 36,
                    borderRadius: 10,
                    backgroundColor: weekDays.has(d) ? C.green : C.cream,
                    borderWidth: d === today ? 2 : 0,
                    borderColor: C.navy,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {weekDays.has(d) ? (
                    <Check color={C.white} size={17} />
                  ) : (
                    <Text style={S.small}>{Number(d.slice(-2))}</Text>
                  )}
                </View>
              </View>
            ))}
          </View>
          <View
            style={{ height: 6, backgroundColor: C.cream, borderRadius: 8 }}
          >
            <View
              style={{
                width: `${Math.min(weekDays.size / goal, 1) * 100}%`,
                height: 6,
                borderRadius: 8,
                backgroundColor: C.green,
              }}
            />
          </View>
          <Text style={S.body}>
            {weekDays.size >= goal
              ? "Weekly goal complete. Enjoy the win."
              : `${Math.max(0, goal - weekDays.size)} more practice days toward your weekly goal.`}
          </Text>
          <View style={S.rule} />
          <View style={S.row}>
            <Stat value={state.getCurrentStreak()} label="Day streak" />
            <Stat value={state.totalPoints} label="Reward points" />
          </View>
        </Card>
      </View>
      <View style={S.between}>
        <Text style={S.h2}>A plan you can actually follow</Text>
        <Button
          title="See full plan"
          secondary
          onPress={() => router.push("/(home)/training")}
        />
      </View>
      <Card>
        <View style={S.between}>
          <View style={{ gap: 8, flex: 1, minWidth: 200 }}>
            <Text style={S.eyebrow}>SUGGESTED NEXT SESSION</Text>
            <Text style={S.h3}>{next.map((d) => d.title).join(" + ")}</Text>
            <Text style={S.body}>
              {next.reduce((n, d) => n + d.minutes, 0)} min suggested · Adapt to
              your player’s energy and schedule.
            </Text>
          </View>
          <Button
            title="Open guided practice"
            onPress={() => {
              setGuided(true);
              setPractice(true);
            }}
          />
        </View>
      </Card>
      <View style={S.grid}>
        <Card style={{ flex: 1, minWidth: 240 }}>
          <Flame size={23} color={C.red} />
          <Text style={S.h3}>Small wins add up.</Text>
          <Text style={S.body}>
            {new Set(state.logs.map((l) => l.date)).size} practice days
            recorded. See your milestones and personal benchmarks.
          </Text>
          <Button
            secondary
            title="View progress"
            onPress={() => router.push("/(home)/weekly")}
          />
        </Card>
        <Card style={{ flex: 1, minWidth: 240 }}>
          <CircleDot color={C.green} size={23} />
          <Text style={S.h3}>Make it a family thing.</Text>
          <Text style={S.body}>
            Choose a reward together. Players request it; parents give the final
            thumbs-up.
          </Text>
          <Button
            secondary
            title="Explore rewards"
            onPress={() => router.push("/(home)/store")}
          />
        </Card>
      </View>
      <PracticeFlow
        visible={practice}
        onClose={() => setPractice(false)}
        drillIds={guided ? next.map((d) => d.id) : []}
      />
    </Screen>
  );
}
