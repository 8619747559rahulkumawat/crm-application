const webpack = require('webpack');

module.exports = function override(config, env) {
  config.resolve.fallback = {
    "http": require.resolve("stream-http"),
    "https": require.resolve("https-browserify"),
    "stream": require.resolve("stream-browserify"),
    "crypto": require.resolve("crypto-browserify"),
    "url": require.resolve("url/"),
    "path": require.resolve("path-browserify"),
    "assert": require.resolve("assert/"),
    "util": require.resolve("util/"),
    "zlib": require.resolve("browserify-zlib"),
    "http2": false
  };

  config.plugins.push(
    new webpack.ProvidePlugin({
      process: require.resolve('process/browser'),
      Buffer: ['buffer', 'Buffer']
    })
  );

  return config;
}
