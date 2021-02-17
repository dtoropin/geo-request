module.exports = {
  pug: {
    src: 'src/*.pug',
    dest: 'dist/',
    watch: 'src/**/*.pug'
  },
  style: {
    src: 'src/scss/*.scss',
    dest: 'dist/files/',
    watch: 'src/scss/**/*.scss'
  },
  js: {
    src: 'src/js/*.js',
    dest: 'dist/files/',
    watch: 'src/js/**/*.js'
  },
  fonts: {
    src: 'src/fonts/**/*.*',
    dest: 'dist/files/fonts/',
    watch: 'src/fonts/**/*.*'
  },
  img: {
    src: 'src/img/**/*.*',
    dest: 'dist/files/img/',
    watch: 'src/img/**/*.*'
  },
  clean: 'dist/**/*'
}