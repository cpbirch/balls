define(["settings"], function(settings) {

  var previousHealthyBuilding = [];
  var previousSickBuilding = [];

  function audioElmFor(elmId) {
    var elm = document.getElementById(elmId);
    elm.addEventListener('ended', function() { elm.currentTime = 0; });
    return elm;
  }

  var breakingBuildAudio = audioElmFor("build-breaking-audio");
  var sickToHealthyAudio = audioElmFor("sick-to-healthy-audio");

  function audioPlaying(audioElm) {
    return audioElm.currentTime != 0;
  }

  function canPlay(audioElm) {
    return settings.playBrokenBuildSoundEnabled() && !audioPlaying(audioElm)
  }

  function playSound(sound) {
    if (canPlay(sound)) {
      sound.play();
    }
  }

  function playSoundFor(data, compareList, sound) {
    data.forEach(function(d) {
      if (_.contains(compareList, d.name)) {
        playSound(sound);
        return;
      }
    })
  }

  function checkSickBuildingSuccess(healthy) {
    playSoundFor(healthy, previousSickBuilding, sickToHealthyAudio);
  }

  function checkBrokenBuild(sick) {
    var allPreviousBuilding = previousHealthyBuilding.concat(previousSickBuilding);

    playSoundFor(sick, allPreviousBuilding, breakingBuildAudio);
  }

  function updatePreviousBuilding(sickBuilding, healthyBuilding) {
    previousHealthyBuilding = _.pluck(healthyBuilding, "name");
    previousSickBuilding = _.pluck(sickBuilding, "name");
  }

  function play(healthy, sick, sickBuilding, healthyBuilding) {
    checkSickBuildingSuccess(healthy || []);
    checkBrokenBuild(sick || []);

    updatePreviousBuilding(sickBuilding || [], healthyBuilding || [])
  }

  return {
    play: play
  };

});