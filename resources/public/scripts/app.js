requirejs.config({
  baseUrl: 'scripts/app',
  paths: {
    lib: '../lib',
    jquery: '../lib/jquery',
    repository: 'server/repository',
    three: '../lib/three',
    lodash: '../lib/lodash',
    hex2rgb: 'utils/hexToRgb',
    debounce: '../lib/jquery-debounce'
  },

  shim: {
    three: { exports: 'THREE'},
    jquery: { exports: '$'},
    debounce: {exports: '$', deps: ['jquery']},
    lodash: {exports: '_'}
  }
});


require(['main', 'repository', 'settings', 'three', 'lib/tween', 'jquery', 'lodash'], function (main, repo, settings) {
  var cctrayUrl = settings.cctrayUrl()

  if (cctrayUrl) {
    repo.getPipelines(cctrayUrl)
      .then(function(d) {
        main(d, cctrayUrl)
      })
      .fail(function() {
        settings.show();
      })
  }

});


