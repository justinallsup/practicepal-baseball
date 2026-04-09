module.exports = function (api) {
  api.cache(true)
  return {
    presets: [
      require('expo/node_modules/babel-preset-expo'),
    ],
    // No reanimated plugin — app uses built-in Animated only
  }
}
