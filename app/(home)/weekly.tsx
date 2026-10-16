import React from "react";
import { View, Text } from "react-native";
import { router } from "expo-router";
import { Award, LockKeyhole } from "lucide-react-native";
import Svg, { Polyline, Circle } from "react-native-svg";
import { useStore } from "../../lib/store";
import { achievements, METRICS, type Metric } from "../../lib/progress";
import { getWeekDates, getToday } from "../../lib/utils";
import { Screen, Heading, Card, Button, Stat, C, S } from "../../components/ui";
export default function Progress() {
  const state = useStore(),
    dates = getWeekDates();
  const days = new Set(state.logs.map((l) => l.date)).size;
  const badges = achievements(state.logs, state.child?.goalPerWeek ?? 3, dates);
  const weeks = Array.from({ length: 8 }, (_, i) => {
    const end = new Date();
    end.setDate(end.getDate() - (end.getDay() || 7) + 7 - (7 - i) * 7);
    const start = new Date(end);
    start.setDate(start.getDate() - 6);
    const local = (d: Date) =>
      `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    return {
      label: `${start.getMonth() + 1}/${start.getDate()}`,
      count: new Set(
        state.logs
          .filter((l) => l.date >= local(start) && l.date <= local(end))
          .map((l) => l.date),
      ).size,
    };
  });
  return (
    <Screen>
      <Heading
        eyebrow="YOUR OWN PERSONAL BEST"
        title="Progress worth noticing."
        detail="Real practice records. Small milestones. No comparisons with other players."
      />
      <Card>
        <View style={S.row}>
          <Stat value={days} label="Practice days" />
          <Stat value={state.getCurrentStreak()} label="Current streak" />
          <Stat value={state.getBestStreak()} label="Best streak" />
          <Stat
            value={
              state.practiceSessions.filter(
                (s) => s.state === "completed" || s.state === "partial",
              ).length
            }
            label="Timed sessions"
          />
        </View>
      </Card>
      <Card>
        <Text style={S.h2}>Your last eight weeks</Text>
        <Text style={S.small}>Practice days per week · Monday–Sunday</Text>
        <View
          style={{
            flexDirection: "row",
            height: 150,
            alignItems: "flex-end",
            gap: 10,
          }}
        >
          {weeks.map((w, i) => (
            <View
              key={i}
              accessibilityLabel={`Week of ${w.label}: ${w.count} practice days`}
              style={{ flex: 1, alignItems: "center", gap: 7 }}
            >
              <Text style={S.small}>{w.count}</Text>
              <View
                style={{
                  width: "100%",
                  height: Math.max(4, (w.count / 7) * 95),
                  borderRadius: 5,
                  backgroundColor: i === 7 ? C.red : C.navy,
                }}
              />
              <Text style={[S.small, { fontSize: 10 }]}>{w.label}</Text>
            </View>
          ))}
        </View>
      </Card>
      <Text style={S.h2}>Milestones earned by showing up</Text>
      <View style={S.grid}>
        {badges.map((b) => (
          <Card
            key={b.title}
            style={{
              flex: 1,
              minWidth: 240,
              backgroundColor: b.earned ? C.pale : C.white,
            }}
          >
            {b.earned ? (
              <Award size={28} color={C.green} />
            ) : (
              <LockKeyhole size={25} color={C.muted} />
            )}
            <Text style={S.h3}>{b.title}</Text>
            <Text style={S.body}>{b.detail}</Text>
            <Text
              style={[
                S.small,
                { fontWeight: "700", color: b.earned ? C.green : C.muted },
              ]}
            >
              {b.earned ? "Earned" : "Keep building"}
            </Text>
          </Card>
        ))}
      </View>
      <View style={S.between}>
        <Text style={S.h2}>Skill benchmarks</Text>
        <Button
          title="Record a benchmark"
          secondary
          onPress={() => router.push("/(home)/parent")}
        />
      </View>
      <Text style={S.body}>
        Parent-entered observations, not a rating of ability. Keep the setup
        consistent to make changes meaningful.
      </Text>
      <View style={S.grid}>
        {(Object.keys(METRICS) as Metric[]).map((metric) => {
          const entries = state.benchmarks.filter((b) => b.metric === metric),
            recent = entries.slice(-8),
            last = entries.at(-1),
            first = entries[0];
          return (
            <Card key={metric} style={{ flex: 1, minWidth: 260 }}>
              <Text style={S.h3}>{METRICS[metric].label}</Text>
              {last ? (
                <>
                  <Text style={[S.title, { fontSize: 38 }]}>
                    {last.value}
                    <Text style={S.body}> / 10</Text>
                  </Text>
                  <Text style={S.small}>
                    {entries.length > 1
                      ? `${last.value - first.value >= 0 ? "+" : ""}${last.value - first.value} from first recorded result`
                      : "Your starting point"}{" "}
                    · {last.date}
                  </Text>
                  <Svg
                    viewBox="0 0 280 90"
                    width="100%"
                    height={90}
                    accessibilityLabel={recent
                      .map((b) => `${b.date}: ${b.value} of 10`)
                      .join(", ")}
                  >
                    <Polyline
                      fill="none"
                      stroke={C.green}
                      strokeWidth="3"
                      points={recent
                        .map(
                          (b, i) =>
                            `${15 + (i * 250) / Math.max(1, recent.length - 1)},${75 - b.value * 6}`,
                        )
                        .join(" ")}
                    />
                    {recent.map((b, i) => (
                      <Circle
                        key={b.id}
                        cx={15 + (i * 250) / Math.max(1, recent.length - 1)}
                        cy={75 - b.value * 6}
                        r={4}
                        fill={C.green}
                      />
                    ))}
                  </Svg>
                  <Text style={S.small}>
                    Recent results: {recent.map((b) => b.value).join(" → ")}
                  </Text>
                  {last.note ? <Text style={S.body}>{last.note}</Text> : null}
                </>
              ) : (
                <Text style={S.body}>
                  No benchmark yet. Start with one observation together, then
                  revisit the same drill over time.
                </Text>
              )}
            </Card>
          );
        })}
      </View>
      <Card>
        <Text style={S.h2}>Recent practice</Text>
        {state.logs.length ? (
          state.logs
            .slice(-10)
            .reverse()
            .map((l) => (
              <View key={l.id} style={S.between}>
                <View style={{ gap: 4 }}>
                  <Text style={S.h3}>
                    {l.date === getToday() ? "Today" : l.date}
                  </Text>
                  <Text style={S.small}>
                    {l.types.length
                      ? l.types
                          .map((t) => (t === "Pitching" ? "Throwing" : t))
                          .join(" · ")
                      : "General practice"}
                  </Text>
                </View>
                <Text style={S.small}>
                  {l.feeling ? `Felt ${l.feeling}` : "Recorded"}
                </Text>
              </View>
            ))
        ) : (
          <Text style={S.body}>
            Your story starts with the first practice. Log one from Today.
          </Text>
        )}
      </Card>
    </Screen>
  );
}
