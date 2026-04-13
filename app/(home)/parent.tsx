import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useStore } from '../../lib/store'

const GEAR_ITEMS = [
  { emoji: '⚾', name: 'Youth Bat', price: '$49.99', url: 'https://www.amazon.com/s?k=youth+baseball+bat' },
  { emoji: '🧤', name: 'Batting Gloves', price: '$24.99', url: 'https://www.amazon.com/s?k=youth+batting+gloves' },
  { emoji: '🎯', name: 'Training Gear', price: '$34.99', url: 'https://www.amazon.com/s?k=baseball+training+equipment' },
]

function openURL(url: string) {
  if (Platform.OS === 'web') {
    if (typeof window !== 'undefined') {
      window.open(url, '_blank')
    }
  } else {
    import('expo-linking').then(({ default: Linking }) => {
      Linking.openURL(url).catch(() => {})
    }).catch(() => {})
  }
}

function copyToClipboard(text: string) {
  if (Platform.OS === 'web') {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text).catch(() => {})
    }
  } else {
    // React Native clipboard
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { Clipboard } = require('react-native')
      if (Clipboard) Clipboard.setString(text)
    } catch {}
  }
}

export default function ParentScreen() {
  const redemptionRequests = useStore(s => s.redemptionRequests)
  const approveRedemption = useStore(s => s.approveRedemption)
  const denyRedemption = useStore(s => s.denyRedemption)
  const getWeekLogs = useStore(s => s.getWeekLogs)
  const getCurrentStreak = useStore(s => s.getCurrentStreak)
  const totalPoints = useStore(s => s.totalPoints)
  const inviteCode = useStore(s => s.inviteCode)
  const notificationsEnabled = useStore(s => s.notificationsEnabled)
  const setNotificationsEnabled = useStore(s => s.setNotificationsEnabled)

  const weekLogs = getWeekLogs()
  const streak = getCurrentStreak()
  const weekPractices = new Set(weekLogs.map(l => l.date)).size

  // Weekly points (approximation: 10 pts per practice this week)
  const weekPoints = weekPractices * 10

  const pendingRequests = redemptionRequests.filter(r => r.status === 'pending')

  const handleApprove = (id: string, itemName: string) => {
    Alert.alert('Approve Request', `Approve "${itemName}"?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Approve ✓', onPress: () => approveRedemption(id) },
    ])
  }

  const handleDeny = (id: string, itemName: string) => {
    Alert.alert('Deny Request', `Deny "${itemName}"? Points will be refunded.`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Deny', style: 'destructive', onPress: () => denyRedemption(id) },
    ])
  }

  const handleToggleNotif = () => {
    setNotificationsEnabled(!notificationsEnabled)
  }

  const handleCopyCode = () => {
    copyToClipboard(inviteCode)
    Alert.alert('Copied!', `Invite code ${inviteCode} copied to clipboard.`)
  }

  const handleShareCode = () => {
    const message = `Join me on PracticePal Baseball! Use code ${inviteCode} to get started.`
    if (Platform.OS === 'web') {
      if (typeof navigator !== 'undefined' && (navigator as any).share) {
        (navigator as any).share({ text: message }).catch(() => {})
      } else {
        copyToClipboard(message)
        Alert.alert('Copied!', 'Share message copied to clipboard.')
      }
    } else {
      import('expo-linking').then(() => {
        Alert.alert('Share', message, [{ text: 'OK' }])
      }).catch(() => {})
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Parent Dashboard 👨‍👩‍👧</Text>

        {/* Pending Approvals */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pending Approvals</Text>
          {pendingRequests.length === 0 ? (
            <Text style={styles.emptyText}>No pending requests ✓</Text>
          ) : (
            pendingRequests.map(req => (
              <View key={req.id} style={styles.approvalRow}>
                <View style={styles.approvalInfo}>
                  <Text style={styles.approvalName}>{req.itemName}</Text>
                  <Text style={styles.approvalPoints}>⭐ {req.pointCost} pts</Text>
                </View>
                <View style={styles.approvalButtons}>
                  <TouchableOpacity
                    style={styles.approveBtn}
                    onPress={() => handleApprove(req.id, req.itemName)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.approveBtnText}>✓</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.denyBtn}
                    onPress={() => handleDeny(req.id, req.itemName)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.denyBtnText}>✗</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </View>

        {/* This Week Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>This Week</Text>
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{weekPractices}</Text>
              <Text style={styles.statLabel}>Practices</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{weekPoints}</Text>
              <Text style={styles.statLabel}>Points Earned</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{streak}</Text>
              <Text style={styles.statLabel}>Day Streak 🔥</Text>
            </View>
          </View>
          <View style={styles.totalPointsRow}>
            <Text style={styles.totalPointsLabel}>Total Points:</Text>
            <Text style={styles.totalPointsValue}>⭐ {totalPoints} pts</Text>
          </View>
        </View>

        {/* Gear Shop */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Gear Shop 🔥</Text>
          <Text style={styles.sectionSub}>Affiliate links — we earn a small commission</Text>
          <View style={styles.gearGrid}>
            {GEAR_ITEMS.map(item => (
              <TouchableOpacity
                key={item.name}
                style={styles.gearCard}
                onPress={() => openURL(item.url)}
                activeOpacity={0.8}
              >
                <Text style={styles.gearEmoji}>{item.emoji}</Text>
                <Text style={styles.gearName}>{item.name}</Text>
                <Text style={styles.gearPrice}>{item.price}</Text>
                <Text style={styles.shopBtn}>Shop →</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Invite Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Invite a Teammate ⚾</Text>
          <Text style={styles.inviteSubtext}>+100 points per friend who joins (limited time)</Text>
          <View style={styles.codeBox}>
            <Text style={styles.codeLabel}>Your invite code:</Text>
            <Text style={styles.codeText}>{inviteCode}</Text>
          </View>
          <View style={styles.inviteButtons}>
            <TouchableOpacity style={styles.copyBtn} onPress={handleCopyCode} activeOpacity={0.8}>
              <Text style={styles.copyBtnText}>Copy Code</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.shareBtn} onPress={handleShareCode} activeOpacity={0.8}>
              <Text style={styles.shareBtnText}>Share ↗</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Notification Toggle */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Reminders</Text>
          <View style={styles.notifRow}>
            <View style={styles.notifInfo}>
              <Text style={styles.notifLabel}>Daily Practice Reminder</Text>
              <Text style={styles.notifSub}>6pm reminder to log practice</Text>
            </View>
            <TouchableOpacity
              style={[styles.toggle, notificationsEnabled && styles.toggleOn]}
              onPress={handleToggleNotif}
              activeOpacity={0.8}
            >
              <Text style={styles.toggleText}>{notificationsEnabled ? 'On' : 'Off'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    padding: 20,
    paddingBottom: 48,
    gap: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 4,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sectionSub: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: -4,
    fontStyle: 'italic',
  },
  emptyText: {
    fontSize: 14,
    color: '#22c55e',
    fontWeight: '600',
    textAlign: 'center',
    paddingVertical: 8,
  },
  approvalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  approvalInfo: {
    gap: 2,
  },
  approvalName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
  },
  approvalPoints: {
    fontSize: 13,
    color: '#64748b',
  },
  approvalButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  approveBtn: {
    backgroundColor: '#dcfce7',
    borderRadius: 10,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#86efac',
  },
  approveBtnText: {
    fontSize: 18,
    color: '#166534',
    fontWeight: '700',
  },
  denyBtn: {
    backgroundColor: '#fee2e2',
    borderRadius: 10,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#fca5a5',
  },
  denyBtnText: {
    fontSize: 18,
    color: '#991b1b',
    fontWeight: '700',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#f8fafc',
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    gap: 4,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: '900',
    color: '#1e40af',
  },
  statLabel: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '600',
    textAlign: 'center',
  },
  totalPointsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fef3c7',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  totalPointsLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#92400e',
  },
  totalPointsValue: {
    fontSize: 16,
    fontWeight: '800',
    color: '#92400e',
  },
  gearGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  gearCard: {
    flex: 1,
    minWidth: 90,
    backgroundColor: '#f8fafc',
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    gap: 4,
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
  },
  gearEmoji: {
    fontSize: 28,
  },
  gearName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0f172a',
    textAlign: 'center',
  },
  gearPrice: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
  },
  shopBtn: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1e40af',
    marginTop: 2,
  },
  inviteSubtext: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '500',
  },
  codeBox: {
    backgroundColor: '#eff6ff',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    gap: 4,
    borderWidth: 1.5,
    borderColor: '#bfdbfe',
  },
  codeLabel: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '500',
  },
  codeText: {
    fontSize: 24,
    fontWeight: '900',
    color: '#1e40af',
    letterSpacing: 2,
  },
  inviteButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  copyBtn: {
    flex: 1,
    backgroundColor: '#1e40af',
    borderRadius: 12,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  copyBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  shareBtn: {
    flex: 1,
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
  },
  shareBtnText: {
    color: '#1e40af',
    fontSize: 14,
    fontWeight: '700',
  },
  notifRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  notifInfo: {
    flex: 1,
    gap: 2,
  },
  notifLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
  },
  notifSub: {
    fontSize: 12,
    color: '#64748b',
  },
  toggle: {
    backgroundColor: '#e2e8f0',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    minWidth: 56,
    alignItems: 'center',
  },
  toggleOn: {
    backgroundColor: '#1e40af',
  },
  toggleText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#fff',
  },
})
