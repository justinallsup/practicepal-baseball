import React from 'react'
import Svg, { Path } from 'react-native-svg'

interface Props { size?: number; color?: string }
export function TrophyIcon({ size = 24, color = '#1e293b' }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M6 4H18V12C18 15.3 15.3 18 12 18C8.7 18 6 15.3 6 12V4Z" stroke={color} strokeWidth="1.5"/>
      <Path d="M6 7H3C3 7 2.5 11 6 12" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <Path d="M18 7H21C21 7 21.5 11 18 12" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <Path d="M12 18V21M9 21H15" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    </Svg>
  )
}
