import React, { useEffect } from 'react'
import { Tabs } from 'expo-router'
import { useStore } from '../../lib/store'
import { router } from 'expo-router'
import { Text } from 'react-native'

function TabIcon({ emoji }: { emoji: string }) {
  return <Text style={{ fontSize: 20 }}>{emoji}</Text>
}

export default function HomeLayout() {
  const isTrialExpired = useStore(s => s.isTrialExpired)
  const subscriptionStatus = useStore(s => s.subscriptionStatus)

  useEffect(() => {
    if (isTrialExpired() && subscriptionStatus !== 'active') {
      router.replace('/(home)/paywall')
    }
  }, [subscriptionStatus])

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopColor: '#f1f5f9',
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 8,
        },
        tabBarActiveTintColor: '#1e40af',
        tabBarInactiveTintColor: '#94a3b8',
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => <TabIcon emoji="🏠" />,
        }}
      />
      <Tabs.Screen
        name="kid-mode"
        options={{
          title: 'Kid Mode',
          tabBarIcon: ({ focused }) => <TabIcon emoji="⚾" />,
        }}
      />
      <Tabs.Screen
        name="store"
        options={{
          title: 'Store',
          tabBarIcon: ({ focused }) => <TabIcon emoji="🛒" />,
        }}
      />
      <Tabs.Screen
        name="leaderboard"
        options={{
          title: 'Leaderboard',
          tabBarIcon: ({ focused }) => <TabIcon emoji="🏆" />,
        }}
      />
      <Tabs.Screen
        name="parent"
        options={{
          title: 'Parent',
          tabBarIcon: ({ focused }) => <TabIcon emoji="👨‍👩‍👧" />,
        }}
      />
      {/* Hidden screens - not shown in tab bar */}
      <Tabs.Screen
        name="weekly"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="paywall"
        options={{
          href: null,
        }}
      />
    </Tabs>
  )
}
