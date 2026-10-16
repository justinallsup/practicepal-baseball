import React from "react";
import { View, Text, useWindowDimensions } from "react-native";
import { router } from "expo-router";
import {
  ArrowUpRight,
  Target,
  CalendarCheck,
  ShieldCheck,
  Trophy,
} from "lucide-react-native";
import { Screen, Brand, Button, Card, C, S } from "../../components/ui";

export default function Welcome() {
  const wide = useWindowDimensions().width >= 800;
  return (
    <Screen>
      <View style={S.between}>
        <Brand />
        <Text style={S.eyebrow}>SMALL SESSIONS. BIG HABITS.</Text>
      </View>
      <View
        style={[
          S.hero,
          {
            padding: wide ? 48 : 26,
            flexDirection: wide ? "row" : "column",
            gap: 40,
            marginTop: 12,
          },
        ]}
      >
        <View style={{ flex: 1, gap: 22 }}>
          <Text style={[S.eyebrow, { color: "#E9AF92" }]}>
            A LITTLE BETTER. EVERY PRACTICE.
          </Text>
          <Text
            role="heading"
            aria-level={1}
            style={{
              fontSize: wide ? 60 : 42,
              lineHeight: wide ? 64 : 46,
              fontWeight: "800",
              color: C.white,
              letterSpacing: -2,
            }}
          >
            Great habits{"\n"}start in the{"\n"}backyard.
          </Text>
          <Text style={[S.body, S.light, { maxWidth: 420 }]}>
            Turn “we should practice” into a routine your player wants to keep.
            A clear plan, small wins, and progress you can see together.
          </Text>
          <Button
            title="Build your player’s plan"
            onPress={() => router.push("/onboarding/add-child")}
          />
          <Text style={[S.small, S.light]}>
            Free to use · No account or card needed · Parent-led setup
          </Text>
        </View>
        <View style={{ flex: 1, justifyContent: "center", gap: 16 }}>
          <Card
            style={{
              transform: [{ rotate: wide ? "2deg" : "0deg" }],
              borderColor: "#FFF",
            }}
          >
            <View style={S.between}>
              <Text style={S.eyebrow}>YOUR NEXT GOOD HABIT</Text>
              <Target size={22} color={C.red} />
            </View>
            <Text style={[S.h2, { fontSize: 29 }]}>
              Less planning.{"\n"}More playing.
            </Text>
            <Text style={S.body}>
              Choose a focus. Follow a drill. Celebrate showing up.
            </Text>
            <View style={S.rule} />
            {[
              "A weekly plan built around your goals",
              "A simple timer to stay focused",
              "Rewards chosen together",
            ].map((t, i) => (
              <View key={t} style={S.row}>
                <Text style={{ color: C.red, fontSize: 12, fontWeight: "800" }}>
                  0{i + 1}
                </Text>
                <Text style={[S.body, { flex: 1, color: C.navy }]}>{t}</Text>
              </View>
            ))}
          </Card>
          <View style={[S.row, { justifyContent: "center" }]}>
            <ShieldCheck color="#C5D3D9" size={17} />
            <Text style={[S.small, S.light]}>
              Your player’s records stay on this device.
            </Text>
          </View>
        </View>
      </View>
      <View style={S.grid}>
        {[
          {
            Icon: CalendarCheck,
            title: "Make practice doable",
            body: "Short, flexible sessions for hitting, fielding, throwing, and footwork.",
          },
          {
            Icon: Trophy,
            title: "Celebrate real progress",
            body: "Personal milestones and parent-recorded benchmarks. Every win is your own.",
          },
          {
            Icon: ShieldCheck,
            title: "Keep parents in control",
            body: "Approve rewards, adjust goals, and export or delete your family’s records.",
          },
        ].map(({ Icon, title, body }) => (
          <Card key={title} style={{ flex: 1, minWidth: 240 }}>
            <Icon size={25} color={C.red} />
            <Text style={S.h3}>{title}</Text>
            <Text style={S.body}>{body}</Text>
          </Card>
        ))}
      </View>
      <View style={S.between}>
        <Text style={S.small}>Built for the moments between games.</Text>
        <Button
          secondary
          title="Privacy & data"
          onPress={() => router.push("/privacy")}
        />
      </View>
    </Screen>
  );
}
