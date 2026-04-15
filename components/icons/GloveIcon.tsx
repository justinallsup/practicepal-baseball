import React from 'react'
import Svg, { Path } from 'react-native-svg'

interface Props { size?: number; color?: string }
export function GloveIcon({ size = 24, color = '#1e293b' }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Palm / main glove body */}
      <Path
        d="M5 19 L5 13 C5 10.5 6.5 9 8.5 9 L8.5 6.5 C8.5 5.7 9.2 5 10 5 C10.8 5 11.5 5.7 11.5 6.5 L11.5 9 L12.5 9 L12.5 6 C12.5 5.2 13.2 4.5 14 4.5 C14.8 4.5 15.5 5.2 15.5 6 L15.5 9 L16 9 C17.5 9 18.5 10 18.5 11.5 L18.5 15 C18.5 17.5 16.5 19.5 14 19.5 L7.5 19.5 C6.2 19.5 5 18.9 5 19 Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Thumb */}
      <Path
        d="M5 13 C4 12.5 3 11.5 3 10 C3 8.5 4 7.5 5.5 7.5 L8.5 7.5"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Web strap between thumb and index */}
      <Path
        d="M5.5 11 C6.5 10 7.5 9.5 8.5 9.5"
        stroke={color}
        strokeWidth="1.2"
        strokeLinecap="round"
        fill="none"
      />
      {/* Finger divider lines on glove */}
      <Path
        d="M11.5 9 L11.5 11"
        stroke={color}
        strokeWidth="1.2"
        strokeLinecap="round"
        fill="none"
      />
      <Path
        d="M14.5 9 L14.5 11"
        stroke={color}
        strokeWidth="1.2"
        strokeLinecap="round"
        fill="none"
      />
    </Svg>
  )
}
