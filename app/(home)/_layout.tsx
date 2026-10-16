import React, { useEffect, useState } from "react";
import { Tabs, Redirect } from "expo-router";
import {
  House,
  Target,
  ChartNoAxesColumn,
  Gift,
  ShieldCheck,
} from "lucide-react-native";
import { useStore } from "../../lib/store";
import { C } from "../../components/ui";
export default function Layout() {
  const complete = useStore((s) => s.onboardingComplete);
  const [ready, setReady] = useState(useStore.persist.hasHydrated());
  useEffect(() => {
    const unsub = useStore.persist.onFinishHydration(() => setReady(true));
    if (useStore.persist.hasHydrated()) setReady(true);
    return unsub;
  }, []);
  if (!ready) return null;
  if (!complete) return <Redirect href="/onboarding" />;
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: C.red,
        tabBarInactiveTintColor: C.muted,
        tabBarStyle: {
          backgroundColor: C.white,
          borderTopColor: C.line,
          height: 70,
          paddingTop: 8,
          paddingBottom: 10,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: "700" },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Today",
          tabBarIcon: ({ color }) => <House color={color} size={21} />,
        }}
      />
      <Tabs.Screen
        name="training"
        options={{
          title: "Training",
          tabBarIcon: ({ color }) => <Target color={color} size={21} />,
        }}
      />
      <Tabs.Screen
        name="weekly"
        options={{
          title: "Progress",
          tabBarIcon: ({ color }) => (
            <ChartNoAxesColumn color={color} size={21} />
          ),
        }}
      />
      <Tabs.Screen
        name="store"
        options={{
          title: "Rewards",
          tabBarIcon: ({ color }) => <Gift color={color} size={21} />,
        }}
      />
      <Tabs.Screen
        name="parent"
        options={{
          title: "Parent",
          tabBarIcon: ({ color }) => <ShieldCheck color={color} size={21} />,
        }}
      />
      {["kid-mode", "leaderboard", "paywall"].map((name) => (
        <Tabs.Screen key={name} name={name} options={{ href: null }} />
      ))}
    </Tabs>
  );
}
