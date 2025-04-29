// mobile-app/metro.config.js
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Fix for topInsetsChange error
config.resolver.sourceExts = ['jsx', 'js', 'ts', 'tsx', 'cjs', 'json'];

// Add additional assetExts if needed
config.resolver.assetExts = config.resolver.assetExts.filter(ext => ext !== 'svg');
config.resolver.assetExts.push('db', 'ttf', 'png', 'jpg');

// Add svg to sourceExts if you're using svg
config.resolver.sourceExts.push('svg');

// Fix for topInsetsChange issue
config.resolver.blacklistRE = /node_modules\/.*\/node_modules\/(@react-native-community\/cli-platform-(ios|android)|react-native-codegen)/;
config.resolver.blockList = /node_modules\/.*\/node_modules\/(@react-native-community\/cli-platform-(ios|android)|react-native-codegen)/;

module.exports = config;