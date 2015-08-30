# Gulp + Browserify + React transform

There is a lot of tutorials on the internet that shows how to use Browserify
in gulp and all of them are not working now with the latest versions of
browserify.

There is solutions that suggest you to use `vinyl-transform`, but that would
not work know, because `vinyl-transform` expects a stream that is both writeable
and readable, but that got fixed so it wasn't.

This is the simplest solution and it is also future proof.

It works they way you inspect and keeps the same folder structure.

```
app/
  main.js --> build/main.js
  subfolder/
    app.js --> build/subfolder/app.js
```

This examples also shows with a transform, which a lot of tutorials leaves out,
and that caused a lot of errors, because it was different because it would
throw an error `write after end`.

Here is what it looks like:

```
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

```

But you can see there that we have the normal `gulp.src`, then after that a
transform stream, that is a object stream `through2.obj`. That means instead of
strings getting passed through, it is javascript objects.

Then we are modifying the `vinyl` object that we got passed in the line
```
file.contents = res
```

A [https://github.com/wearefractal/vinyl](vinyl object) is essential a virtual
file, but it never got that popular, and I think it was because it is a little
too complicated.

But we are changing the content and then push that object onto down the stream.

```
next(null, file)
```

That also mean that we can changed the path if we want to have them in a flat
structure. Like this:

```
build/
  app.js
  main.js
```

Then we need to add the lines to change the path of the original file to this

```
var filename = file.path.split('/')
file.path = file.base + filename[filename.length - 1]
```

So it looks like this

```
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
          var filename = file.path.split('/')
          file.path = file.base + filename[filename.length - 1]
          next(null, file);
        });
    }))
    .pipe(uglify())
    .pipe(gulp.dest('./build'))
})
```

I hope this helped you!

If you have any question, feel free to email me at kevin@blackbeard.io

-Kevin

[https://twitter.com/kevinsimper](@kevinsimper)
