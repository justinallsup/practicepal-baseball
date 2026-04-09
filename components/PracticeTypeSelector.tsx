import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { PracticeType } from '../lib/store'

interface PracticeTypeSelectorProps {
  selected: PracticeType[]
  onToggle: (type: PracticeType) => void
}

const TYPES: PracticeType[] = ['Pitching', 'Hitting', 'Fielding']

export default function PracticeTypeSelector({ selected, onToggle }: PracticeTypeSelectorProps) {
  return (
    <View style={styles.container}>
      {TYPES.map(type => {
        const isSelected = selected.includes(type)
        return (
          <TouchableOpacity
            key={type}
            onPress={() => onToggle(type)}
            style={[styles.chip, isSelected && styles.chipSelected]}
            activeOpacity={0.7}
          >
            <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
              {type}
            </Text>
          </TouchableOpacity>
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
    paddingVertical: 8,
  },
  chip: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#cbd5e1',
    backgroundColor: '#fff',
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chipSelected: {
    borderColor: '#1e40af',
    backgroundColor: '#1e40af',
  },
  chipText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
  },
  chipTextSelected: {
    color: '#fff',
  },
})
