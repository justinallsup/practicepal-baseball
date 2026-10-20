import React, { useState } from "react";
import { View, Text, useWindowDimensions } from "react-native";
import { router } from "expo-router";
import { Check, Star, Trophy, Zap } from "lucide-react-native";
import { useStore } from "../../lib/store";
import { buildWeeklyPlan } from "../../lib/training-plan";
import { dayLabel, getToday, getWeekDates } from "../../lib/utils";
import { Screen, Brand, Card, Button, C, D, S } from "../../components/ui";
import {
  PointsPill,
  RallyHero,
  RewardGoalCard,
} from "../../components/RewardRally";
import PracticeFlow from "../../components/PracticeFlow";

export default function Today() {
  const child = useStore((s) => s.child),
    logs = useStore((s) => s.logs),
    points = useStore((s) => s.totalPoints);
  const goals = useStore((s) => s.improvementGoals),
    sessions = useStore((s) => s.practiceSessions);
  const familyReward = useStore((s) => s.reward);
  const wide = useWindowDimensions().width >= 850;
  const [practice, setPractice] = useState(false),
    [guided, setGuided] = useState(false);
  const dates = getWeekDates(),
    today = getToday();
  const weekDays = new Set(
    logs.filter((l) => dates.includes(l.date)).map((l) => l.date),
  );
  const goal = child?.goalPerWeek ?? 3,
    done = weekDays.has(today);
  const active = sessions.find(
    (s) => s.childId === child?.id && s.state === "in_progress",
  );
  const plan = buildWeeklyPlan(goals, goal),
    next = plan[weekDays.size % plan.length];
  const rewards = () => router.push("/(home)/store");
  return (
    <Screen>
      <View style={S.between}>
        <Brand />
        <PointsPill points={points} />
      </View>
      <View style={{ gap: 5 }}>
        <Text
          role="heading"
          aria-level={1}
          style={[S.h2, { fontSize: wide ? 30 : 25 }]}
        >
          Let’s go, {child?.name ?? "player"}.
        </Text>
        <Text style={S.body}>
          {done
            ? "You showed up today. That’s a win worth celebrating."
            : "Your next big win starts with a little play."}
        </Text>
      </View>
      <View style={[S.grid, { alignItems: "stretch" }]}>
        <RallyHero
          title={
            done ? "EFFORT IN.\nGOOD TIMES OUT." : "PLAY BALL.\nEARN THE FUN."
          }
          subtitle={
            done ? "TODAY’S POINTS: COLLECTED" : "YOUR PRACTICE. YOUR PAYOFF."
          }
          style={{
            flex: wide ? 1.65 : undefined,
            width: wide ? undefined : "100%",
          }}
        >
          <Button
            gold
            title={
              active ? "Resume practice" : done ? "Play again" : "Let’s play"
            }
            onPress={() => {
              setGuided(false);
              setPractice(true);
            }}
          />
          <Text style={[S.small, { color: "#EDF5E5" }]}>
            {done
              ? "Your 10 daily points are in. Rest is a win, too."
              : "Show up. Play your way. Earn 10 points today."}
          </Text>
        </RallyHero>
        <View
          style={{
            flex: wide ? 1 : undefined,
            width: wide ? undefined : "100%",
            minWidth: 0,
          }}
        >
          <RewardGoalCard compact={!wide} onRewards={rewards} />
        </View>
      </View>
      {familyReward ? (
        <Card style={{ backgroundColor: "#FFF0D5", padding: 18 }}>
          <View style={[S.row, { flexWrap: "nowrap" }]}>
            <Trophy color={C.gold} size={28} />
            <View style={{ flex: 1, gap: 4 }}>
              <Text style={S.eyebrow}>
                {familyReward.earnedAt
                  ? "FAMILY GOAL: YOU DID IT!"
                  : "A LITTLE EXTRA TO PLAY FOR"}
              </Text>
              <Text style={S.h3}>{familyReward.rewardName}</Text>
              <Text style={S.small}>
                Your parent’s separate practice-day reward. See the goal in
                Rewards.
              </Text>
            </View>
          </View>
        </Card>
      ) : null}
      <View style={S.between}>
        <View style={{ gap: 5 }}>
          <Text style={S.eyebrow}>GRAB YOUR GLOVE</Text>
          <Text style={S.h2}>What’s the play?</Text>
        </View>
        <Button
          secondary
          title="All drills"
          onPress={() => router.push("/(home)/training")}
        />
      </View>
      <View style={S.grid}>
        <Card
          style={{
            flex: 1,
            minWidth: 250,
            backgroundColor: C.electric,
            borderColor: C.electric,
          }}
        >
          <View style={S.between}>
            <Zap size={28} fill={C.navy} color={C.navy} />
            <Text style={[S.eyebrow, { color: C.navy }]}>YOUR WAY</Text>
          </View>
          <Text style={[S.display, { fontSize: 38, lineHeight: 40 }]}>
            JUST GO PLAY.
          </Text>
          <Text style={[S.body, { color: C.navy }]}>
            Backyard catch? A few swings? Pick your focus and fire up the timer.
          </Text>
          <Button
            title="Start my own session"
            onPress={() => {
              setGuided(false);
              setPractice(true);
            }}
          />
        </Card>
        <Card
          style={{
            flex: 1,
            minWidth: 250,
            backgroundColor: "#FFDCCC",
            borderColor: "#F5C6AD",
          }}
        >
          <View style={S.between}>
            <Star size={28} fill={C.navy} color={C.navy} />
            <Text style={[S.eyebrow, { color: C.navy }]}>PICKED FOR YOU</Text>
          </View>
          <Text style={[S.display, { fontSize: 38, lineHeight: 40 }]}>
            MIX IT UP.
          </Text>
          <Text style={[S.body, { color: C.navy }]}>
            {next.map((d) => d.title).join(" + ")}. Two drills, one good
            session.
          </Text>
          <Button
            secondary
            title="Try today’s combo"
            onPress={() => {
              setGuided(true);
              setPractice(true);
            }}
          />
        </Card>
      </View>
      <Card style={{ padding: wide ? 24 : 18 }}>
        <View style={S.between}>
          <View style={{ gap: 4 }}>
            <Text style={S.eyebrow}>YOUR WEEK OF WINS</Text>
            <Text style={S.h2}>
              {weekDays.size >= goal
                ? "Weekly goal. Nailed it."
                : `${weekDays.size} down. ${Math.max(0, goal - weekDays.size)} to your goal.`}
            </Text>
          </View>
          <Trophy size={30} color={C.gold} />
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            gap: 4,
          }}
        >
          {dates.map((d) => (
            <View key={d} style={{ alignItems: "center", gap: 8 }}>
              <Text style={[S.small, { fontSize: 10 }]}>
                {dayLabel(d).slice(0, 1)}
              </Text>
              <View
                accessibilityLabel={`${dayLabel(d)} ${weekDays.has(d) ? "practiced" : "not logged"}${d === today ? ", today" : ""}`}
                style={{
                  width: wide ? 46 : 34,
                  height: wide ? 46 : 38,
                  borderRadius: 12,
                  backgroundColor: weekDays.has(d)
                    ? C.electric
                    : d === today
                      ? C.navy
                      : C.pale,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {weekDays.has(d) ? (
                  <Check color={C.navy} size={19} />
                ) : (
                  <Text
                    style={[
                      S.h3,
                      { fontSize: 13, color: d === today ? C.white : C.muted },
                    ]}
                  >
                    {Number(d.slice(-2))}
                  </Text>
                )}
              </View>
            </View>
          ))}
        </View>
        <Text style={S.small}>
          Choose your practice days around games and rest. Every day you show up
          counts.
        </Text>
      </Card>
      <PracticeFlow
        visible={practice}
        onClose={() => setPractice(false)}
        drillIds={guided ? next.map((d) => d.id) : []}
      />
    </Screen>
  );
}
