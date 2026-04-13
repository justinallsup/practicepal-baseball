import React from 'react'
import { Image, Text, ImageStyle, TextStyle } from 'react-native'

// Sentinel value used in practice-types.ts to indicate "show the bat image"
export const BAT_IMAGE_SENTINEL = '__BAT_IMAGE__'

const batImage = require('../assets/bat.png')

interface Props {
  value: string
  size: number
  textStyle?: TextStyle
  imageStyle?: ImageStyle
}

/**
 * Renders an emoji as <Text> or the bat icon as <Image> when the sentinel is detected.
 */
export function EmojiOrImage({ value, size, textStyle, imageStyle }: Props) {
  if (value === BAT_IMAGE_SENTINEL) {
    return (
      <Image
        source={batImage}
        style={[{ width: size, height: size }, imageStyle]}
        resizeMode="contain"
      />
    )
  }
  return <Text style={[{ fontSize: size }, textStyle]}>{value}</Text>
}
