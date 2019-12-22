const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const PropTypesPlugin = require('./src/plugin/PropTypesPlugin');

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
    new PropTypesPlugin({
      source: './src/components/AppContainer.jsx',
      receiver: './src/components/App.jsx'
    })
  ]
};
