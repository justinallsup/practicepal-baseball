import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'

const AVATARS = ['⚾', '🧢', '🥎', '🏟️', '🤾', '⭐', '🦁', '🐯', '🔥', '💪']

// Store selected child temporarily in module scope (passed via navigation)
export let pendingChild: { name: string; avatar: string } | null = null

export default function AddChild() {
  const [name, setName] = useState('')
  const [avatar, setAvatar] = useState('⚾')

  const canContinue = name.trim().length > 0

  const handleContinue = () => {
    pendingChild = { name: name.trim(), avatar }
    router.push('/onboarding/add-reward')
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.title}>Add Your Player</Text>
          <Text style={styles.subtitle}>Who are we tracking?</Text>

          {/* Avatar display */}
          <View style={styles.avatarDisplay}>
            <Text style={styles.avatarLarge}>{avatar}</Text>
          </View>

          {/* Name input */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Player's name"
              placeholderTextColor="#94a3b8"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
              returnKeyType="done"
              maxLength={30}
            />
          </View>

          {/* Avatar picker */}
          <Text style={styles.pickerLabel}>Choose an avatar</Text>
          <View style={styles.avatarGrid}>
            {AVATARS.map(em => (
              <TouchableOpacity
                key={em}
                onPress={() => setAvatar(em)}
                style={[
                  styles.avatarOption,
                  avatar === em && styles.avatarOptionSelected,
                ]}
                activeOpacity={0.7}
              >
                <Text style={styles.avatarEmoji}>{em}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            style={[styles.button, !canContinue && styles.buttonDisabled]}
            onPress={handleContinue}
            disabled={!canContinue}
            activeOpacity={0.85}
          >
            <Text style={styles.buttonText}>Continue →</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#fff',
  },
  flex: { flex: 1 },
  content: {
    padding: 24,
    paddingBottom: 48,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
    marginBottom: 24,
  },
  avatarDisplay: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarLarge: {
    fontSize: 72,
  },
  inputContainer: {
    marginBottom: 24,
  },
  input: {
    height: 56,
    borderWidth: 2,
    borderColor: '#e2e8f0',
    borderRadius: 16,
    paddingHorizontal: 20,
    fontSize: 18,
    color: '#0f172a',
    backgroundColor: '#f8fafc',
  },
  pickerLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  avatarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 32,
  },
  avatarOption: {
    width: 56,
    height: 56,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f1f5f9',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  avatarOptionSelected: {
    borderColor: '#1e40af',
    backgroundColor: '#eff6ff',
  },
  avatarEmoji: {
    fontSize: 26,
  },
  button: {
    backgroundColor: '#1e40af',
    borderRadius: 16,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
})
