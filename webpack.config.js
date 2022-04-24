const path = require('path');

module.exports = {
  entry: './src/scripts/main.js',
  output: {
    path: path.resolve(__dirname, 'dist/scripts'),
    filename: 'main.js'
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  }
}