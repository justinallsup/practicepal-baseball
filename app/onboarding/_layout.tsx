import React from 'react'
import { Stack } from 'expo-router'

export default function OnboardingLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="welcome" />
      <Stack.Screen name="add-child" />
      <Stack.Screen name="set-goal" />
      <Stack.Screen name="add-reward" />
    </Stack>
  )
}
