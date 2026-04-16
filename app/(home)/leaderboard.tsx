import React, { useEffect } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useStore } from '../../lib/store'

const MEDALS = ['🥇', '🥈', '🥉']

export default function LeaderboardScreen() {
  const leaderboard = useStore(s => s.leaderboard)
  const refreshLeaderboard = useStore(s => s.refreshLeaderboard)
  const getWeekLogs = useStore(s => s.getWeekLogs)
  const hasLoggedToday = useStore(s => s.hasLoggedToday)

  useEffect(() => {
    refreshLeaderboard()
  }, [])

  const loggedToday = hasLoggedToday()

  // Find user's position and gap to next
  const userIndex = leaderboard.findIndex(e => e.isYou)
  const userEntry = leaderboard[userIndex]
  let motivationalCopy = ''
  if (userIndex > 0 && userEntry) {
    const above = leaderboard[userIndex - 1]
    const gap = above.practices - userEntry.practices
    if (gap <= 1) {
      motivationalCopy = `You're 1 practice away from ${userIndex === 1 ? '1st' : `${userIndex}${userIndex === 2 ? 'nd' : 'rd'}`} place 👀`
    } else if (gap <= 3) {
      motivationalCopy = `Only ${gap} practices to move up — you've got this 💪`
    }
  } else if (userIndex === 0) {
    motivationalCopy = 'You\'re in the lead — keep it up! 🏆'
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Leaderboard 🏆</Text>
        <Text style={styles.subtitle}>Weekly practices — resets every Sunday</Text>

        <View style={styles.listCard}>
          {leaderboard.map((entry, index) => {
            const medal = index < 3 ? MEDALS[index] : `${index + 1}.`
            return (
              <View
                key={`${entry.name}-${index}`}
                style={[styles.row, entry.isYou && styles.rowHighlight]}
              >
                <Text style={styles.medal}>{medal}</Text>
                <View style={styles.nameSection}>
                  <Text style={[styles.name, entry.isYou && styles.nameYou]}>
                    {entry.name}
                    {entry.isYou && ' (You)'}
                  </Text>
                  <Text style={styles.practices}>{entry.practices} practices</Text>
                </View>
                {index === 0 && (
                  <Text style={styles.fire}>🔥</Text>
                )}
              </View>
            )
          })}
        </View>

        <View style={styles.footer}>
          {motivationalCopy ? (
            <Text style={styles.motivationalText}>{motivationalCopy}</Text>
          ) : null}
          {loggedToday ? (
            <Text style={styles.footerText}>Nice work today — keep the streak alive ⭐</Text>
          ) : (
            <Text style={styles.footerText}>Log practice today to climb the board ⚾</Text>
          )}
        </View>

        <TouchableOpacity
          style={styles.refreshBtn}
          onPress={refreshLeaderboard}
          activeOpacity={0.8}
        >
          <Text style={styles.refreshBtnText}>↻ Refresh</Text>
        </TouchableOpacity>
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
    fontSize: 26,
    fontWeight: '800',
    color: '#0f172a',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    fontWeight: '500',
  },
  listCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    gap: 14,
  },
  rowHighlight: {
    backgroundColor: '#eff6ff',
  },
  medal: {
    fontSize: 22,
    width: 32,
    textAlign: 'center',
  },
  nameSection: {
    flex: 1,
    gap: 2,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
  },
  nameYou: {
    color: '#1e40af',
  },
  practices: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '500',
  },
  fire: {
    fontSize: 20,
  },
  footer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1e40af',
    textAlign: 'center',
  },
  motivationalText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#d97706',
    textAlign: 'center',
    marginBottom: 4,
  },
  refreshBtn: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  refreshBtnText: {
    fontSize: 14,
    color: '#94a3b8',
    fontWeight: '600',
  },
})
