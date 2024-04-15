const path = require('path');
module.exports = {
  webpack: function (config, env) {
    config.resolve.fallback = {
      fs: false,
      tls: false,
      net: false,
      os: false,
      url: false,
      path: false,
      assert: false,
      querystring: false,
      http: require.resolve("stream-http"),
      crypto: require.resolve("crypto-browserify"),
      stream: require.resolve("stream-browserify"),
      buffer: require.resolve("buffer"),
      https: require.resolve("https-browserify"),
    };
    config.resolve.alias = {
      '@injectivelabs/core-proto-ts': path.resolve(__dirname, 'node_modules/@injectivelabs/core-proto-ts/cjs/index.js'),
      '@injectivelabs/sdk-ts': path.resolve(__dirname, 'node_modules/@injectivelabs/sdk-ts/dist/cjs/index.js'),
      '@injectivelabs/utils': path.resolve(__dirname, 'node_modules/@injectivelabs/utils/dist/cjs/index.js'),
      '@injectivelabs/networks': path.resolve(__dirname, 'node_modules/@injectivelabs/networks/dist/cjs/index.js'),
      '@injectivelabs/exceptions': path.resolve(__dirname, 'node_modules/@injectivelabs/exceptions/dist/cjs/index.js'),
      '@injectivelabs/mito-proto-ts': path.resolve(__dirname, 'node_modules/@injectivelabs/mito-proto-ts/cjs/index.js'),
      '@injectivelabs/dmm-proto-ts': path.resolve(__dirname, 'node_modules/@injectivelabs/dmm-proto-ts/cjs/index.js'),
      '@injectivelabs/indexer-proto-ts': path.resolve(__dirname, 'node_modules/@injectivelabs/indexer-proto-ts/cjs/index.js'),
      '@injectivelabs/token-metadata': path.resolve(__dirname, 'node_modules/@injectivelabs/token-metadata/dist/cjs/index.js'),
      '@injectivelabs/ts-types': path.resolve(__dirname, 'node_modules/@injectivelabs/ts-types/dist/cjs/index.js'),
    }

    return config;
  }
};
