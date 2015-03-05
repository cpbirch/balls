define(['views/pipelines', 'views/camera', 'views/renderer',
        'views/scene', 'repository', 'views/nonGreenBuilds', 'sounds',
        'views/events', 'views/composer', 'views/snow', 'views/sky',
        'views/clouds',
        'views/lights'],
  function (pipelines, camera, renderer, scene, repo, nonGreenBuilds, sounds, events, composer, snow, sky, clouds) {

    var glitchEffectEnabled = false;
    var snowEffectEnabled = false;
    var cloudEffectEnabled = false;
    var nightTime = false;

    function render() {
      TWEEN.update();
      renderer.render(scene, camera);
      requestAnimationFrame(render);

      if (glitchEffectEnabled) { composer.render(); }

      pipelines.animate();
      snow.animate(snowEffectEnabled);
      clouds.animate(cloudEffectEnabled)
      sky.update(nightTime)
    }

    function setEventListeners() {
      function onWindowResize() {
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
      }

      window.addEventListener('resize', onWindowResize);

    }

    function start(cctrayurl, includeFilter, excludeFilter) {
      sky.init();

      repo.pipelines(cctrayurl, includeFilter, excludeFilter)
        .then(function(d) {
          pipelines.init(d.healthy || []);
        });

      setEventListeners();
      render();

      setInterval(function() {
        repo.pipelines(cctrayurl, includeFilter, excludeFilter)
          .then(function(d) {
            d.healthy = d.healthy || [];
            d.sick = d.sick || [];
            d['sick-building'] = d['sick-building'] || [];
            d['healthy-building'] = d['healthy-building'] || [];

            return d;
          })
          .then(function(d) {
            pipelines.update(d.healthy);
            return d;
          }).then(function(d) {
            nonGreenBuilds.update(d.sick, d['sick-building'], d['healthy-building']);
            return d;
          }).then(function(d) {
            sounds.play(d.healthy, d.sick, d['sick-building'], d['healthy-building']);
            return d;
          }).then(function(d) {
            glitchEffectEnabled = d.glitch
            events(d);
            return d;
          }).then(function(d) {
            snowEffectEnabled = d.snow;
            cloudEffectEnabled = d.clouds;
            nightTime = d.night;
          });
      }, 2000);
    }

    return start;
  });