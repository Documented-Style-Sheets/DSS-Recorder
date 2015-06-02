var gulp       = require('gulp'),
    concat     = require('gulp-concat'),
    io         = require('socket.io')(35729),
    browserify = require('gulp-browserify'),
    gcb        = require('gulp-callback');

gulp.task('dev', function() {
  var reload = function() {
    io.emit('fileChange', {
      reload: true
    });
  }

  var copyBackgroundScript = function() {
    gulp.src(['src/background-dev.js', 'src/background.js'])
      .pipe(concat('background.js'))
      .pipe(browserify())
      .pipe(gulp.dest('./'))
      .pipe(gcb(reload));
  }

  var copyContentScript = function() {
    gulp.src(['node_modules/lodash/index.js', 'src/content.js'])
      .pipe(concat('content.js'))
      .pipe(gulp.dest('./'))
      .pipe(gcb(reload));
  }

  var copyScripts = function() {
    copyBackgroundScript();
    copyContentScript();
  }

  gulp.watch(['src/*.js'], copyScripts);
  copyScripts();
});

gulp.task('default', ['dev']);
