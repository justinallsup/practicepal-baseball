import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

interface StreakBadgeProps {
  currentStreak: number
  bestStreak: number
}

export default function StreakBadge({ currentStreak, bestStreak }: StreakBadgeProps) {
  const streakMessage = currentStreak === 0
    ? 'Start your streak today!'
    : currentStreak === 1
    ? 'Keep it alive tomorrow!'
    : `${currentStreak} days strong — keep it going!`

  return (
    <View style={styles.container}>
      <View style={styles.streakRow}>
        <Text style={styles.text}>
          🔥 <Text style={styles.bold}>{currentStreak}-day streak</Text>
        </Text>
        <Text style={styles.divider}>  |  </Text>
        <Text style={styles.text}>
          🏆 Best: <Text style={styles.bold}>{bestStreak} days</Text>
        </Text>
      </View>
      <Text style={styles.message}>{streakMessage}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: '#f0f9ff',
    borderRadius: 24,
    marginHorizontal: 16,
    gap: 4,
  },
  streakRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    fontSize: 14,
    color: '#0f172a',
  },
  bold: {
    fontWeight: '700',
    color: '#1e40af',
  },
  divider: {
    fontSize: 14,
    color: '#94a3b8',
  },
  message: {
    fontSize: 12,
    fontWeight: '600',
    color: '#d97706',
  },
})
