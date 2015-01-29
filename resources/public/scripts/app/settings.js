define(['repository', 'jquery', 'debounce'], function (repo) {

  var cctrayUrlKey = "cctrayUrl";
  var rotateNonGreenTextKey = "rotateNonGreenText";
  var selectedPipelineNamesKey = "selectedPipelineNames";
  var filterFieldKey = "filterField";
  var repulsionFactorKey = "repulsionFactor";
  var attractionFactorKey = "attractionFactor";

  var settings = $('#control-interface');
  var filterField = $('#filter-field');
  var selectedPipelinesField = $('#selected-pipelines');
  var repulsionFactorField = $('#repulsion-factor');
  var attractionFactorField = $('#attraction-factor');

  function ccTrayUrlFromStorage() {
    return localStorage.getItem(cctrayUrlKey);
  }

  function cctrayUrlFromUI() {
    return $('#ci-url-text').val();
  }

  function focusOnCCTrayUrlTextfield() {
    $('#ci-url-text').focus();
  }

  function getSelectedPipelineNames() {
    return JSON.parse(localStorage.getItem(selectedPipelineNamesKey));
  }

  function filterCriteriaFromStorage() {
    var v = localStorage.getItem(filterFieldKey);
    return _.isEmpty(v) ? ".*" : v;
  }

  if (filterCriteriaFromStorage()) {
    filterField.val(filterCriteriaFromStorage())
  }

  function getRepulsionFactorFromStorage() {
    var v = localStorage.getItem(repulsionFactorKey);
    return v ? parseInt(v) : 1;
  }

  function getAttractionFactorFromStorage() {
    var v = localStorage.getItem(attractionFactorKey);
    return v ? parseInt(v) / 100 : 0.01;
  }


  $('#settings-close-btn').click(function (e) {
    e.preventDefault();
    settings.hide();
  });

  filterField.val(filterCriteriaFromStorage())

  $('#controls').click(function (e) {
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

    localStorage.setItem(cctrayUrlKey, cctrayUrlFromUI());

    var checked = $('#rotate-non-green-text').is(':checked');
    localStorage.setItem(rotateNonGreenTextKey, checked ? 'on' : 'off');

    var selectedPipelineNames = $('#selected-pipelines .pipeline').map(function () {
      return $(this).text()
    }).get();

    var names = JSON.stringify(selectedPipelineNames);

    localStorage.setItem(selectedPipelineNamesKey, names);

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


  filterField.on('keyup', $.debounce(function () {
    var val = filterField.val().trim();
    var cctrayUrl = cctrayUrlFromUI();
    if (_.isEmpty(val) || _.isEmpty(cctrayUrl)) {
      return;
    }

    showPipelinesToSelect(cctrayUrl, val);
  }, 300));

  function showPipelinesToSelect(cctrayUrl, filterCriteria) {
    return repo.filteredPipelinesNames(cctrayUrl, filterCriteria)
      .then(showFilteredList)
      .then(function() {selectedPipelinesField.show(300)});
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
      $('#rotate-non-green-text').prop('checked', false)
    } else {
      localStorage.setItem(rotateNonGreenTextKey, 'on');
      $('#rotate-non-green-text').prop('checked', true);
    }

    $('#rotate-non-green-text').click(function () {
      var checked = $('#rotate-non-green-text').is(':checked');
      localStorage.setItem(rotateNonGreenTextKey, checked ? 'on' : 'off');
    });
  }

  function showSettingsView() {
    var cctrayUrl = localStorage.getItem(cctrayUrlKey);

    if (cctrayUrl) {
      $('#ci-url-text').val(localStorage.getItem(cctrayUrlKey));
      showPipelinesToSelect(cctrayUrl, filterCriteriaFromStorage())
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


  return {
    rotateNonGreenText: function () {
      return localStorage.getItem(rotateNonGreenTextKey) === 'on';
    },
    getPipelines: function() {
      var cctrayUrl = ccTrayUrlFromStorage();
      if (!_.isEmpty(cctrayUrl)) {
        return repo.getPipelines(cctrayUrl, filterCriteriaFromStorage());
      }

    },
    show: showSettingsView,
    repulsionFactor: getRepulsionFactorFromStorage,
    attractionFactor: getAttractionFactorFromStorage

  }

});