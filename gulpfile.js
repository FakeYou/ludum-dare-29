var gulp = require('gulp');
var browserify = require('gulp-browserify');
var rename = require('gulp-rename');
var nodemon = require('gulp-nodemon');

gulp.task('pixi', function() {
  gulp.src('node_modules/pixi.js/bin/pixi.js')
    .pipe(rename('pixi.min.js'))
    .pipe(gulp.dest('public/lib'));
});

gulp.task('jquery', function() {
  gulp.src('node_modules/jquery/dist/jquery.min.js')
    .pipe(gulp.dest('public/lib'));

  gulp.src('node_modules/jquery/dist/jquery.min.map')
    .pipe(gulp.dest('public/lib'));
});

gulp.task('browserify', function() {
  gulp.src('game/game.js')
    .pipe(browserify({
      insertGlobals : true
    }))
    .pipe(rename('game.js'))
    .pipe(gulp.dest('public/game'));

  gulp.src('game/preload.js')
    .pipe(browserify())
    .pipe(rename('preload.js'))
    .pipe(gulp.dest('public/game'));

  gulp.src('game/assets/*.*', { base: './' })
    .pipe(gulp.dest('public'));
});

gulp.task('develop', function() {
  nodemon({ script: 'server/main.js', ext: 'js json', ignore: ['public/*']})
    .on('restart', ['browserify']);
});


gulp.task('default', ['pixi', 'jquery', 'browserify', 'develop']);