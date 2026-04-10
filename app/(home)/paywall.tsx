import React, { useState } from 'react'
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

// TODO: integrate Stripe or RevenueCat

export default function PaywallScreen() {
  const child = useStore(s => s.child)
  const getCurrentStreak = useStore(s => s.getCurrentStreak)
  const getWeekLogs = useStore(s => s.getWeekLogs)
  const activateSubscription = useStore(s => s.activateSubscription)
  const startTrial = useStore(s => s.startTrial)
  const subscriptionStatus = useStore(s => s.subscriptionStatus)
  const reward = useStore(s => s.reward)
  const getRewardProgress = useStore(s => s.getRewardProgress)
  const totalPoints = useStore(s => s.totalPoints)
  const totalLogsCount = useStore(s => s.totalLogsCount)

  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('yearly')

  const streak = getCurrentStreak()
  const weekLogs = getWeekLogs()
  const rewardProgress = reward ? getRewardProgress() : 0
  const rewardPct = reward ? Math.round((rewardProgress / reward.targetValue) * 100) : 0

  const handleContinue = () => {
    // TODO: integrate Stripe or RevenueCat for real payment
    activateSubscription(selectedPlan)
    router.replace('/(home)')
  }

  const handleMaybeLater = () => {
    router.back()
  }

  return (
    <View style={styles.bg}>
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <Text style={styles.headline}>Keep your player progressing ⚾</Text>
          <Text style={styles.subhead}>
            They've already started — don't lose momentum
          </Text>

          {/* Dynamic stats */}
          <View style={styles.statsCard}>
            <View style={styles.statRow}>
              <Text style={styles.statIcon}>✅</Text>
              <Text style={styles.statText}>{totalLogsCount} practices completed</Text>
            </View>
            <View style={styles.statRow}>
              <Text style={styles.statIcon}>⭐</Text>
              <Text style={styles.statText}>{totalPoints} points earned</Text>
            </View>
            {reward && (
              <View style={styles.statRow}>
                <Text style={styles.statIcon}>🎯</Text>
                <Text style={styles.statText}>{rewardPct}% toward {reward.rewardName}</Text>
              </View>
            )}
            {streak > 0 && (
              <View style={styles.statRow}>
                <Text style={styles.statIcon}>🔥</Text>
                <Text style={styles.statText}>{streak}-day streak</Text>
              </View>
            )}
          </View>

          {/* Plan selector */}
          <View style={styles.plansRow}>
            <TouchableOpacity
              style={[styles.planCard, selectedPlan === 'monthly' && styles.planCardSelected]}
              onPress={() => setSelectedPlan('monthly')}
              activeOpacity={0.85}
            >
              <Text style={[styles.planPrice, selectedPlan === 'monthly' && styles.planPriceSelected]}>
                $7.99
              </Text>
              <Text style={[styles.planLabel, selectedPlan === 'monthly' && styles.planLabelSelected]}>
                per month
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.planCard, styles.planCardBest, selectedPlan === 'yearly' && styles.planCardSelected]}
              onPress={() => setSelectedPlan('yearly')}
              activeOpacity={0.85}
            >
              <View style={styles.bestBadge}>
                <Text style={styles.bestBadgeText}>★ Best Value</Text>
              </View>
              <Text style={[styles.planPrice, selectedPlan === 'yearly' && styles.planPriceSelected]}>
                $59.99
              </Text>
              <Text style={[styles.planLabel, selectedPlan === 'yearly' && styles.planLabelSelected]}>
                per year
              </Text>
            </TouchableOpacity>
          </View>

          {/* Value stack */}
          <View style={styles.valueCard}>
            {[
              'Daily practice tracking',
              'Reward system',
              'Progress tracking',
              'Motivation tools',
              'Leaderboard + teammates',
            ].map(feature => (
              <View key={feature} style={styles.featureRow}>
                <Text style={styles.featureCheck}>✓</Text>
                <Text style={styles.featureText}>{feature}</Text>
              </View>
            ))}
          </View>

          {/* CTA */}
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleContinue}
            activeOpacity={0.85}
          >
            <Text style={styles.primaryButtonText}>Continue Progress →</Text>
          </TouchableOpacity>

          <Text style={styles.legal}>Start today, cancel anytime</Text>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handleMaybeLater}
            activeOpacity={0.7}
          >
            <Text style={styles.secondaryButtonText}>Maybe later</Text>
          </TouchableOpacity>
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
    gap: 16,
  },
  headline: {
    fontSize: 26,
    fontWeight: '900',
    color: '#fff',
    textAlign: 'center',
    marginTop: 8,
  },
  subhead: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
    lineHeight: 22,
  },
  statsCard: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 20,
    padding: 20,
    width: '100%',
    gap: 10,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statIcon: {
    fontSize: 18,
    width: 24,
  },
  statText: {
    fontSize: 15,
    color: '#fff',
    fontWeight: '600',
  },
  plansRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  planCard: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    gap: 4,
  },
  planCardBest: {
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  planCardSelected: {
    borderColor: '#3b82f6',
    backgroundColor: 'rgba(59,130,246,0.15)',
  },
  bestBadge: {
    backgroundColor: '#fbbf24',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginBottom: 4,
  },
  bestBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#78350f',
  },
  planPrice: {
    fontSize: 24,
    fontWeight: '800',
    color: 'rgba(255,255,255,0.6)',
  },
  planPriceSelected: {
    color: '#fff',
  },
  planLabel: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.4)',
    fontWeight: '500',
  },
  planLabelSelected: {
    color: 'rgba(255,255,255,0.8)',
  },
  valueCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    width: '100%',
    gap: 10,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureCheck: {
    fontSize: 16,
    color: '#22c55e',
    fontWeight: '700',
    width: 20,
  },
  featureText: {
    fontSize: 15,
    color: '#334155',
    fontWeight: '500',
  },
  primaryButton: {
    backgroundColor: '#3b82f6',
    borderRadius: 16,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    shadowColor: '#3b82f6',
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
  legal: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.4)',
    textAlign: 'center',
  },
  secondaryButton: {
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.3)',
  },
})
