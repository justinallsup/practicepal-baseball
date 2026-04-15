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
import { PRACTICE_CHALLENGES, DRILL_CHIPS, PracticeDuration } from '../../lib/practice-types'
import { AppIcon } from '../AppIcon'
import { Play } from 'lucide-react-native'

interface PrePracticeScreenProps {
  childName: string
  onStart: (durationMinutes: PracticeDuration, challengeId?: string, drillIds?: string[]) => void
  onCancel: () => void
  defaultDuration?: PracticeDuration
}

export default function PrePracticeScreen({
  childName,
  onStart,
  onCancel,
  defaultDuration = 15,
}: PrePracticeScreenProps) {
  const [selectedChallenge, setSelectedChallenge] = useState<string | undefined>(undefined)
  const [selectedDrills, setSelectedDrills] = useState<string[]>([])
  const [duration, setDuration] = useState<PracticeDuration>(defaultDuration)

  const handleStartPractice = () => {
    onStart(duration, selectedChallenge, selectedDrills)
  }

  const toggleDrill = (drillId: string) => {
    setSelectedDrills((prev) =>
      prev.includes(drillId) ? prev.filter((id) => id !== drillId) : [...prev, drillId]
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Let's Practice!</Text>
        <TouchableOpacity onPress={onCancel} style={styles.closeButton}>
          <Text style={styles.closeButtonText}>✕</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {/* Duration Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>How long?</Text>
          <View style={styles.durationGrid}>
            {([10, 15, 20, 30] as PracticeDuration[]).map((mins) => (
              <TouchableOpacity
                key={mins}
                onPress={() => setDuration(mins)}
                style={[
                  styles.durationButton,
                  duration === mins && styles.durationButtonSelected,
                ]}
              >
                <Text
                  style={[
                    styles.durationButtonText,
                    duration === mins && styles.durationButtonTextSelected,
                  ]}
                >
                  {mins} min
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Challenge Selection */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionLabel}>Pick Today's Challenge</Text>
            <Text style={styles.optionalLabel}>(optional)</Text>
          </View>
          <View style={styles.challengeList}>
            {PRACTICE_CHALLENGES.map((challenge) => (
              <TouchableOpacity
                key={challenge.id}
                onPress={() =>
                  setSelectedChallenge(selectedChallenge === challenge.id ? undefined : challenge.id)
                }
                style={[
                  styles.challengeCard,
                  selectedChallenge === challenge.id && styles.challengeCardSelected,
                ]}
              >
                <AppIcon
                  name={challenge.icon}
                  size={30}
                  color={selectedChallenge === challenge.id ? '#10b981' : '#fff'}
                  style={styles.challengeIconWrap}
                />
                <View style={styles.challengeInfo}>
                  <Text
                    style={[
                      styles.challengeTitle,
                      selectedChallenge === challenge.id && styles.challengeTitleSelected,
                    ]}
                  >
                    {challenge.title}
                  </Text>
                  <Text
                    style={[
                      styles.challengeDescription,
                      selectedChallenge === challenge.id && styles.challengeDescriptionSelected,
                    ]}
                  >
                    {challenge.description}
                  </Text>
                </View>
                {selectedChallenge === challenge.id && (
                  <View style={styles.checkmark}>
                    <Text style={styles.checkmarkText}>✓</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Drill Chips */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionLabel}>What are you working on?</Text>
            <Text style={styles.optionalLabel}>(optional)</Text>
          </View>
          <View style={styles.drillChips}>
            {DRILL_CHIPS.map((drill) => (
              <TouchableOpacity
                key={drill.id}
                onPress={() => toggleDrill(drill.id)}
                style={[
                  styles.drillChip,
                  selectedDrills.includes(drill.id) && styles.drillChipSelected,
                ]}
              >
                <AppIcon
                  name={drill.icon}
                  size={18}
                  color={selectedDrills.includes(drill.id) ? '#10b981' : '#fff'}
                />
                <Text
                  style={[
                    styles.drillText,
                    selectedDrills.includes(drill.id) && styles.drillTextSelected,
                  ]}
                >
                  {drill.title}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Summary */}
        <View style={styles.summary}>
          <Text style={styles.summaryLabel}>Ready to practice:</Text>
          <Text style={styles.summaryText}>{duration} minute session</Text>
          {selectedChallenge && (
            <Text style={styles.summaryDetail}>
              Challenge: {PRACTICE_CHALLENGES.find((c) => c.id === selectedChallenge)?.title}
            </Text>
          )}
          {selectedDrills.length > 0 && (
            <Text style={styles.summaryDetail}>
              Drills: {selectedDrills.map((id) => DRILL_CHIPS.find((d) => d.id === id)?.title).join(', ')}
            </Text>
          )}
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.footer}>
        <TouchableOpacity onPress={handleStartPractice} style={styles.startButton}>
          <View style={styles.startButtonInner}>
            <Play size={20} color="#10b981" />
            <Text style={styles.startButtonText}>Start Practice</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={onCancel} style={styles.cancelButton}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#10b981',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#fff',
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 20,
    color: '#fff',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 24,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
  },
  optionalLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
  },
  durationGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  durationButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
  },
  durationButtonSelected: {
    backgroundColor: '#fff',
  },
  durationButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
  },
  durationButtonTextSelected: {
    color: '#10b981',
  },
  challengeList: {
    gap: 8,
  },
  challengeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  challengeCardSelected: {
    backgroundColor: '#fff',
    borderColor: '#10b981',
  },
  challengeIconWrap: {
    marginRight: 12,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  challengeInfo: {
    flex: 1,
  },
  challengeTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
  },
  challengeTitleSelected: {
    color: '#10b981',
  },
  challengeDescription: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  challengeDescriptionSelected: {
    color: '#059669',
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#10b981',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  drillChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  drillChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    gap: 6,
  },
  drillChipSelected: {
    backgroundColor: '#fff',
  },
  drillText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  drillTextSelected: {
    color: '#10b981',
  },
  summary: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  summaryLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 4,
  },
  summaryText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  summaryDetail: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 4,
  },
  footer: {
    padding: 20,
    gap: 12,
  },
  startButton: {
    backgroundColor: '#fff',
    paddingVertical: 20,
    borderRadius: 16,
    alignItems: 'center',
  },
  startButtonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  startButtonText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#10b981',
  },
  cancelButton: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
})
