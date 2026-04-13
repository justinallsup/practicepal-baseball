import React from 'react'
import Svg, { Circle, Path } from 'react-native-svg'

interface Props { size?: number; color?: string }
export function BaseballIcon({ size = 24, color = '#1e293b' }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="1.5" fill="#f8fafc"/>
      <Path d="M7 4.5C8.5 6.5 9 9 9 12s-.5 5.5-2 7.5" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <Path d="M17 4.5C15.5 6.5 15 9 15 12s.5 5.5 2 7.5" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <Path d="M4.5 7C6.5 8.5 9 9 12 9s5.5-.5 7.5-2" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <Path d="M4.5 17C6.5 15.5 9 15 12 15s5.5.5 7.5 2" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    </Svg>
  )
}
