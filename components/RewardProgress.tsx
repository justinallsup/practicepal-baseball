import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { useStore } from '../lib/store'

interface Props {
  onAddReward: () => void
}

export default function RewardProgress({ onAddReward }: Props) {
  const reward = useStore(s => s.reward)
  const getRewardProgress = useStore(s => s.getRewardProgress)
  const clearReward = useStore(s => s.clearReward)

  if (!reward) {
    return (
      <View style={styles.card}>
        <View style={styles.noRewardRow}>
          <Text style={styles.noRewardText}>🎯 Add a reward to boost motivation</Text>
          <TouchableOpacity style={styles.addBtn} onPress={onAddReward} activeOpacity={0.8}>
            <Text style={styles.addBtnText}>+ Add</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  const isEarned = reward.earnedAt !== null && reward.earnedAt !== undefined

  if (isEarned) {
    return (
      <View style={[styles.card, styles.earnedCard]}>
        <Text style={styles.earnedEmoji}>🎉</Text>
        <Text style={styles.earnedTitle}>Reward earned!</Text>
        <Text style={styles.earnedReward}>{reward.rewardName}</Text>
        <TouchableOpacity
          style={styles.newRewardBtn}
          onPress={() => {
            clearReward()
            onAddReward()
          }}
          activeOpacity={0.8}
        >
          <Text style={styles.newRewardBtnText}>Set New Reward</Text>
        </TouchableOpacity>
      </View>
    )
  }

  // In progress
  const progress = getRewardProgress()
  const ratio = Math.min(progress / reward.targetValue, 1.0)
  const remaining = Math.max(0, reward.targetValue - progress)
  const progressLabel =
    reward.targetType === 'streak_goal'
      ? `${progress} / ${reward.targetValue} streak days`
      : `This week: ${progress} / ${reward.targetValue} sessions`

  const almostThereText = remaining === 1
    ? `Only 1 more to unlock ${reward.rewardName}! 🎯`
    : remaining <= 2
    ? `Almost there — ${remaining} more to earn ${reward.rewardName}!`
    : null

  return (
    <View style={styles.card}>
      <Text style={styles.progressTitle}>🎯 Working toward: {reward.rewardName}</Text>
      <View style={styles.barTrack}>
        <View style={[styles.barFill, { width: `${Math.round(ratio * 100)}%` as any }]} />
      </View>
      <Text style={styles.progressLabel}>{progressLabel}</Text>
      {almostThereText && (
        <Text style={styles.almostThereText}>{almostThereText}</Text>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  noRewardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  noRewardText: {
    fontSize: 14,
    color: '#475569',
    fontWeight: '600',
    flex: 1,
  },
  addBtn: {
    backgroundColor: '#eff6ff',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginLeft: 10,
  },
  addBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1e40af',
  },
  progressTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 10,
  },
  barTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#e2e8f0',
    overflow: 'hidden',
  },
  barFill: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#1e40af',
  },
  progressLabel: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 6,
    fontWeight: '500',
  },
  almostThereText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#d97706',
    marginTop: 4,
  },
  earnedCard: {
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#f0fdf4',
  },
  earnedEmoji: {
    fontSize: 36,
    marginBottom: 4,
  },
  earnedTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#15803d',
  },
  earnedReward: {
    fontSize: 15,
    fontWeight: '600',
    color: '#166534',
    marginBottom: 8,
  },
  newRewardBtn: {
    backgroundColor: '#1e40af',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginTop: 4,
  },
  newRewardBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
})
