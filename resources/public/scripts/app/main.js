define(['views/pipelines', 'views/camera', 'views/renderer', 'views/scene', 'views/lights'],
  function (pipelines, camera, renderer, scene) {

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

    function start(pipelinesData, cctrayUrl) {
      pipelines.init(pipelinesData);
      setEventListeners();
      render();
      setInterval(function() {
        pipelines.update(cctrayUrl);
      }, 5000);
    }

    return start;
  });