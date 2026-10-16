import React from 'react'
import { View, Text, ScrollView, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useStore } from '../../lib/store'
import { buildWeeklyPlan } from '../../lib/training-plan'

export default function TrainingPlanScreen() {
  const child = useStore(s => s.child)
  const goals = useStore(s => s.improvementGoals)
  const logs = useStore(s => s.logs)
  const plan = buildWeeklyPlan(goals, child?.goalPerWeek ?? 3)
  const completed = new Set(logs.map(l => l.date)).size

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.eyebrow}>PLAYER DEVELOPMENT</Text>
        <Text style={styles.title}>{child?.name ?? 'Your player'}'s training plan</Text>
        <Text style={styles.subtitle}>A balanced weekly routine based on your family's practice goals. Sessions are suggestions, not medical or professional coaching advice.</Text>
        <View style={styles.hero}>
          <Text style={styles.heroLabel}>THIS WEEK'S TARGET</Text>
          <Text style={styles.heroValue}>{child?.goalPerWeek ?? 3} practice days</Text>
          <Text style={styles.heroNote}>{completed} total recorded practice days • Consistency over intensity</Text>
        </View>
        {plan.map((session, index) => (
          <View key={index} style={styles.card}>
            <View style={styles.cardTop}>
              <Text style={styles.session}>SESSION {index + 1}</Text>
              <Text style={styles.duration}>{session.reduce((sum, d) => sum + d.minutes, 0)} MIN</Text>
            </View>
            {session.map(drill => (
              <View key={drill.id} style={styles.drill}>
                <Text style={styles.drillTitle}>{drill.title}</Text>
                <Text style={styles.skill}>{drill.skill} · {drill.minutes} min</Text>
                <Text style={styles.instructions}>{drill.instructions}</Text>
                <Text style={styles.equipment}>Equipment: {drill.equipment}</Text>
                <Text style={styles.safety}>Safety: {drill.safety}</Text>
              </View>
            ))}
          </View>
        ))}
        <Text style={styles.footer}>Parent guidance: adjust practice length to age, ability, rest needs, and coaching advice. Progress is not a competition.</Text>
      </ScrollView>
    </SafeAreaView>
  )
}
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f5f5f0' },
  content: { padding: 20, paddingBottom: 48, gap: 16 },
  eyebrow: { color: '#b91c1c', fontSize: 11, letterSpacing: 2, fontWeight: '800' },
  title: { fontSize: 30, fontWeight: '900', color: '#10243a', letterSpacing: -0.6 },
  subtitle: { fontSize: 14, color: '#526477', lineHeight: 21 },
  hero: { backgroundColor: '#10243a', borderRadius: 22, padding: 24, gap: 8 },
  heroLabel: { color: '#f5b9a9', fontSize: 11, fontWeight: '800', letterSpacing: 1.4 },
  heroValue: { color: '#fff', fontSize: 27, fontWeight: '900' },
  heroNote: { color: '#cbd5e1', fontSize: 12, lineHeight: 18 },
  card: { backgroundColor: '#fff', borderRadius: 20, padding: 20, gap: 14, borderWidth: 1, borderColor: '#e5e7eb' },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between' },
  session: { color: '#b91c1c', fontSize: 12, fontWeight: '900', letterSpacing: 1.2 },
  duration: { color: '#526477', fontSize: 12, fontWeight: '700' },
  drill: { borderTopWidth: 1, borderTopColor: '#edf0f2', paddingTop: 12, gap: 5 },
  drillTitle: { fontSize: 17, fontWeight: '800', color: '#10243a' },
  skill: { fontSize: 12, fontWeight: '700', color: '#b91c1c' },
  instructions: { fontSize: 14, color: '#334155', lineHeight: 21 },
  equipment: { fontSize: 12, color: '#64748b' },
  safety: { fontSize: 12, color: '#64748b', fontStyle: 'italic' },
  footer: { fontSize: 12, lineHeight: 18, color: '#64748b' },
})
