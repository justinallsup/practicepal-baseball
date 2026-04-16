import React, { useEffect, useRef } from 'react'
import { View, Animated, StyleSheet, Dimensions } from 'react-native'

const { width: W, height: H } = Dimensions.get('window')

const COLORS = ['#fbbf24', '#10b981', '#3b82f6', '#ef4444', '#8b5cf6', '#f97316', '#ec4899']
const PIECE_COUNT = 40

interface Piece {
  x: Animated.Value
  y: Animated.Value
  rot: Animated.Value
  scale: Animated.Value
  color: string
  left: number
  size: number
}

interface ConfettiProps {
  visible: boolean
}

export function Confetti({ visible }: ConfettiProps) {
  const pieces = useRef<Piece[]>([])
  const animsRef = useRef<Animated.CompositeAnimation[]>([])

  useEffect(() => {
    if (!visible) return

    // Create pieces
    pieces.current = Array.from({ length: PIECE_COUNT }).map(() => ({
      x: new Animated.Value(0),
      y: new Animated.Value(-20),
      rot: new Animated.Value(0),
      scale: new Animated.Value(1),
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      left: Math.random() * W,
      size: 8 + Math.random() * 8,
    }))

    // Animate each piece
    animsRef.current = pieces.current.map(p => {
      const delay = Math.random() * 400
      const duration = 1200 + Math.random() * 800
      const xDrift = (Math.random() - 0.5) * 120

      return Animated.parallel([
        Animated.timing(p.y, {
          toValue: H * 0.7,
          duration,
          delay,
          useNativeDriver: true,
        }),
        Animated.timing(p.x, {
          toValue: xDrift,
          duration,
          delay,
          useNativeDriver: true,
        }),
        Animated.timing(p.rot, {
          toValue: (Math.random() > 0.5 ? 1 : -1) * 720,
          duration,
          delay,
          useNativeDriver: true,
        }),
        Animated.timing(p.scale, {
          toValue: 0,
          duration: 300,
          delay: delay + duration - 300,
          useNativeDriver: true,
        }),
      ])
    })

    Animated.stagger(20, animsRef.current).start()

    return () => {
      animsRef.current.forEach(a => a.stop())
    }
  }, [visible])

  if (!visible || pieces.current.length === 0) return null

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {pieces.current.map((p, i) => {
        const rotate = p.rot.interpolate({
          inputRange: [-720, 720],
          outputRange: ['-720deg', '720deg'],
        })
        const isCircle = i % 3 === 0
        return (
          <Animated.View
            key={i}
            style={[
              styles.piece,
              {
                left: p.left,
                width: p.size,
                height: p.size,
                borderRadius: isCircle ? p.size / 2 : 2,
                backgroundColor: p.color,
                transform: [
                  { translateX: p.x },
                  { translateY: p.y },
                  { rotate },
                  { scale: p.scale },
                ],
              },
            ]}
          />
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  piece: {
    position: 'absolute',
    top: 0,
  },
})
