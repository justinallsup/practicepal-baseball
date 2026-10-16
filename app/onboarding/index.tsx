import React from "react";
import { View, Text, useWindowDimensions } from "react-native";
import { router } from "expo-router";
import {
  Target,
  ShieldCheck,
  Timer,
  ArrowDownRight,
  Check,
  Star,
} from "lucide-react-native";
import { Screen, Brand, Button, Card, C, D, F, S } from "../../components/ui";
import {
  PhotoPanel,
  Medal,
  Ring,
  SectionTitle,
} from "../../components/ClubVisuals";
export default function Welcome() {
  const wide = useWindowDimensions().width >= 800;
  return (
    <Screen>
      <View style={[S.between, { paddingBottom: 8 }]}>
        <Brand />
        <View style={S.row}>
          {wide && <Text style={S.small}>FOR THE LOVE OF THE GAME.</Text>}
          <View
            style={{
              backgroundColor: C.pale,
              borderRadius: 20,
              paddingHorizontal: 12,
              paddingVertical: 8,
            }}
          >
            <Text style={[S.eyebrow, { fontSize: 8, letterSpacing: 1 }]}>
              PARENT LED. PLAYER LOVED.
            </Text>
          </View>
        </View>
      </View>
      <PhotoPanel style={{ minHeight: wide ? 580 : 510 }}>
        <View
          style={{
            padding: wide ? 48 : 26,
            flex: 1,
            justifyContent: "space-between",
            gap: 28,
          }}
        >
          <View style={[S.row, { gap: 8 }]}>
            <View
              style={{
                height: 6,
                width: 6,
                borderRadius: 3,
                backgroundColor: C.lime,
              }}
            />
            <Text style={[S.eyebrow, { color: C.lime, fontSize: 9 }]}>
              A LITTLE BETTER. EVERY PRACTICE.
            </Text>
          </View>
          <View style={{ gap: 20, maxWidth: wide ? 520 : 300 }}>
            <Text
              role="heading"
              aria-level={1}
              style={[
                S.display,
                {
                  color: C.white,
                  fontSize: wide ? 90 : 52,
                  lineHeight: wide ? 82 : 51,
                },
              ]}
            >
              Great habits{"\n"}start in the{"\n"}
              <Text style={{ color: C.lime }}>backyard.</Text>
            </Text>
            <Text
              style={[
                S.body,
                {
                  color: "#E0E7DD",
                  maxWidth: 360,
                  fontSize: 13,
                  lineHeight: 22,
                },
              ]}
            >
              Less “you should practice.” More “let’s go.” Build a routine your
              player wants to keep, one small win at a time.
            </Text>
          </View>
          <View style={{ gap: 14, maxWidth: 340 }}>
            <Button
              gold
              title="Build your player’s plan"
              onPress={() => router.push("/onboarding/add-child")}
            />
            <Text style={[S.small, { color: "#D7DFD2", fontSize: 10 }]}>
              Free to use · No account or card needed · Parent-led setup
            </Text>
          </View>
        </View>
        {wide && (
          <View
            style={{
              position: "absolute",
              right: 32,
              bottom: 32,
              width: 238,
              padding: 20,
              backgroundColor: "rgba(248,247,239,.96)",
              borderRadius: 18,
              gap: 11,
              transform: [{ rotate: "-3deg" }],
            }}
          >
            <View style={S.between}>
              <Text style={S.eyebrow}>THE PRACTICE MINDSET</Text>
              <Star color={C.gold} size={17} />
            </View>
            <Text style={[S.h3, { fontSize: 19 }]}>
              Show up. Have fun.{"\n"}Do it again.
            </Text>
            <View style={{ flexDirection: "row", gap: 5 }}>
              {["PLAN", "PRACTICE", "CELEBRATE"].map((t) => (
                <View
                  key={t}
                  style={{
                    flex: 1,
                    backgroundColor: C.pale,
                    borderRadius: 6,
                    paddingVertical: 7,
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={[S.eyebrow, { fontSize: 6, letterSpacing: 0.5 }]}
                  >
                    {t}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </PhotoPanel>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          flexWrap: "wrap",
          gap: 18,
          paddingVertical: 13,
          borderBottomWidth: 1,
          borderBottomColor: C.line,
        }}
      >
        {["HITTING", "FIELDING", "THROWING", "FOOTWORK"].map((t) => (
          <Text
            key={t}
            style={[
              S.eyebrow,
              {
                color: C.muted,
                fontSize: wide ? 11 : 8,
                letterSpacing: wide ? 3 : 1.5,
              },
            ]}
          >
            {t}
          </Text>
        ))}
      </View>
      <View style={[S.between, { marginTop: 8 }]}>
        <SectionTitle
          label="A BETTER ROUTINE STARTS HERE"
          title="Little moments. Lasting confidence."
        />
        <Text style={[S.body, { maxWidth: 350 }]}>
          Made for the moments between games, and the people cheering them on.
        </Text>
      </View>
      <View style={S.grid}>
        <Card
          style={{
            flex: 1,
            minWidth: 240,
            backgroundColor: C.navy,
            borderColor: C.navy,
          }}
        >
          <View style={S.between}>
            <Text style={[S.eyebrow, { color: C.lime }]}>
              01 / FIND YOUR RHYTHM
            </Text>
            <Timer color={C.lime} size={22} />
          </View>
          <Text
            style={[
              S.display,
              { fontSize: 44, lineHeight: 43, color: C.white },
            ]}
          >
            LESS PLANNING.{"\n"}MORE PLAYING.
          </Text>
          <Text style={[S.body, S.light]}>
            A clear plan, easy-to-follow drills, and a timer that keeps practice
            simple.
          </Text>
          <View style={{ flexDirection: "row", gap: 6, marginTop: 10 }}>
            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
              <View
                key={i}
                style={{
                  flex: 1,
                  height: 40,
                  borderRadius: 8,
                  backgroundColor: [1, 3, 5].includes(i) ? C.lime : "#2B483D",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {[1, 3, 5].includes(i) ? (
                  <Check size={15} color={C.navy} />
                ) : (
                  <View
                    style={{
                      height: 4,
                      width: 4,
                      borderRadius: 2,
                      backgroundColor: "#809188",
                    }}
                  />
                )}
              </View>
            ))}
          </View>
        </Card>
        <Card style={{ flex: 1, minWidth: 240, backgroundColor: "#ECEEE2" }}>
          <View style={S.between}>
            <Text style={S.eyebrow}>02 / SEE THE SMALL WINS</Text>
            <Medal size={63} />
          </View>
          <Text style={[S.display, { fontSize: 44, lineHeight: 43 }]}>
            EFFORT YOU{"\n"}CAN SEE.
          </Text>
          <Text style={S.body}>
            Real milestones and personal benchmarks. Progress that belongs to
            your player.
          </Text>
        </Card>
        <PhotoPanel
          glove
          strong
          style={{
            flex: 1,
            minWidth: 240,
            minHeight: 280,
            padding: 24,
            justifyContent: "space-between",
          }}
        >
          <Text style={[S.eyebrow, { color: C.lime }]}>
            03 / MAKE IT A FAMILY THING
          </Text>
          <View style={{ gap: 10 }}>
            <Text
              style={[
                S.display,
                { fontSize: 44, lineHeight: 43, color: C.white },
              ]}
            >
              PLAY FOR{"\n"}SOMETHING GOOD.
            </Text>
            <Text style={[S.body, S.light]}>
              Rewards chosen together. Every request approved by a parent.
            </Text>
          </View>
        </PhotoPanel>
      </View>
      <View style={[S.between, { paddingTop: 6 }]}>
        <View style={[S.row, { gap: 8 }]}>
          <ShieldCheck size={17} color={C.green} />
          <Text style={S.small}>
            Your player’s records stay on this device.
          </Text>
        </View>
        <Button
          secondary
          title="Privacy & data"
          onPress={() => router.push("/privacy")}
        />
      </View>
    </Screen>
  );
}
