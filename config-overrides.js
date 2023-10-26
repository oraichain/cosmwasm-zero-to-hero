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
      https: require.resolve("https-browserify")
    };

    return config;
  }
};
