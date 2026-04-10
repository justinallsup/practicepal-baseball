import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import { useStore } from '../../lib/store'

const GOALS = ['Consistency', 'Effort', 'Skill development', 'Confidence']

export default function GoalsScreen() {
  const setImprovementGoals = useStore(s => s.setImprovementGoals)
  const [selected, setSelected] = useState<string[]>([])

  const toggle = (goal: string) => {
    setSelected(prev =>
      prev.includes(goal) ? prev.filter(g => g !== goal) : [...prev, goal]
    )
  }

  const handleContinue = () => {
    setImprovementGoals(selected)
    router.push('/onboarding/reward-pick')
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.content}>
        <View style={styles.top}>
          <Text style={styles.step}>3 of 5</Text>
          <Text style={styles.title}>What would you like to improve?</Text>
          <Text style={styles.subtitle}>Select all that apply</Text>
        </View>
        <View style={styles.options}>
          {GOALS.map(goal => {
            const isSelected = selected.includes(goal)
            return (
              <TouchableOpacity
                key={goal}
                style={[styles.pill, isSelected && styles.pillSelected]}
                onPress={() => toggle(goal)}
                activeOpacity={0.8}
              >
                <Text style={[styles.pillText, isSelected && styles.pillTextSelected]}>
                  {goal}
                </Text>
              </TouchableOpacity>
            )
          })}
        </View>
        <TouchableOpacity
          style={[styles.button, selected.length === 0 && styles.buttonDisabled]}
          onPress={handleContinue}
          activeOpacity={0.85}
          disabled={selected.length === 0}
        >
          <Text style={styles.buttonText}>Continue →</Text>
        </TouchableOpacity>
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
    gap: 28,
  },
  top: {
    gap: 8,
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
  subtitle: {
    fontSize: 15,
    color: '#64748b',
  },
  options: {
    gap: 12,
  },
  pill: {
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#e2e8f0',
    paddingHorizontal: 24,
    paddingVertical: 18,
    alignItems: 'center',
  },
  pillSelected: {
    backgroundColor: '#eff6ff',
    borderColor: '#1e40af',
  },
  pillText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#475569',
  },
  pillTextSelected: {
    color: '#1e40af',
  },
  button: {
    backgroundColor: '#1e40af',
    borderRadius: 16,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
})
