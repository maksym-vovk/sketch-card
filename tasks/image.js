// const { src, dest } = require('gulp');
// const { paths } = require('./settings');
// const browserSync = require('browser-sync');
//
// function image() {
//   return src(paths.src.img)
//     .pipe(dest(paths.build.img))
//     .pipe(browserSync.reload({ stream: true }));
// }
//
// module.exports = image;

const { src, dest } = require('gulp');
const { paths, prod } = require('./settings');
const browserSync = require('browser-sync');
const gulpIf = require('gulp-if');
const imagemin = require('gulp-imagemin');
const mozjpeg = require('imagemin-mozjpeg');
const pngquant = require('imagemin-pngquant');
const webp = require('gulp-webp');
const { parallel } = require('gulp');

function compressImages() {
    return src(paths.src.img)
        .pipe(gulpIf(prod(), imagemin([
            mozjpeg({ quality: 80, progressive: true }),
            pngquant({ quality: [0.6, 0.8] }),
        ])))
        .pipe(dest(paths.build.img))
        .pipe(browserSync.reload({ stream: true }));
}

function generateWebp() {
    return src('src/img/*.+(jpg|jpeg|png)')
        .pipe(webp({ quality: 80 }))
        .pipe(dest(paths.build.img));
}

const image = parallel(compressImages, generateWebp);

module.exports = image;