import React, { useEffect } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import { useStore } from '../../lib/store'

export default function SetGoalScreen() {
  const onboardingRewardSuggestion = useStore(s => s.onboardingRewardSuggestion)

  // Parse reward and practice count
  const [rewardName, practiceCount] = onboardingRewardSuggestion?.split('|') || ['Practice Goal', '5']
  const practices = parseInt(practiceCount) || 5

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.content}>
        <View style={styles.top}>
          <Text style={styles.step}>5 of 6</Text>
          <Text style={styles.title}>Here's how this works</Text>
        </View>

        <View style={styles.body}>
          {/* Goal Display */}
          <View style={styles.goalCard}>
            <Text style={styles.goalEmoji}>🎯</Text>
            <Text style={styles.goalTitle}>{rewardName}</Text>
            <View style={styles.progressDisplay}>
              <Text style={styles.progressText}>0 / {practices} practices</Text>
            </View>
          </View>

          {/* How it works steps */}
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

          {/* Visual progress indicator */}
          <View style={styles.progressBar}>
            <View style={styles.progressBarTrack}>
              <View style={[styles.progressBarFill, { width: '0%' }]} />
            </View>
            <View style={styles.progressLabels}>
              <Text style={styles.progressLabel}>Start</Text>
              <Text style={styles.progressLabel}>{practices} practices</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('/onboarding/trial')}
          activeOpacity={0.85}
        >
          <Text style={styles.buttonText}>Got it</Text>
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
    justifyContent: 'space-between',
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
  body: {
    gap: 32,
  },
  goalCard: {
    backgroundColor: '#eff6ff',
    borderRadius: 24,
    borderWidth: 3,
    borderColor: '#bfdbfe',
    paddingVertical: 28,
    paddingHorizontal: 24,
    alignItems: 'center',
    gap: 12,
  },
  goalEmoji: {
    fontSize: 56,
  },
  goalTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1e40af',
    textAlign: 'center',
  },
  progressDisplay: {
    backgroundColor: 'rgba(30, 64, 175, 0.1)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
    marginTop: 8,
  },
  progressText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e40af',
  },
  steps: {
    gap: 20,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
  },
  stepIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#1e40af',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepIconText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#fff',
  },
  stepText: {
    flex: 1,
    fontSize: 16,
    color: '#475569',
    lineHeight: 24,
  },
  stepBold: {
    fontWeight: '700',
    color: '#0f172a',
  },
  progressBar: {
    gap: 8,
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
    fontSize: 13,
    fontWeight: '600',
    color: '#64748b',
  },
  button: {
    backgroundColor: '#1e40af',
    borderRadius: 16,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
})
