let mix = require('laravel-mix')

mix
  .setPublicPath('dist')
  .js('resources/js/resizable.js', 'dist').vue()
  .sass('resources/sass/styles.scss', 'dist')
