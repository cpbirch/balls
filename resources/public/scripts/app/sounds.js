define(["settings"], function(settings) {

  var previousBuilding = [];

  var breakingBuildAudio = document.getElementById("build-breaking-audio");
  breakingBuildAudio.setAttribute("autoplay", 'autoplay');

  function playBrokenBuildSound() {
    if (!settings.playBrokenBuildSoundEnabled()) {
      return;
    }

    breakingBuildAudio.play();
  }

  function checkBrokenBuild(sick) {
    sick = sick || [];
    sick.forEach(function(d) {
      if (_.contains(previousBuilding, d.name)) {
        playBrokenBuildSound();
        return;
      }
    });
  }

  function updatePreviousBuilding(sickBuilding, healthyBuilding) {
    sickBuilding = sickBuilding || [];
    healthyBuilding = healthyBuilding || [];

    previousBuilding = _.pluck(sickBuilding.concat(healthyBuilding), "name");
  }

  function play(healthy, sick, sickBuilding, healthyBuilding) {
    checkBrokenBuild(sick);

    updatePreviousBuilding(sickBuilding, healthyBuilding)
  }

  return {
    play: play
  };

});