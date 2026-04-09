const { getDefaultConfig } = require('expo/metro-config')

const config = getDefaultConfig(__dirname)

// Force CJS versions of zustand to avoid import.meta in ESM builds
config.resolver.resolveRequest = (context, moduleName, platform) => {
  // Redirect zustand ESM imports to CJS for web to avoid import.meta crash
  if (moduleName === 'zustand/middleware') {
    return {
      filePath: require.resolve('./node_modules/zustand/middleware.js'),
      type: 'sourceFile',
    }
  }
  if (moduleName === 'zustand') {
    return {
      filePath: require.resolve('./node_modules/zustand/index.js'),
      type: 'sourceFile',
    }
  }
  return context.resolveRequest(context, moduleName, platform)
}

module.exports = config
