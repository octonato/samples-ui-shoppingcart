const webpack = require('webpack');
const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = env => {

  const envKeys = Object.keys(env).reduce((prev, next) => {
    prev[`process.env.${next}`] = JSON.stringify(env[next]);
    return prev;
  }, {});

  return {
    entry: "./src/index.tsx",
    mode: "development",
    output: {
      path: path.resolve(__dirname, 'public/build'),
      filename: 'bundle.js',
      library: 'shop',
      libraryTarget: 'window',
      libraryExport: 'default'
    },
    plugins: [
      new webpack.DefinePlugin(envKeys)
    ],
    optimization: {
      minimizer: [
        new TerserPlugin({
          cache: true,
          parallel: true,
          sourceMap: true, // Must be set to true if using source-maps in production
          terserOptions: {
            // https://github.com/webpack-contrib/terser-webpack-plugin#terseroptions
          }
        }),
      ],
    },
    module: {
      rules: [
        {
          test: /\.ts(x?)$/,
          include: /src|_proto/,
          exclude: /node_modules/,
          loader: "ts-loader"
        }
      ]
    },
    resolve: {
      extensions: [".ts", ".js", ".tsx"]
    }
  }
};
