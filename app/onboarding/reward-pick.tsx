import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import { useStore } from '../../lib/store'

const REWARDS = [
  { label: 'Ice Cream 🍦', value: 'Ice Cream' },
  { label: 'Batting Gloves 🧤', value: 'Batting Gloves' },
  { label: 'New Bat 🔥', value: 'New Bat' },
]

export default function RewardPickScreen() {
  const setOnboardingRewardSuggestion = useStore(s => s.setOnboardingRewardSuggestion)

  const handleSelect = (reward: string) => {
    setOnboardingRewardSuggestion(reward)
    router.push('/onboarding/trial')
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.content}>
        <View style={styles.top}>
          <Text style={styles.step}>4 of 5</Text>
          <Text style={styles.title}>Pick a reward that would motivate them</Text>
        </View>
        <View style={styles.options}>
          {REWARDS.map(reward => (
            <TouchableOpacity
              key={reward.value}
              style={styles.pill}
              onPress={() => handleSelect(reward.value)}
              activeOpacity={0.8}
            >
              <Text style={styles.pillText}>{reward.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 32,
    justifyContent: 'center',
    gap: 32,
  },
  top: {
    gap: 12,
  },
  step: {
    fontSize: 13,
    fontWeight: '600',
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0f172a',
    lineHeight: 36,
  },
  options: {
    gap: 14,
  },
  pill: {
    backgroundColor: '#eff6ff',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#bfdbfe',
    paddingHorizontal: 24,
    paddingVertical: 20,
    alignItems: 'center',
  },
  pillText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e40af',
  },
})
