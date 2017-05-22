var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');

gulp.task('combine-js', function () {
  return gulp.src('dist/jquery.partialScroll.js')
    .pipe(concat('jquery.partialScroll.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('dist'));
});

gulp.task('default', [
  'combine-js'
]);