import React from 'react'
import Svg, { Path } from 'react-native-svg'

interface Props { size?: number; color?: string }
export function GloveIcon({ size = 24, color = '#1e293b' }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M5 20V12C5 9 6 7 8 6.5M8 6.5C8 5 9 4 10.5 4.5M8 6.5V10M10.5 4.5C10.5 3 12 2.5 13 3.5M10.5 4.5V10M13 3.5C14 2.5 15.5 3 15.5 4.5M13 3.5V10M15.5 4.5C16.5 3.5 18 4 18 6V12M15.5 4.5V10M5 20H18C19.5 20 20 18.5 19 17.5L18 16.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
  )
}
