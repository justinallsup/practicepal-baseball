import React from 'react'
import Svg, { Circle } from 'react-native-svg'

interface Props { size?: number; color?: string }
export function TargetIcon({ size = 24, color = '#1e293b' }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="1.5"/>
      <Circle cx="12" cy="12" r="6" stroke={color} strokeWidth="1.5"/>
      <Circle cx="12" cy="12" r="2" fill={color}/>
    </Svg>
  )
}
