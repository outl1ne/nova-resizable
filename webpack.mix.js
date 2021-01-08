let mix = require('laravel-mix')

mix
  .setPublicPath('dist')
  .js('resources/js/resizable.js', 'js')
  .sass('resources/sass/styles.scss', 'css')
