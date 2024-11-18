const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const { merge } = require('webpack-merge');
const dotenv = require('dotenv');
const autoprefixer = require('autoprefixer');
const baseWebpackConfig = require('./webpack.base.conf');
const getClientEnvironment = require('./utils/env');

// https://github.com/bkeepers/dotenv#what-other-env-files-can-i-use
const dotenvFiles = [
  path.resolve(__dirname, '../.env.development.local'),
  path.resolve(__dirname, '../.env.test.local'),
  path.resolve(__dirname, '../.env.local'),
  path.resolve(__dirname, '../.env.development'),
  path.resolve(__dirname, '../.env.test'),
  path.resolve(__dirname, '../.env')
].filter((dotenvFile) => fs.existsSync(dotenvFile));

console.log(`${dotenvFiles[0]} will be used.\n`);

// Load env variables
dotenv.config({
  path: dotenvFiles[0]
});

const clientEnv = getClientEnvironment('development');

module.exports = merge(baseWebpackConfig, {
  mode: 'development',
  target: 'web',
  devtool: 'eval-cheap-module-source-map',
  output: {
    filename: 'assets/js/[name].js',
    chunkFilename: 'assets/js/[name].chunk.js'
  },
  devServer: {
    static: {
      directory: path.join(__dirname, '../public'),
    },
    host: '0.0.0.0',
    port: 8888,
    historyApiFallback: true,
    hot: true,
    client: {
      overlay: {
        warnings: false,
        errors: true
      },
    },
  },
  plugins: [
    new webpack.DefinePlugin(clientEnv.stringified),
    new webpack.HotModuleReplacementPlugin(),
  ],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: [
          'babel-loader',
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
              compilerOptions: {
                noEmit: false
              }
            }
          }
        ]
      },
      {
        test: /\.jsx?$/,
        include: path.resolve(__dirname, '../src'),
        loader: 'babel-loader'
      },
      {
        test: /\.s?css$/i,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
              importLoaders: 2
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  autoprefixer()
                ]
              }
            }
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true
            }
          }
        ]
      }
    ]
  },
  optimization: {
    moduleIds: 'named',
    removeAvailableModules: false,
    removeEmptyChunks: false,
    splitChunks: false,
  }
});