const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function (env, argv) {
  entry: './index.web.js'
  const config = await createExpoWebpackConfigAsync(env, argv);
  
  return config;
};
