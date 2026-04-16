import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import { useStore } from '../../lib/store'
import { ProgressBar } from '../../components/ProgressBar'

// TODO: integrate Stripe or RevenueCat

export default function TrialScreen() {
  const startTrial = useStore(s => s.startTrial)
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('yearly')

  const handleStartTrial = async () => {
    startTrial()

    // Schedule day-specific notifications (non-web only)
    if (Platform.OS !== 'web') {
      try {
        const {
          scheduleDay1Notification,
          scheduleDay2Notification,
          scheduleDay3Notification,
        } = await import('../../lib/notifications')
        await scheduleDay1Notification()
        await scheduleDay2Notification()
        await scheduleDay3Notification()
      } catch {}
    }

    router.push('/onboarding/add-child')
  }

  return (
    <View style={styles.bg}>
      <SafeAreaView style={styles.safe}>
        <ProgressBar currentStep={6} totalSteps={6} />
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <Text style={styles.step}>6 of 6</Text>
          <Text style={styles.title}>Start your 3-day free trial</Text>
          <Text style={styles.subtitle}>Most kids increase practice in the first week</Text>

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

          <TouchableOpacity
            style={styles.ctaButton}
            onPress={handleStartTrial}
            activeOpacity={0.85}
          >
            <Text style={styles.ctaButtonText}>Start Free Trial →</Text>
          </TouchableOpacity>

          <Text style={styles.legal}>
            3 days free, then ${selectedPlan === 'monthly' ? '7.99/month' : '59.99/year'}.
            Cancel anytime.
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
    padding: 32,
    paddingBottom: 48,
    alignItems: 'center',
    gap: 20,
    flexGrow: 1,
    justifyContent: 'center',
  },
  step: {
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.4)',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#fff',
    textAlign: 'center',
    lineHeight: 36,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
  },
  plansRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
    marginTop: 8,
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
    fontSize: 26,
    fontWeight: '800',
    color: 'rgba(255,255,255,0.7)',
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
  ctaButton: {
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
  ctaButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
  },
  legal: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.35)',
    textAlign: 'center',
  },
})
