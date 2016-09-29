import gulp from 'gulp';
import { join } from 'path';
import webpack from 'webpack';

const commonConfig = {
  context: __dirname,
  devtool: 'source-map',
  module: {
    loaders: [
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel' },
      { test: /\.json$/, loader: 'json' },
    ],
  },
};

const nodeConfig = {
  ...commonConfig,
  output: {
    path: join(__dirname, 'build'),
    filename: '[name].js',
    libraryTarget: 'commonjs2',
  },
  target: 'node',
  node: {
    console: false,
    global: false,
    process: false,
    Buffer: false,
    __filename: false,
    __dirname: false,
    setImmediate: false,
  },
};

gulp.task('html', () => (
  gulp.src('server/index.html')
    .pipe(gulp.dest('build'))
));

gulp.task('client', (cb) => {
  webpack({
    ...commonConfig,
    entry: './src/index',
    output: {
      path: join(__dirname, 'dist'),
      filename: 'client.js',
      library: 'demo',
      libraryTarget: 'umd',
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify('production'),
        },
      }),
      new webpack.optimize.DedupePlugin(),
    ],
  }, cb);
});

gulp.task('server', ['html'], (cb) => {
  webpack({
    ...nodeConfig,
    entry: { server: './server/index' },
  }, cb);
});

gulp.task('api', (cb) => {
  webpack({
    ...nodeConfig,
    entry: { api: './api/index' },
  }, cb);
});

gulp.task('default', ['server', 'api', 'client']);
