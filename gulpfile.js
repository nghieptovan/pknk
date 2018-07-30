const gulp = require('gulp');
const HubRegistry = require('gulp-hub');
const browserSync = require('browser-sync');

const conf = require('./conf/gulp.conf');

// Load some files into the registry
const hub = new HubRegistry([conf.path.tasks('*.js')]);

// Tell gulp to use the tasks just loaded
gulp.registry(hub);

gulp.task('build', gulp.series(gulp.parallel('other', 'webpack:dist')));
gulp.task('qa', gulp.series(gulp.parallel('other', 'webpack:qa')));
gulp.task('tl', gulp.series(gulp.parallel('other', 'webpack:tl')));
gulp.task('demoqa', gulp.series(gulp.parallel('other', 'webpack:demoqa')));
gulp.task('demotl', gulp.series(gulp.parallel('other', 'webpack:demotl')));
gulp.task('demodist', gulp.series(gulp.parallel('other', 'webpack:demodist')));
gulp.task('test', gulp.series('karma:single-run'));
gulp.task('test:auto', gulp.series('karma:auto-run'));
gulp.task('serve', gulp.series('webpack:watch', 'watch', 'browsersync'));
gulp.task('serve:dist', gulp.series('default', 'browsersync:dist'));
gulp.task('default', gulp.series('clean', 'build'));
gulp.task('watch', watch);

// gulp.task('set-dev-env', function () {
//     return process.env.NODE_ENV = 'development';
// });

// gulp.task('set-prod-env', function () {
//     return process.env.NODE_ENV = 'production';
// });

function reloadBrowserSync(cb) {
  browserSync.reload();
  cb();
}

function watch(done) {
  gulp.watch(conf.path.tmp('index.html'), reloadBrowserSync);
  done();
}
