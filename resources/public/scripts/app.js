requirejs.config({
  baseUrl: 'scripts/app',
  paths: {
    lib: '../lib',
    jquery: '../lib/jquery',
    repository: 'server/repository',
    three: '../lib/three',
    lodash: '../lib/lodash',
    hex2rgb: 'utils/hexToRgb',
    debounce: '../lib/jquery-debounce',
    text: '../lib/requireText'
  },

  shim: {
    three: { exports: 'THREE'},
    jquery: { exports: '$'},
    debounce: {exports: '$', deps: ['jquery']},
    lodash: {exports: '_'}
  }
});


require(['main', 'settings', 'three', 'lib/tween', 'jquery', 'lodash'], function (main, settings) {
  _.isEmpty(settings.getPipelines()) ? settings.show() : main()
});


