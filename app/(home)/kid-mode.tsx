import React, { useState, useRef } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  Platform,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import { useStore } from '../../lib/store'

export default function KidModeScreen() {
  const child = useStore(s => s.child)
  const reward = useStore(s => s.reward)
  const totalPoints = useStore(s => s.totalPoints)
  const logPractice = useStore(s => s.logPractice)
  const hasLoggedToday = useStore(s => s.hasLoggedToday)
  const getCurrentStreak = useStore(s => s.getCurrentStreak)
  const getRewardProgress = useStore(s => s.getRewardProgress)
  const isRewardEarned = useStore(s => s.isRewardEarned)
  const markRewardEarned = useStore(s => s.markRewardEarned)
  const clearReward = useStore(s => s.clearReward)

  const [showSuccess, setShowSuccess] = useState(false)
  const [rewardComplete, setRewardComplete] = useState(false)
  const successOpacity = useRef(new Animated.Value(0)).current

  const streak = getCurrentStreak()
  const progress = getRewardProgress()
  const rewardTarget = reward?.targetValue ?? 5
  const rewardName = reward?.rewardName ?? 'Practice Goal'
  const rewardEarned = isRewardEarned()
  const loggedToday = hasLoggedToday()

  // Build progress display (up to 10 bubbles max)
  const displayCount = Math.min(rewardTarget, 10)
  const filledCount = Math.min(progress, displayCount)

  const handleStartPractice = async () => {
    if (loggedToday) return

    if (Platform.OS !== 'web') {
      try {
        const Haptics = await import('expo-haptics')
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
      } catch {}
    }

    const result = logPractice([])
    if (!result.alreadyLoggedToday) {
      // Check reward
      const newProgress = getRewardProgress()
      if (reward && !rewardEarned && newProgress >= reward.targetValue) {
        markRewardEarned()
        setRewardComplete(true)
      }

      setShowSuccess(true)
      Animated.timing(successOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }).start()
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header row */}
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>Kid Mode ⚾</Text>
          <View style={styles.pointsBadge}>
            <Text style={styles.pointsText}>⭐ {totalPoints} pts</Text>
          </View>
        </View>

        {/* Earning label */}
        <View style={styles.earningCard}>
          <Text style={styles.earningLabel}>You're earning:</Text>
          <Text style={styles.earningReward}>{rewardName}</Text>
        </View>

        {/* Progress balls */}
        <View style={styles.progressSection}>
          <View style={styles.ballsRow}>
            {Array.from({ length: displayCount }).map((_, i) => (
              <Text key={i} style={[styles.ball, i < filledCount ? styles.ballFilled : styles.ballEmpty]}>
                ⚾
              </Text>
            ))}
          </View>
          <Text style={styles.progressLabel}>{progress} / {rewardTarget} completed</Text>
        </View>

        {/* Streak */}
        <View style={styles.streakRow}>
          <Text style={styles.streakText}>
            {streak > 0 ? `${streak} day streak 🔥` : 'Start your streak today! ⚾'}
          </Text>
        </View>

        {/* Success message */}
        {showSuccess && (
          <Animated.View style={[styles.successBanner, { opacity: successOpacity }]}>
            <Text style={styles.successTitle}>Nice work! 💪</Text>
            <Text style={styles.successPoints}>+10 points</Text>
          </Animated.View>
        )}

        {/* Reward complete state */}
        {rewardComplete && (
          <View style={styles.rewardCompleteCard}>
            <Text style={styles.rewardCompleteEmoji}>🎉</Text>
            <Text style={styles.rewardCompleteTitle}>You earned it!</Text>
            <Text style={styles.rewardCompleteSubtitle}>{rewardName}</Text>
            <View style={styles.rewardCompleteButtons}>
              <TouchableOpacity
                style={styles.claimButton}
                onPress={() => {
                  clearReward()
                  setRewardComplete(false)
                }}
                activeOpacity={0.85}
              >
                <Text style={styles.claimButtonText}>Claim Reward 🎯</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.newGoalButton}
                onPress={() => {
                  clearReward()
                  setRewardComplete(false)
                  router.push('/onboarding/add-reward')
                }}
                activeOpacity={0.8}
              >
                <Text style={styles.newGoalButtonText}>Set New Goal</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Main practice button */}
        {!rewardComplete && (
          <TouchableOpacity
            style={[styles.practiceButton, loggedToday && styles.practiceButtonDone]}
            onPress={handleStartPractice}
            activeOpacity={0.85}
            disabled={loggedToday}
          >
            <Text style={styles.practiceButtonEmoji}>⚾</Text>
            <Text style={styles.practiceButtonText}>
              {loggedToday ? 'Practice Done Today! ✅' : 'Start Practice ⚾'}
            </Text>
          </TouchableOpacity>
        )}

        {loggedToday && !rewardComplete && (
          <Text style={styles.doneSubtext}>Come back tomorrow to keep the streak going! 🔥</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#f0f9ff',
  },
  content: {
    padding: 24,
    paddingBottom: 48,
    gap: 20,
    alignItems: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0f172a',
  },
  pointsBadge: {
    backgroundColor: '#fef3c7',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1.5,
    borderColor: '#fbbf24',
  },
  pointsText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#92400e',
  },
  earningCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#0ea5e9',
    shadowOpacity: 0.1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  earningLabel: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '600',
    marginBottom: 4,
  },
  earningReward: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0f172a',
  },
  progressSection: {
    alignItems: 'center',
    gap: 12,
    width: '100%',
  },
  ballsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
  },
  ball: {
    fontSize: 32,
  },
  ballFilled: {
    opacity: 1,
  },
  ballEmpty: {
    opacity: 0.25,
  },
  progressLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e40af',
  },
  streakRow: {
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 12,
    width: '100%',
    alignItems: 'center',
  },
  streakText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
  },
  successBanner: {
    backgroundColor: '#dcfce7',
    borderRadius: 16,
    paddingHorizontal: 24,
    paddingVertical: 16,
    width: '100%',
    alignItems: 'center',
    gap: 4,
    borderWidth: 1.5,
    borderColor: '#86efac',
  },
  successTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#166534',
  },
  successPoints: {
    fontSize: 16,
    fontWeight: '700',
    color: '#22c55e',
  },
  rewardCompleteCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 28,
    width: '100%',
    alignItems: 'center',
    gap: 12,
    shadowColor: '#f59e0b',
    shadowOpacity: 0.2,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  rewardCompleteEmoji: {
    fontSize: 56,
  },
  rewardCompleteTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#0f172a',
  },
  rewardCompleteSubtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e40af',
  },
  rewardCompleteButtons: {
    width: '100%',
    gap: 10,
    marginTop: 8,
  },
  claimButton: {
    backgroundColor: '#1e40af',
    borderRadius: 14,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
  },
  claimButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  newGoalButton: {
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  newGoalButtonText: {
    fontSize: 15,
    color: '#64748b',
    fontWeight: '600',
  },
  practiceButton: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: '#1e40af',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#1e40af',
    shadowOpacity: 0.35,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
  },
  practiceButtonDone: {
    backgroundColor: '#22c55e',
    shadowColor: '#22c55e',
  },
  practiceButtonEmoji: {
    fontSize: 48,
  },
  practiceButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'center',
    paddingHorizontal: 8,
  },
  doneSubtext: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
  },
})
