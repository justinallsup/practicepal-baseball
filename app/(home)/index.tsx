import React, { useState, useRef, useCallback } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Animated,
  Platform,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import * as Haptics from 'expo-haptics'
import { useStore } from '../../lib/store'
import { PracticeType } from '../../lib/store'
import StreakBadge from '../../components/StreakBadge'
import WeeklyTracker from '../../components/WeeklyTracker'
import PracticeTypeSelector from '../../components/PracticeTypeSelector'

export default function HomeScreen() {
  const child = useStore(s => s.child)
  const logs = useStore(s => s.logs)
  const logPractice = useStore(s => s.logPractice)
  const getCurrentStreak = useStore(s => s.getCurrentStreak)
  const getBestStreak = useStore(s => s.getBestStreak)
  const hasLoggedToday = useStore(s => s.hasLoggedToday)
  const shouldShowPaywall = useStore(s => s.shouldShowPaywall)

  const [showModal, setShowModal] = useState(false)
  const [selectedTypes, setSelectedTypes] = useState<PracticeType[]>([])
  const [loggedThisSession, setLoggedThisSession] = useState(false)

  // Animation refs
  const successScale = useRef(new Animated.Value(0)).current
  const confettiOpacity = useRef(new Animated.Value(0)).current

  const currentStreak = getCurrentStreak()
  const bestStreak = getBestStreak()
  const loggedToday = hasLoggedToday()
  const paywallActive = shouldShowPaywall()

  const handleLogPress = useCallback(async () => {
    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    }
    setSelectedTypes([])
    setShowModal(true)
  }, [])

  const handleToggleType = useCallback((type: PracticeType) => {
    setSelectedTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    )
  }, [])

  const handleDone = useCallback(() => {
    setShowModal(false)
    const result = logPractice(selectedTypes)
    if (!result.alreadyLoggedToday) {
      setLoggedThisSession(true)
      // Animate success
      Animated.parallel([
        Animated.spring(successScale, {
          toValue: 1,
          useNativeDriver: true,
          damping: 12,
          stiffness: 150,
        }),
        Animated.timing(confettiOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start(() => {
        // After 2s, check if we should navigate to paywall
        setTimeout(() => {
          const show = shouldShowPaywall()
          if (show) {
            router.push('/(home)/paywall')
          }
        }, 1800)
      })
    }
  }, [selectedTypes, logPractice, shouldShowPaywall])

  const newStreak = getCurrentStreak()

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{child?.name ?? 'Player'}'s Practice</Text>
        <TouchableOpacity
          style={styles.weeklyBtn}
          onPress={() => router.push('/(home)/weekly')}
          activeOpacity={0.7}
        >
          <Text style={styles.weeklyBtnText}>📊</Text>
        </TouchableOpacity>
      </View>

      {/* Streak badge */}
      <StreakBadge currentStreak={currentStreak} bestStreak={bestStreak} />

      {/* Weekly tracker */}
      <View style={styles.trackerContainer}>
        <WeeklyTracker logs={logs} />
      </View>

      {/* Main area */}
      <View style={styles.mainArea}>
        {paywallActive && !loggedToday ? (
          /* Paywall locked state */
          <View style={styles.lockedContainer}>
            <Text style={styles.lockedEmoji}>🔒</Text>
            <Text style={styles.lockedTitle}>Subscribe to keep your streak alive</Text>
            <Text style={styles.lockedSub}>
              You've been crushing it — don't let your streak reset
            </Text>
            <TouchableOpacity
              style={styles.paywallButton}
              onPress={() => router.push('/(home)/paywall')}
              activeOpacity={0.85}
            >
              <Text style={styles.paywallButtonText}>Keep the streak alive →</Text>
            </TouchableOpacity>
          </View>
        ) : loggedToday || loggedThisSession ? (
          /* Success state */
          <Animated.View
            style={[
              styles.successContainer,
              { transform: [{ scale: loggedThisSession ? successScale : new Animated.Value(1) }] },
            ]}
          >
            <Text style={styles.successEmoji}>✅</Text>
            <Text style={styles.successTitle}>Practice logged! 🎉</Text>
            <Text style={styles.successStreak}>
              {child?.name ?? 'Player'} is on a {newStreak}-day streak 🔥
            </Text>
            {newStreak >= 2 && (
              <View style={styles.motivationBanner}>
                <Text style={styles.motivationText}>
                  {newStreak} days in a row — keep it going!
                </Text>
              </View>
            )}
            {loggedThisSession && (
              <Animated.Text style={[styles.confetti, { opacity: confettiOpacity }]}>
                🎉 ⭐ 🔥 ⭐ 🎉
              </Animated.Text>
            )}
          </Animated.View>
        ) : (
          /* Log button state */
          <View style={styles.logContainer}>
            <TouchableOpacity
              style={styles.logButton}
              onPress={handleLogPress}
              activeOpacity={0.85}
            >
              <Text style={styles.logButtonEmoji}>⚾</Text>
              <Text style={styles.logButtonText}>Log Practice</Text>
            </TouchableOpacity>
            <Text style={styles.logSubtitle}>Tap to log today's practice</Text>
          </View>
        )}
      </View>

      {/* Practice type selector modal */}
      <Modal
        visible={showModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>What did you work on?</Text>
            <Text style={styles.modalSub}>Select all that apply (optional)</Text>

            <PracticeTypeSelector
              selected={selectedTypes}
              onToggle={handleToggleType}
            />

            <TouchableOpacity
              style={styles.doneButton}
              onPress={handleDone}
              activeOpacity={0.85}
            >
              <Text style={styles.doneButtonText}>Done ✓</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.skipButton}
              onPress={handleDone}
              activeOpacity={0.7}
            >
              <Text style={styles.skipButtonText}>Skip</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0f172a',
  },
  weeklyBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#eff6ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  weeklyBtnText: {
    fontSize: 20,
  },
  trackerContainer: {
    marginTop: 8,
    marginBottom: 8,
  },
  mainArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  logContainer: {
    alignItems: 'center',
    gap: 16,
  },
  logButton: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: '#1e40af',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    shadowColor: '#1e40af',
    shadowOpacity: 0.35,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
  },
  logButtonEmoji: {
    fontSize: 48,
  },
  logButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  logSubtitle: {
    fontSize: 15,
    color: '#94a3b8',
    textAlign: 'center',
  },
  successContainer: {
    alignItems: 'center',
    gap: 12,
  },
  successEmoji: {
    fontSize: 72,
  },
  successTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0f172a',
    textAlign: 'center',
  },
  successStreak: {
    fontSize: 17,
    color: '#64748b',
    textAlign: 'center',
  },
  motivationBanner: {
    backgroundColor: '#fef3c7',
    borderRadius: 14,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginTop: 8,
  },
  motivationText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#92400e',
    textAlign: 'center',
  },
  confetti: {
    fontSize: 28,
    marginTop: 8,
    letterSpacing: 4,
  },
  lockedContainer: {
    alignItems: 'center',
    gap: 14,
    paddingHorizontal: 16,
  },
  lockedEmoji: {
    fontSize: 56,
  },
  lockedTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0f172a',
    textAlign: 'center',
  },
  lockedSub: {
    fontSize: 15,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 22,
  },
  paywallButton: {
    backgroundColor: '#1e40af',
    borderRadius: 16,
    paddingHorizontal: 28,
    paddingVertical: 16,
    marginTop: 8,
  },
  paywallButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  // Modal
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalSheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    paddingBottom: 40,
    gap: 8,
  },
  modalHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#e2e8f0',
    alignSelf: 'center',
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0f172a',
    textAlign: 'center',
  },
  modalSub: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
    marginBottom: 8,
  },
  doneButton: {
    backgroundColor: '#1e40af',
    borderRadius: 16,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  doneButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
  },
  skipButton: {
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  skipButtonText: {
    fontSize: 15,
    color: '#94a3b8',
  },
})
