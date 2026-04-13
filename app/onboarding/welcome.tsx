import React, { useEffect, useRef } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { LinearGradient } from 'expo-linear-gradient'
import { router } from 'expo-router'

export default function Welcome() {
  // Animation refs
  const floatAnim = useRef(new Animated.Value(0)).current
  const fadeAnim = useRef(new Animated.Value(0)).current
  const pulseAnim = useRef(new Animated.Value(1)).current
  const glowAnim = useRef(new Animated.Value(0.6)).current

  useEffect(() => {
    // Fade in content on mount
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start()

    // Baseball floating animation (slow up/down)
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -12,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start()

    // Button pulse animation (every 3 seconds)
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.delay(2200),
      ])
    ).start()

    // Glow pulse behind baseball
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0.6,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start()
  }, [])

  return (
    <LinearGradient
      colors={['#1e3a8a', '#3b82f6', '#6366f1']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.gradient}
    >
      {/* Subtle background elements */}
      <View style={styles.backgroundElements}>
        <View style={[styles.fieldLine, styles.fieldLine1]} />
        <View style={[styles.fieldLine, styles.fieldLine2]} />
        <View style={[styles.fieldLine, styles.fieldLine3]} />
        <Text style={styles.bgIcon1}>🧤</Text>
        <Text style={styles.bgIcon2}>⚾</Text>
      </View>

      <SafeAreaView style={styles.safe}>
        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          <View style={styles.top}>
            {/* Baseball with glow and float */}
            <View style={styles.baseballContainer}>
              <Animated.View
                style={[
                  styles.baseballGlow,
                  {
                    opacity: glowAnim,
                    transform: [{ scale: glowAnim }],
                  },
                ]}
              />
              <Animated.Text
                style={[
                  styles.emoji,
                  {
                    transform: [{ translateY: floatAnim }],
                  },
                ]}
              >
                ⚾
              </Animated.Text>
              <View style={styles.baseballShadow} />
            </View>

            {/* Title with increased hierarchy */}
            <Text style={styles.title}>Build a consistent{'\n'}practice habit</Text>
            
            {/* Subtitle with better spacing */}
            <Text style={styles.subtitle}>
              Track your child's baseball practice{'\n'}in seconds
            </Text>

            {/* Social proof */}
            <View style={styles.proofContainer}>
              <Text style={styles.proofText}>⭐ Trusted by 1,000+ baseball families</Text>
            </View>
          </View>

          <View style={styles.bottom}>
            {/* Upgraded CTA button */}
            <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
              <TouchableOpacity
                style={styles.buttonWrapper}
                onPress={() => router.push('/onboarding/add-child')}
                activeOpacity={0.85}
              >
                <LinearGradient
                  colors={['#ffffff', '#f0f9ff']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0, y: 1 }}
                  style={styles.button}
                >
                  <Text style={styles.buttonText}>Start Practice Now ⚾</Text>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>

            {/* Secondary info */}
            <Text style={styles.secondaryText}>Free 3-day trial • No credit card required</Text>
          </View>
        </Animated.View>
      </SafeAreaView>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  backgroundElements: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
  },
  fieldLine: {
    position: 'absolute',
    height: 2,
    backgroundColor: 'rgba(255,255,255,0.08)',
    width: '100%',
  },
  fieldLine1: {
    top: '25%',
    transform: [{ rotate: '-2deg' }],
  },
  fieldLine2: {
    top: '50%',
    transform: [{ rotate: '1deg' }],
  },
  fieldLine3: {
    top: '75%',
    transform: [{ rotate: '-1deg' }],
  },
  bgIcon1: {
    position: 'absolute',
    fontSize: 60,
    opacity: 0.05,
    top: '15%',
    left: '10%',
    transform: [{ rotate: '-15deg' }],
  },
  bgIcon2: {
    position: 'absolute',
    fontSize: 50,
    opacity: 0.05,
    bottom: '20%',
    right: '15%',
    transform: [{ rotate: '20deg' }],
  },
  safe: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 32,
    paddingBottom: 32,
  },
  top: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 24,
  },
  baseballContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  baseballGlow: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(255,255,255,0.15)',
    shadowColor: '#fff',
    shadowOpacity: 0.3,
    shadowRadius: 30,
    shadowOffset: { width: 0, height: 0 },
  },
  emoji: {
    fontSize: 96,
    textShadowColor: 'rgba(0,0,0,0.15)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 8,
  },
  baseballShadow: {
    position: 'absolute',
    bottom: -20,
    width: 60,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(0,0,0,0.15)',
  },
  title: {
    fontSize: 38,
    fontWeight: '900',
    color: '#fff',
    textAlign: 'center',
    lineHeight: 46,
    letterSpacing: -1,
    textShadowColor: 'rgba(0,0,0,0.1)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 19,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
    lineHeight: 28,
    marginTop: 4,
  },
  proofContainer: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginTop: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  proofText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.9)',
  },
  bottom: {
    paddingTop: 24,
    gap: 16,
  },
  buttonWrapper: {
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  button: {
    borderRadius: 20,
    height: 68,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  buttonText: {
    color: '#1e3a8a',
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  secondaryText: {
    fontSize: 14,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
  },
})
