define(['repository', 'jquery', 'debounce'], function (repo) {

  var cctrayUrlKey = "cctrayUrl";
  var rotateNonGreenTextKey = "rotateNonGreenText";
  var filterFieldKey = "filterField";
  var excludeFieldKey = "excludeField";
  var repulsionFactorKey = "repulsionFactor";
  var attractionFactorKey = "attractionFactor";
  var playBrokenBuildSoundKey = "playBrokenBuildSound";

  var allStorageKeys = [
    cctrayUrlKey, rotateNonGreenTextKey, filterFieldKey,
    excludeFieldKey, repulsionFactorKey, attractionFactorKey,
    playBrokenBuildSoundKey
  ];

  var settings = $('#config-interface');
  var filterField = $('#filter-field');
  var excludeField = $('#exclude-field');
  var selectedPipelinesField = $('#selected-pipelines');
  var repulsionFactorField = $('#repulsion-factor');
  var attractionFactorField = $('#attraction-factor');
  var preferencesField = $('#preferences');
  var rotateNonGreenTextField = $('#rotate-non-green-text');
  var playBrokenBuildSoundField = $('#play-broken-build-sound');
  var cctrayField = $('#ci-url-text');
  var preferencesControlBtn = $('#preferences-control-btn');
  var settingsCloseBtn = $('#settings-close-btn');
  var configBtn = $('#config');
  var pipelinesFetchBtn = $('#ci-url-fetch-btn');
  var settingsSaveBtn = $('#settings-save-btn');
  var settingsResetBtn = $('#settings-reset-btn');

  function fromStore(key) {
    return localStorage.getItem(key);
  }

  function store(key, val) {
    localStorage.setItem(key, val);
  }

  function checkedToStoreVal(jqElm) {
    return jqElm.is(':checked') ? 'on' : 'off';
  }

  function getFilterCriteria() {
    return fromStore(filterFieldKey) || filterField.val();
  }

  function getExcludeCriteria() {
    return fromStore(excludeFieldKey) || excludeField.val();
  }

  function getccTrayUrl() {
    var val = fromStore(cctrayUrlKey) || cctrayField.val().trim();

    if (!_.isEmpty(val)) {
      return val;
    }
  }

  function getRepulsionFactor() {
    var v = fromStore(repulsionFactorKey);
    return v ? parseInt(v) : 1;
  }

  function getAttractionFactor() {
    var v = fromStore(attractionFactorKey);
    return v ? parseInt(v) / 100 : 0.01;
  }

  function focusOnCCTrayUrlTextfield() {
    cctrayField.focus();
  }

  function bindEvents() {

    var bindEvent = function(event, jqElm, cb) {
      jqElm.bind(event, function (e) {
        e.preventDefault();
        cb();
      })
    };

    var bindClickEvent = function(jqElm, cb) {
      bindEvent('click', jqElm, cb);
    };

    bindClickEvent(preferencesControlBtn, function () {
      settings.hide(150);
      preferencesField.toggle(250);
    });

    bindClickEvent(settingsCloseBtn, function () {
      settings.hide();
    });

    bindClickEvent(configBtn, showSettingsView);

    bindEvent('change mousemove', repulsionFactorField, function () {
      store(repulsionFactorKey, repulsionFactorField.val());
    });

    bindEvent('change mousemove', attractionFactorField, function () {
      store(attractionFactorKey, attractionFactorField.val());
    });

    bindEvent('keyup', filterField, $.debounce(searchNames, 300));
    bindEvent('keyup', excludeField, $.debounce(searchNames, 300));

    bindClickEvent(pipelinesFetchBtn, function() {
      showPipelinesToSelect(cctrayField.val(), filterField.val(), excludeField.val()).fail(onFail);
    });

    bindClickEvent(playBrokenBuildSoundField, function () {
      store(playBrokenBuildSoundKey, checkedToStoreVal(playBrokenBuildSoundField));
    });

    bindClickEvent(rotateNonGreenTextField, function () {
      store(rotateNonGreenTextKey, checkedToStoreVal(rotateNonGreenTextField));
    });

    bindClickEvent(settingsResetBtn, function() {
      allStorageKeys.forEach(function(key) {
        localStorage.removeItem(key);
      });

      location.reload();
    });

    bindClickEvent(settingsSaveBtn, function () {
      store(filterFieldKey, filterField.val().trim());
      store(excludeFieldKey, excludeField.val().trim());
      store(cctrayUrlKey, cctrayField.val());
      store(rotateNonGreenTextKey, checkedToStoreVal(rotateNonGreenTextField));

      settings.hide();

      location.reload();
    });

  }

  function setFieldValues() {

    var setVal = function(storageKey, field) {
      var valFromStorage = fromStore(storageKey);



      if (!_.isEmpty(valFromStorage)) {
        field.val(valFromStorage);
      } else {
        store(storageKey, field.val().trim())
      }
    };

    setVal(cctrayUrlKey, cctrayField);
    setVal(filterFieldKey, filterField);
    setVal(excludeFieldKey, excludeField);

    repulsionFactorField.val(getRepulsionFactor());
    attractionFactorField.val(getAttractionFactor() * 100);

    if (fromStore(rotateNonGreenTextKey) === 'off') {
      rotateNonGreenTextField.prop('checked', false)
    }

    if (fromStore(playBrokenBuildSoundKey) === 'off') {
      playBrokenBuildSoundField.prop('checked', false)
    }
  }

  function showFilteredList(names) {

    selectedPipelinesField.html('')

    if (_.isEmpty(names)) {
      return;
    }

    var appendName = function(name) {
      selectedPipelinesField.append('<label class="pipeline">' + name + '</label>')
    };

    names.sort().forEach(appendName);

    selectedPipelinesField.show(250);
  }

  function searchNames() {

    var cctrayUrl = cctrayField.val();

    if (_.isEmpty(cctrayUrl)) {
      return;
    }

    showPipelinesToSelect(cctrayUrl, filterField.val().trim(), excludeField.val().trim());
  }

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

  function showSettingsView() {
    preferencesField.hide(250);

    var cctrayUrl = getccTrayUrl();

    if (cctrayUrl) {
      showPipelinesToSelect(cctrayUrl, getFilterCriteria(), getExcludeCriteria())
        .then(settings.show(200))
        .fail(function () {
          settings.show(onFail);
        })

    } else {
      settings.show(focusOnCCTrayUrlTextfield);
    }
  }

  setFieldValues();
  bindEvents();


  return {
    cctrayUrl: function() { return fromStore(cctrayUrlKey); },
    show: showSettingsView,
    repulsionFactor: getRepulsionFactor,
    attractionFactor: getAttractionFactor,

    rotateNonGreenText: function () {
      return fromStore(rotateNonGreenTextKey) === 'on';
    },

    pipelines: function () {
      return repo.pipelines(fromStore(cctrayUrlKey), fromStore(filterFieldKey), fromStore(excludeFieldKey));
    },

    playBrokenBuildSoundEnabled: function () {
      return fromStore((playBrokenBuildSoundKey)) === 'on';
    }

  }

});