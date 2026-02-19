const rollup = require('rollup');
const { paths, dev } = require('./settings');
const commonjs = require('@rollup/plugin-commonjs');
const resolve = require('@rollup/plugin-node-resolve');
const babel = require('rollup-plugin-babel');
const { src, dest } = require('gulp');
const browserSync = require('browser-sync');
const minify = require('gulp-minify');


async function script() {

  const bundle = await rollup.rollup({
    input: paths.rollup.entry,
    plugins: [commonjs(), resolve(), babel(), minify()]
  });

  await bundle.write({
    file: paths.rollup.bundle,
    format: 'iife',
    sourcemap: dev()
  });

  const subscribeBundle = await rollup.rollup({
    input: `${paths.src.scripts}/subscribe.js`,
    plugins: [commonjs(), resolve(), babel(), minify()]
  });

  await subscribeBundle.write({
    file: `${paths.build.scripts}/subscribe.js`,
    format: 'iife',
    sourcemap: dev()
  });

  return src(`${paths.src.scripts}/libs/*.js`)
    .pipe(dest(paths.build.scripts))
    .pipe(browserSync.reload({ stream: true }));
}

module.exports = script;
