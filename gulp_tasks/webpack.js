const gulp = require('gulp');
const gutil = require('gulp-util');

const webpack = require('webpack');
const webpackConf = require('../conf/webpack.conf');
const webpackDistConf = require('../conf/webpack-dist.conf');
const webpackTlConf = require('../conf/webpack-tl.conf');
const webpackQaConf = require('../conf/webpack-qa.conf');
const webpackDemoQaConf = require('../conf/webpack-demoqa.conf');
const webpackDemoTlConf = require('../conf/webpack-demotl.conf');
const webpackDemoDistConf = require('../conf/webpack-demodist.conf');
const gulpConf = require('../conf/gulp.conf');


gulp.task('webpack:watch', done => {
  webpackWrapper(true, webpackConf, done);
});
gulp.task('webpack:tl', done => {
  webpackWrapper(false, webpackTlConf, done);
});
gulp.task('webpack:qa', done => {
  webpackWrapper(false, webpackQaConf, done);
});
gulp.task('webpack:dist', done => {
  webpackWrapper(false, webpackDistConf, done);
});
gulp.task('webpack:demoqa', done => {
  webpackWrapper(false, webpackDemoQaConf, done);
});
gulp.task('webpack:demotl', done => {
  webpackWrapper(false, webpackDemoTlConf, done);
});
gulp.task('webpack:demodist', done => {
  webpackWrapper(false, webpackDemoDistConf, done);
});

function webpackWrapper(watch, conf, done) {
  const webpackBundler = webpack(conf);

  const webpackChangeHandler = (err, stats) => {
    if (err) {
      gulpConf.errorHandler('Webpack')(err);
    }
    gutil.log(stats.toString({
      colors: true,
      chunks: false,
      hash: false,
      version: false
    }));
    if (done) {
      done();
      done = null;
    }
  };

  if (watch) {
    webpackBundler.watch(200, webpackChangeHandler);
  } else {
    webpackBundler.run(webpackChangeHandler);
  }
}
