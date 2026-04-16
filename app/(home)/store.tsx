import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useStore } from '../../lib/store'
import { AppIcon } from '../../components/AppIcon'
import type { AppIconName } from '../../components/AppIcon'

interface StoreItem {
  emoji?: string
  icon?: AppIconName
  name: string
  points: number
}

const STORE_ITEMS: { section: string; items: StoreItem[] }[] = [
  {
    section: 'Small Rewards (50–100 pts)',
    items: [
      { emoji: '🍦', name: 'Ice Cream', points: 50 },
      { emoji: '🍬', name: 'Candy', points: 75 },
      { emoji: '📱', name: 'Screen Time', points: 100 },
    ],
  },
  {
    section: 'Medium Rewards (200–300 pts)',
    items: [
      { icon: 'glove', name: 'Batting Gloves', points: 200 },
      { icon: 'baseball', name: 'Batting Cages', points: 300 },
    ],
  },
  {
    section: 'Big Rewards (500+ pts)',
    items: [
      { icon: 'bat', name: 'New Bat', points: 500 },
    ],
  },
]

export default function StoreScreen() {
  const totalPoints = useStore(s => s.totalPoints)
  const requestRedemption = useStore(s => s.requestRedemption)
  const redemptionRequests = useStore(s => s.redemptionRequests)
  const [lastRedeemed, setLastRedeemed] = useState<string | null>(null)

  const handleRedeem = (item: StoreItem) => {
    if (totalPoints < item.points) {
      const needed = item.points - totalPoints
      Alert.alert(
        'Not enough points',
        `You need ${needed} more points to redeem ${item.name}.`,
        [{ text: 'OK' }]
      )
      return
    }

    Alert.alert(
      'Confirm Redemption',
      `Redeem ${item.name} for ${item.points} pts?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Redeem',
          onPress: () => {
            requestRedemption(item.name, item.points)
            setLastRedeemed(item.name)
            setTimeout(() => setLastRedeemed(null), 3000)
          },
        },
      ]
    )
  }

  const pendingRequests = redemptionRequests.filter(r => r.status === 'pending')

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.headerRow}>
          <Text style={styles.title}>Store 🛒</Text>
          <View style={styles.balanceBadge}>
            <Text style={styles.balanceText}>⭐ {totalPoints} pts</Text>
          </View>
        </View>

        {/* Success banner */}
        {lastRedeemed && (
          <View style={styles.successBanner}>
            <Text style={styles.successText}>Request sent to parent ✓</Text>
          </View>
        )}

        {/* Pending requests */}
        {pendingRequests.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Pending Requests</Text>
            {pendingRequests.map(req => (
              <View key={req.id} style={styles.pendingRow}>
                <Text style={styles.pendingName}>{req.itemName}</Text>
                <View style={styles.pendingBadge}>
                  <Text style={styles.pendingBadgeText}>⏳ Pending</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Store sections */}
        {STORE_ITEMS.map(section => (
          <View key={section.section} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.section}</Text>
            {section.items.map(item => {
              const canAfford = totalPoints >= item.points
              const almostThere = !canAfford && totalPoints >= item.points * 0.7
              return (
                <View key={item.name} style={styles.itemRow}>
                  {item.icon
                    ? <AppIcon name={item.icon} size={32} color="#475569" />
                    : <Text style={styles.itemEmoji}>{item.emoji}</Text>
                  }
                  <View style={styles.itemInfo}>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <Text style={styles.itemPoints}>⭐ {item.points} pts</Text>
                    {almostThere && <Text style={styles.almostThereLabel}>Almost there!</Text>}
                    {canAfford && <Text style={styles.readyLabel}>Ready to redeem</Text>}
                  </View>
                  <TouchableOpacity
                    style={[styles.redeemBtn, !canAfford && styles.redeemBtnDisabled]}
                    onPress={() => handleRedeem(item)}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.redeemBtnText, !canAfford && styles.redeemBtnTextDisabled]}>
                      Redeem
                    </Text>
                  </TouchableOpacity>
                </View>
              )
            })}
          </View>
        ))}

        <Text style={styles.footer}>
          Keep practicing to earn more points — you're close! ⚾
        </Text>
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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0f172a',
  },
  balanceBadge: {
    backgroundColor: '#fef3c7',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1.5,
    borderColor: '#fbbf24',
  },
  balanceText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#92400e',
  },
  successBanner: {
    backgroundColor: '#dcfce7',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#86efac',
  },
  successText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#166534',
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
    marginBottom: 4,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 4,
  },
  itemEmoji: {
    fontSize: 28,
    width: 36,
    textAlign: 'center',
  },
  itemInfo: {
    flex: 1,
    gap: 2,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
  },
  itemPoints: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '500',
  },
  redeemBtn: {
    backgroundColor: '#1e40af',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  redeemBtnDisabled: {
    backgroundColor: '#e2e8f0',
  },
  redeemBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#fff',
  },
  redeemBtnTextDisabled: {
    color: '#94a3b8',
  },
  pendingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  pendingName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0f172a',
  },
  pendingBadge: {
    backgroundColor: '#fef3c7',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  pendingBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#92400e',
  },
  footer: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  almostThereLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#d97706',
  },
  readyLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#22c55e',
  },
})
