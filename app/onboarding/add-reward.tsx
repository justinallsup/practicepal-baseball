import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native'
import { router } from 'expo-router'
import { useStore } from '../../lib/store'
import { pendingGoalChild } from './set-goal'

type EarnMethod = 'weekly_goal' | 'streak_goal'
type EffortLevel = 'easy' | 'medium' | 'hard'

const EFFORT_MAP: Record<EffortLevel, { label: string; sub: string; practices: number }> = {
  easy:   { label: 'Easy',   sub: '3 practices',    practices: 3 },
  medium: { label: 'Medium', sub: '5 practices',    practices: 5 },
  hard:   { label: 'Hard',   sub: 'Daily practice', practices: 7 },
}

export default function AddRewardScreen() {
  const onboardingRewardSuggestion = useStore(s => s.onboardingRewardSuggestion)
  const completeOnboarding = useStore(s => s.completeOnboarding)
  const setReward = useStore(s => s.setReward)

  const rewardName = onboardingRewardSuggestion || 'Your reward'

  // Pick emoji from reward name
  const rewardEmoji =
    rewardName.includes('Ice Cream') || rewardName.includes('🍦') ? '🍦'
    : rewardName.includes('Bat') || rewardName.includes('🔥') ? '🔥'
    : rewardName.includes('Glove') || rewardName.includes('Mitt') || rewardName.includes('🧤') ? '🧤'
    : rewardName.includes('Candy') || rewardName.includes('🍬') ? '🍬'
    : rewardName.includes('dinner') || rewardName.includes('🍕') ? '🍕'
    : rewardName.includes('screen') || rewardName.includes('📱') ? '📱'
    : rewardName.includes('Sleeve') || rewardName.includes('💪') ? '💪'
    : rewardName.includes('Cage') ? '⚾'
    : rewardName.includes('Cleat') || rewardName.includes('👟') ? '👟'
    : rewardName.includes('lesson') || rewardName.includes('🏆') ? '🏆'
    : '🎯'

  const [earnMethod, setEarnMethod] = useState<EarnMethod>('weekly_goal')
  const [effort, setEffort] = useState<EffortLevel>('medium')

  const targetValue = EFFORT_MAP[effort].practices

  // Generate ball display
  const balls = Array.from({ length: targetValue }, (_, i) => (
    <Text key={i} style={styles.ball}>⚾</Text>
  ))

  const childName = pendingGoalChild?.name ?? 'Your Player'

  const handleSave = () => {
    // Complete onboarding (saves child to store)
    if (pendingGoalChild) {
      completeOnboarding(pendingGoalChild)
    }
    // Save the reward
    const cleanName = rewardName.replace(/[🍦🔥🧤🍬🍕📱💪👟🏆🎯]/g, '').trim()
    setReward({
      childName,
      rewardName: cleanName || rewardName,
      targetType: earnMethod,
      targetValue,
    })
    router.replace('/(home)/kid-mode')
  }

  const handleSkip = () => {
    if (pendingGoalChild) {
      completeOnboarding(pendingGoalChild)
    }
    router.replace('/(home)/kid-mode')
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} activeOpacity={0.7}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSkip} style={styles.skipBtn} activeOpacity={0.7}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Title */}
        <Text style={styles.title}>Let's set this up ⚾</Text>

        {/* Selected reward — locked in */}
        <View style={styles.rewardCard}>
          <Text style={styles.rewardEmoji}>{rewardEmoji}</Text>
          <View>
            <Text style={styles.rewardName}>
              {rewardName.replace(/[🍦🔥🧤🍬🍕📱💪👟🏆🎯]/g, '').trim() || rewardName}
            </Text>
            <Text style={styles.rewardSub}>Reward selected ✓</Text>
          </View>
        </View>

        {/* How do they earn it */}
        <Text style={styles.sectionTitle}>How do they earn it?</Text>

        <TouchableOpacity
          style={[styles.methodCard, earnMethod === 'weekly_goal' && styles.methodCardActive]}
          onPress={() => setEarnMethod('weekly_goal')}
          activeOpacity={0.8}
        >
          <View style={styles.methodRow}>
            <Text style={styles.methodLabel}>Complete practices this week</Text>
            {earnMethod === 'weekly_goal' && <Text style={styles.checkmark}>✓</Text>}
          </View>
          <Text style={styles.methodSub}>Finish {targetValue} sessions to earn it</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.methodCard, earnMethod === 'streak_goal' && styles.methodCardActive]}
          onPress={() => setEarnMethod('streak_goal')}
          activeOpacity={0.8}
        >
          <View style={styles.methodRow}>
            <Text style={styles.methodLabel}>Build a streak</Text>
            {earnMethod === 'streak_goal' && <Text style={styles.checkmark}>✓</Text>}
          </View>
          <Text style={styles.methodSub}>Practice {targetValue} days in a row</Text>
        </TouchableOpacity>

        {/* Effort level */}
        <Text style={styles.sectionTitle}>How hard should they work?</Text>

        <View style={styles.effortRow}>
          {(Object.keys(EFFORT_MAP) as EffortLevel[]).map(lvl => (
            <TouchableOpacity
              key={lvl}
              style={[styles.effortBtn, effort === lvl && styles.effortBtnActive]}
              onPress={() => setEffort(lvl)}
              activeOpacity={0.8}
            >
              <Text style={[styles.effortLabel, effort === lvl && styles.effortLabelActive]}>
                {EFFORT_MAP[lvl].label}
              </Text>
              <Text style={[styles.effortSub, effort === lvl && styles.effortSubActive]}>
                {EFFORT_MAP[lvl].sub}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Outcome preview */}
        <View style={styles.previewCard}>
          <Text style={styles.previewText}>
            Complete {targetValue} practices to earn{'\n'}
            <Text style={styles.previewReward}>
              {rewardName.replace(/[🍦🔥🧤🍬🍕📱💪👟🏆🎯]/g, '').trim() || rewardName} {rewardEmoji}
            </Text>
          </Text>
          <View style={styles.ballRow}>{balls}</View>
          <Text style={styles.previewProgress}>0 / {targetValue} completed</Text>
        </View>

        {/* Micro-motivation */}
        <Text style={styles.tip}>
          Most kids do best with short 10–15 minute sessions
        </Text>

        {/* CTA */}
        <TouchableOpacity style={styles.cta} onPress={handleSave} activeOpacity={0.85}>
          <Text style={styles.ctaText}>Start earning now ⚾</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f8fafc' },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  backBtn: { width: 40, height: 40, justifyContent: 'center' },
  backText: { fontSize: 24, color: '#0f172a', fontWeight: '600' },
  skipBtn: { paddingHorizontal: 8, paddingVertical: 6 },
  skipText: { fontSize: 16, color: '#64748b', fontWeight: '600' },
  scroll: { padding: 24, paddingBottom: 48 },
  title: { fontSize: 26, fontWeight: '800', color: '#0f172a', marginBottom: 20 },

  rewardCard: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: '#eff6ff', borderRadius: 16,
    padding: 16, marginBottom: 28,
    borderWidth: 2, borderColor: '#bfdbfe',
  },
  rewardEmoji: { fontSize: 36 },
  rewardName: { fontSize: 18, fontWeight: '700', color: '#0f172a' },
  rewardSub: { fontSize: 13, color: '#3b82f6', fontWeight: '600', marginTop: 2 },

  sectionTitle: {
    fontSize: 17, fontWeight: '700', color: '#0f172a',
    marginBottom: 12, marginTop: 4,
  },

  methodCard: {
    backgroundColor: '#fff', borderRadius: 14, padding: 16,
    marginBottom: 10, borderWidth: 2, borderColor: '#e2e8f0',
  },
  methodCardActive: { borderColor: '#1e40af', backgroundColor: '#eff6ff' },
  methodRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  methodLabel: { fontSize: 16, fontWeight: '700', color: '#0f172a' },
  methodSub: { fontSize: 13, color: '#64748b', marginTop: 4 },
  checkmark: { fontSize: 18, color: '#1e40af', fontWeight: '800' },

  effortRow: { flexDirection: 'row', gap: 10, marginBottom: 24 },
  effortBtn: {
    flex: 1, backgroundColor: '#fff', borderRadius: 14, padding: 14,
    alignItems: 'center', borderWidth: 2, borderColor: '#e2e8f0',
  },
  effortBtnActive: { borderColor: '#1e40af', backgroundColor: '#1e40af' },
  effortLabel: { fontSize: 15, fontWeight: '700', color: '#0f172a' },
  effortLabelActive: { color: '#fff' },
  effortSub: { fontSize: 12, color: '#64748b', marginTop: 3, textAlign: 'center' },
  effortSubActive: { color: '#bfdbfe' },

  previewCard: {
    backgroundColor: '#fff', borderRadius: 16, padding: 20,
    alignItems: 'center', marginBottom: 16,
    borderWidth: 1, borderColor: '#e2e8f0',
  },
  previewText: { fontSize: 15, color: '#64748b', textAlign: 'center', marginBottom: 12, lineHeight: 22 },
  previewReward: { fontWeight: '800', color: '#0f172a' },
  ballRow: { flexDirection: 'row', gap: 6, marginBottom: 8, flexWrap: 'wrap', justifyContent: 'center' },
  ball: { fontSize: 22 },
  previewProgress: { fontSize: 13, color: '#94a3b8', fontWeight: '600' },

  tip: { fontSize: 13, color: '#94a3b8', textAlign: 'center', marginBottom: 24, lineHeight: 18 },

  cta: {
    backgroundColor: '#1e40af', borderRadius: 18, height: 60,
    justifyContent: 'center', alignItems: 'center',
    shadowColor: '#1e40af', shadowOpacity: 0.3, shadowRadius: 12, shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  ctaText: { color: '#fff', fontSize: 18, fontWeight: '800' },
})
