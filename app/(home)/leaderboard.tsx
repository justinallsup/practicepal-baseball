import React from 'react'
import { View, Text, StyleSheet, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useStore } from '../../lib/store'

export default function PersonalRecordsScreen() {
  const child = useStore(s => s.child)
  const logs = useStore(s => s.logs)
  const bestStreak = useStore(s => s.getBestStreak)()
  const currentStreak = useStore(s => s.getCurrentStreak)()
  const weekLogs = useStore(s => s.getWeekLogs)()
  const days = new Set(logs.map(l => l.date)).size
  const weeklyDays = new Set(weekLogs.map(l => l.date)).size
  const goal = child?.goalPerWeek ?? 3

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.eyebrow}>PERSONAL PROGRESS</Text>
        <Text style={styles.title}>{child?.name ?? 'Player'}'s records</Text>
        <Text style={styles.sub}>Your progress is measured against your own practice history, not other kids.</Text>
        <View style={styles.hero}>
          <Text style={styles.heroLabel}>BEST PRACTICE STREAK</Text>
          <Text style={styles.heroValue}>{bestStreak} days</Text>
          <Text style={styles.heroNote}>Current streak: {currentStreak} days</Text>
        </View>
        <View style={styles.grid}>
          <View style={styles.card}><Text style={styles.number}>{days}</Text><Text style={styles.label}>Total practice days</Text></View>
          <View style={styles.card}><Text style={styles.number}>{weeklyDays}/{goal}</Text><Text style={styles.label}>Weekly goal</Text></View>
        </View>
        <View style={styles.card}>
          <Text style={styles.section}>Keep building</Text>
          <Text style={styles.body}>Consistency and good technique matter more than rankings. Celebrate your own progress and take rest days when needed.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f5f5f0' },
  content: { padding: 20, paddingBottom: 48, gap: 16 },
  eyebrow: { fontSize: 11, fontWeight: '800', letterSpacing: 2, color: '#b91c1c' },
  title: { fontSize: 30, fontWeight: '900', color: '#10243a' },
  sub: { fontSize: 14, lineHeight: 21, color: '#526477' },
  hero: { backgroundColor: '#10243a', borderRadius: 22, padding: 24, gap: 8 },
  heroLabel: { color: '#f5b9a9', fontWeight: '800', fontSize: 11, letterSpacing: 1.2 },
  heroValue: { color: '#fff', fontWeight: '900', fontSize: 40 },
  heroNote: { color: '#cbd5e1', fontSize: 13 },
  grid: { flexDirection: 'row', gap: 12 },
  card: { flex: 1, backgroundColor: '#fff', borderRadius: 18, padding: 20, gap: 6 },
  number: { fontSize: 26, fontWeight: '900', color: '#10243a' },
  label: { fontSize: 12, color: '#64748b', fontWeight: '600' },
  section: { fontSize: 18, fontWeight: '800', color: '#10243a' },
  body: { fontSize: 14, lineHeight: 21, color: '#475569' },
})
