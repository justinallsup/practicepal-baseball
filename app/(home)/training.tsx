import React, { useState } from "react";
import { View, Text, useWindowDimensions } from "react-native";
import {
  Timer,
  Target,
  ArrowUpRight,
  MoveUpRight,
  ChevronRight,
} from "lucide-react-native";
import { useStore } from "../../lib/store";
import { TRAINING_DRILLS, buildWeeklyPlan } from "../../lib/training-plan";
import {
  Screen,
  Heading,
  Card,
  Button,
  Chip,
  C,
  D,
  S,
} from "../../components/ui";
import { PhotoPanel, SectionTitle } from "../../components/ClubVisuals";
import PracticeFlow from "../../components/PracticeFlow";
import DrillGuide from "../../components/DrillGuide";
export default function Training() {
  const child = useStore((s) => s.child),
    goals = useStore((s) => s.improvementGoals),
    wide = useWindowDimensions().width >= 800;
  const [filter, setFilter] = useState("All"),
    [selected, setSelected] = useState<string[] | null>(null);
  const plan = buildWeeklyPlan(goals, child?.goalPerWeek ?? 3);
  return (
    <Screen>
      <Heading
        eyebrow="THE TRAINING CLUB"
        title="Put a little play in your day."
        detail="Your plan. Your pace. A little more confidence with every session."
      />
      <PhotoPanel
        glove
        style={{
          minHeight: 270,
          padding: wide ? 34 : 25,
          justifyContent: "space-between",
          gap: 22,
        }}
      >
        <Text style={[S.eyebrow, { color: C.lime }]}>YOUR WEEKLY ROUTINE</Text>
        <Text
          style={[
            S.display,
            {
              fontSize: wide ? 62 : 48,
              lineHeight: wide ? 59 : 47,
              color: C.white,
              maxWidth: 460,
            },
          ]}
        >
          {child?.goalPerWeek ?? 3} DAYS.{"\n"}A STRONGER HABIT.
        </Text>
        <View style={[S.row, { gap: 8 }]}>
          {(goals.length ? goals : ["Balanced fundamentals"]).map((g) => (
            <View
              key={g}
              style={{
                borderRadius: 20,
                backgroundColor: "#FFFFFF25",
                paddingHorizontal: 13,
                paddingVertical: 7,
              }}
            >
              <Text style={[S.small, { color: C.white, fontWeight: "700" }]}>
                {g}
              </Text>
            </View>
          ))}
        </View>
      </PhotoPanel>
      <SectionTitle
        label="YOUR PRACTICE PLAYBOOK"
        title="One session at a time"
      />
      <View style={S.grid}>
        {plan.map((drills, i) => (
          <Card key={i} style={{ flex: 1, minWidth: 240, overflow: "hidden" }}>
            <View style={S.between}>
              <Text
                style={{
                  fontFamily: D,
                  fontSize: 56,
                  lineHeight: 59,
                  color: "#D4DECF",
                }}
              >
                0{i + 1}
              </Text>
              <View
                style={{
                  backgroundColor: C.pale,
                  borderRadius: 20,
                  padding: 8,
                }}
              >
                <Target size={20} color={C.green} />
              </View>
            </View>
            <Text style={S.eyebrow}>SESSION {i + 1}</Text>
            <Text style={[S.h3, { fontSize: 18, lineHeight: 25 }]}>
              {drills.map((d) => d.title).join(" + ")}
            </Text>
            <View style={[S.row, { gap: 6 }]}>
              <Timer size={13} color={C.muted} />
              <Text style={S.small}>
                {drills.reduce((n, d) => n + d.minutes, 0)} minutes suggested
              </Text>
            </View>
            <View style={{ flex: 1 }} />
            <Button
              title={`Start session ${i + 1}`}
              secondary
              onPress={() => setSelected(drills.map((d) => d.id))}
            />
          </Card>
        ))}
      </View>
      <View style={{ backgroundColor: C.pale, padding: 16, borderRadius: 14 }}>
        <Text style={S.small}>
          Space sessions around games, coaching, and rest. These are general
          practice ideas, not a throwing workload prescription.
        </Text>
      </View>
      <Heading
        eyebrow="THE DRILL LIBRARY"
        title="See it. Try it. Make it yours."
        detail="Six original animated guides. Watch the movement, then take it to the field."
      />
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
        ).map((d, i) => (
          <Card
            key={d.id}
            style={{
              flexBasis: wide ? "31%" : "100%",
              flexGrow: 1,
              minWidth: 250,
              maxWidth: wide ? 590 : undefined,
              padding: 18,
            }}
          >
            <DrillGuide drill={d} />
            <Text style={[S.h2, { fontSize: 20 }]}>{d.title}</Text>
            <Text style={S.body}>{d.instructions}</Text>
            <View style={{ flex: 1 }} />
            <View
              style={{
                backgroundColor: "#F3F5EF",
                padding: 12,
                borderRadius: 10,
                gap: 5,
              }}
            >
              <Text style={[S.eyebrow, { fontSize: 8 }]}>IN YOUR KIT</Text>
              <Text style={S.small}>{d.equipment}</Text>
            </View>
            <Text style={[S.small, { fontSize: 10 }]}>{d.safety}</Text>
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
