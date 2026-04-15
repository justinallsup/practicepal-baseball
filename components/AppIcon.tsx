import React from 'react'
import { View } from 'react-native'
import {
  // Lucide sport/action icons used for challenges & drills
  CircleDot,   // baseball (circle with dot = ball)
  Zap,         // hitting (power strike)
  Shield,      // fielding (defensive)
  Send,        // throwing (forward motion)
  Dumbbell,    // batting power / catching
  Footprints,  // quick feet / agility
  // General UI icons
  Play,
  CheckCircle,
  Flame,
  Star,
  Clock,
  Award,
  ChevronRight,
  BarChart2,
  Trophy,
  Target,
} from 'lucide-react-native'

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
  const props = { size, color, strokeWidth: 1.75 }
  const icon = (() => {
    switch (name) {
      // Baseball-specific: use proven Lucide icons
      case 'baseball': return <CircleDot {...props} />
      case 'bat':      return <Zap {...props} />
      case 'glove':    return <Shield {...props} />
      case 'run':      return <Footprints {...props} />
      // General
      case 'trophy':       return <Trophy {...props} />
      case 'target':       return <Target {...props} />
      case 'play':         return <Play {...props} />
      case 'check':        return <CheckCircle {...props} />
      case 'flame':        return <Flame {...props} />
      case 'star':         return <Star {...props} />
      case 'clock':        return <Clock {...props} />
      case 'award':        return <Award {...props} />
      case 'chevron-right':return <ChevronRight {...props} />
      case 'chart':        return <BarChart2 {...props} />
      default:             return null
    }
  })()

  return (
    <View
      style={[
        {
          width: size,
          height: size,
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        },
        style,
      ]}
      accessibilityElementsHidden
    >
      {icon}
    </View>
  )
}
