import React, { useEffect, useState } from "react";
import { Modal, Platform, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowUpRight, BookOpen, Play } from "lucide-react-native";
import type { TrainingDrill } from "../lib/training-plan";
import guides from "../lib/drill-guides.json";
import CoachingVideoLink from "./CoachingVideoLink";
import { PhotoPanel } from "./ClubVisuals";
import { Button, C, S } from "./ui";

export default function DrillGuide({ drill, compact = false }: {
  drill: TrainingDrill; compact?: boolean;
}) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open || Platform.OS !== "web") return;
    // Keep Escape scoped to this guide while the parent practice modal is open.
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
  return (
    <>
      {compact ? (
        <Button secondary title={`Open guide: ${drill.title}`} onPress={() => setOpen(true)} />
      ) : (
        <Pressable accessibilityRole="button" accessibilityLabel={`Open guide: ${drill.title}`}
          onPress={() => setOpen(true)} style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}>
          <PhotoPanel glove={guide.category !== "Hitting"} style={{ minHeight: 172, borderRadius: 16, padding: 18, justifyContent: "space-between", gap: 26 }}>
            <View style={S.between}>
              <Text style={[S.eyebrow, { color: C.lime }]}>{guide.category.toUpperCase()} / GUIDE</Text>
              <BookOpen size={18} color={C.lime} />
            </View>
            <View style={[S.between, { gap: 12 }]}>
              <View style={{ flex: 1, gap: 5 }}>
                <Text style={[S.h3, { color: C.white }]}>Learn the movement</Text>
                <Text style={[S.small, { color: "#D3DFD5" }]}>{guide.resource.kind === "video" ? "Video reference" : "Written reference"} · {guide.resource.provider}</Text>
              </View>
              <ArrowUpRight size={24} color={C.lime} />
            </View>
          </PhotoPanel>
        </Pressable>
      )}
      {open ? (
        <Modal visible animationType="slide" onRequestClose={() => setOpen(false)}>
          <SafeAreaView style={S.page}>
            <ScrollView contentContainerStyle={[S.content, { maxWidth: 900 }]}>
              <View style={[S.between, { gap: 12 }]}>
                <Text style={S.eyebrow}>THE FIELD GUIDE</Text>
                <Button secondary title="Close guide" onPress={() => setOpen(false)} />
              </View>
              <Text role="heading" style={S.h2}>{drill.title}</Text>
              <View style={{ backgroundColor: C.navy, borderRadius: 22, padding: 24, gap: 16 }}>
                <View style={[S.row, { gap: 12 }]}>
                  <View style={{ width: 42, height: 42, borderRadius: 21, backgroundColor: C.lime, alignItems: "center", justifyContent: "center" }}>
                    <Play size={18} fill={C.navy} color={C.navy} />
                  </View>
                  <Text style={[S.eyebrow, { color: C.lime, flex: 1 }]}>{guide.resource.kind === "video" ? "WATCH THE FUNDAMENTALS" : "LEARN THE FOOTWORK"}</Text>
                </View>
                <Text style={[S.h2, { color: C.white }]}>{guide.resource.title}</Text>
                <Text style={[S.small, { color: "#D3DFD5" }]}>{guide.resource.kind === "video" ? "Video by" : "Written guide by"} {guide.resource.provider}</Text>
                <Text style={[S.body, { color: C.white }]}>{guide.resource.note}</Text>
                <CoachingVideoLink url={guide.resource.url} provider={guide.resource.provider} kind={guide.resource.kind} />
                <Text style={[S.small, { color: "#D3DFD5" }]}>Opens an external website. Watch with an adult; the provider may show ads or use cookies.</Text>
              </View>
              <Text style={S.h3}>Your practice cues</Text>
              {guide.steps.map((step, i) => (
                <View key={step.title} style={{ flexDirection: "row", gap: 14, paddingVertical: 7 }}>
                  <Text style={[S.eyebrow, { color: C.green, paddingTop: 4 }]}>0{i + 1}</Text>
                  <View style={{ flex: 1, gap: 5 }}>
                    <Text style={S.h3}>{step.title}</Text>
                    <Text style={S.body}>{step.cue}</Text>
                  </View>
                </View>
              ))}
              <View style={{ backgroundColor: C.pale, borderRadius: 16, padding: 18, gap: 8 }}>
                <Text style={S.eyebrow}>TAKE IT TO THE FIELD</Text>
                <Text style={S.small}>Bring: {drill.equipment}</Text>
                <Text style={S.body}>{drill.instructions}</Text>
                <Text style={S.small}>{drill.safety}</Text>
              </View>
              <Text style={S.small}>These independent references teach related fundamentals; they may use different equipment or repetitions. PracticePal is not affiliated with the providers. Follow your coach’s technique advice.</Text>
            </ScrollView>
          </SafeAreaView>
        </Modal>
      ) : null}
    </>
  );
}
