import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import { useStore } from '../../lib/store'
import { getWeekDates } from '../../lib/utils'
import { PracticeType } from '../../lib/store'

export default function WeeklyScreen() {
  const child = useStore(s => s.child)
  const getWeekLogs = useStore(s => s.getWeekLogs)

  const weekLogs = getWeekLogs()
  const goal = child?.goalPerWeek ?? 3
  const daysCount = weekLogs.length
  const weekDates = getWeekDates()

  // Count practice types
  const typeCounts: Record<PracticeType, number> = {
    Pitching: 0,
    Hitting: 0,
    Fielding: 0,
  }
  weekLogs.forEach(log => {
    log.types.forEach(t => {
      typeCounts[t] = (typeCounts[t] || 0) + 1
    })
  })

  const progress = Math.min(daysCount / goal, 1)
  const remaining = Math.max(goal - daysCount, 0)

  let encouragement = ''
  if (daysCount >= goal) {
    encouragement = 'Goal reached! Amazing week 🏆'
  } else if (daysCount >= Math.floor(goal / 2)) {
    encouragement = `Keep it up! ${remaining} more day${remaining !== 1 ? 's' : ''} to hit your goal`
  } else {
    encouragement = "You can still make it — practice today!"
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>{child?.name ?? 'Player'}'s Week</Text>
          <View style={{ width: 60 }} />
        </View>

        {/* Summary card */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryNumber}>{daysCount}</Text>
          <Text style={styles.summaryLabel}>of {goal} days practiced this week</Text>
        </View>

        {/* Encouragement */}
        <View style={[
          styles.encourageBanner,
          daysCount >= goal && styles.encourageBannerSuccess
        ]}>
          <Text style={[
            styles.encourageText,
            daysCount >= goal && styles.encourageTextSuccess
          ]}>
            {encouragement}
          </Text>
        </View>

        {/* Progress bar */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Weekly Goal Progress</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress * 100}%` as any }]} />
          </View>
          <Text style={styles.progressLabel}>{daysCount} / {goal} days</Text>
        </View>

        {/* Practice type breakdown */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Practice Breakdown</Text>
          {(['Pitching', 'Hitting', 'Fielding'] as PracticeType[]).map(type => (
            <View key={type} style={styles.typeRow}>
              <Text style={styles.typeLabel}>{type}</Text>
              <View style={styles.typeBarBg}>
                <View
                  style={[
                    styles.typeBarFill,
                    {
                      width: weekLogs.length > 0
                        ? `${(typeCounts[type] / Math.max(weekLogs.length, 1)) * 100}%` as any
                        : '0%',
                    },
                  ]}
                />
              </View>
              <Text style={styles.typeCount}>{typeCounts[type]}</Text>
            </View>
          ))}
        </View>

        {/* Days grid */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Days This Week</Text>
          {weekDates.map(date => {
            const dayLog = weekLogs.find(l => l.date === date)
            return (
              <View key={date} style={styles.dayRow}>
                <Text style={styles.dayName}>
                  {new Date(date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long' })}
                </Text>
                {dayLog ? (
                  <View style={styles.dayDone}>
                    <Text style={styles.dayDoneText}>
                      ✓ {dayLog.types.length > 0 ? dayLog.types.join(', ') : 'Practice'}
                    </Text>
                  </View>
                ) : (
                  <Text style={styles.dayMissed}>—</Text>
                )}
              </View>
            )
          })}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  backBtn: {
    paddingVertical: 8,
    paddingRight: 8,
    width: 60,
  },
  backText: {
    fontSize: 15,
    color: '#1e40af',
    fontWeight: '600',
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0f172a',
    textAlign: 'center',
  },
  summaryCard: {
    backgroundColor: '#1e40af',
    borderRadius: 24,
    padding: 28,
    alignItems: 'center',
  },
  summaryNumber: {
    fontSize: 64,
    fontWeight: '900',
    color: '#fff',
  },
  summaryLabel: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '500',
    textAlign: 'center',
  },
  encourageBanner: {
    backgroundColor: '#fef3c7',
    borderRadius: 14,
    padding: 16,
  },
  encourageBannerSuccess: {
    backgroundColor: '#dcfce7',
  },
  encourageText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#92400e',
    textAlign: 'center',
  },
  encourageTextSuccess: {
    color: '#166534',
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  progressBar: {
    height: 12,
    backgroundColor: '#e2e8f0',
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#22c55e',
    borderRadius: 6,
  },
  progressLabel: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '600',
    textAlign: 'right',
  },
  typeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  typeLabel: {
    width: 70,
    fontSize: 14,
    fontWeight: '600',
    color: '#0f172a',
  },
  typeBarBg: {
    flex: 1,
    height: 8,
    backgroundColor: '#f1f5f9',
    borderRadius: 4,
    overflow: 'hidden',
  },
  typeBarFill: {
    height: '100%',
    backgroundColor: '#3b82f6',
    borderRadius: 4,
  },
  typeCount: {
    width: 24,
    fontSize: 14,
    fontWeight: '700',
    color: '#1e40af',
    textAlign: 'right',
  },
  dayRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  dayName: {
    fontSize: 14,
    color: '#0f172a',
    fontWeight: '500',
  },
  dayDone: {
    backgroundColor: '#dcfce7',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  dayDoneText: {
    fontSize: 13,
    color: '#166534',
    fontWeight: '600',
  },
  dayMissed: {
    fontSize: 14,
    color: '#cbd5e1',
  },
})
