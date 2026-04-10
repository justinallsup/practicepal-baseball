import React, { useState } from 'react'
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
  const fadeAnim = React.useRef(new Animated.Value(0)).current

  const toggle = (goal: string) => {
    setSelected(prev =>
      prev.includes(goal) ? prev.filter(g => g !== goal) : [...prev, goal]
    )
  }

  const handleContinue = () => {
    setImprovementGoals(selected)
    
    // Show brief feedback
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
      <View style={styles.content}>
        <View style={styles.top}>
          <Text style={styles.step}>3 of 6</Text>
          <Text style={styles.title}>What's the biggest struggle right now?</Text>
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
                activeOpacity={0.8}
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
        <TouchableOpacity
          style={[styles.button, selected.length === 0 && styles.buttonDisabled]}
          onPress={handleContinue}
          activeOpacity={0.85}
          disabled={selected.length === 0}
        >
          <Text style={styles.buttonText}>Continue →</Text>
        </TouchableOpacity>

        {/* Feedback toast */}
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
    paddingVertical: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    position: 'relative',
  },
  pillPopular: {
    backgroundColor: '#fef3c7',
    borderColor: '#fbbf24',
    borderWidth: 3,
  },
  popularBadge: {
    position: 'absolute',
    top: -10,
    right: 16,
    backgroundColor: '#fbbf24',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
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
  },
  pillIcon: {
    fontSize: 28,
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
  feedbackToast: {
    position: 'absolute',
    bottom: 100,
    left: 32,
    right: 32,
    backgroundColor: '#22c55e',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  feedbackText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
})
