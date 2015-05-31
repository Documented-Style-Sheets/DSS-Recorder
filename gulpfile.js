var gulp       = require('gulp'),
    concat     = require('gulp-concat'),
    io         = require('socket.io')(35729),
    browserify = require('gulp-browserify'),
    gcb        = require('gulp-callback');

gulp.task('dev', function() {
  var copyBackgroundScript = function() {
    gulp.src(['src/background-dev.js', 'src/background.js'])
      .pipe(concat('background.js'))
      .pipe(browserify())
      .pipe(gulp.dest('./'))
      .pipe(gcb(function() {
        io.emit('fileChange', {
          reload: true
        });
      }));
  }

  gulp.watch('src/*.js', copyBackgroundScript);
  copyBackgroundScript();
});

gulp.task('default', ['dev']);
