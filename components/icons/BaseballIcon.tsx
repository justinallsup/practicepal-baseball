import React from 'react'
import Svg, { Circle, Path } from 'react-native-svg'

interface Props { size?: number; color?: string }
export function BaseballIcon({ size = 24, color = '#1e293b' }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Ball outline */}
      <Circle cx="12" cy="12" r="9.5" stroke={color} strokeWidth="1.5" />
      {/* Left seam curve */}
      <Path
        d="M8.5 4.5 C7 6.5 6.5 9 6.5 12 C6.5 15 7 17.5 8.5 19.5"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
      {/* Right seam curve */}
      <Path
        d="M15.5 4.5 C17 6.5 17.5 9 17.5 12 C17.5 15 17 17.5 15.5 19.5"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
      {/* Top stitch ticks on left seam */}
      <Path d="M7 7.5 L8.8 8" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
      <Path d="M6.6 10 L8.5 10.5" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
      <Path d="M6.6 14 L8.5 13.5" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
      <Path d="M7 16.5 L8.8 16" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
      {/* Top stitch ticks on right seam */}
      <Path d="M17 7.5 L15.2 8" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
      <Path d="M17.4 10 L15.5 10.5" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
      <Path d="M17.4 14 L15.5 13.5" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
      <Path d="M17 16.5 L15.2 16" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
    </Svg>
  )
}
