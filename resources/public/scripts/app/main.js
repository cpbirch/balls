define(['views/pipelines', 'views/camera', 'views/renderer',
        'views/scene', 'settings', 'views/nonGreenBuilds', 'views/lights'],
  function (pipelines, camera, renderer, scene, settings, nonGreenBuilds) {

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
      settings.getGreenPipelines()
        .then(function(d) {
          pipelines.init(d);
        });

      setEventListeners();
      render();

      setInterval(function() {
        settings.getGreenPipelines()
          .then(function(d) {
            pipelines.update(d);
          })

        settings.getNonGreenPipelines()
          .then(function(d) {
            nonGreenBuilds.update(d);
          })
      }, 2000);
    }

    return start;
  });