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

const PRIMARY_REWARDS = [
  { label: 'Ice Cream 🍦', value: 'Ice Cream', subtitle: 'Quick win' },
  { label: 'Batting Gloves 🧤', value: 'Batting Gloves', subtitle: '1–2 weeks' },
  { label: 'New Bat 🔥', value: 'New Bat', subtitle: 'Big goal' },
  { label: 'New Glove / Mitt 🧤', value: 'New Glove', subtitle: 'Big goal' },
]

const SMALL_REWARDS = [
  { label: 'Candy 🍬', value: 'Candy' },
  { label: 'Pick dinner 🍕', value: 'Pick dinner' },
  { label: 'Extra screen time 📱', value: 'Extra screen time' },
  { label: '$5 allowance 💵', value: '$5 allowance' },
]

const MEDIUM_REWARDS = [
  { label: 'Arm Sleeve 💪', value: 'Arm Sleeve' },
  { label: 'Batting Cage Session ⚾', value: 'Batting Cage Session' },
  { label: 'Team merch 🧢', value: 'Team merch' },
]

const BIG_REWARDS = [
  { label: 'Cleats 👟', value: 'Cleats' },
  { label: 'Catcher\'s Gear 🛡️', value: 'Catcher\'s Gear' },
  { label: 'Private lesson 🏆', value: 'Private lesson' },
]

export default function RewardPickScreen() {
  const setOnboardingRewardSuggestion = useStore(s => s.setOnboardingRewardSuggestion)
  const [expanded, setExpanded] = useState(false)
  const [showCustom, setShowCustom] = useState(false)
  const [customReward, setCustomReward] = useState('')

  const handleSelect = (reward: string) => {
    setOnboardingRewardSuggestion(reward)
    router.push('/onboarding/trial')
  }

  const handleCustomSubmit = () => {
    if (customReward.trim()) {
      handleSelect(customReward.trim())
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.top}>
          <Text style={styles.step}>4 of 5</Text>
          <Text style={styles.title}>Pick a reward that would motivate them</Text>
        </View>

        <View style={styles.options}>
          {/* Primary rewards */}
          {PRIMARY_REWARDS.map(reward => (
            <TouchableOpacity
              key={reward.value}
              style={styles.primaryPill}
              onPress={() => handleSelect(reward.value)}
              activeOpacity={0.8}
            >
              <Text style={styles.primaryPillText}>{reward.label}</Text>
              <Text style={styles.primaryPillSubtitle}>{reward.subtitle}</Text>
            </TouchableOpacity>
          ))}

          {/* Expandable section */}
          <TouchableOpacity
            style={styles.expandButton}
            onPress={() => setExpanded(!expanded)}
            activeOpacity={0.8}
          >
            <Text style={styles.expandButtonText}>
              More reward ideas {expanded ? '▲' : '▼'}
            </Text>
          </TouchableOpacity>

          {expanded && (
            <View style={styles.expandedSection}>
              {/* Small rewards */}
              <Text style={styles.categoryLabel}>Small</Text>
              <View style={styles.categoryGrid}>
                {SMALL_REWARDS.map(reward => (
                  <TouchableOpacity
                    key={reward.value}
                    style={styles.smallPill}
                    onPress={() => handleSelect(reward.value)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.smallPillText}>{reward.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Medium rewards */}
              <Text style={styles.categoryLabel}>Medium</Text>
              <View style={styles.categoryGrid}>
                {MEDIUM_REWARDS.map(reward => (
                  <TouchableOpacity
                    key={reward.value}
                    style={styles.smallPill}
                    onPress={() => handleSelect(reward.value)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.smallPillText}>{reward.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Big rewards */}
              <Text style={styles.categoryLabel}>Big</Text>
              <View style={styles.categoryGrid}>
                {BIG_REWARDS.map(reward => (
                  <TouchableOpacity
                    key={reward.value}
                    style={styles.smallPill}
                    onPress={() => handleSelect(reward.value)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.smallPillText}>{reward.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Custom option */}
              {!showCustom ? (
                <TouchableOpacity
                  style={styles.customButton}
                  onPress={() => setShowCustom(true)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.customButtonText}>Create your own reward</Text>
                </TouchableOpacity>
              ) : (
                <View style={styles.customInputContainer}>
                  <TextInput
                    style={styles.customInput}
                    value={customReward}
                    onChangeText={setCustomReward}
                    placeholder="Enter custom reward..."
                    placeholderTextColor="#94a3b8"
                    autoFocus
                    onSubmitEditing={handleCustomSubmit}
                  />
                  <TouchableOpacity
                    style={[styles.customSubmitButton, !customReward.trim() && styles.customSubmitButtonDisabled]}
                    onPress={handleCustomSubmit}
                    disabled={!customReward.trim()}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.customSubmitButtonText}>Add</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}

          {/* Helper text */}
          <View style={styles.helperSection}>
            <Text style={styles.helperText}>💡 Tip: Start with a small reward to build momentum</Text>
            <Text style={styles.helperText}>Most parents set 2–3 rewards at once</Text>
          </View>
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
    gap: 32,
  },
  top: {
    gap: 12,
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
  options: {
    gap: 14,
  },
  primaryPill: {
    backgroundColor: '#eff6ff',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#bfdbfe',
    paddingHorizontal: 24,
    paddingVertical: 20,
    alignItems: 'center',
    gap: 4,
  },
  primaryPillText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e40af',
  },
  primaryPillSubtitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748b',
  },
  expandButton: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    paddingHorizontal: 20,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  expandButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#475569',
  },
  expandedSection: {
    gap: 16,
    marginTop: 8,
  },
  categoryLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 8,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  smallPill: {
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#cbd5e1',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  smallPillText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#334155',
  },
  customButton: {
    backgroundColor: '#fef3c7',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#fbbf24',
    paddingHorizontal: 20,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  customButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#92400e',
  },
  customInputContainer: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
  },
  customInput: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: '#0f172a',
    backgroundColor: '#f8fafc',
  },
  customSubmitButton: {
    backgroundColor: '#1e40af',
    borderRadius: 12,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  customSubmitButtonDisabled: {
    backgroundColor: '#cbd5e1',
  },
  customSubmitButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
  helperSection: {
    gap: 6,
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  helperText: {
    fontSize: 13,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 18,
  },
})
