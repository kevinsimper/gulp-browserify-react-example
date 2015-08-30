var gulp = require('gulp')
var through2 = require('through2')
var browserify = require('browserify')
var uglify = require('gulp-uglify')
var reactify = require('reactify')

gulp.task('browserify', function () {
  return gulp.src(['./app/**/*.js'])
    .pipe(through2.obj(function (file, enc, next){
      browserify(file.path)
        .transform(reactify)
        .bundle(function(err, res){
          file.contents = res;
          next(null, file);
        });
    }))
    .pipe(uglify())
    .pipe(gulp.dest('./build'))
})
