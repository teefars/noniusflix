
// LIBRARIES
var gulp     = require('gulp'),
compass      = require('gulp-compass'),
plumber      = require('gulp-plumber'),
prefix       = require('gulp-autoprefixer'),
fileinclude  = require('gulp-file-include'),
strip        = require('gulp-strip-comments'),
path         = require('path'),
del          = require('del'),
browserSync  = require('browser-sync').create();

// Process the styles (uncompressed)
gulp.task('styles', function() {
  return gulp.src('./source/scss/**/*.scss')
    .pipe(plumber({
      errorHandler: function (error) {
        console.log(error.message);
        this.emit('end');
    }}))
    .pipe(compass({
      css: './dist/css',
      sass: './source/scss',
      project: path.join(__dirname, 'assets'),
    }))
    .pipe(prefix({
      cascade: false
    }))
    .pipe(gulp.dest('./dist/css'))
    .pipe(browserSync.stream());
});

// Clean dist folder to rebuild
gulp.task('clean', function(){
  return del('./dist', {force:true});
});

// Fontawesome webicon
gulp.task('icons', function() {
  return gulp.src('node_modules/@fortawesome/fontawesome-free/webfonts/**.*')
    .pipe(gulp.dest('./dist/fonts/fontawesome'));
  return gulp.src('node_modules/@fortawesome/fontawesome-free/scss/fontawesome.scss')
    .pipe(compass({
      css: './dist/css',
      sass: 'node_modules/@fortawesome/fontawesome-free/scss/fontawesome.scss',
      project: path.join(__dirname, 'assets'),
    }))
    .pipe(gulp.dest('./dist/css/fontawesome'));
});

gulp.task('html', gulp.parallel('fonts','javascript','image','favicon','files'), function() {
  return gulp.src(['./source/**/*.html','!./source/partials/**/*.html'])
    .pipe(plumber())
    .pipe(fileinclude({
      prefix: '@@',
      basepath: '@file'
    }))
    .pipe(strip())
    .pipe(gulp.dest('./dist/'))
    .pipe(browserSync.stream());
});

gulp.task('fonts', function() {
  return gulp.src('./source/fonts/**/*')
    .pipe(gulp.dest('./dist/fonts'));
});

gulp.task('javascript', function() {
  return gulp.src('./source/js/**/*')
    .pipe(gulp.dest('./dist/js'));
});

gulp.task('image', function() {
  return gulp.src('./source/img/**/*')
    .pipe(gulp.dest('./dist/img'));
});

gulp.task('files', function() {
  return gulp.src('./source/files/**/*')
    .pipe(gulp.dest('./dist/files'));
});

gulp.task('favicon', function() {
  return gulp.src('./source/favicon.ico')
    .pipe(gulp.dest('./dist/'));
});

gulp.task('clean', function(){
  return del('./dist/**', {force:true});
});

// Default function, does everything above (dev + browserSync) and keep watching for changes
gulp.task('serve', gulp.parallel('styles','html'), function() {
  browserSync.init({
    server: {
      baseDir: "./dist/"
    }
  });
  gulp.watch(
    [
      "./source/scss/**/*",
      "./source/**/*.html",
      "./source/**/*.js"
    ], 
    gulp.paralllel('styles','html')
  );
});

gulp.task('default', gulp.series('serve'));
