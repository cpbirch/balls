define(["settings"], function(settings) {

  var previousHealthyBuilding = [];
  var previousSickBuilding = [];

  function loadAudio(path, settingsEnabledFn) {
    var a = new Audio(path);
    a.settingsEnabled = settingsEnabledFn;
    a.addEventListener('ended', function() { a.currentTime = 0; });
    return a;
  }

  var audios = {
    breakingBuildAudio: loadAudio('/sounds/wario_ah_hahaha_wonderful.wav', settings.playBrokenBuildSoundEnabled),
    sickToHealthyAudio: loadAudio('/sounds/mario_woo_hoo.wav', settings.playBrokenBuildIsHealthySoundEnabled)
  };


  function audioPlaying(audio) {
    return audio.currentTime != 0;
  }

  function canPlay(audio) {
    return audio.settingsEnabled() && !audioPlaying(audio)
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
    playSoundFor(healthy, previousSickBuilding, audios.sickToHealthyAudio);
  }

  function checkBrokenBuild(sick) {
    var allPreviousBuilding = previousHealthyBuilding.concat(previousSickBuilding);

    playSoundFor(sick, allPreviousBuilding, audios.breakingBuildAudio);
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