define(['views/pipelines', 'views/camera', 'views/renderer',
        'views/scene', 'config', 'views/nonGreenBuilds', 'sounds', 'views/lights'],
  function (pipelines, camera, renderer, scene, config, nonGreenBuilds, sounds) {

    function render() {
      TWEEN.update();
      renderer.render(scene, camera);
      requestAnimationFrame(render);

      pipelines.animate();
    }

    function setEventListeners() {
      function onWindowResize() {
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
      }

      window.addEventListener('resize', onWindowResize);

    }

    function start() {
      config.pipelines()
        .then(function(d) {
          pipelines.init(d.healthy);
          return d;
        });

      setEventListeners();
      render();

      setInterval(function() {
        config.pipelines()
          .then(function(d) {
            pipelines.update(d.healthy);
            return d;
          }).then(function(d) {
            nonGreenBuilds.update(d.sick, d['sick-building'], d['healthy-building']);
            return d;
          }).then(function(d) {
            sounds.play(d.healthy, d.sick, d['sick-building'], d['healthy-building']);
          })
      }, 2000);
    }

    return start;
  });