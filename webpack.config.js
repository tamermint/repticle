const path = require('path');
const webpack = require('webpack')

const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const mode = process.env.NODE_ENV || 'development';

module.exports = {
  mode: mode,
  entry: {
    hello: './src/hello.js',
    components: './src/components.js',
    'near-wallet': './src/near-wallet.js'
  },
  devtool: mode === 'development' ? 'inline-source-map' : false,
  devServer: {
    static: './dist',
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  resolve: {
    fallback: {
      https: require.resolve("https-browserify"),
      http: require.resolve("stream-http"),
      crypto: require.resolve("crypto-browserify"),
    }
  },
  module: {
    rules: [
      {
        test: /\.(js)$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.m?js/,
        resolve: {
            fullySpecified: false
        }
      }
    ],
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [{ from: 'src/assets', to: 'assets' }]
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './src/index.html'
      //chunks: ['index'],
    }), 
    new HtmlWebpackPlugin({
      filename: 'hello-near.html',
      template: './src/hello-near.html',
      chunks: ['hello'],
    }), 
    new HtmlWebpackPlugin({
      filename: 'why-kyc.html',
      template: './src/why-kyc.html'
      //chunks: ['index'],
    }),
    new HtmlWebpackPlugin({
      filename: 'components.html',
      template: './src/components.html',
      chunks: ['components'],
    }),
    new webpack.ProvidePlugin({
      process: 'process/browser',
    }),
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
    }),
  ]
};