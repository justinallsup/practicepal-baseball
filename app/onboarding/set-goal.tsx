import React, { useState } from 'react'
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
import { pendingChild } from './add-child'

type GoalOption = {
  label: string
  value: 3 | 4 | 5 | 7
  description: string
}

const GOALS: GoalOption[] = [
  { label: '3 days/week', value: 3, description: 'Light — great for beginners' },
  { label: '4 days/week', value: 4, description: 'Moderate — building the habit' },
  { label: '5 days/week', value: 5, description: 'Committed — serious player' },
  { label: 'Every day', value: 7, description: 'All-in — elite level grind' },
]

export default function SetGoal() {
  const [goal, setGoal] = useState<3 | 4 | 5 | 7>(3)
  const completeOnboarding = useStore(s => s.completeOnboarding)

  const childName = pendingChild?.name ?? 'Your Player'

  const handleStart = () => {
    const child = {
      id: Date.now().toString(),
      name: childName,
      avatar: pendingChild?.avatar ?? '⚾',
      goalPerWeek: goal,
    }
    completeOnboarding(child)
    router.replace('/(home)')
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>How often should</Text>
        <Text style={styles.name}>{childName}</Text>
        <Text style={styles.title}>practice?</Text>

        <View style={styles.options}>
          {GOALS.map(g => (
            <TouchableOpacity
              key={g.value}
              style={[styles.card, goal === g.value && styles.cardSelected]}
              onPress={() => setGoal(g.value)}
              activeOpacity={0.8}
            >
              <View style={styles.cardRow}>
                <View style={[styles.radio, goal === g.value && styles.radioSelected]}>
                  {goal === g.value && <View style={styles.radioDot} />}
                </View>
                <View style={styles.cardText}>
                  <Text style={[styles.cardLabel, goal === g.value && styles.cardLabelSelected]}>
                    {g.label}
                  </Text>
                  <Text style={styles.cardDesc}>{g.description}</Text>
                </View>
                {g.value === 7 && (
                  <Text style={styles.badge}>🔥</Text>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.button} onPress={handleStart} activeOpacity={0.85}>
          <Text style={styles.buttonText}>Start Tracking ⚾</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 24,
    paddingBottom: 48,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0f172a',
    lineHeight: 36,
  },
  name: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1e40af',
    lineHeight: 36,
  },
  options: {
    marginTop: 28,
    marginBottom: 32,
    gap: 12,
  },
  card: {
    borderWidth: 2,
    borderColor: '#e2e8f0',
    borderRadius: 16,
    padding: 16,
    backgroundColor: '#f8fafc',
  },
  cardSelected: {
    borderColor: '#1e40af',
    backgroundColor: '#eff6ff',
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#cbd5e1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: {
    borderColor: '#1e40af',
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#1e40af',
  },
  cardText: {
    flex: 1,
  },
  cardLabel: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0f172a',
  },
  cardLabelSelected: {
    color: '#1e40af',
  },
  cardDesc: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 2,
  },
  badge: {
    fontSize: 22,
  },
  button: {
    backgroundColor: '#1e40af',
    borderRadius: 16,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
})
