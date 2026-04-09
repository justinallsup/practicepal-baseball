import React, { useEffect, useRef } from 'react'
import { View, Text, StyleSheet, Animated } from 'react-native'
import { getToday, getWeekDates, dayLabel } from '../lib/utils'
import { PracticeLog } from '../lib/store'

interface WeeklyTrackerProps {
  logs: PracticeLog[]
}

export default function WeeklyTracker({ logs }: WeeklyTrackerProps) {
  const weekDates = getWeekDates()
  const today = getToday()
  const pulseAnim = useRef(new Animated.Value(1)).current

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 0.6,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
      ])
    ).start()
  }, [])

  const loggedDates = new Set(logs.map(l => l.date))

  return (
    <View style={styles.container}>
      {weekDates.map((date, index) => {
        const hasPractice = loggedDates.has(date)
        const isToday = date === today
        const isPast = date < today
        const isFuture = date > today

        let boxStyle = [styles.box]
        let content: React.ReactNode = null

        if (hasPractice) {
          // @ts-ignore
          boxStyle = [styles.box, styles.boxDone]
          content = <Text style={styles.checkEmoji}>⚾</Text>
        } else if (isToday) {
          // @ts-ignore
          boxStyle = [styles.box, styles.boxToday]
          content = (
            <Animated.Text style={[styles.dayText, { opacity: pulseAnim, color: '#1e40af' }]}>
              {dayLabel(date).charAt(0)}
            </Animated.Text>
          )
        } else if (isPast) {
          // @ts-ignore
          boxStyle = [styles.box, styles.boxMissed]
          content = <Text style={[styles.dayText, { color: '#cbd5e1' }]}>{dayLabel(date).charAt(0)}</Text>
        } else {
          // future
          // @ts-ignore
          boxStyle = [styles.box, styles.boxFuture]
          content = <Text style={[styles.dayText, { color: '#e2e8f0' }]}>{dayLabel(date).charAt(0)}</Text>
        }

        return (
          <View key={date} style={styles.dayContainer}>
            <View style={boxStyle as any}>{content}</View>
            <Text style={styles.label}>{dayLabel(date).slice(0, 2)}</Text>
          </View>
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginVertical: 8,
  },
  dayContainer: {
    alignItems: 'center',
    gap: 4,
  },
  box: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e2e8f0',
  },
  boxDone: {
    backgroundColor: '#1e40af',
  },
  boxToday: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#1e40af',
  },
  boxMissed: {
    backgroundColor: '#f1f5f9',
  },
  boxFuture: {
    backgroundColor: '#f8fafc',
  },
  checkEmoji: {
    fontSize: 18,
  },
  dayText: {
    fontSize: 14,
    fontWeight: '700',
  },
  label: {
    fontSize: 11,
    color: '#94a3b8',
    fontWeight: '500',
  },
})
