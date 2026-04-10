import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import { useStore } from '../../lib/store'

// Structured reward tiers with practice counts
const QUICK_WINS = [
  { label: 'Extra Screen Time 🎮', value: 'Extra Screen Time', practices: 1 },
  { label: 'Stay Up Late ⏰', value: 'Stay Up Late', practices: 2 },
  { label: 'Pick Dinner 🍕', value: 'Pick Dinner', practices: 3 },
]

const MID_TIER = [
  { label: 'Batting Gloves 🧤', value: 'Batting Gloves', practices: 5 },
  { label: 'Arm Sleeve 💪', value: 'Arm Sleeve', practices: 7 },
  { label: 'Baseball Card Pack ⚾', value: 'Baseball Card Pack', practices: 10 },
]

const BIG_GOALS = [
  { label: 'New Bat 🔥', value: 'New Bat', practices: 15 },
  { label: 'New Glove / Mitt 🧤', value: 'New Glove', practices: 20 },
  { label: 'Cleats 👟', value: 'Cleats', practices: 25 },
  { label: 'Private Lesson / Cage Session 🎯', value: 'Private Lesson', practices: 30 },
]

export default function RewardPickScreen() {
  const setOnboardingRewardSuggestion = useStore(s => s.setOnboardingRewardSuggestion)
  const [showCustom, setShowCustom] = useState(false)
  const [customReward, setCustomReward] = useState('')
  const [customPractices, setCustomPractices] = useState('5')
  const [mostPopularShown, setMostPopularShown] = useState(true)

  const handleSelect = (reward: string, practices: number) => {
    // Store both reward name and practice count
    setOnboardingRewardSuggestion(`${reward}|${practices}`)
    router.push('/onboarding/set-goal')
  }

  const handleCustomSubmit = () => {
    const rewardName = customReward.trim()
    const practiceCount = parseInt(customPractices) || 5
    if (rewardName) {
      handleSelect(rewardName, practiceCount)
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.top}>
          <Text style={styles.step}>4 of 6</Text>
          <Text style={styles.title}>Pick a reward that would motivate them</Text>
          <Text style={styles.subtitle}>Choose a goal based on effort level</Text>
        </View>

        <View style={styles.sections}>
          {/* Quick Wins */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🟢 Quick Wins</Text>
            <View style={styles.rewardGrid}>
              {QUICK_WINS.map((reward, idx) => (
                <TouchableOpacity
                  key={reward.value}
                  style={[
                    styles.rewardCard,
                    idx === 0 && mostPopularShown && styles.rewardCardPopular,
                  ]}
                  onPress={() => handleSelect(reward.value, reward.practices)}
                  activeOpacity={0.8}
                >
                  {idx === 0 && mostPopularShown && (
                    <View style={styles.popularBadge}>
                      <Text style={styles.popularText}>Most Popular</Text>
                    </View>
                  )}
                  <Text style={styles.rewardLabel}>{reward.label}</Text>
                  <Text style={styles.rewardPractices}>
                    Earn in {reward.practices} {reward.practices === 1 ? 'practice' : 'practices'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Mid Tier */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🟡 Mid Tier</Text>
            <View style={styles.rewardGrid}>
              {MID_TIER.map(reward => (
                <TouchableOpacity
                  key={reward.value}
                  style={styles.rewardCard}
                  onPress={() => handleSelect(reward.value, reward.practices)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.rewardLabel}>{reward.label}</Text>
                  <Text style={styles.rewardPractices}>
                    Earn in {reward.practices} practices
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Big Goals */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🔴 Big Goals</Text>
            <View style={styles.rewardGrid}>
              {BIG_GOALS.map(reward => (
                <TouchableOpacity
                  key={reward.value}
                  style={styles.rewardCard}
                  onPress={() => handleSelect(reward.value, reward.practices)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.rewardLabel}>{reward.label}</Text>
                  <Text style={styles.rewardPractices}>
                    Earn in {reward.practices} practices
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Custom Reward */}
          {!showCustom ? (
            <TouchableOpacity
              style={styles.customButton}
              onPress={() => setShowCustom(true)}
              activeOpacity={0.8}
            >
              <Text style={styles.customButtonText}>+ Create Custom Reward</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.customContainer}>
              <Text style={styles.customLabel}>Custom Reward</Text>
              <TextInput
                style={styles.customInput}
                value={customReward}
                onChangeText={setCustomReward}
                placeholder="Enter reward name..."
                placeholderTextColor="#94a3b8"
                autoFocus
              />
              <View style={styles.practicesInputRow}>
                <Text style={styles.practicesLabel}>Practices needed:</Text>
                <TextInput
                  style={styles.practicesInput}
                  value={customPractices}
                  onChangeText={setCustomPractices}
                  placeholder="5"
                  placeholderTextColor="#94a3b8"
                  keyboardType="number-pad"
                  maxLength={3}
                />
              </View>
              <TouchableOpacity
                style={[styles.customSubmitButton, !customReward.trim() && styles.customSubmitButtonDisabled]}
                onPress={handleCustomSubmit}
                disabled={!customReward.trim()}
                activeOpacity={0.8}
              >
                <Text style={styles.customSubmitButtonText}>Add Reward</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 32,
    paddingBottom: 48,
  },
  top: {
    gap: 8,
    marginBottom: 32,
  },
  step: {
    fontSize: 13,
    fontWeight: '600',
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0f172a',
    lineHeight: 36,
  },
  subtitle: {
    fontSize: 15,
    color: '#64748b',
    marginTop: 4,
  },
  sections: {
    gap: 28,
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
  },
  rewardGrid: {
    gap: 12,
  },
  rewardCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#e2e8f0',
    paddingHorizontal: 20,
    paddingVertical: 18,
    gap: 6,
    position: 'relative',
  },
  rewardCardPopular: {
    backgroundColor: '#fef3c7',
    borderColor: '#fbbf24',
    borderWidth: 3,
  },
  popularBadge: {
    position: 'absolute',
    top: -10,
    right: 12,
    backgroundColor: '#fbbf24',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
  },
  popularText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#78350f',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  rewardLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
  },
  rewardPractices: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e40af',
  },
  customButton: {
    backgroundColor: '#eff6ff',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#bfdbfe',
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: 8,
  },
  customButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e40af',
  },
  customContainer: {
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#e2e8f0',
    padding: 20,
    gap: 14,
    marginTop: 8,
  },
  customLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
  },
  customInput: {
    borderWidth: 1.5,
    borderColor: '#cbd5e1',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#0f172a',
    backgroundColor: '#fff',
  },
  practicesInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  practicesLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#475569',
  },
  practicesInput: {
    borderWidth: 1.5,
    borderColor: '#cbd5e1',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#0f172a',
    backgroundColor: '#fff',
    width: 80,
    textAlign: 'center',
  },
  customSubmitButton: {
    backgroundColor: '#1e40af',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  customSubmitButtonDisabled: {
    backgroundColor: '#cbd5e1',
  },
  customSubmitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
})
