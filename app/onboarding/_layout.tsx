import React, { useEffect, useState } from "react";
import { Stack, Redirect } from "expo-router";
import { useStore } from "../../lib/store";
export default function OnboardingLayout() {
  const complete = useStore((s) => s.onboardingComplete);
  const [ready, setReady] = useState(useStore.persist.hasHydrated());
  useEffect(() => {
    const unsub = useStore.persist.onFinishHydration(() => setReady(true));
    if (useStore.persist.hasHydrated()) setReady(true);
    return unsub;
  }, []);
  if (!ready) return null;
  if (complete) return <Redirect href="/(home)" />;
  return <Stack screenOptions={{ headerShown: false }} />;
}
