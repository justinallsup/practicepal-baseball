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
import { PracticeTimerModal } from '../../components/PracticeTimerModal'

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

  const [showPracticeModal, setShowPracticeModal] = useState(false)
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

  const handleStartPractice = () => {
    if (loggedToday) return
    setShowPracticeModal(true)
  }

  const handlePracticeComplete = async () => {
    setShowPracticeModal(false)

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
    }

    // Always show success after completing practice flow
    setShowSuccess(true)
    Animated.timing(successOpacity, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start()
  }

  const handlePracticeCancel = () => {
    setShowPracticeModal(false)
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
          {rewardTarget - progress === 1 && !rewardEarned && (
            <Text style={styles.almostThereLabel}>Only 1 more to unlock {rewardName}! 🎯</Text>
          )}
          {rewardTarget - progress > 1 && rewardTarget - progress <= 3 && !rewardEarned && (
            <Text style={styles.almostThereLabel}>Almost there — {rewardTarget - progress} more to go!</Text>
          )}
        </View>

        {/* Streak */}
        <View style={styles.streakRow}>
          <Text style={styles.streakText}>
            {streak > 0 ? `🔥 ${streak} day streak — keep it going!` : 'Start your streak today! ⚾'}
          </Text>
        </View>

        {/* Success message */}
        {showSuccess && (
          <Animated.View style={[styles.successBanner, { opacity: successOpacity }]}>
            <Text style={styles.successTitle}>Nice work! 💪</Text>
            <Text style={styles.successPoints}>🔥 +10 points</Text>
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
              {loggedToday ? 'Practice Done Today ✅' : 'Start Practice ⚾'}
            </Text>
          </TouchableOpacity>
        )}

        {loggedToday && !rewardComplete && (
          <Text style={styles.doneSubtext}>Come back tomorrow to keep the streak alive! 🔥</Text>
        )}

        {/* Teammates leaderboard */}
        <View style={styles.teammatesSection}>
          <Text style={styles.teammatesTitle}>Teammates training 🏟️</Text>
          {[
            { name: 'Jake', practices: 3 },
            { name: 'Marcus', practices: 2 },
            { name: 'Tyler', practices: 5 },
          ].map((tm) => (
            <View key={tm.name} style={styles.teammateRow}>
              <Text style={styles.teammateName}>⚾ {tm.name}</Text>
              <Text style={styles.teammatePractices}>{tm.practices} practices</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Practice Timer Modal */}
      <PracticeTimerModal
        visible={showPracticeModal}
        onComplete={handlePracticeComplete}
        onCancel={handlePracticeCancel}
      />
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
  almostThereLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#d97706',
    marginTop: 4,
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
    backgroundColor: '#fef3c7',
    borderRadius: 24,
    padding: 24,
    width: '100%',
    alignItems: 'center',
    gap: 12,
    borderWidth: 2,
    borderColor: '#fbbf24',
  },
  rewardCompleteEmoji: {
    fontSize: 64,
  },
  rewardCompleteTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#78350f',
  },
  rewardCompleteSubtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#92400e',
  },
  rewardCompleteButtons: {
    width: '100%',
    gap: 12,
    marginTop: 8,
  },
  claimButton: {
    backgroundColor: '#22c55e',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  claimButtonText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#fff',
  },
  newGoalButton: {
    backgroundColor: '#fff',
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fbbf24',
  },
  newGoalButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#92400e',
  },
  practiceButton: {
    backgroundColor: '#22c55e',
    borderRadius: 24,
    paddingVertical: 24,
    paddingHorizontal: 32,
    width: '100%',
    alignItems: 'center',
    gap: 8,
    shadowColor: '#22c55e',
    shadowOpacity: 0.3,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  practiceButtonDone: {
    backgroundColor: '#cbd5e1',
    shadowColor: '#64748b',
  },
  practiceButtonEmoji: {
    fontSize: 40,
  },
  practiceButtonText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#fff',
  },
  doneSubtext: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
    textAlign: 'center',
  },
  teammatesSection: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    width: '100%',
    gap: 12,
  },
  teammatesTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 4,
  },
  teammateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  teammateName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#475569',
  },
  teammatePractices: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1e40af',
  },
})
