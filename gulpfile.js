"use strict";

var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var plumber = require('gulp-plumber');
var sourcemap = require('gulp-sourcemaps');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var sprite = require('gulp-svgstore');
var rename = require('gulp-rename');
var svgmin = require('gulp-svgmin');
var csso = require('gulp-csso');
var posthtml = require('gulp-posthtml');
var include = require('posthtml-include');
var clear = require('del');
var webpack = require('webpack-stream');
const isDev = false;
const isProd = !isDev;

gulp.task('css', function() {
  return gulp.src('app/scss/style.scss')
  .pipe(plumber())
  .pipe(sourcemap.init())
  .pipe(sass())
  .pipe(postcss([autoprefixer()]))
  .pipe(csso())
  .pipe(rename('style.min.css'))
  .pipe(sourcemap.write('.'))
  .pipe(gulp.dest('build/css'))
  .pipe(browserSync.stream());
});

gulp.task('js', function() {
    return gulp.src('app/js/select.js')
    .pipe(webpack({
        output: {
            filename: 'select.min.js',
        },
        module: {
            rules: [
            {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            }
        ]
    },
    mode: isDev ? 'development' : 'production'
  }))
  .pipe(gulp.dest('build/js'))
  .pipe(browserSync.stream());
});

gulp.task('html', function () {
  return gulp.src('app/*.html')
  .pipe(posthtml([
    include()
  ]))
  .pipe(gulp.dest('build'));
});

gulp.task('sprite', function() {
  return gulp.src('app/img/icon-*.svg')
  .pipe(svgmin({
    plugins:[{
      removeDimensions: true
    }]
  }))
  .pipe(sprite({
    inlineSvg: true
  }))
  .pipe(rename('sprite.svg'))
  .pipe(gulp.dest('build/img'));
});


gulp.task('server', function () {
  browserSync.init({
    server:'build/',
    notify: false
  });

    gulp.watch('app/scss/**/*.scss', gulp.series('css'));
    gulp.watch('app/js/**/*.js', gulp.series('js'));
    gulp.watch('app/**/*.html', gulp.series('html','refresh'));
});

gulp.task('refresh', function (done) {
  browserSync.reload();
  done();
});

gulp.task('copy', function () {
  return gulp.src([
    'app/fonts/**/*.{woff,woff2}',
    'app/*.ico',
    'app/img/**/*.{png,jpg,svg}',
  ], {
    base: 'app'
  })
  .pipe(gulp.dest('build'));
});

gulp.task('clear', function () {
  return clear('build');
});

gulp.task('build', gulp.series(
  'clear',
  'copy',
  'js',
  'css',
  'sprite',
  'html'
));

gulp.task('start', gulp.series('build', 'server'));
