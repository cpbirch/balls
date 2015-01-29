define(['views/pipelines', 'views/camera', 'views/renderer', 'views/scene', 'settings', 'views/lights'],
  function (pipelines, camera, renderer, scene, settings) {

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
      settings.getPipelines()
        .then(function(d) {
          pipelines.init(d);
        });

      setEventListeners();
      render();

      setInterval(function() {
        settings.getPipelines()
          .then(function(d) {
            pipelines.update(d);
          })
      }, 2000);
    }

    return start;
  });