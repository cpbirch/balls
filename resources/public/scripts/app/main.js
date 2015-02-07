define(['views/pipelines', 'views/camera', 'views/renderer',
        'views/scene', 'repository', 'views/nonGreenBuilds', 'sounds', 'views/lights'],
  function (pipelines, camera, renderer, scene, repo, nonGreenBuilds, sounds) {

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

    function start(cctrayurl, includeFilter, excludeFilter) {
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
          })
      }, 2000);
    }

    return start;
  });