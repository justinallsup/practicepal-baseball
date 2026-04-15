import React from 'react'
import Svg, { Path } from 'react-native-svg'

interface Props { size?: number; color?: string }
export function BatIcon({ size = 24, color = '#1e293b' }: Props) {
  // Diagonal bat: barrel at top-right, handle at bottom-left
  // The bat tapers from barrel (~3px wide) to handle (~1.5px stroke)
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Main bat body — thick at barrel end, tapers to handle */}
      <Path
        d="M18.5 3.5 L5.5 18.5"
        stroke={color}
        strokeWidth="3.5"
        strokeLinecap="round"
        fill="none"
      />
      {/* Taper overlay to simulate narrowing (handle side) */}
      <Path
        d="M12 11 L5.5 18.5"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      {/* Handle (thin grip) */}
      <Path
        d="M7 17 L5.5 18.5"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
      {/* Knob at handle end */}
      <Path
        d="M4.5 19.5 L6.5 19.5"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
    </Svg>
  )
}
