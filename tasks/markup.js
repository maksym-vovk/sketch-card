const { src, dest } = require('gulp');
const { paths, dev } = require('./settings');
const browserSync = require('browser-sync');
const plumber = require('gulp-plumber');
const pug = require('gulp-pug');
const condition = require('gulp-if');
const pretty = require('gulp-pretty-html');
const fs = require('fs');
const path = require('path');
const merge = require('merge-stream');

const prettySettings = {
  indent_size: 2,
  indent_char: ' '
};

function markup() {
  const locales = fs.readdirSync(paths.src.localization).map((file) => {
    return file.replace('.json', '');
  });

  const tasks = locales.map((locale) => {
    const localePath = path.resolve(paths.src.localization, `${locale}.json`);
    const data = JSON.parse(fs.readFileSync(localePath, 'utf-8'));

    return src([
        `${paths.src.templates}/*.pug`,
        // `${paths.src.templates}/pages/**/*.pug`,
        `!${paths.src.templates}/layout/**`,
        `!${paths.src.templates}/components/**`
      ])
      .pipe(plumber())
      .pipe(pug({
        locals: {
          t: data,
          locale: locale
        }
      }))
      .pipe(condition(dev(), pretty(prettySettings)))
      .pipe(dest(locale === 'en' ? paths.build.markup : `${paths.build.markup}/${locale}`))
      .pipe(browserSync.reload({ stream: true }));
  });

  return merge(tasks);
}

module.exports = markup;
