requirejs.config({
  baseUrl: 'scripts/app',
  paths: {
    lib: '../lib',
    jquery: '../lib/jquery',
    repository: 'server/repository',
    three: '../lib/three',
    lodash: '../lib/lodash',
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


require(['main', 'config', 'three', 'lib/tween', 'jquery', 'lodash'], function (main, config) {
  var url = config.cctrayUrl();
  var includeFilter = config.includeFilter();
  var excludeFilter = config.excludeFilter();

  _.isEmpty(config.cctrayUrl()) ? config.show() : main(url, includeFilter, excludeFilter)
});


