import React, { useState } from "react";
import { View, Text, useWindowDimensions } from "react-native";
import { Timer, Target, Zap } from "lucide-react-native";
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
import { PhotoPanel } from "../../components/ClubVisuals";
import { REWARD_COLORS } from "../../components/RewardRally";
import PracticeFlow from "../../components/PracticeFlow";
import DrillGuide from "../../components/DrillGuide";

export default function Training() {
  const child = useStore((s) => s.child),
    goals = useStore((s) => s.improvementGoals);
  const wide = useWindowDimensions().width >= 800;
  const [filter, setFilter] = useState("All"),
    [selected, setSelected] = useState<string[] | null>(null);
  const plan = buildWeeklyPlan(goals, child?.goalPerWeek ?? 3);
  return (
    <Screen>
      <Heading
        eyebrow="PICK UP & PLAY"
        title="What’s your game?"
        detail="Pick a drill or try a combo. Your pace. Your kind of fun."
      />
      <PhotoPanel
        glove
        style={{
          minHeight: 190,
          padding: wide ? 30 : 22,
          justifyContent: "space-between",
          gap: 18,
        }}
      >
        <Text style={[S.eyebrow, { color: C.electric }]}>
          BACKYARD. BALLFIELD. LET’S GO.
        </Text>
        <Text
          style={[
            S.display,
            {
              fontSize: wide ? 58 : 44,
              lineHeight: wide ? 55 : 44,
              color: C.white,
              maxWidth: 440,
            },
          ]}
        >
          HIT. CATCH.{"\n"}MAKE IT COUNT.
        </Text>
      </PhotoPanel>
      <View style={{ gap: 5 }}>
        <Text style={S.eyebrow}>A LITTLE OF BOTH</Text>
        <Text style={S.h2}>Try a combo</Text>
      </View>
      <View style={S.grid}>
        {plan.map((drills, i) => (
          <Card
            key={i}
            style={{
              flex: 1,
              minWidth: 250,
              backgroundColor: REWARD_COLORS[i % 6],
              borderColor: REWARD_COLORS[i % 6],
              padding: 22,
            }}
          >
            <View style={S.between}>
              <Text
                style={{
                  fontFamily: D,
                  fontSize: 45,
                  lineHeight: 48,
                  color: C.navy,
                  fontWeight: "700",
                }}
              >
                COMBO 0{i + 1}
              </Text>
              <Zap size={26} color={C.navy} />
            </View>
            <Text style={[S.h3, { lineHeight: 25 }]}>
              {drills.map((d) => d.title).join(" + ")}
            </Text>
            <Text style={[S.small, { color: C.navy }]}>
              {drills.reduce((n, d) => n + d.minutes, 0)} minutes suggested ·
              adjust to fit your day
            </Text>
            <View style={{ flex: 1 }} />
            <Button
              secondary
              title="Let’s do this combo"
              accessibilityLabel={`Start session ${i + 1}`}
              onPress={() => setSelected(drills.map((d) => d.id))}
            />
          </Card>
        ))}
      </View>
      <Heading
        eyebrow="OR PICK YOUR FAVORITE"
        title="One drill. All you."
        detail="Need a tip? Each drill has an optional guide."
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
              flexBasis: wide ? "30%" : "100%",
              flexGrow: 1,
              minWidth: 250,
              padding: 22,
            }}
          >
            <View style={S.between}>
              <View
                style={{
                  backgroundColor: REWARD_COLORS[i % 6],
                  padding: 13,
                  borderRadius: 15,
                  transform: [{ rotate: "-6deg" }],
                }}
              >
                <Target size={26} color={C.navy} />
              </View>
              <View style={[S.row, { gap: 5 }]}>
                <Timer size={14} color={C.green} />
                <Text style={S.small}>{d.minutes} min</Text>
              </View>
            </View>
            <Text style={[S.h2, { fontSize: 23 }]}>{d.title}</Text>
            <Text style={S.small}>Grab: {d.equipment}</Text>
            <View style={{ flex: 1 }} />
            <Button
              title="Play this drill"
              accessibilityLabel={`Practice: ${d.title}`}
              onPress={() => setSelected([d.id])}
            />
            <DrillGuide drill={d} compact />
          </Card>
        ))}
      </View>
      <Text style={S.small}>
        Clear your space and practice with an adult. Space practice around games
        and rest. Stop for pain or unusual fatigue and follow your coach’s
        throwing limits.
      </Text>
      <PracticeFlow
        visible={selected !== null}
        onClose={() => setSelected(null)}
        drillIds={selected ?? []}
      />
    </Screen>
  );
}
