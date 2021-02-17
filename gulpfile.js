const { task, src, dest, series, parallel, watch } = require('gulp');
const imagemin = require('gulp-imagemin');
const Image = require('gulp-image');
const pug = require('gulp-pug');
const rm = require('gulp-rm');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const sassGlob = require('gulp-sass-glob');
const autoprefixer = require('gulp-autoprefixer');
const gcmq = require('gulp-group-css-media-queries');
const cleanCSS = require('gulp-clean-css');
const sourcemaps = require('gulp-sourcemaps');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const gulpif = require('gulp-if');
const browserSync = require('browser-sync').create();
const reload = browserSync.reload;
const notify = require('gulp-notify');

sass.compiler = require('node-sass');
const ENV = process.env.NODE_ENV;
const path = require('./gulp.config');

// tasks
function clean() {
  return src(path.clean, { read: false })
    .pipe(rm())
}

function fonts() {
  return src(path.fonts.src)
    .pipe(dest(path.fonts.dest))
}

function image() {
  return src(path.img.src)
    .pipe(Image())
    .pipe(imagemin({
      interlaced: true,
      progressive: true,
      optimizationLevel: 5,
      svgoPlugins: [{ removeViewBox: true }]
    }))
    .pipe(dest(path.img.dest))
    .pipe(gulpif(ENV === 'dev', reload({ stream: true })));
}

function pugHtml() {
  return src(path.pug.src)
    .pipe(pug(
      gulpif(ENV === 'dev', { pretty: true })
    )).on('error', notify.onError(error => 'Message to the notifier: ' + error.message))
    .pipe(dest(path.pug.dest))
    .pipe(gulpif(ENV === 'dev', reload({ stream: true })));
}

function styles() {
  return src(path.style.src)
    .pipe(gulpif(ENV === 'dev', sourcemaps.init()))
    .pipe(concat('main.min.scss'))
    .pipe(sassGlob())
    .pipe(sass().on('error', sass.logError))
    .pipe(gulpif(ENV === 'prod', autoprefixer({ cascade: false })))
    .pipe(gulpif(ENV === 'prod', gcmq()))
    .pipe(gulpif(ENV === 'prod', cleanCSS()))
    .pipe(gulpif(ENV === 'dev', sourcemaps.write('.')))
    .pipe(dest(path.style.dest))
    .pipe(gulpif(ENV === 'dev', reload({ stream: true })));
}

function scripts() {
  return src(path.js.src)
    .pipe(gulpif(ENV === 'dev', sourcemaps.init()))
    .pipe(concat('main.min.js', { newLine: ';' }))
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .pipe(gulpif(ENV === 'prod', uglify()))
    .pipe(gulpif(ENV === 'dev', sourcemaps.write('.')))
    .pipe(dest(path.js.dest))
    .pipe(gulpif(ENV === 'dev', reload({ stream: true })));
}

task('server', () => {
  browserSync.init({
    server: {
      baseDir: './dist'
    },
    host: 'localhost',
    port: 9000,
    browser: ['chrome']
  });
})

task('watch', () => {
  watch(path.style.watch, series(styles));
  watch(path.pug.watch, series(pugHtml));
  watch(path.js.watch, series(scripts));
  watch(path.img.watch, series(image));
})

// development
task('default', series(clean, parallel(fonts, image, pugHtml, styles, scripts), parallel('server', 'watch')))
// build
task('build', series(clean, fonts, image, pugHtml, styles, scripts))


// made svg sprite
const svgo = require('gulp-svgo');
const svgSprite = require('gulp-svg-sprite');

task('sprite', () => {
  return src('source/icons/*.svg')
    .pipe(svgo({
      plugins: [
        {
          removeAttrs: {
            attrs: "(fill|stroke|style|width|height|data.*)"
          }
        }
      ]
    }))
    .pipe(svgSprite({
      mode: {
        stack: {
          sprite: "../sprite.svg"
        }
      }
    }))
    .pipe(dest('src/img/'));
})