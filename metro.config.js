
const { getDefaultConfig } = require('expo/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

// Add '.csv' to the asset extensions list
defaultConfig.resolver.assetExts.push('csv');

module.exports = defaultConfig;
