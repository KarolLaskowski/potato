const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const mode =
  process.env.NODE_ENV === 'production' ? 'production' : 'development';

module.exports = {
  mode: mode,
  target: 'node',
  entry: {
    background: './src/js/background.ts',
    options: './src/js/options.ts',
  },
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
      {
        test: /\.(eot|ttf|woff2?|otf)$/,
        use: ['file-loader'],
      },
      {
        test: /\.(scss|css)$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({ filename: './css/[name].css' }),
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
    filename: './js/[name].js',
    path: path.resolve(__dirname, 'build'),
  },
};
