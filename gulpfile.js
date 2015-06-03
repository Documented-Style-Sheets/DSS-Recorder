var gulp       = require('gulp'),
    concat     = require('gulp-concat'),
    io         = require('socket.io')(35729),
    browserify = require('browserify'),
    source     = require('vinyl-source-stream'),
    gcb        = require('gulp-callback');

gulp.task('dev', function() {
  var reload = function() {
    io.emit('fileChange', {
      reload: true
    });
  }

  var copyBackgroundScript = function() {
    return browserify(['src/background-dev.js', 'src/background.js']).bundle()
      .pipe(source('background.js'))
      .pipe(gulp.dest('./'))
      .pipe(gcb(reload));
  }

  var copyContentScript = function() {
    return browserify(['src/content.js']).bundle()
      .pipe(source('content.js'))
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
