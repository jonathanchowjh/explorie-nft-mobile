// Metro only bundles files inside the project unless told otherwise. The app
// bundles the drops from the server's folder, so the two always agree.
const path = require("path");
const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);
config.watchFolders = [...config.watchFolders, path.resolve(__dirname, "../server/src")];

module.exports = config;
