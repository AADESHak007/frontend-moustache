const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Remove 'mjs' from source extensions to prevent Metro from picking up
// zustand ESM builds that contain `import.meta.env`, forcing it to use the CJS builds
// that safely use `process.env.NODE_ENV` instead.
config.resolver.sourceExts = config.resolver.sourceExts.filter(ext => ext !== 'mjs');

module.exports = config;
