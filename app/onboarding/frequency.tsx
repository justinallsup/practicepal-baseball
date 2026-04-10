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
  const fadeAnim = useRef(new Animated.Value(0)).current
  const scaleAnims = useRef(OPTIONS.map(() => new Animated.Value(1))).current

  const handlePress = (freq: Frequency, index: number) => {
    // Tap scale animation
    Animated.sequence([
      Animated.timing(scaleAnims[index], {
        toValue: 0.97,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnims[index], {
        toValue: 1,
        friction: 5,
        useNativeDriver: true,
      }),
    ]).start()

    // Proceed with selection
    setTimeout(() => handleSelect(freq), 150)
  }

  const handleSelect = (freq: Frequency) => {
    setPracticeFrequency(freq)
    
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
      <ProgressBar currentStep={2} totalSteps={6} />
      <View style={styles.content}>
        <View style={styles.top}>
          <Text style={styles.step}>2 of 6</Text>
          <Text style={styles.title}>⚾ How often are they practicing right now?</Text>
        </View>
        <View style={styles.options}>
          {OPTIONS.map((opt, idx) => (
            <Animated.View
              key={opt.value}
              style={{ transform: [{ scale: scaleAnims[idx] }] }}
            >
              <TouchableOpacity
                style={[
                  styles.pill,
                  idx === 1 && styles.pillPopular,
                ]}
                onPress={() => handlePress(opt.value, idx)}
                activeOpacity={1}
              >
                {idx === 1 && (
                  <View style={styles.popularBadge}>
                    <Text style={styles.popularText}>Most common</Text>
                  </View>
                )}
                <Text style={styles.pillIcon}>{opt.icon}</Text>
                <Text style={styles.pillText}>{opt.label}</Text>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>

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
    gap: 40,
  },
  top: {
    gap: 16,
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
  options: {
    gap: 16,
  },
  pill: {
    backgroundColor: '#fff',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#e2e8f0',
    paddingHorizontal: 24,
    paddingVertical: 22,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    position: 'relative',
    shadowColor: '#000',
    shadowOpacity: 0.06,
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
  pillIcon: {
    fontSize: 32,
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
