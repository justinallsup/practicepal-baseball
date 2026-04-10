import React, { useEffect, useRef } from 'react'
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

export default function SetGoalScreen() {
  const onboardingRewardSuggestion = useStore(s => s.onboardingRewardSuggestion)
  const buttonScale = useRef(new Animated.Value(1)).current
  const cardScale = useRef(new Animated.Value(0.9)).current
  const fadeAnim = useRef(new Animated.Value(0)).current

  const [rewardName, practiceCount] = onboardingRewardSuggestion?.split('|') || ['Practice Goal', '5']
  const practices = parseInt(practiceCount) || 5

  useEffect(() => {
    // Entrance animation
    Animated.parallel([
      Animated.spring(cardScale, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start()
  }, [])

  const handleContinue = () => {
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

    setTimeout(() => router.push('/onboarding/trial'), 150)
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ProgressBar currentStep={5} totalSteps={6} />
      <View style={styles.content}>
        <View style={styles.top}>
          <Text style={styles.step}>5 of 6</Text>
          <Text style={styles.title}>✨ Here's how this works</Text>
        </View>

        <Animated.View style={[styles.body, { opacity: fadeAnim }]}>
          <Animated.View style={[styles.goalCard, { transform: [{ scale: cardScale }] }]}>
            <Text style={styles.goalEmoji}>🎯</Text>
            <Text style={styles.goalTitle}>{rewardName}</Text>
            <View style={styles.progressDisplay}>
              <Text style={styles.progressText}>0 / {practices} practices</Text>
            </View>
          </Animated.View>

          <View style={styles.steps}>
            <View style={styles.stepRow}>
              <View style={styles.stepIcon}>
                <Text style={styles.stepIconText}>1</Text>
              </View>
              <Text style={styles.stepText}>
                Complete <Text style={styles.stepBold}>{practices} practices</Text> to earn: <Text style={styles.stepBold}>{rewardName}</Text>
              </Text>
            </View>

            <View style={styles.stepRow}>
              <View style={styles.stepIcon}>
                <Text style={styles.stepIconText}>2</Text>
              </View>
              <Text style={styles.stepText}>
                Each practice takes about <Text style={styles.stepBold}>10–15 minutes</Text>
              </Text>
            </View>

            <View style={styles.stepRow}>
              <View style={styles.stepIcon}>
                <Text style={styles.stepIconText}>3</Text>
              </View>
              <Text style={styles.stepText}>
                Stay consistent to <Text style={styles.stepBold}>unlock rewards faster</Text>
              </Text>
            </View>
          </View>

          <View style={styles.progressBar}>
            <View style={styles.progressBarTrack}>
              <View style={[styles.progressBarFill, { width: '0%' }]} />
            </View>
            <View style={styles.progressLabels}>
              <Text style={styles.progressLabel}>Start</Text>
              <Text style={styles.progressLabel}>{practices} practices</Text>
            </View>
          </View>
        </Animated.View>

        <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
          <TouchableOpacity
            style={styles.button}
            onPress={handleContinue}
            activeOpacity={1}
          >
            <Text style={styles.buttonText}>Got it</Text>
          </TouchableOpacity>
        </Animated.View>
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
    justifyContent: 'space-between',
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
  body: {
    gap: 36,
  },
  goalCard: {
    backgroundColor: '#eff6ff',
    borderRadius: 28,
    borderWidth: 3,
    borderColor: '#bfdbfe',
    paddingVertical: 32,
    paddingHorizontal: 24,
    alignItems: 'center',
    gap: 14,
    shadowColor: '#1e40af',
    shadowOpacity: 0.15,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  goalEmoji: {
    fontSize: 64,
  },
  goalTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1e40af',
    textAlign: 'center',
  },
  progressDisplay: {
    backgroundColor: 'rgba(30, 64, 175, 0.1)',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 14,
    marginTop: 8,
  },
  progressText: {
    fontSize: 19,
    fontWeight: '700',
    color: '#1e40af',
  },
  steps: {
    gap: 22,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
  },
  stepIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#1e40af',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#1e40af',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  stepIconText: {
    fontSize: 17,
    fontWeight: '800',
    color: '#fff',
  },
  stepText: {
    flex: 1,
    fontSize: 17,
    color: '#475569',
    lineHeight: 26,
  },
  stepBold: {
    fontWeight: '700',
    color: '#0f172a',
  },
  progressBar: {
    gap: 10,
  },
  progressBarTrack: {
    height: 12,
    backgroundColor: '#e2e8f0',
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#1e40af',
    borderRadius: 6,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
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
  buttonText: {
    color: '#fff',
    fontSize: 19,
    fontWeight: '800',
  },
})
