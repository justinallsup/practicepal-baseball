const { getDefaultConfig } = require('expo/metro-config')

const config = getDefaultConfig(__dirname)

// Alias AsyncStorage to web-compatible version for web platform
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (platform === 'web' && moduleName === '@react-native-async-storage/async-storage') {
    return context.resolveRequest(
      context,
      '@react-native-async-storage/async-storage/lib/module/AsyncStorage.js',
      platform
    )
  }
  return context.resolveRequest(context, moduleName, platform)
}

module.exports = config
