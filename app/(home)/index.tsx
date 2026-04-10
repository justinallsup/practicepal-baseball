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
import { useStore } from '../../lib/store'
import { PracticeType } from '../../lib/store'
import StreakBadge from '../../components/StreakBadge'
import WeeklyTracker from '../../components/WeeklyTracker'
import PracticeTypeSelector from '../../components/PracticeTypeSelector'
import RewardProgress from '../../components/RewardProgress'
import {
  requestNotificationPermission,
  scheduleStreakReminder,
} from '../../lib/notifications'

type Feeling = 'easy' | 'solid' | 'hard'

const FEELING_OPTIONS: { value: Feeling; emoji: string; label: string }[] = [
  { value: 'easy', emoji: '😐', label: 'Easy' },
  { value: 'solid', emoji: '💪', label: 'Solid' },
  { value: 'hard', emoji: '🔥', label: 'Hard' },
]

const FEELING_MESSAGES: Record<Feeling, string> = {
  easy: 'Good session — keep building ⚾',
  solid: 'Nice consistent effort 👊',
  hard: 'Great work pushing today 💪',
}

export default function HomeScreen() {
  const child = useStore(s => s.child)
  const logs = useStore(s => s.logs)
  const logPractice = useStore(s => s.logPractice)
  const getCurrentStreak = useStore(s => s.getCurrentStreak)
  const getBestStreak = useStore(s => s.getBestStreak)
  const hasLoggedToday = useStore(s => s.hasLoggedToday)
  const shouldShowPaywall = useStore(s => s.shouldShowPaywall)
  const reward = useStore(s => s.reward)
  const getRewardProgress = useStore(s => s.getRewardProgress)
  const isRewardEarned = useStore(s => s.isRewardEarned)
  const markRewardEarned = useStore(s => s.markRewardEarned)
  const clearReward = useStore(s => s.clearReward)
  const updateLastLogFeeling = useStore(s => s.updateLastLogFeeling)
  const notificationsEnabled = useStore(s => s.notificationsEnabled)
  const hasAskedNotificationPermission = useStore(s => s.hasAskedNotificationPermission)
  const setNotificationsEnabled = useStore(s => s.setNotificationsEnabled)
  const setHasAskedNotificationPermission = useStore(s => s.setHasAskedNotificationPermission)

  const [showModal, setShowModal] = useState(false)
  const [selectedTypes, setSelectedTypes] = useState<PracticeType[]>([])
  const [loggedThisSession, setLoggedThisSession] = useState(false)
  const [showRewardModal, setShowRewardModal] = useState(false)
  const [selectedFeeling, setSelectedFeeling] = useState<Feeling | null>(null)
  const [showNotifPrompt, setShowNotifPrompt] = useState(false)

  // Animation refs
  const successScale = useRef(new Animated.Value(0)).current
  const confettiOpacity = useRef(new Animated.Value(0)).current

  const currentStreak = getCurrentStreak()
  const bestStreak = getBestStreak()
  const loggedToday = hasLoggedToday()
  const paywallActive = shouldShowPaywall()

  const handleLogPress = useCallback(async () => {
    if (Platform.OS !== 'web') {
      try {
        const Haptics = await import('expo-haptics')
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
      } catch {}
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
      setSelectedFeeling(null)

      // Check if reward was just earned
      if (reward && !isRewardEarned()) {
        const progress = getRewardProgress()
        if (progress >= reward.targetValue) {
          markRewardEarned()
          setShowRewardModal(true)
        }
      }

      // Re-schedule streak reminder if notifications are enabled
      if (notificationsEnabled) {
        const progress = getRewardProgress()
        scheduleStreakReminder({
          rewardName: reward?.rewardName,
          remainingPractices: reward
            ? Math.max(0, reward.targetValue - progress)
            : undefined,
          currentStreak: getCurrentStreak(),
        }).catch(() => {})
      }

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
        // After success animation, check if we should show notification prompt
        // Show after 2nd log and haven't asked yet
        const currentLogs = useStore.getState().logs
        if (currentLogs.length === 2 && !hasAskedNotificationPermission) {
          setTimeout(() => {
            setShowNotifPrompt(true)
          }, 600)
        }

        // After 2s, check if we should navigate to paywall
        setTimeout(() => {
          const show = shouldShowPaywall()
          if (show) {
            router.push('/(home)/paywall')
          }
        }, 1800)
      })
    }
  }, [
    selectedTypes,
    logPractice,
    shouldShowPaywall,
    reward,
    isRewardEarned,
    getRewardProgress,
    markRewardEarned,
    notificationsEnabled,
    getCurrentStreak,
    hasAskedNotificationPermission,
  ])

  const handleFeelingSelect = useCallback(
    (feeling: Feeling) => {
      setSelectedFeeling(feeling)
      updateLastLogFeeling(feeling)
    },
    [updateLastLogFeeling]
  )

  const handleNotifYes = useCallback(async () => {
    setShowNotifPrompt(false)
    setHasAskedNotificationPermission(true)
    const granted = await requestNotificationPermission()
    if (granted) {
      setNotificationsEnabled(true)
      const progress = getRewardProgress()
      scheduleStreakReminder({
        rewardName: reward?.rewardName,
        remainingPractices: reward
          ? Math.max(0, reward.targetValue - progress)
          : undefined,
        currentStreak: getCurrentStreak(),
      }).catch(() => {})
    }
  }, [
    setHasAskedNotificationPermission,
    setNotificationsEnabled,
    getRewardProgress,
    reward,
    getCurrentStreak,
  ])

  const handleNotifNo = useCallback(() => {
    setShowNotifPrompt(false)
    setHasAskedNotificationPermission(true)
  }, [setHasAskedNotificationPermission])

  const newStreak = getCurrentStreak()
  const rewardEarned = isRewardEarned()
  const rewardProgress = getRewardProgress()
  const remainingPractices = reward
    ? Math.max(0, reward.targetValue - rewardProgress)
    : null

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

      {/* Reward progress card */}
      <RewardProgress onAddReward={() => router.push('/onboarding/add-reward')} />

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
            {loggedThisSession && reward && !rewardEarned && (
              <Text style={styles.rewardNudge}>
                1 step closer to {reward.rewardName} 🎯
              </Text>
            )}
            {loggedThisSession && (
              <Animated.Text style={[styles.confetti, { opacity: confettiOpacity }]}>
                🎉 ⭐ 🔥 ⭐ 🎉
              </Animated.Text>
            )}

            {/* Feeling selector — shown only when just logged and no feeling picked yet */}
            {loggedThisSession && selectedFeeling === null && (
              <View style={styles.feelingSection}>
                <Text style={styles.feelingTitle}>How was practice today?</Text>
                <View style={styles.feelingRow}>
                  {FEELING_OPTIONS.map(opt => (
                    <TouchableOpacity
                      key={opt.value}
                      style={styles.feelingBtn}
                      onPress={() => handleFeelingSelect(opt.value)}
                      activeOpacity={0.75}
                    >
                      <Text style={styles.feelingEmoji}>{opt.emoji}</Text>
                      <Text style={styles.feelingLabel}>{opt.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {/* Feeling confirmation message */}
            {loggedThisSession && selectedFeeling !== null && (
              <View style={styles.feelingConfirm}>
                <Text style={styles.feelingConfirmText}>{FEELING_MESSAGES[selectedFeeling]}</Text>
              </View>
            )}

            {/* Next step section */}
            <View style={styles.nextStepSection}>
              <View style={styles.nextStepDivider} />
              <Text style={styles.nextStepHeading}>Next step:</Text>
              <Text style={styles.nextStepText}>
                Log practice again tomorrow to keep the streak alive 🔥
              </Text>
              {reward && !rewardEarned && remainingPractices !== null && remainingPractices > 0 && (
                <Text style={styles.nextStepReward}>
                  {remainingPractices} more practice{remainingPractices === 1 ? '' : 's'} to earn{' '}
                  {reward.rewardName} 🎯
                </Text>
              )}
            </View>
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

      {/* Reward earned modal */}
      <Modal visible={showRewardModal} transparent animationType="fade">
        <View style={styles.rewardModalOverlay}>
          <View style={styles.rewardModalCard}>
            <Text style={styles.rewardModalEmoji}>🎉</Text>
            <Text style={styles.rewardModalTitle}>Reward Earned!</Text>
            <Text style={styles.rewardModalReward}>{reward?.rewardName}</Text>
            <Text style={styles.rewardModalSub}>{child?.name} earned this reward!</Text>
            <TouchableOpacity
              onPress={() => {
                clearReward()
                setShowRewardModal(false)
              }}
              style={styles.rewardModalBtn}
              activeOpacity={0.85}
            >
              <Text style={styles.rewardModalBtnText}>Set New Reward</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Notification permission soft prompt */}
      <Modal visible={showNotifPrompt} transparent animationType="fade">
        <View style={styles.notifModalOverlay}>
          <View style={styles.notifModalCard}>
            <Text style={styles.notifModalEmoji}>🔔</Text>
            <Text style={styles.notifModalTitle}>Want a reminder so you don't break your streak?</Text>
            <Text style={styles.notifModalSub}>
              We'll ping you at 6pm so practice stays on track.
            </Text>
            <TouchableOpacity
              style={styles.notifYesBtn}
              onPress={handleNotifYes}
              activeOpacity={0.85}
            >
              <Text style={styles.notifYesBtnText}>Yes, remind me</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.notifNoBtn}
              onPress={handleNotifNo}
              activeOpacity={0.7}
            >
              <Text style={styles.notifNoBtnText}>No thanks</Text>
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
    width: '100%',
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
  rewardNudge: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e40af',
    textAlign: 'center',
    marginTop: 4,
  },
  confetti: {
    fontSize: 28,
    marginTop: 8,
    letterSpacing: 4,
  },
  // Feeling selector
  feelingSection: {
    marginTop: 16,
    alignItems: 'center',
    gap: 12,
    width: '100%',
  },
  feelingTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#475569',
    textAlign: 'center',
  },
  feelingRow: {
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
  },
  feelingBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  feelingEmoji: {
    fontSize: 18,
  },
  feelingLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
  },
  feelingConfirm: {
    backgroundColor: '#eff6ff',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginTop: 4,
  },
  feelingConfirmText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e40af',
    textAlign: 'center',
  },
  // Next step section
  nextStepSection: {
    alignItems: 'center',
    gap: 6,
    width: '100%',
    marginTop: 8,
    paddingHorizontal: 8,
  },
  nextStepDivider: {
    width: '80%',
    height: 1,
    backgroundColor: '#e2e8f0',
    marginBottom: 8,
  },
  nextStepHeading: {
    fontSize: 13,
    fontWeight: '700',
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  nextStepText: {
    fontSize: 14,
    color: '#475569',
    textAlign: 'center',
    lineHeight: 20,
  },
  nextStepReward: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e40af',
    textAlign: 'center',
    marginTop: 2,
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
  // Practice type modal
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
  // Reward earned modal
  rewardModalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 32,
  },
  rewardModalCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    gap: 8,
    width: '100%',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 8 },
    elevation: 16,
  },
  rewardModalEmoji: {
    fontSize: 56,
    marginBottom: 4,
  },
  rewardModalTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#0f172a',
  },
  rewardModalReward: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e40af',
  },
  rewardModalSub: {
    fontSize: 15,
    color: '#64748b',
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 8,
  },
  rewardModalBtn: {
    backgroundColor: '#1e40af',
    borderRadius: 14,
    paddingHorizontal: 28,
    paddingVertical: 14,
    marginTop: 8,
  },
  rewardModalBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  // Notification soft prompt modal
  notifModalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 32,
  },
  notifModalCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    gap: 10,
    width: '100%',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 6 },
    elevation: 12,
  },
  notifModalEmoji: {
    fontSize: 48,
    marginBottom: 4,
  },
  notifModalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0f172a',
    textAlign: 'center',
    lineHeight: 26,
  },
  notifModalSub: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 4,
  },
  notifYesBtn: {
    backgroundColor: '#1e40af',
    borderRadius: 14,
    paddingHorizontal: 28,
    paddingVertical: 14,
    width: '100%',
    alignItems: 'center',
    marginTop: 4,
  },
  notifYesBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  notifNoBtn: {
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notifNoBtnText: {
    fontSize: 15,
    color: '#94a3b8',
  },
})
