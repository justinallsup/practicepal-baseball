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

type Frequency = 'rarely' | '1-2x' | '3x+'

const OPTIONS: { value: Frequency; label: string; icon: string }[] = [
  { value: 'rarely', label: 'Almost never', icon: '😐' },
  { value: '1-2x', label: '1–2 times per week', icon: '⚾' },
  { value: '3x+', label: '3+ times per week', icon: '🔥' },
]

export default function FrequencyScreen() {
  const setPracticeFrequency = useStore(s => s.setPracticeFrequency)
  const [showFeedback, setShowFeedback] = useState(false)
  const [feedbackText, setFeedbackText] = useState('')
  const fadeAnim = React.useRef(new Animated.Value(0)).current

  const handleSelect = (freq: Frequency) => {
    setPracticeFrequency(freq)
    
    // Show brief feedback
    let feedback = 'Got it 👍'
    if (freq === 'rarely') feedback = "We'll help fix that 💪"
    if (freq === '3x+') feedback = 'Nice — consistency builds results 🔥'
    
    setFeedbackText(feedback)
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
      router.push('/onboarding/goals')
    })
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.content}>
        <View style={styles.top}>
          <Text style={styles.step}>2 of 6</Text>
          <Text style={styles.title}>How often are they practicing right now?</Text>
        </View>
        <View style={styles.options}>
          {OPTIONS.map((opt, idx) => (
            <TouchableOpacity
              key={opt.value}
              style={[
                styles.pill,
                idx === 1 && styles.pillPopular, // Most popular
              ]}
              onPress={() => handleSelect(opt.value)}
              activeOpacity={0.8}
            >
              {idx === 1 && (
                <View style={styles.popularBadge}>
                  <Text style={styles.popularText}>Most common</Text>
                </View>
              )}
              <Text style={styles.pillIcon}>{opt.icon}</Text>
              <Text style={styles.pillText}>{opt.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Feedback toast */}
        {showFeedback && (
          <Animated.View style={[styles.feedbackToast, { opacity: fadeAnim }]}>
            <Text style={styles.feedbackText}>{feedbackText}</Text>
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
    fontSize: 28,
    fontWeight: '800',
    color: '#0f172a',
    lineHeight: 36,
  },
  options: {
    gap: 14,
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
  pillIcon: {
    fontSize: 28,
  },
  pillText: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
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
