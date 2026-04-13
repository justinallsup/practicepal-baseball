import React from 'react'
import { View } from 'react-native'
import { BaseballIcon, BatIcon, GloveIcon, TrophyIcon, TargetIcon, RunIcon } from './icons'
import { Play, CheckCircle, Flame, Star, Clock, Award, ChevronRight, BarChart2 } from 'lucide-react-native'

export type AppIconName =
  | 'baseball' | 'bat' | 'glove' | 'trophy' | 'target' | 'run'
  | 'play' | 'check' | 'flame' | 'star' | 'clock' | 'award' | 'chevron-right' | 'chart'

interface AppIconProps {
  name: AppIconName
  size?: number
  color?: string
  style?: any
}

export function AppIcon({ name, size = 24, color = '#1e293b', style }: AppIconProps) {
  const props = { size, color }
  const icon = (() => {
    switch (name) {
      case 'baseball': return <BaseballIcon {...props} />
      case 'bat': return <BatIcon {...props} />
      case 'glove': return <GloveIcon {...props} />
      case 'trophy': return <TrophyIcon {...props} />
      case 'target': return <TargetIcon {...props} />
      case 'run': return <RunIcon {...props} />
      case 'play': return <Play {...props} />
      case 'check': return <CheckCircle {...props} />
      case 'flame': return <Flame {...props} />
      case 'star': return <Star {...props} />
      case 'clock': return <Clock {...props} />
      case 'award': return <Award {...props} />
      case 'chevron-right': return <ChevronRight {...props} />
      case 'chart': return <BarChart2 {...props} />
      default: return null
    }
  })()

  return (
    <View style={[{ alignItems: 'center', justifyContent: 'center' }, style]} accessibilityElementsHidden>
      {icon}
    </View>
  )
}
