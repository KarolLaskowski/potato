const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

const mode =
  process.env.NODE_ENV === 'production' ? 'production' : 'development';

module.exports = {
  mode: mode,
  target: 'node',
  entry: './src/js/background.ts',
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: 'ts-loader',
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: 'src/html', to: 'html' },
        { from: 'src/img', to: 'img' },
        { from: 'src/manifest.json', to: 'manifest.json' },
      ],
    }),
  ],
  resolve: {
    extensions: ['.ts', '.js'],
  },
  output: {
    filename: './js/background.js',
    path: path.resolve(__dirname, 'build'),
  },
};
