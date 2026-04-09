import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import { useStore } from '../../lib/store'
import { getWeekDates } from '../../lib/utils'

export default function PaywallScreen() {
  const child = useStore(s => s.child)
  const getCurrentStreak = useStore(s => s.getCurrentStreak)
  const getWeekLogs = useStore(s => s.getWeekLogs)
  const startTrial = useStore(s => s.startTrial)
  const reward = useStore(s => s.reward)
  const getRewardProgress = useStore(s => s.getRewardProgress)

  const streak = getCurrentStreak()
  const weekLogs = getWeekLogs()
  const weekDates = getWeekDates()
  const goal = child?.goalPerWeek ?? 3

  const handleStartTrial = () => {
    startTrial()
    router.back()
  }

  const handleMaybeLater = () => {
    router.back()
  }

  return (
    <View style={styles.bg}>
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <Text style={styles.headline}>Don't break the streak 🔥</Text>
          <Text style={styles.subhead}>
            {child?.name ?? 'Your player'} is on a{' '}
            <Text style={styles.streakHighlight}>{streak}-day streak</Text>
          </Text>

          {/* Reward context */}
          {reward && (
            <Text style={styles.rewardSubtext}>
              {child?.name ?? 'Your player'} is {Math.max(0, reward.targetValue - getRewardProgress())} away from earning {reward.rewardName} 🎯
            </Text>
          )}

          {/* Streak visual */}
          <View style={styles.streakVisual}>
            <Text style={styles.streakNumber}>{streak}</Text>
            <Text style={styles.streakEmoji}>🔥</Text>
          </View>
          <Text style={styles.streakLabel}>day streak</Text>

          {/* Weekly progress dots */}
          <View style={styles.dotsContainer}>
            {weekDates.map((date) => {
              const logged = weekLogs.some(l => l.date === date)
              return (
                <View
                  key={date}
                  style={[styles.dot, logged && styles.dotFilled]}
                />
              )
            })}
          </View>
          <Text style={styles.dotsLabel}>
            {weekLogs.length} of {goal} days this week
          </Text>

          {/* Offer card */}
          <View style={styles.offerCard}>
            <View style={styles.offerBadge}>
              <Text style={styles.offerBadgeText}>MOST POPULAR</Text>
            </View>
            <Text style={styles.offerTitle}>3-Day Free Trial</Text>
            <Text style={styles.offerPrice}>Then $29.99/year</Text>
            <Text style={styles.offerCancel}>Cancel anytime</Text>

            <View style={styles.offerDivider} />

            <View style={styles.offerFeature}>
              <Text style={styles.offerFeatureIcon}>✓</Text>
              <Text style={styles.offerFeatureText}>Unlimited practice logging</Text>
            </View>
            <View style={styles.offerFeature}>
              <Text style={styles.offerFeatureIcon}>✓</Text>
              <Text style={styles.offerFeatureText}>Streak tracking & history</Text>
            </View>
            <View style={styles.offerFeature}>
              <Text style={styles.offerFeatureIcon}>✓</Text>
              <Text style={styles.offerFeatureText}>Weekly progress reports</Text>
            </View>
          </View>

          {/* Warning */}
          <View style={styles.warningRow}>
            <Text style={styles.warningText}>
              ⚠️  If you stop now, your streak resets to zero
            </Text>
          </View>

          {/* CTA */}
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleStartTrial}
            activeOpacity={0.85}
          >
            <Text style={styles.primaryButtonText}>Keep the streak alive →</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handleMaybeLater}
            activeOpacity={0.7}
          >
            <Text style={styles.secondaryButtonText}>Maybe later</Text>
          </TouchableOpacity>

          <Text style={styles.legal}>
            Free trial starts immediately. Cancel anytime before trial ends
            to avoid charges. Payment charged to your Apple ID account.
          </Text>
        </ScrollView>
      </SafeAreaView>
    </View>
  )
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  safe: {
    flex: 1,
  },
  content: {
    padding: 24,
    paddingBottom: 48,
    alignItems: 'center',
    gap: 12,
  },
  headline: {
    fontSize: 28,
    fontWeight: '900',
    color: '#fff',
    textAlign: 'center',
    marginTop: 8,
  },
  subhead: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
  },
  streakHighlight: {
    color: '#f97316',
    fontWeight: '700',
  },
  rewardSubtext: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.75)',
    textAlign: 'center',
    fontWeight: '600',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    width: '100%',
  },
  streakVisual: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 16,
    marginBottom: 4,
  },
  streakNumber: {
    fontSize: 80,
    fontWeight: '900',
    color: '#f97316',
    lineHeight: 90,
  },
  streakEmoji: {
    fontSize: 48,
  },
  streakLabel: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.6)',
    marginBottom: 8,
  },
  dotsContainer: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  dotFilled: {
    backgroundColor: '#22c55e',
    borderColor: '#22c55e',
  },
  dotsLabel: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.5)',
    marginBottom: 8,
  },
  offerCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    width: '100%',
    marginTop: 8,
    gap: 8,
  },
  offerBadge: {
    backgroundColor: '#fef3c7',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
  offerBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#92400e',
    letterSpacing: 0.5,
  },
  offerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0f172a',
    marginTop: 4,
  },
  offerPrice: {
    fontSize: 16,
    color: '#475569',
    fontWeight: '500',
  },
  offerCancel: {
    fontSize: 13,
    color: '#94a3b8',
  },
  offerDivider: {
    height: 1,
    backgroundColor: '#f1f5f9',
    marginVertical: 8,
  },
  offerFeature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  offerFeatureIcon: {
    fontSize: 16,
    color: '#22c55e',
    fontWeight: '700',
  },
  offerFeatureText: {
    fontSize: 15,
    color: '#334155',
    fontWeight: '500',
  },
  warningRow: {
    backgroundColor: 'rgba(239,68,68,0.12)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    width: '100%',
  },
  warningText: {
    fontSize: 13,
    color: '#fca5a5',
    textAlign: 'center',
    fontWeight: '600',
  },
  primaryButton: {
    backgroundColor: '#f97316',
    borderRadius: 16,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    shadowColor: '#f97316',
    shadowOpacity: 0.4,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
  },
  secondaryButton: {
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.4)',
  },
  legal: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.25)',
    textAlign: 'center',
    lineHeight: 16,
    paddingHorizontal: 8,
  },
})

