const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const BuildBooster = require('./src/plugin/BuildBooster');

module.exports = {
  entry: './src/index.js',
  output: {
      path: path.join(__dirname, '/dist'),
      filename: 'index.bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.(js$|jsx$)/,
        exclude: /node_modules/,
        use: [
          'babel-loader'
        ]
      },
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  plugins: [
    new HTMLWebpackPlugin({
      template: './src/index.html'
    }),
    new BuildBooster({
      source: 'src/**/*.jsx',
      receiver: 'dist/meta/metadata.json'
    })
  ]
};
