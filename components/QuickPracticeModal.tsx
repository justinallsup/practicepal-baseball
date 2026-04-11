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
import { PracticeDuration } from '../lib/practice-types'

interface QuickPracticeModalProps {
  visible: boolean
  onComplete: () => void
  onCancel: () => void
}

export function QuickPracticeModal({ visible, onComplete, onCancel }: QuickPracticeModalProps) {
  const [phase, setPhase] = useState<'setup' | 'active'>('setup')
  const [duration, setDuration] = useState<PracticeDuration>(15)
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const [showEarlyFinishModal, setShowEarlyFinishModal] = useState(false)
  
  const timerRef = useRef<NodeJS.Timeout | null>(null)

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
    }
  }, [visible])

  useEffect(() => {
    if (phase === 'active') {
      timerRef.current = setInterval(() => {
        setElapsedSeconds(prev => prev + 1)
      }, 1000)
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [phase])

  const handleStart = () => {
    setPhase('active')
    setElapsedSeconds(0)
  }

  const handleFinish = () => {
    if (timerRef.current) clearInterval(timerRef.current)
    
    // If not complete, show early finish modal
    if (!isComplete) {
      setShowEarlyFinishModal(true)
    } else {
      onComplete()
      setPhase('setup')
      setElapsedSeconds(0)
    }
  }

  const handleEarlyFinish = () => {
    setShowEarlyFinishModal(false)
    onComplete()
    setPhase('setup')
    setElapsedSeconds(0)
  }

  const handleKeepPracticing = () => {
    setShowEarlyFinishModal(false)
    // Resume timer
    setPhase('active')
  }

  const handleCancelModal = () => {
    if (timerRef.current) clearInterval(timerRef.current)
    setPhase('setup')
    setElapsedSeconds(0)
    setShowEarlyFinishModal(false)
    onCancel()
  }

  if (!visible) return null

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          {/* Setup Phase */}
          {phase === 'setup' && (
            <View style={styles.setupContainer}>
              <Text style={styles.title}>Quick Practice</Text>
              <Text style={styles.subtitle}>Set duration and start</Text>
              
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

              <TouchableOpacity onPress={handleStart} style={styles.startButton}>
                <Text style={styles.startButtonText}>Start Timer</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleCancelModal} style={styles.cancelButton}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Active Phase */}
          {phase === 'active' && (
            <View style={styles.activeContainer}>
              <Text style={styles.activeTitle}>Practice In Progress</Text>
              
              <View style={styles.timerContainer}>
                <Text style={styles.timerText}>{formatTime(remainingSeconds)}</Text>
                <Text style={styles.timerLabel}>{isComplete ? 'Time Complete!' : 'Time Remaining'}</Text>
              </View>

              <View style={styles.progressBarContainer}>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: `${progress}%` }]} />
                </View>
                <Text style={styles.progressText}>{Math.round(progress)}%</Text>
              </View>

              <TouchableOpacity 
                onPress={handleFinish} 
                style={[styles.finishButton, isComplete && styles.finishButtonComplete]}
              >
                <Text style={styles.finishButtonText}>
                  {isComplete ? "Done! 🎉" : 'Finish Practice'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={handleCancelModal} style={styles.cancelButton}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Early Finish Modal */}
          {showEarlyFinishModal && (
            <View style={styles.earlyFinishOverlay}>
              <View style={styles.earlyFinishModal}>
                <Text style={styles.earlyFinishEmoji}>🤔</Text>
                <Text style={styles.earlyFinishTitle}>End practice early?</Text>
                <Text style={styles.earlyFinishSubtitle}>
                  You still have {formatTime(remainingSeconds)} left!
                </Text>
                <View style={styles.earlyFinishButtons}>
                  <TouchableOpacity onPress={handleKeepPracticing} style={styles.keepButton}>
                    <Text style={styles.keepButtonText}>Keep Practicing</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handleEarlyFinish} style={styles.endButton}>
                    <Text style={styles.endButtonText}>End Early</Text>
                  </TouchableOpacity>
                </View>
              </View>
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
    backgroundColor: '#1e40af',
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
    gap: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#fff',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
  },
  activeTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#fff',
  },
  durationRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
  },
  durationButton: {
    flex: 1,
    paddingVertical: 18,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
  },
  durationButtonActive: {
    backgroundColor: '#fff',
  },
  durationText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#fff',
  },
  durationTextActive: {
    color: '#1e40af',
  },
  startButton: {
    backgroundColor: '#fff',
    paddingVertical: 20,
    borderRadius: 18,
    alignItems: 'center',
    marginTop: 16,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  startButtonText: {
    fontSize: 19,
    fontWeight: '800',
    color: '#1e40af',
  },
  cancelButton: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  timerContainer: {
    alignItems: 'center',
  },
  timerText: {
    fontSize: 72,
    fontWeight: '800',
    color: '#fff',
  },
  timerLabel: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 8,
  },
  progressBarContainer: {
    width: '100%',
    alignItems: 'center',
    gap: 12,
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
  finishButton: {
    backgroundColor: '#fff',
    paddingVertical: 20,
    paddingHorizontal: 40,
    borderRadius: 18,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  finishButtonComplete: {
    backgroundColor: '#fbbf24',
  },
  finishButtonText: {
    fontSize: 19,
    fontWeight: '800',
    color: '#1e40af',
  },
  earlyFinishOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  earlyFinishModal: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 32,
    width: '100%',
    maxWidth: 360,
    alignItems: 'center',
  },
  earlyFinishEmoji: {
    fontSize: 56,
    marginBottom: 16,
  },
  earlyFinishTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 8,
  },
  earlyFinishSubtitle: {
    fontSize: 15,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 24,
  },
  earlyFinishButtons: {
    width: '100%',
    gap: 12,
  },
  keepButton: {
    backgroundColor: '#22c55e',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  keepButtonText: {
    fontSize: 17,
    fontWeight: '800',
    color: '#fff',
  },
  endButton: {
    backgroundColor: '#f1f5f9',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  endButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#475569',
  },
})
