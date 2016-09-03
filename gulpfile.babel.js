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

const nodeCommonConfig = {
  ...commonConfig,
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

gulp.task('client', cb => {
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

gulp.task('server', ['html'], cb => {
  webpack({
    ...nodeCommonConfig,
    entry: './server/index',
    target: 'node',
    output: {
      path: join(__dirname, 'build'),
      filename: 'server.js',
      library: 'demoServer',
      libraryTarget: 'commonjs2',
    },
  }, cb);
});

gulp.task('api', cb => {
  webpack({
    ...nodeCommonConfig,
    entry: './api/index',
    target: 'node',
    output: {
      path: join(__dirname, 'build'),
      filename: 'api.js',
      library: 'demoServer',
      libraryTarget: 'commonjs2',
    },
  }, cb);
});

gulp.task('default', ['server', 'client', 'api']);
