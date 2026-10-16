import React, { useState } from "react";
import { View, Text, useWindowDimensions } from "react-native";
import { router } from "expo-router";
import { useStore, type Child } from "../../lib/store";
import {
  Screen,
  Heading,
  Card,
  Field,
  Chip,
  Button,
  S,
  C,
  D,
  Brand,
} from "../../components/ui";

import { PhotoPanel, Medal } from "../../components/ClubVisuals";
export default function Setup() {
  const wide = useWindowDimensions().width >= 850;
  const [name, setName] = useState("");
  const [days, setDays] = useState<Child["goalPerWeek"]>(3);
  const [goals, setGoals] = useState<string[]>(["Hitting"]);
  const [confirmed, setConfirmed] = useState(false);
  function start() {
    if (!name.trim() || !confirmed) return;
    const state = useStore.getState();
    state.setImprovementGoals(goals);
    state.completeOnboarding({
      id: Date.now().toString(),
      name: name.trim(),
      avatar: "⚾",
      goalPerWeek: days,
    });
    router.replace("/(home)");
  }
  return (
    <Screen>
      <Brand />
      <Heading
        eyebrow="THE FIRST STEP"
        title="Make it their own."
        detail="A parent or guardian can set up a player in less than a minute."
      />
      <View style={[S.grid, { alignItems: "stretch" }]}>
        {wide && (
          <PhotoPanel
            style={{
              flex: 1,
              minHeight: 620,
              padding: 35,
              justifyContent: "space-between",
            }}
          >
            <Text style={[S.eyebrow, { color: C.lime }]}>
              WELCOME TO THE CLUB
            </Text>
            <View style={{ gap: 16 }}>
              <Text
                style={[
                  S.display,
                  { color: C.white, fontSize: 68, lineHeight: 64 },
                ]}
              >
                BIG DREAMS. SMALL STEPS.
              </Text>
              <Text style={[S.body, S.light]}>
                A little time together today. A stronger habit tomorrow.
              </Text>
            </View>
            <Text style={[S.small, S.light]}>PRACTICEPAL / BASEBALL</Text>
          </PhotoPanel>
        )}
        <Card style={{ flex: 1, minWidth: 260, width: "100%" }}>
          <Field
            label="Player nickname"
            placeholder="First name or nickname"
            value={name}
            onChangeText={setName}
            maxLength={30}
            autoComplete="off"
          />
          <Text style={S.small}>
            No full name, birthday, school, or email needed.
          </Text>
          <Text style={S.h3}>Practice days per week</Text>
          <View style={S.row}>
            {([3, 4, 5, 7] as const).map((d) => (
              <Chip
                key={d}
                title={`${d} days`}
                selected={d === days}
                onPress={() => setDays(d)}
              />
            ))}
          </View>
          <Text style={S.small}>
            A goal is a guide. Rest and recovery always come first.
          </Text>
          <Text style={S.h3}>What do they want to work on?</Text>
          <View style={S.row}>
            {["Hitting", "Fielding", "Throwing", "Footwork"].map((g) => (
              <Chip
                key={g}
                title={g}
                selected={goals.includes(g)}
                onPress={() =>
                  setGoals((p) =>
                    p.includes(g) ? p.filter((x) => x !== g) : [...p, g],
                  )
                }
              />
            ))}
          </View>
          <Chip
            title="I’m the parent or guardian setting this up"
            selected={confirmed}
            onPress={() => setConfirmed(!confirmed)}
          />
          <Button
            title="Create my plan"
            disabled={!name.trim() || !confirmed}
            onPress={start}
          />
          <Text style={S.small}>
            Records save in this browser or app only. Clearing site data removes
            them. Export a backup in Parent. No cloud account or cross-device
            sync.
          </Text>
          <Button
            title="Back"
            secondary
            onPress={() => router.replace("/onboarding")}
          />
        </Card>
      </View>
    </Screen>
  );
}
