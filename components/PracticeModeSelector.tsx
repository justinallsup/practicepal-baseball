import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

interface PracticeModeSelectorProps {
  visible: boolean
  onSelectKidMode: () => void
  onSelectQuickMode: () => void
  onCancel: () => void
}

export function PracticeModeSelector({
  visible,
  onSelectKidMode,
  onSelectQuickMode,
  onCancel,
}: PracticeModeSelectorProps) {
  if (!visible) return null

  return (
    <Modal visible={visible} animationType="fade" transparent={true}>
      <View style={styles.overlay}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.container}>
            <View style={styles.modal}>
              <Text style={styles.title}>🚀 Start Practice</Text>
              <Text style={styles.subtitle}>Choose how to track this session</Text>

              <TouchableOpacity
                style={[styles.optionCard, styles.optionCardRecommended]}
                onPress={onSelectKidMode}
                activeOpacity={0.85}
              >
                <View style={styles.recommendedBadge}>
                  <Text style={styles.recommendedText}>⭐ Recommended</Text>
                </View>
                <Text style={styles.optionEmoji}>🎮</Text>
                <View style={styles.optionContent}>
                  <Text style={styles.optionTitle}>Kid Mode</Text>
                  <Text style={styles.optionDescription}>
                    Timer • Challenges • Rewards
                  </Text>
                </View>
                <Text style={styles.arrow}>→</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.optionCard}
                onPress={onSelectQuickMode}
                activeOpacity={0.85}
              >
                <Text style={styles.optionEmoji}>⚡</Text>
                <View style={styles.optionContent}>
                  <Text style={styles.optionTitle}>Quick Mode</Text>
                  <Text style={styles.optionDescription}>
                    Just track time
                  </Text>
                </View>
                <Text style={styles.arrow}>→</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.cancelButton} onPress={onCancel} activeOpacity={0.85}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modal: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 28,
    width: '100%',
    maxWidth: 420,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
    elevation: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0f172a',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 24,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 18,
    padding: 22,
    marginBottom: 14,
    borderWidth: 2,
    borderColor: '#e2e8f0',
    gap: 16,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    position: 'relative' as const,
  },
  optionCardRecommended: {
    backgroundColor: '#eff6ff',
    borderColor: '#1e40af',
    borderWidth: 2.5,
    shadowColor: '#1e40af',
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  recommendedBadge: {
    position: 'absolute' as const,
    top: -10,
    right: 14,
    backgroundColor: '#1e40af',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  recommendedText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#fff',
  },
  optionEmoji: {
    fontSize: 36,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
  },
  arrow: {
    fontSize: 24,
    color: '#94a3b8',
  },
  cancelButton: {
    backgroundColor: '#f1f5f9',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#475569',
  },
})
