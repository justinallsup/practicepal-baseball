import React, { useState } from "react";
import { View, Text } from "react-native";
import { useStore } from "../../lib/store";
import { TRAINING_DRILLS, buildWeeklyPlan } from "../../lib/training-plan";
import { Screen, Heading, Card, Button, Chip, C, S } from "../../components/ui";
import PracticeFlow from "../../components/PracticeFlow";
import DrillDiagram from "../../components/DrillDiagram";
export default function Training() {
  const child = useStore((s) => s.child),
    goals = useStore((s) => s.improvementGoals);
  const [filter, setFilter] = useState("All"),
    [selected, setSelected] = useState<string[] | null>(null);
  const plan = buildWeeklyPlan(goals, child?.goalPerWeek ?? 3);
  return (
    <Screen>
      <Heading
        eyebrow="PLAYER DEVELOPMENT"
        title="A little structure. A lot of play."
        detail="Your weekly plan and a drill library for the backyard, garage, or field."
      />
      <View style={S.hero}>
        <Text style={[S.eyebrow, { color: "#E9AF92" }]}>
          YOUR WEEKLY ROUTINE
        </Text>
        <Text style={[S.h2, S.white]}>
          {child?.goalPerWeek ?? 3} days. Flexible by design.
        </Text>
        <Text style={[S.body, S.light]}>
          Focus: {goals.length ? goals.join(" + ") : "Balanced fundamentals"}.
          Space sessions around games, coaching, and rest. These are general
          practice ideas, not a throwing workload prescription.
        </Text>
      </View>
      <View style={S.grid}>
        {plan.map((drills, i) => (
          <Card key={i} style={{ flex: 1, minWidth: 240 }}>
            <Text style={S.eyebrow}>SESSION {i + 1}</Text>
            <Text style={S.h3}>{drills.map((d) => d.title).join(" + ")}</Text>
            <Text style={S.small}>
              {drills.reduce((n, d) => n + d.minutes, 0)} minutes suggested
            </Text>
            <Button
              title={`Start session ${i + 1}`}
              secondary
              onPress={() => setSelected(drills.map((d) => d.id))}
            />
          </Card>
        ))}
      </View>
      <Heading eyebrow="THE DRILL LIBRARY" title="Find your next focus." />
      <View style={S.row}>
        {["All", "Hitting", "Fielding", "Pitching", "Speed"].map((f) => (
          <Chip
            key={f}
            title={
              f === "Pitching" ? "Throwing" : f === "Speed" ? "Footwork" : f
            }
            selected={filter === f}
            onPress={() => setFilter(f)}
          />
        ))}
      </View>
      <View style={S.grid}>
        {TRAINING_DRILLS.filter(
          (d) => filter === "All" || d.skill === filter,
        ).map((d) => (
          <Card key={d.id} style={{ flex: 1, minWidth: 250, maxWidth: 510 }}>
            <DrillDiagram skill={d.skill} />
            <Text style={S.eyebrow}>
              {d.skill === "Pitching" ? "Throwing" : d.skill} · {d.minutes} MIN
            </Text>
            <Text style={S.h2}>{d.title}</Text>
            <Text style={S.body}>{d.instructions}</Text>
            <Text style={S.small}>Bring: {d.equipment}</Text>
            <Text style={S.small}>{d.safety}</Text>
            <Button
              secondary
              title={`Practice: ${d.title}`}
              onPress={() => setSelected([d.id])}
            />
          </Card>
        ))}
      </View>
      <Text style={S.small}>
        Keep sessions age-appropriate and supervised. Stop for pain or unusual
        fatigue. Follow your coach’s throwing limits and rest plan.
      </Text>
      <PracticeFlow
        visible={selected !== null}
        onClose={() => setSelected(null)}
        drillIds={selected ?? []}
      />
    </Screen>
  );
}
