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
import { C, F } from "../../components/ui";
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
        tabBarActiveTintColor: C.lime,
        tabBarInactiveTintColor: "#B4C5B9",
        tabBarStyle: {
          backgroundColor: C.navy,
          borderTopColor: "#29483C",
          height: 76,
          paddingTop: 8,
          paddingBottom: 10,
        },
        tabBarLabelStyle: { fontFamily: F, fontSize: 10, fontWeight: "800" },
        tabBarActiveBackgroundColor: "#1B3B31",
        tabBarItemStyle: { marginHorizontal: 4, borderRadius: 14 },
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
          title: "Play",
          tabBarIcon: ({ color }) => <Target color={color} size={21} />,
        }}
      />
      <Tabs.Screen
        name="store"
        options={{
          title: "Rewards",
          tabBarActiveTintColor: C.navy,
          tabBarActiveBackgroundColor: C.electric,
          tabBarIcon: ({ color }) => <Gift color={color} size={21} />,
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
