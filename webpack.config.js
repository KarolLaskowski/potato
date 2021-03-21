const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

const mode =
  process.env.NODE_ENV === 'production' ? 'production' : 'development';

module.exports = {
  mode: mode,
  target: 'node',
  entry: {
    background: './src/js/background.ts',
    options: './src/js/options.ts',
    optionsCss: '/src/scss/options.scss',
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
        test: /\.scss$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'file-loader',
            options: { outputPath: './css/', name: '[name].css' },
          },
          'sass-loader',
        ],
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
    filename: './js/[name].js',
    path: path.resolve(__dirname, 'build'),
  },
};
