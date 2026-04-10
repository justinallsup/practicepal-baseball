import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'

export default function OnboardingHook() {
  return (
    <View style={styles.gradient}>
      <SafeAreaView style={styles.safe}>
        <View style={styles.content}>
          <View style={styles.top}>
            <Text style={styles.emoji}>⚾</Text>
            <Text style={styles.title}>Tired of asking them to practice?</Text>
            <Text style={styles.subtitle}>This fixes that.</Text>
            <Text style={styles.social}>Parents report 2–3x more practice in the first week</Text>
          </View>
          <View style={styles.bottom}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => router.push('/onboarding/frequency')}
              activeOpacity={0.85}
            >
              <Text style={styles.buttonText}>Start in 30 seconds ⚾</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </View>
  )
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    backgroundColor: '#1e3a8a',
  },
  safe: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 32,
    paddingBottom: 24,
  },
  top: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },
  emoji: {
    fontSize: 80,
    marginBottom: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#fff',
    textAlign: 'center',
    lineHeight: 40,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 22,
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
    fontWeight: '600',
  },
  social: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    fontWeight: '500',
    marginTop: 4,
  },
  bottom: {
    paddingTop: 16,
  },
  button: {
    backgroundColor: '#fff',
    borderRadius: 16,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  buttonText: {
    color: '#1e3a8a',
    fontSize: 18,
    fontWeight: '700',
  },
})
