const { src, dest, series } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const include = require('gulp-file-include');
const tsGulp = require('gulp-typescript');

const createProject = tsGulp.createProject('tsconfig.json');

function ts() {
  return src('src/**/*.ts')
    .pipe(createProject())
    .pipe(dest('dist'));

  // return tsResult.js.pipe(dest('dist'));
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
  return src(['src/**/*', '!src/**/*.scss', '!src/**/*.html']).pipe(
    dest('dist/')
  );
}

exports.default = series(ts, html, styles, other);
