import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

interface StreakBadgeProps {
  currentStreak: number
  bestStreak: number
}

export default function StreakBadge({ currentStreak, bestStreak }: StreakBadgeProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        🔥 <Text style={styles.bold}>{currentStreak}-day streak</Text>
      </Text>
      <Text style={styles.divider}>  |  </Text>
      <Text style={styles.text}>
        🏆 Best: <Text style={styles.bold}>{bestStreak} days</Text>
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#f0f9ff',
    borderRadius: 24,
    marginHorizontal: 16,
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
})
