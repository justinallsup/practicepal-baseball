import React from 'react'
import Svg, { Path, Circle } from 'react-native-svg'

interface Props { size?: number; color?: string }
export function RunIcon({ size = 24, color = '#1e293b' }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="14" cy="4" r="1.5" fill={color}/>
      <Path d="M8 17L10 12L13 14L15 9L19 11" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M10 17L8 20M13 14L11 20" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    </Svg>
  )
}
