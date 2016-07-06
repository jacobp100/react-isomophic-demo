const path = require('path');

module.exports = {
  context: __dirname,
  entry: './src/index',
  devtool: 'source-map',
  output: {
    path: path.join(__dirname, '/dist'),
    filename: 'cats.js',
    library: 'cats',
    libraryTarget: 'umd',
    publicPath: '/dist/',
  },
  module: {
    loaders: [
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel' },
    ],
  },
  devServer: {
    historyApiFallback: true,
    host: '0.0.0.0',
  },
};
