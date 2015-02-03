define(['repository', 'jquery', 'debounce'], function (repo) {

  var cctrayUrlKey = "cctrayUrl";
  var rotateNonGreenTextKey = "rotateNonGreenText";
  var filterFieldKey = "filterField";
  var excludeFieldKey = "excludeField";
  var repulsionFactorKey = "repulsionFactor";
  var attractionFactorKey = "attractionFactor";
  var playBrokenBuildSoundKey = "playBrokenBuildSound";

  var settings = $('#config-interface');
  var filterField = $('#filter-field');
  var excludeField = $('#exclude-field');
  var selectedPipelinesField = $('#selected-pipelines');
  var repulsionFactorField = $('#repulsion-factor');
  var attractionFactorField = $('#attraction-factor');
  var preferencesField = $('#preferences');
  var rotateNonGreenTextField = $('#rotate-non-green-text');
  var playBrokenBuildSoundField = $('#play-broken-build-sound');

  function ccTrayUrlFromStorage() {
    return localStorage.getItem(cctrayUrlKey);
  }

  function cctrayUrlFromUI() {
    return $('#ci-url-text').val();
  }

  function focusOnCCTrayUrlTextfield() {
    $('#ci-url-text').focus();
  }

  function filterCriteriaFromStorage() {
    var v = localStorage.getItem(filterFieldKey);
    return _.isEmpty(v) ? ".*" : v;
  }

  function excludeCriteriaFromStorage() {
    return localStorage.getItem(excludeFieldKey) || "";
  }

  filterField.val(filterCriteriaFromStorage())

  excludeField.val(excludeCriteriaFromStorage())

  function getRepulsionFactorFromStorage() {
    var v = localStorage.getItem(repulsionFactorKey);
    return v ? parseInt(v) : 1;
  }

  function getAttractionFactorFromStorage() {
    var v = localStorage.getItem(attractionFactorKey);
    return v ? parseInt(v) / 100 : 0.01;
  }

  $('#preferences-control-btn').click(function (e) {
    e.preventDefault();
    settings.hide(150);
    preferencesField.toggle(250);
  });

  $('#settings-close-btn').click(function (e) {
    e.preventDefault();
    settings.hide();
  });


  $('#config').click(function (e) {
    e.preventDefault();
    showSettingsView();
  });


  repulsionFactorField.val(getRepulsionFactorFromStorage());

  attractionFactorField.val(getAttractionFactorFromStorage() * 100);

  repulsionFactorField.on("change mousemove", function () {
    localStorage.setItem(repulsionFactorKey, repulsionFactorField.val())
  });

  attractionFactorField.on("change mousemove", function () {
    localStorage.setItem(attractionFactorKey, attractionFactorField.val())
  });


  $('#settings-save-btn').click(function (e) {
    e.preventDefault();

    localStorage.setItem(filterFieldKey, filterField.val().trim());
    localStorage.setItem(excludeFieldKey, excludeField.val().trim());

    localStorage.setItem(cctrayUrlKey, cctrayUrlFromUI());

    var checked = $('#rotate-non-green-text').is(':checked');
    localStorage.setItem(rotateNonGreenTextKey, checked ? 'on' : 'off');

    settings.hide();

    location.reload();
  });

  function showFilteredList(names) {

    selectedPipelinesField.html('')

    if (_.isEmpty(names)) {
      return;
    }

    names.sort().forEach(function (n) {
      selectedPipelinesField.append('<label class="pipeline">' + n + '</label>')
    });

    selectedPipelinesField.show(250);
  }

  function searchNames() {

    var cctrayUrl = cctrayUrlFromUI();
    if (_.isEmpty(cctrayUrl)) {
      return;
    }

    showPipelinesToSelect(cctrayUrl, filterField.val().trim(), excludeField.val().trim());
  }


  filterField.on('keyup', $.debounce(searchNames, 300));
  excludeField.on('keyup', $.debounce(searchNames, 300));

  function showPipelinesToSelect(cctrayUrl, filterCriteria, excludeCriteria) {
    return repo.filteredPipelinesNames(cctrayUrl, filterCriteria, excludeCriteria)
      .then(showFilteredList)
      .then(function () {
        selectedPipelinesField.show(300)
      });
  }

  function onFail() {
    focusOnCCTrayUrlTextfield();
    filterField.hide(300);
    selectedPipelinesField.html('')
    selectedPipelinesField.hide();
  }


  function fetchPipelinesBtnSetup() {
    $('#ci-url-fetch-btn').click(function (e) {
      e.preventDefault();

      var cctrayUrl = cctrayUrlFromUI();
      showPipelinesToSelect(cctrayUrl)
        .fail(onFail);
    });
  }


  function rotateNonGreenTextSetup() {
    if (localStorage.getItem(rotateNonGreenTextKey) === 'off') {
      rotateNonGreenTextField.prop('checked', false)
    } else {
      localStorage.setItem(rotateNonGreenTextKey, 'on');
      rotateNonGreenTextField.prop('checked', true);
    }

    rotateNonGreenTextField.click(function () {
      var checked = rotateNonGreenTextField.is(':checked');
      localStorage.setItem(rotateNonGreenTextKey, checked ? 'on' : 'off');
    });
  }

  function soundsSetup() {
    if (localStorage.getItem(playBrokenBuildSoundKey) === 'off') {
      playBrokenBuildSoundField.prop('checked', false)
    } else {
      localStorage.setItem(playBrokenBuildSoundKey, 'on');
      playBrokenBuildSoundField.prop('checked', true);
    }

    playBrokenBuildSoundField.click(function () {
      var checked = playBrokenBuildSoundField.is(':checked');
      localStorage.setItem(playBrokenBuildSoundKey, checked ? 'on' : 'off');
    });

  }

  function showSettingsView() {
    preferencesField.hide(250);

    var cctrayUrl = localStorage.getItem(cctrayUrlKey);

    if (cctrayUrl) {
      $('#ci-url-text').val(localStorage.getItem(cctrayUrlKey));
      showPipelinesToSelect(cctrayUrl, filterCriteriaFromStorage(), excludeCriteriaFromStorage())
        .then(settings.show(200))
        .fail(function () {
          settings.show(onFail);
        })

    } else {
      settings.show(focusOnCCTrayUrlTextfield);
    }
  }

  fetchPipelinesBtnSetup();
  rotateNonGreenTextSetup();
  soundsSetup();


  return {
    rotateNonGreenText: function () {
      return localStorage.getItem(rotateNonGreenTextKey) === 'on';
    },
    cctrayUrl: ccTrayUrlFromStorage,
    pipelines: function () {
      return repo.pipelines(ccTrayUrlFromStorage(), filterCriteriaFromStorage(), excludeCriteriaFromStorage());
    },
    show: showSettingsView,
    repulsionFactor: getRepulsionFactorFromStorage,
    attractionFactor: getAttractionFactorFromStorage,
    playBrokenBuildSoundEnabled: function () {
      return localStorage.getItem(playBrokenBuildSoundKey) === 'on';
    }

  }

});