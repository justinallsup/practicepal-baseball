import React, { useEffect, useState } from "react";
import {
  Image,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Play } from "lucide-react-native";
import type { TrainingDrill } from "../lib/training-plan";
import guides from "../lib/drill-guides.json";
import DrillVideoPlayer from "./DrillVideoPlayer";
import { Button, C, S } from "./ui";

export default function DrillGuide({
  drill,
  compact = false,
}: {
  drill: TrainingDrill;
  compact?: boolean;
}) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open || Platform.OS !== "web") return;
    // During RN Web's modal entrance animation its parent can still be marked
    // active. Handle Escape first so it closes this guide, not the practice too.
    const closeGuide = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      event.stopImmediatePropagation();
      setOpen(false);
    };
    document.addEventListener("keyup", closeGuide, true);
    return () => document.removeEventListener("keyup", closeGuide, true);
  }, [open]);
  const guide = guides.find((g) => g.id === drill.id);
  if (!guide) return null;
  const source = `${Platform.OS === "web" ? "" : "https://baseballpracticepal.com"}/drills/v1/${guide.id}`;
  return (
    <>
      {compact ? (
        <Button
          secondary
          title={`Watch guide: ${drill.title}`}
          onPress={() => setOpen(true)}
        />
      ) : (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Watch guide: ${drill.title}`}
          onPress={() => setOpen(true)}
          style={({ pressed }) => ({
            borderRadius: 16,
            overflow: "hidden",
            backgroundColor: C.navy,
            opacity: pressed ? 0.85 : 1,
          })}
        >
          <Image
            source={{ uri: `${source}-thumb.jpg` }}
            style={{ width: "100%", aspectRatio: 2.55 }}
            accessibilityLabel={`${drill.title} setup`}
          />
          <View style={[S.between, { padding: 14, gap: 12 }]}>
            <View style={[S.row, { gap: 8 }]}>
              <View
                style={{
                  backgroundColor: C.lime,
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Play size={15} color={C.navy} fill={C.navy} />
              </View>
              <Text style={[S.small, { color: C.white, fontWeight: "700" }]}>
                Watch guide
              </Text>
            </View>
            <Text style={[S.small, { color: C.lime }]}>0:18 · Animated</Text>
          </View>
        </Pressable>
      )}
      {open ? (
        <Modal
          visible
          animationType="slide"
          onRequestClose={() => setOpen(false)}
        >
          <SafeAreaView style={S.page}>
            <ScrollView contentContainerStyle={[S.content, { maxWidth: 900 }]}>
              <View style={[S.between, { gap: 12 }]}>
                <Text style={S.eyebrow}>THE MOTION PLAYBOOK</Text>
                <Button
                  secondary
                  title="Close guide"
                  onPress={() => setOpen(false)}
                />
              </View>
              <Text role="heading" style={S.h2}>
                {drill.title}
              </Text>
              <Text style={S.small}>
                18-second animated guide · Sound-free · PracticePal original
              </Text>
              <DrillVideoPlayer
                key={guide.id}
                source={source}
                title={drill.title}
              />
              <Text style={S.h3}>The drill, step by step</Text>
              {guide.steps.map((step, i) => (
                <View
                  key={step.title}
                  style={{ flexDirection: "row", gap: 14, paddingVertical: 7 }}
                >
                  <Text style={[S.eyebrow, { color: C.green, paddingTop: 4 }]}>
                    0{i + 1}
                  </Text>
                  <View style={{ flex: 1, gap: 5 }}>
                    <Text style={S.h3}>{step.title}</Text>
                    <Text style={S.body}>{step.cue}</Text>
                  </View>
                </View>
              ))}
              <View
                style={{
                  backgroundColor: C.pale,
                  borderRadius: 16,
                  padding: 18,
                  gap: 8,
                }}
              >
                <Text style={S.eyebrow}>TAKE IT TO THE FIELD</Text>
                <Text style={S.small}>Bring: {drill.equipment}</Text>
                <Text style={S.body}>{drill.instructions}</Text>
                <Text style={S.small}>{drill.safety}</Text>
              </View>
              <Text style={S.small}>
                A simplified setup and movement guide. Practice with an adult
                and follow your coach’s technique advice.
              </Text>
            </ScrollView>
          </SafeAreaView>
        </Modal>
      ) : null}
    </>
  );
}
