
// LIBRARIES
var gulp        = require('gulp'),
compass         = require('gulp-compass'),
plumber         = require('gulp-plumber'),
prefix          = require('gulp-autoprefixer'),
fileinclude     = require('gulp-file-include'),
strip           = require('gulp-strip-comments'),
path            = require('path'),
del             = require('del'),
googleWebFonts  = require('gulp-google-webfonts'),
browserSync     = require('browser-sync').create();

/*
*   Process styles
*   Obs: demands ruby and gem compass
*/
  function style() {
    return gulp.src('./source/scss/**/*.scss')
      .pipe(compass({
        css: 'dist/css',
        sass: 'source/scss',
      }))
      .pipe(plumber())
      .pipe(prefix({
        cascade: false
      }))
      .pipe(gulp.dest('./dist/css'))
      .pipe(browserSync.stream());
  }
/*  /Process styles */

/*
*   Process libraries
*/
  function libs() {

    // Bootstrap
    // Not getting SCSS dinamically to not break on version change
    /*return gulp.src('node_modules/bootstrap/*')
      .pipe(plumber())
      .pipe(gulp.dest('./dist/source/bootstrap'))
      .pipe(browserSync.stream());*/
  }
/*  /Process libraries */


/*
*   Clean distribution folder to rebuild
*/ 
  gulp.task('clean', function(){
    return del('./dist', {force:true});
  });
/*  /Clean */ 

/*
*   Move JS files
*   todo: test
*/ 
  function javascript(){
    return gulp.src('./source/js/**/*')
      .pipe(gulp.dest('./dist/js'));
  }
/*  /Move JS files */ 

/*
*   Fontawesome webicon
*   todo: check if it's possible to get icons on demand
*         check which files really need to be imported
*/ 
  // gulp.task('icons', function() {
  //   return gulp.src('node_modules/@fortawesome/fontawesome-free/webfonts/**.*')
  //     .pipe(gulp.dest('./dist/fonts/fontawesome'));
  //   return gulp.src('node_modules/@fortawesome/fontawesome-free/scss/fontawesome.scss')
  //     .pipe(compass({
  //       css: './dist/css',
  //       sass: 'node_modules/@fortawesome/fontawesome-free/scss/fontawesome.scss',
  //       project: path.join(__dirname, 'assets'),
  //     }))
  //     .pipe(gulp.dest('./dist/css/fontawesome'));
  // });
/*  /Fontawesome webicon */ 

/*
*   Webfonts treatment
*/
  function googleFonts(){
    var options = {
      cssFilename:  'fonts-google.css',
    };
    // add to source files *just for organization
    // todo: check a better automated way to generate the CSS and Fonts
    //  this method doesn't integrate with SCSS in any way and since
    //  you can't edit the css file paths (because it gets regenerated) and
    //  can't avoid generating the CSS file (you could exclude 
    //  after generation but seems wrong), this is the only 'right' way to use
    //  this solution*: the path you use here is used to save files and in
    //  the CSSfile. 
    //  * considering having the fonts locally and with an automated process
    return gulp.src('./fonts.list')
        .pipe(googleWebFonts(options))
        .pipe(plumber())
        .pipe(gulp.dest('./dist/fonts'));
  };

  gulp.task('fonts', function() {
    return googleFonts();
  });
/*   /Webfonts treatment */

/*
*   Images
*   todo: optimize
*/
  // gulp.task('images', function() {
  //   return gulp.src('./source/img/**/*')
  //     .pipe(gulp.dest('./dist/img'));
  // });
/*   /Images */

/*
*   Files 
*   (downloads, pdfs, etc)
*/
  // gulp.task('files', function() {
  //   return gulp.src('./source/files/**/*')
  //     .pipe(gulp.dest('./dist/files'));
  // });
/*  /Files */

/*
*   Favicon
*/
  // gulp.task('favicon', function() {
  //   return gulp.src('./source/favicon.ico')
  //     .pipe(gulp.dest('./dist/'));
  // });
/*   /Favicon */

/*
*   Clean distribution folder
*/
  gulp.task('clean', function(){
    return del('./dist/**', {force:true});
  });
/*  /Clean distribution folder */

/*
*   HTML build
*   todo: optimize output
*/
  function html(){
    return gulp.src(['./source/**/*.html','!./source/partials/**/*.html'])
      .pipe(plumber())
      // File include for adding HTML partials *check if really needed
      .pipe(fileinclude({
        prefix: '@@',
        basepath: '@file',
        indent: true
      }))
      .pipe(strip())
      .pipe(gulp.dest('./dist/'));
  };
/*  /HTML build */

/*
*   Watch function and browsersync
*/
  function watch() {
    browserSync.init({
        server: {
            baseDir: "dist",
        }
    });
    gulp.watch('./source/scss/**/*', style);
    gulp.watch('./source/**/*.html').on('change',gulp.series(html,browserSync.reload));
    gulp.watch('./source/**/*.js').on('change',gulp.series(javascript,browserSync.reload));
  }
/*  /Watch function and browsersync */

// default 'gulp' command
gulp.task('default', gulp.series('clean','fonts', html, style, watch));
