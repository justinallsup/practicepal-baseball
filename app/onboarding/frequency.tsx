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

type Frequency = 'rarely' | '1-2x' | '3x+'

const OPTIONS: { value: Frequency; label: string }[] = [
  { value: 'rarely', label: 'Rarely' },
  { value: '1-2x', label: '1–2x per week' },
  { value: '3x+', label: '3+ times' },
]

export default function FrequencyScreen() {
  const setPracticeFrequency = useStore(s => s.setPracticeFrequency)

  const handleSelect = (freq: Frequency) => {
    setPracticeFrequency(freq)
    router.push('/onboarding/goals')
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.content}>
        <View style={styles.top}>
          <Text style={styles.step}>2 of 5</Text>
          <Text style={styles.title}>How often do they practice right now?</Text>
        </View>
        <View style={styles.options}>
          {OPTIONS.map(opt => (
            <TouchableOpacity
              key={opt.value}
              style={styles.pill}
              onPress={() => handleSelect(opt.value)}
              activeOpacity={0.8}
            >
              <Text style={styles.pillText}>{opt.label}</Text>
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
    paddingVertical: 18,
    alignItems: 'center',
  },
  pillText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e40af',
  },
})
