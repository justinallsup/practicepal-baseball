import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import { useStore } from '../../lib/store'
import { RewardTargetType } from '../../lib/store'
import { pendingGoalChild } from './set-goal'

const SUGGESTIONS = ['New Bat', 'Batting Gloves', 'Ice Cream', 'Batting Cages']

export default function AddReward() {
  const completeOnboarding = useStore(s => s.completeOnboarding)
  const setReward = useStore(s => s.setReward)
  const onboardingRewardSuggestion = useStore(s => s.onboardingRewardSuggestion)

  const [rewardName, setRewardName] = useState(onboardingRewardSuggestion ?? '')
  const [targetType, setTargetType] = useState<RewardTargetType>('weekly_goal')
  const [streakTarget, setStreakTarget] = useState('5')

  const childName = pendingGoalChild?.name ?? 'Your Player'

  const handleSkip = () => {
    if (pendingGoalChild) {
      completeOnboarding(pendingGoalChild)
    }
    router.replace('/(home)/kid-mode')
  }

  const handleSave = () => {
    if (!rewardName.trim()) return
    if (pendingGoalChild) {
      completeOnboarding(pendingGoalChild)
    }
    const targetValue =
      targetType === 'streak_goal' ? parseInt(streakTarget, 10) || 5 : 1
    setReward({
      childName,
      rewardName: rewardName.trim(),
      targetType,
      targetValue,
    })
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

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.header}>Add a reward</Text>
        <Text style={styles.subtext}>Give your player something to work toward</Text>

        {/* Reward name section */}
        <Text style={styles.label}>What's the reward?</Text>
        <View style={styles.chipsRow}>
          {SUGGESTIONS.map(s => (
            <TouchableOpacity
              key={s}
              style={[styles.chip, rewardName === s && styles.chipSelected]}
              onPress={() => setRewardName(s)}
              activeOpacity={0.8}
            >
              <Text style={[styles.chipText, rewardName === s && styles.chipTextSelected]}>
                {s}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <TextInput
          style={styles.input}
          value={rewardName}
          onChangeText={setRewardName}
          placeholder="Or enter your own..."
          placeholderTextColor="#94a3b8"
        />

        {/* Earn method section */}
        <Text style={[styles.label, { marginTop: 24 }]}>How do they earn it?</Text>

        <TouchableOpacity
          style={[styles.optionCard, targetType === 'weekly_goal' && styles.optionCardSelected]}
          onPress={() => setTargetType('weekly_goal')}
          activeOpacity={0.8}
        >
          <View style={[styles.radio, targetType === 'weekly_goal' && styles.radioSelected]}>
            {targetType === 'weekly_goal' && <View style={styles.radioDot} />}
          </View>
          <View style={styles.optionText}>
            <Text style={[styles.optionTitle, targetType === 'weekly_goal' && styles.optionTitleSelected]}>
              Complete weekly goal
            </Text>
            <Text style={styles.optionDesc}>Finish all sessions in a week</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.optionCard, targetType === 'streak_goal' && styles.optionCardSelected]}
          onPress={() => setTargetType('streak_goal')}
          activeOpacity={0.8}
        >
          <View style={[styles.radio, targetType === 'streak_goal' && styles.radioSelected]}>
            {targetType === 'streak_goal' && <View style={styles.radioDot} />}
          </View>
          <View style={styles.optionText}>
            <Text style={[styles.optionTitle, targetType === 'streak_goal' && styles.optionTitleSelected]}>
              Reach a streak
            </Text>
            <Text style={styles.optionDesc}>Practice days in a row</Text>
          </View>
          {targetType === 'streak_goal' && (
            <View style={styles.streakInputWrap}>
              <TextInput
                style={styles.streakInput}
                value={streakTarget}
                onChangeText={setStreakTarget}
                keyboardType="number-pad"
                maxLength={3}
              />
              <Text style={styles.streakInputLabel}>days</Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.saveButton, !rewardName.trim() && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={!rewardName.trim()}
          activeOpacity={0.85}
        >
          <Text style={styles.saveButtonText}>Save Reward 🎯</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#fff',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  backBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  backText: {
    fontSize: 24,
    color: '#0f172a',
    fontWeight: '600',
  },
  skipBtn: {
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  skipText: {
    fontSize: 16,
    color: '#64748b',
    fontWeight: '600',
  },
  content: {
    padding: 24,
    paddingBottom: 48,
  },
  header: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 6,
  },
  subtext: {
    fontSize: 15,
    color: '#64748b',
    marginBottom: 24,
  },
  label: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 12,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 14,
  },
  chip: {
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: '#f8fafc',
  },
  chipSelected: {
    borderColor: '#1e40af',
    backgroundColor: '#eff6ff',
  },
  chipText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
  },
  chipTextSelected: {
    color: '#1e40af',
  },
  input: {
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#0f172a',
    backgroundColor: '#f8fafc',
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e2e8f0',
    borderRadius: 16,
    padding: 16,
    backgroundColor: '#f8fafc',
    marginBottom: 12,
    gap: 14,
  },
  optionCardSelected: {
    borderColor: '#1e40af',
    backgroundColor: '#eff6ff',
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#cbd5e1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: {
    borderColor: '#1e40af',
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#1e40af',
  },
  optionText: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
  },
  optionTitleSelected: {
    color: '#1e40af',
  },
  optionDesc: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 2,
  },
  streakInputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  streakInput: {
    borderWidth: 1.5,
    borderColor: '#1e40af',
    borderRadius: 10,
    width: 52,
    height: 40,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '700',
    color: '#1e40af',
    backgroundColor: '#fff',
  },
  streakInputLabel: {
    fontSize: 14,
    color: '#475569',
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: '#1e40af',
    borderRadius: 16,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 28,
  },
  saveButtonDisabled: {
    backgroundColor: '#cbd5e1',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
})
