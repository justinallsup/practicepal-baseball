import React, { useState } from "react";
import { View, Text, Pressable, useWindowDimensions } from "react-native";
import { router } from "expo-router";
import {
  ArrowUpRight,
  Check,
  Flame,
  Star,
  Timer,
  ChevronRight,
  ShieldCheck,
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
  C,
  D,
  F,
  S,
} from "../../components/ui";
import {
  PhotoPanel,
  Ring,
  Medal,
  SectionTitle,
} from "../../components/ClubVisuals";
import PracticeFlow from "../../components/PracticeFlow";
export default function Today() {
  const state = useStore(),
    wide = useWindowDimensions().width >= 850;
  const [practice, setPractice] = useState(false),
    [guided, setGuided] = useState(false);
  const dates = getWeekDates(),
    today = getToday(),
    weekDays = new Set(
      state.logs.filter((l) => dates.includes(l.date)).map((l) => l.date),
    );
  const goal = state.child?.goalPerWeek ?? 3,
    done = weekDays.has(today),
    active = state.getActivePracticeSession(state.child?.id ?? "");
  const plan = buildWeeklyPlan(state.improvementGoals, goal),
    next = plan[weekDays.size % plan.length];
  const totalDays = new Set(state.logs.map((l) => l.date)).size;
  return (
    <Screen>
      <View
        style={[
          S.between,
          {
            paddingBottom: 16,
            borderBottomWidth: 1,
            borderBottomColor: C.line,
          },
        ]}
      >
        <Brand />
        <View style={[S.row, { gap: 8 }]}>
          <View
            style={{
              width: 7,
              height: 7,
              borderRadius: 4,
              backgroundColor: C.green,
            }}
          />
          <Text style={[S.small, { fontWeight: "700" }]}>
            {new Date().toLocaleDateString(undefined, {
              weekday: "short",
              month: "short",
              day: "numeric",
            })}
          </Text>
        </View>
      </View>
      <View style={S.between}>
        <Heading
          eyebrow="YOUR EVERYDAY ADVANTAGE"
          title={`Let’s go, ${state.child?.name ?? "player"}.`}
          detail={
            done
              ? "You showed up today. That’s something to be proud of."
              : "Big dreams. Small steps. Your next good rep starts here."
          }
        />
        {wide && (
          <View
            style={[
              S.row,
              { backgroundColor: C.pale, padding: 12, borderRadius: 12 },
            ]}
          >
            <ShieldCheck size={18} color={C.green} />
            <Text style={[S.small, { fontWeight: "700" }]}>
              YOUR PACE. YOUR PROGRESS.
            </Text>
          </View>
        )}
      </View>
      <View style={[S.grid, { alignItems: "stretch" }]}>
        <PhotoPanel
          style={{
            flex: wide ? 1.65 : undefined,
            width: wide ? undefined : "100%",
            minHeight: wide ? 390 : 350,
          }}
        >
          <View
            style={{
              padding: wide ? 32 : 24,
              gap: 17,
              flex: 1,
              justifyContent: "space-between",
            }}
          >
            <View
              style={{
                alignSelf: "flex-start",
                backgroundColor: "#FFFFFF18",
                borderColor: "#FFFFFF32",
                borderWidth: 1,
                borderRadius: 20,
                paddingVertical: 8,
                paddingHorizontal: 12,
              }}
            >
              <Text style={[S.eyebrow, { color: C.lime, fontSize: 9 }]}>
                {done ? "TODAY’S WIN" : "THE WORK STARTS HERE"} / 01
              </Text>
            </View>
            <View style={{ gap: 14, maxWidth: wide ? "65%" : "76%" }}>
              <Text
                style={[
                  S.display,
                  {
                    fontSize: wide ? 60 : 44,
                    lineHeight: wide ? 56 : 43,
                    color: C.white,
                  },
                ]}
              >
                {done
                  ? "ANOTHER DAY.\nANOTHER WIN."
                  : "BETTER BEGINS\nWITH ONE REP."}
              </Text>
              <Text
                style={[
                  S.body,
                  {
                    color: "#E3E9DD",
                    fontSize: 12,
                    lineHeight: 20,
                    maxWidth: 260,
                  },
                ]}
              >
                {active
                  ? "Your saved timer is ready when you are."
                  : done
                    ? "You put in the work. Take a breath and enjoy the progress."
                    : "A little practice today. A little more confidence tomorrow."}
              </Text>
            </View>
            <View style={{ gap: 12, maxWidth: wide ? 270 : 230 }}>
              <Button
                gold
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
              <View style={[S.row, { gap: 6 }]}>
                <Star size={13} color={C.lime} />
                <Text style={[S.small, { color: "#E1E6DA" }]}>
                  Earn 10 points for showing up
                </Text>
              </View>
            </View>
          </View>
        </PhotoPanel>
        <Card
          style={{
            flex: wide ? 1 : undefined,
            width: wide ? undefined : "100%",
            minWidth: 0,
            padding: 24,
            justifyContent: "space-between",
          }}
        >
          <View style={S.between}>
            <Text style={S.h3}>Your weekly rhythm</Text>
            <Text style={[S.small, { color: C.green, fontWeight: "800" }]}>
              WEEKLY GOAL
            </Text>
          </View>
          <View
            style={[
              S.row,
              { justifyContent: "center", paddingVertical: 8, gap: 22 },
            ]}
          >
            <Ring value={weekDays.size} total={goal} size={150} />
            <View style={{ gap: 6, maxWidth: 125 }}>
              <Text style={[S.h3, { fontSize: 17 }]}>
                {weekDays.size >= goal ? "You did it." : "Keep it going."}
              </Text>
              <Text style={S.small}>
                {weekDays.size >= goal
                  ? "Weekly goal complete. Enjoy the win."
                  : `${goal - weekDays.size} more practice days toward your weekly goal.`}
              </Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              gap: 5,
            }}
          >
            {dates.map((d) => (
              <View key={d} style={{ alignItems: "center", gap: 8 }}>
                <Text style={[S.small, { fontSize: 9, fontWeight: "700" }]}>
                  {dayLabel(d)[0]}
                </Text>
                <View
                  accessibilityLabel={`${dayLabel(d)} ${weekDays.has(d) ? "practiced" : "not logged"}${d === today ? ", today" : ""}`}
                  style={{
                    width: 32,
                    height: 34,
                    borderRadius: 11,
                    backgroundColor: weekDays.has(d)
                      ? C.green
                      : d === today
                        ? C.navy
                        : "#F3F5EF",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {weekDays.has(d) ? (
                    <Check color={C.white} size={16} />
                  ) : (
                    <Text
                      style={[
                        S.small,
                        {
                          color: d === today ? C.white : C.muted,
                          fontWeight: "700",
                        },
                      ]}
                    >
                      {Number(d.slice(-2))}
                    </Text>
                  )}
                </View>
              </View>
            ))}
          </View>
          <View
            style={[
              S.row,
              {
                borderTopWidth: 1,
                borderTopColor: C.line,
                marginTop: 16,
                paddingTop: 16,
                justifyContent: "space-between",
              },
            ]}
          >
            <View style={[S.row, { gap: 9 }]}>
              <Flame color={C.gold} size={22} />
              <View>
                <Text style={[S.h3, { fontSize: 19 }]}>
                  {state.getCurrentStreak()}
                  <Text style={S.small}> day streak</Text>
                </Text>
              </View>
            </View>
            <View style={[S.row, { gap: 9 }]}>
              <Star color={C.gold} size={22} />
              <Text style={[S.h3, { fontSize: 19 }]}>
                {state.totalPoints}
                <Text style={S.small}> points</Text>
              </Text>
            </View>
          </View>
        </Card>
      </View>
      <View style={S.between}>
        <SectionTitle
          label="LESS PLANNING. MORE PLAYING."
          title="Your next session"
        />
        <Button
          secondary
          title="See full plan"
          onPress={() => router.push("/(home)/training")}
        />
      </View>
      <View style={S.grid}>
        <PhotoPanel
          glove
          style={{
            width: wide ? 245 : "100%",
            minHeight: wide ? 204 : 160,
            justifyContent: "flex-end",
            padding: 22,
          }}
        >
          <Text style={[S.eyebrow, { color: C.lime }]}>
            BUILT FOR THE BACKYARD
          </Text>
          <Text
            style={[
              S.display,
              { fontSize: 32, lineHeight: 33, color: C.white, marginTop: 8 },
            ]}
          >
            GEAR UP.\nGET AFTER IT.
          </Text>
        </PhotoPanel>
        <Card
          style={{ flex: 1, minWidth: 240, justifyContent: "space-between" }}
        >
          <View style={S.between}>
            <View style={[S.row, { gap: 6 }]}>
              <Timer size={14} color={C.green} />
              <Text style={[S.eyebrow, { fontSize: 9 }]}>
                {next.reduce((n, d) => n + d.minutes, 0)} MIN · GUIDED PRACTICE
              </Text>
            </View>
            <Text style={S.small}>AT YOUR OWN PACE</Text>
          </View>
          <View style={{ gap: 12 }}>
            {next.map((d, i) => (
              <View key={d.id} style={[S.row, { flexWrap: "nowrap" }]}>
                <View
                  style={{
                    width: 33,
                    height: 33,
                    borderRadius: 10,
                    backgroundColor: C.pale,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text style={[S.eyebrow, { letterSpacing: 0 }]}>
                    0{i + 1}
                  </Text>
                </View>
                <Text style={[S.h3, { flex: 1 }]}>{d.title}</Text>
                <Text style={S.small}>{d.minutes} min</Text>
              </View>
            ))}
          </View>
          <Button
            title="Open guided practice"
            onPress={() => {
              setGuided(true);
              setPractice(true);
            }}
          />
        </Card>
      </View>
      <View style={S.grid}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="View progress"
          onPress={() => router.push("/(home)/weekly")}
          style={({ pressed }) => [
            S.card,
            {
              flex: 1,
              minWidth: 240,
              flexDirection: "row",
              alignItems: "center",
              gap: 17,
              backgroundColor: C.pale,
              opacity: pressed ? 0.8 : 1,
            },
          ]}
        >
          <Medal earned={totalDays > 0} size={70} />
          <View style={{ flex: 1, gap: 5 }}>
            <Text style={S.eyebrow}>EVERY DAY ADDS UP</Text>
            <Text style={S.h3}>
              {totalDays
                ? `${totalDays} days of showing up.`
                : "Your first win is waiting."}
            </Text>
            <Text style={S.small}>View progress & milestones</Text>
          </View>
          <ArrowUpRight color={C.green} size={20} />
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Explore rewards"
          onPress={() => router.push("/(home)/store")}
          style={({ pressed }) => [
            S.card,
            {
              flex: 1,
              minWidth: 240,
              flexDirection: "row",
              alignItems: "center",
              gap: 17,
              backgroundColor: "#F3E8CA",
              borderColor: "#E8DBB8",
              opacity: pressed ? 0.8 : 1,
            },
          ]}
        >
          <View
            style={{
              width: 62,
              height: 62,
              borderRadius: 22,
              backgroundColor: "#EBD59F",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Star color={C.gold} size={31} />
          </View>
          <View style={{ flex: 1, gap: 5 }}>
            <Text style={[S.eyebrow, { color: C.gold }]}>
              SOMETHING TO PLAY FOR
            </Text>
            <Text style={S.h3}>Good effort. Great rewards.</Text>
            <Text style={S.small}>Explore your family rewards</Text>
          </View>
          <ArrowUpRight color={C.gold} size={20} />
        </Pressable>
      </View>
      <Text style={[S.small, { textAlign: "center", paddingTop: 8 }]}>
        SMALL SESSIONS. BIG HABITS. / PRACTICEPAL BASEBALL
      </Text>
      <PracticeFlow
        visible={practice}
        onClose={() => setPractice(false)}
        drillIds={guided ? next.map((d) => d.id) : []}
      />
    </Screen>
  );
}
