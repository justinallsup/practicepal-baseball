import React from 'react'
import Svg, { Path } from 'react-native-svg'

interface Props { size?: number; color?: string }
export function BatIcon({ size = 24, color = '#1e293b' }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M3 21L14 10" stroke={color} strokeWidth="3" strokeLinecap="round"/>
      <Path d="M14 10L17.5 6.5C18.5 5.5 20 5 21 6s.5 2.5-.5 3.5L17 13" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
  )
}
