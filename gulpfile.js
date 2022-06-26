const { src, dest, series } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const include = require('gulp-file-include');
const tsGulp = require('gulp-typescript');
const tsify = require('tsify');
const browserify = require('browserify');
const source = require('vinyl-source-stream');

const createProject = tsGulp.createProject('tsconfig.json');

function ts() {
  return browserify({
    basedir: '.',
    debug: true,
    entries: ['src/index.ts'],
    cache: {},
    packageCache: {},
  })
    .plugin(tsify, {project: 'tsconfig.json'})
    .bundle()
    .pipe(source('index.js'))
    .pipe(dest('dist'));
}

function styles() {
  return src('src/**/*.scss').pipe(sass()).pipe(dest('dist'));
}

function html() {
  return src(['src/**/*.html', '!src/assets/**/*.html'])
    .pipe(
      include({
        prefix: '@@',
        basepath: '@file',
      })
    )
    .pipe(dest('dist'));
}

function other() {
  return src([
    'src/**/*',
    '!src/**/*.scss',
    '!src/**/*.html',
    '!src/**/*.ts',
  ]).pipe(dest('dist/'));
}

exports.default = series(ts, html, styles, other);
