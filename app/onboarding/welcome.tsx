import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'

export default function Welcome() {
  return (
    <View style={styles.gradient}>
      <SafeAreaView style={styles.safe}>
        <View style={styles.content}>
          <View style={styles.top}>
            <Text style={styles.emoji}>⚾</Text>
            <Text style={styles.title}>Build a consistent{'\n'}practice habit</Text>
            <Text style={styles.subtitle}>
              Track your child's baseball practice{'\n'}in seconds
            </Text>
          </View>
          <View style={styles.bottom}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => router.push('/onboarding/add-child')}
              activeOpacity={0.85}
            >
              <Text style={styles.buttonText}>Continue →</Text>
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
    backgroundColor: '#1e40af',
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
    fontSize: 17,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    lineHeight: 24,
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
    color: '#1e40af',
    fontSize: 18,
    fontWeight: '700',
  },
})
