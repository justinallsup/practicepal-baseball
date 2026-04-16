import React, { useState, useRef, useEffect } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Animated,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { PracticeDuration, PRACTICE_CHALLENGES } from '../lib/practice-types'
import { AppIcon } from './AppIcon'
import { Play } from 'lucide-react-native'

interface PracticeTimerModalProps {
  visible: boolean
  onComplete: () => void
  onCancel: () => void
}

export function PracticeTimerModal({ visible, onComplete, onCancel }: PracticeTimerModalProps) {
  const [phase, setPhase] = useState<'setup' | 'active' | 'complete'>('setup')
  const [duration, setDuration] = useState<PracticeDuration>(15)
  const [selectedChallenge, setSelectedChallenge] = useState<string | undefined>()
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const [showEncouragement, setShowEncouragement] = useState(false)
  const [encouragementText, setEncouragementText] = useState('')
  
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const encouragementOpacity = useRef(new Animated.Value(0)).current

  const targetSeconds = duration * 60
  const progress = Math.min((elapsedSeconds / targetSeconds) * 100, 100)
  const remainingSeconds = Math.max(0, targetSeconds - elapsedSeconds)
  const isComplete = elapsedSeconds >= targetSeconds

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // Reset when modal becomes visible
  useEffect(() => {
    if (visible) {
      setPhase('setup')
      setElapsedSeconds(0)
      setSelectedChallenge(undefined)
      setShowEncouragement(false)
    }
  }, [visible])

  useEffect(() => {
    if (phase === 'active') {
      timerRef.current = setInterval(() => {
        setElapsedSeconds(prev => {
          const next = prev + 1
          // Show encouragement at milestones
          const pct = next / targetSeconds
          if (Math.abs(pct - 0.5) < 0.01) {
            showEncouragementMessage('💪 Halfway there — keep going!')
          } else if (Math.abs(pct - 0.75) < 0.01) {
            showEncouragementMessage('🔥 Almost done — don\'t stop now!')
          }
          return next
        })
      }, 1000)
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [phase, targetSeconds])

  const showEncouragementMessage = (message?: string) => {
    const messages = ["💪 Halfway there — keep going!", "🔥 Almost done — don't stop now!", "You're on fire! 🎯"]
    setEncouragementText(message || messages[Math.floor(Math.random() * messages.length)])
    setShowEncouragement(true)
    Animated.sequence([
      Animated.timing(encouragementOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.delay(2000),
      Animated.timing(encouragementOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => setShowEncouragement(false))
  }

  const handleStart = () => {
    setPhase('active')
    setElapsedSeconds(0)
  }

  const handleFinish = () => {
    if (timerRef.current) clearInterval(timerRef.current)
    setPhase('complete')
  }

  const handleDone = () => {
    onComplete()
    // Reset for next time
    setPhase('setup')
    setElapsedSeconds(0)
    setSelectedChallenge(undefined)
  }

  const handleCancelModal = () => {
    if (timerRef.current) clearInterval(timerRef.current)
    setPhase('setup')
    setElapsedSeconds(0)
    setSelectedChallenge(undefined)
    onCancel()
  }

  if (!visible) return null

  return (
    <Modal 
      visible={visible} 
      animationType="slide" 
      transparent={false}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
        {/* Setup Phase */}
        {phase === 'setup' && (
          <View style={styles.setupContainer}>
            <Text style={styles.title}>Let's Practice!</Text>
            
            <View style={styles.section}>
              <Text style={styles.label}>How long?</Text>
              <View style={styles.durationRow}>
                {([10, 15, 20, 30] as PracticeDuration[]).map(mins => (
                  <TouchableOpacity
                    key={mins}
                    onPress={() => setDuration(mins)}
                    style={[styles.durationButton, duration === mins && styles.durationButtonActive]}
                  >
                    <Text style={[styles.durationText, duration === mins && styles.durationTextActive]}>
                      {mins} min
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.label}>Pick a Challenge (optional)</Text>
              {PRACTICE_CHALLENGES.slice(0, 3).map(challenge => {
                const isActive = selectedChallenge === challenge.id
                return (
                  <TouchableOpacity
                    key={challenge.id}
                    onPress={() => setSelectedChallenge(
                      isActive ? undefined : challenge.id
                    )}
                    style={[
                      styles.challengeCard,
                      isActive && styles.challengeCardActive
                    ]}
                  >
                    <View style={styles.challengeIconWrap}>
                      <AppIcon
                        name={challenge.icon}
                        size={28}
                        color={isActive ? '#10b981' : '#fff'}
                      />
                    </View>
                    <Text style={[
                      styles.challengeTitle,
                      isActive && styles.challengeTitleActive,
                    ]}>
                      {challenge.title}
                    </Text>
                    {isActive && (
                      <View style={styles.challengeCheck}>
                        <Text style={styles.challengeCheckText}>✓</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                )
              })}
            </View>

            <TouchableOpacity onPress={handleStart} style={styles.startButton}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Play size={20} color="#10b981" />
                <Text style={styles.startButtonText}>Start Practice</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleCancelModal} style={styles.cancelButton}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Active Phase */}
        {phase === 'active' && (
          <View style={styles.activeContainer}>
            {showEncouragement && (
              <Animated.View style={[styles.encouragement, { opacity: encouragementOpacity }]}>
                <Text style={styles.encouragementText}>{encouragementText}</Text>
              </Animated.View>
            )}

            <Text style={styles.activeTitle}>Practice In Progress 🔥</Text>
            
            <View style={styles.timerContainer}>
              <Text style={styles.timerText}>{formatTime(remainingSeconds)}</Text>
              <Text style={styles.timerLabel}>{isComplete ? 'Time Complete!' : 'Time Remaining'}</Text>
            </View>

            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${progress}%` }]} />
            </View>
            <Text style={styles.progressText}>{Math.round(progress)}%</Text>

            {selectedChallenge && (
              <View style={styles.challengeDisplay}>
                <AppIcon
                  name={PRACTICE_CHALLENGES.find(c => c.id === selectedChallenge)?.icon ?? 'baseball'}
                  size={48}
                  color="#fff"
                />
                <Text style={styles.challengeDisplayText}>
                  {PRACTICE_CHALLENGES.find(c => c.id === selectedChallenge)?.title}
                </Text>
              </View>
            )}

            <TouchableOpacity onPress={handleFinish} style={[styles.finishButton, isComplete && styles.finishButtonComplete]}>
              <Text style={styles.finishButtonText}>
                {isComplete ? "I'm Done!" : 'Finish Practice'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleCancelModal} style={styles.cancelButton}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Complete Phase */}
        {phase === 'complete' && (
          <View style={styles.completeContainer}>
            <Text style={styles.confettiRow}>🎉 ⭐ 🏆 ⭐ 🎉</Text>
            <AppIcon name="trophy" size={72} color="#fbbf24" />
            <Text style={styles.completeTitle}>Practice Complete!</Text>
            <Text style={styles.completeSubtitle}>You crushed it 💪</Text>
            
            <View style={styles.statsCard}>
              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <Text style={styles.statsLabel}>🔥 Points</Text>
                  <Text style={styles.statsValue}>+10</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statsLabel}>⏱ Time</Text>
                  <Text style={styles.statsValueSmall}>{Math.round(elapsedSeconds / 60)} min</Text>
                </View>
              </View>
            </View>

            {selectedChallenge && (
              <View style={styles.challengeCompleteCard}>
                <Text style={styles.challengeCompleteEmoji}>✅</Text>
                <Text style={styles.challengeCompleteText}>Challenge Complete!</Text>
                <Text style={styles.challengeCompleteTitle}>
                  {PRACTICE_CHALLENGES.find(c => c.id === selectedChallenge)?.title}
                </Text>
              </View>
            )}

            <Text style={styles.keepGoingText}>Keep the streak alive — come back tomorrow! 🔥</Text>

            <TouchableOpacity onPress={handleDone} style={styles.doneButton}>
              <Text style={styles.doneButtonText}>Done 🎯</Text>
            </TouchableOpacity>
          </View>
        )}
        </View>
      </SafeAreaView>
    </Modal>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#10b981',
  },
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  setupContainer: {
    gap: 24,
  },
  activeContainer: {
    alignItems: 'center',
    gap: 24,
  },
  completeContainer: {
    alignItems: 'center',
    gap: 16,
  },
  confettiRow: {
    fontSize: 28,
    letterSpacing: 4,
    marginBottom: 4,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#fff',
    textAlign: 'center',
  },
  activeTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#fff',
  },
  section: {
    gap: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  durationRow: {
    flexDirection: 'row',
    gap: 8,
  },
  durationButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
  },
  durationButtonActive: {
    backgroundColor: '#fff',
  },
  durationText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  durationTextActive: {
    color: '#10b981',
  },
  challengeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    gap: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  challengeCardActive: {
    backgroundColor: '#fff',
    borderColor: '#10b981',
  },
  challengeIconWrap: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  challengeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    flex: 1,
  },
  challengeTitleActive: {
    color: '#10b981',
  },
  challengeCheck: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#10b981',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  challengeCheckText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '800',
  },
  startButton: {
    backgroundColor: '#fff',
    paddingVertical: 20,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 12,
  },
  startButtonText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#10b981',
  },
  cancelButton: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  timerContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  timerText: {
    fontSize: 72,
    fontWeight: '800',
    color: '#fff',
  },
  timerLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 8,
  },
  progressBar: {
    width: '100%',
    height: 12,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 6,
  },
  progressText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  challengeDisplay: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    gap: 8,
  },
  challengeDisplayEmoji: {
    fontSize: 48,
  },
  challengeDisplayText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  finishButton: {
    backgroundColor: '#fff',
    paddingVertical: 20,
    paddingHorizontal: 40,
    borderRadius: 16,
    width: '100%',
    alignItems: 'center',
  },
  finishButtonComplete: {
    backgroundColor: '#fbbf24',
  },
  finishButtonText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#10b981',
  },
  encouragement: {
    position: 'absolute',
    top: 40,
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 100,
  },
  encouragementText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#10b981',
  },
  completeEmoji: {
    fontSize: 80,
  },
  completeTitle: {
    fontSize: 36,
    fontWeight: '800',
    color: '#fff',
  },
  completeSubtitle: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.9)',
  },
  statsCard: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 32,
    paddingVertical: 20,
    borderRadius: 20,
    width: '100%',
    gap: 8,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    gap: 4,
  },
  statsLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  statsValue: {
    fontSize: 48,
    fontWeight: '800',
    color: '#fff',
  },
  statsValueSmall: {
    fontSize: 32,
    fontWeight: '800',
    color: '#fff',
  },
  statsDetail: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
  },
  keepGoingText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
  },
  challengeCompleteCard: {
    backgroundColor: '#fbbf24',
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderRadius: 16,
    alignItems: 'center',
    width: '100%',
    gap: 8,
  },
  challengeCompleteEmoji: {
    fontSize: 40,
  },
  challengeCompleteText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#78350f',
  },
  challengeCompleteTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#92400e',
  },
  doneButton: {
    backgroundColor: '#fff',
    paddingVertical: 20,
    paddingHorizontal: 60,
    borderRadius: 16,
    width: '100%',
    alignItems: 'center',
    marginTop: 12,
  },
  doneButtonText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#10b981',
  },
})
