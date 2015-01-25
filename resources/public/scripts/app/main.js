define(['views/pipelines', 'views/camera', 'views/renderer', 'views/scene', 'settings', 'repository', 'views/lights'],
  function (pipelines, camera, renderer, scene, settings, repo) {

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

    function filterPipelines(cctrayUrl) {
      return repo.getPipelines(cctrayUrl)
        .then(function(pipelinesData) {
          var selectedPipelinesNames = settings.selectedPipelineNames();
          var names = _.keys(pipelinesData);
          var selectedNames = _.intersection(names, selectedPipelinesNames);
          return _.pick(pipelinesData, selectedNames);
        })

    }

    function start(cctrayUrl) {
      filterPipelines(cctrayUrl)
        .then(function(d) {
          pipelines.init(d);
        });

      setEventListeners();
      render();
      setInterval(function() {
        filterPipelines(cctrayUrl)
          .then(function(d) {
            pipelines.update(d);
          })
      }, 2000);
    }

    return start;
  });