import React, { useState, useRef } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import { useStore } from '../../lib/store'
import { ProgressBar } from '../../components/ProgressBar'

const GOALS = [
  { value: 'Getting them to practice at all', icon: '😩' },
  { value: 'Staying consistent', icon: '📅' },
  { value: 'Giving full effort', icon: '💪' },
  { value: 'Building confidence in games', icon: '⭐' },
]

export default function GoalsScreen() {
  const setImprovementGoals = useStore(s => s.setImprovementGoals)
  const [selected, setSelected] = useState<string[]>([])
  const [showFeedback, setShowFeedback] = useState(false)
  const fadeAnim = useRef(new Animated.Value(0)).current
  const buttonScale = useRef(new Animated.Value(1)).current

  const toggle = (goal: string) => {
    setSelected(prev =>
      prev.includes(goal) ? prev.filter(g => g !== goal) : [...prev, goal]
    )
  }

  const handleContinue = () => {
    // Button press animation
    Animated.sequence([
      Animated.timing(buttonScale, {
        toValue: 0.97,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(buttonScale, {
        toValue: 1,
        friction: 5,
        useNativeDriver: true,
      }),
    ]).start()

    setImprovementGoals(selected)
    
    setShowFeedback(true)
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.delay(1200),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowFeedback(false)
      router.push('/onboarding/reward-pick')
    })
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ProgressBar currentStep={3} totalSteps={6} />
      <View style={styles.content}>
        <View style={styles.top}>
          <Text style={styles.step}>3 of 6</Text>
          <Text style={styles.title}>🎯 What's the biggest struggle right now?</Text>
          <Text style={styles.subtitle}>Select all that apply</Text>
        </View>
        <View style={styles.options}>
          {GOALS.map((goal, idx) => {
            const isSelected = selected.includes(goal.value)
            return (
              <TouchableOpacity
                key={goal.value}
                style={[
                  styles.pill,
                  isSelected && styles.pillSelected,
                  idx === 0 && !isSelected && styles.pillPopular,
                ]}
                onPress={() => toggle(goal.value)}
                activeOpacity={1}
              >
                {idx === 0 && !isSelected && (
                  <View style={styles.popularBadge}>
                    <Text style={styles.popularText}>#1 issue</Text>
                  </View>
                )}
                <Text style={styles.pillIcon}>{goal.icon}</Text>
                <Text style={[styles.pillText, isSelected && styles.pillTextSelected]}>
                  {goal.value}
                </Text>
                {isSelected && (
                  <View style={styles.checkmark}>
                    <Text style={styles.checkmarkText}>✓</Text>
                  </View>
                )}
              </TouchableOpacity>
            )
          })}
        </View>
        <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
          <TouchableOpacity
            style={[styles.button, selected.length === 0 && styles.buttonDisabled]}
            onPress={handleContinue}
            activeOpacity={1}
            disabled={selected.length === 0}
          >
            <Text style={styles.buttonText}>Continue →</Text>
          </TouchableOpacity>
        </Animated.View>

        {showFeedback && (
          <Animated.View style={[styles.feedbackToast, { opacity: fadeAnim }]}>
            <Text style={styles.feedbackText}>Perfect. Let's build a plan 🎯</Text>
          </Animated.View>
        )}
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
    fontSize: 32,
    fontWeight: '800',
    color: '#0f172a',
    lineHeight: 40,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
    fontWeight: '500',
  },
  options: {
    gap: 14,
  },
  pill: {
    backgroundColor: '#fff',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#e2e8f0',
    paddingHorizontal: 24,
    paddingVertical: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    position: 'relative',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  pillPopular: {
    backgroundColor: '#fffbeb',
    borderColor: '#fbbf24',
    borderWidth: 3,
    shadowColor: '#fbbf24',
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  popularBadge: {
    position: 'absolute',
    top: -10,
    right: 16,
    backgroundColor: '#fbbf24',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  popularText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#78350f',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  pillSelected: {
    backgroundColor: '#eff6ff',
    borderColor: '#1e40af',
    borderWidth: 3,
    shadowColor: '#1e40af',
    shadowOpacity: 0.2,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  pillIcon: {
    fontSize: 32,
  },
  pillText: {
    flex: 1,
    fontSize: 17,
    fontWeight: '600',
    color: '#475569',
  },
  pillTextSelected: {
    color: '#1e40af',
    fontWeight: '700',
  },
  checkmark: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#1e40af',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
  },
  button: {
    backgroundColor: '#1e40af',
    borderRadius: 18,
    height: 64,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#1e40af',
    shadowOpacity: 0.3,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  buttonDisabled: {
    opacity: 0.4,
    shadowOpacity: 0,
  },
  buttonText: {
    color: '#fff',
    fontSize: 19,
    fontWeight: '800',
  },
  feedbackToast: {
    position: 'absolute',
    bottom: 100,
    left: 32,
    right: 32,
    backgroundColor: '#22c55e',
    borderRadius: 20,
    paddingVertical: 18,
    paddingHorizontal: 24,
    alignItems: 'center',
    shadowColor: '#22c55e',
    shadowOpacity: 0.3,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  feedbackText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#fff',
  },
})
