define(['store', 'repository', 'jquery'], function (store, repo) {

  var cctrayUrlStoreKey = "cctrayUrl";
  var filterFieldStoreKey = "filterField";
  var excludeFieldStoreKey = "excludeField";

  var settings = $('#config-interface');
  var filterField = $('#filter-field');
  var excludeField = $('#exclude-field');
  var selectedPipelinesField = $('#selected-pipelines');
  var cctrayField = $('#ci-url-text');

  function getccTrayUrl() { return store.get(cctrayUrlStoreKey) || cctrayField.val(); }

  function getFilterCriteria() { return store.get(filterFieldStoreKey) || filterField.val(); }

  function getExcludeCriteria() { return store.get(excludeFieldStoreKey) || excludeField.val(); }

  function onFail() {
    cctrayField.focus();
    selectedPipelinesField.html('')
  }

  (function setConfigValues() {

    var setVal = function(storageKey, field) {
      var valFromStorage = store.get(storageKey);

      if (!_.isEmpty(valFromStorage)) {
        field.val(valFromStorage);
      } else {
        store.save(storageKey, field.val().trim())
      }
    };


    if (cctrayField.length == 0) {
      store.remove(cctrayUrlStoreKey);
    } else {
      setVal(cctrayUrlStoreKey, cctrayField);
    }

    setVal(filterFieldStoreKey, filterField);
    setVal(excludeFieldStoreKey, excludeField);
  })();

  (function bindEvents() {

    $('#settings-close-btn').on('click', function () { settings.hide(); });

    $('#config').on('click', show);

    [filterField, excludeField].forEach(function(f) {
      f.on('keyup', _.debounce(searchNames, 300));
    });

    $('#ci-url-fetch-btn').on('click', function() {
      showPipelinesToSelect(cctrayField.val(), filterField.val(), excludeField.val()).fail(onFail);
    });

    $('#settings-reset-btn').on('click', function() {
      store.clear();
      location.reload();
    });

    $('#settings-save-btn').on('click', function () {
      store.save(filterFieldStoreKey, filterField.val().trim());
      store.save(excludeFieldStoreKey, excludeField.val().trim());

      if (cctrayField.length > 0) {
        store.save(cctrayUrlStoreKey, cctrayField.val());
      }

      settings.hide();
      location.reload();
    });
  })();

  function showFilteredList(names) {
    selectedPipelinesField.html('');
    if (_.isEmpty(names)) { return; }

    var appendName = function(name) { selectedPipelinesField.append('<label class="pipeline">' + name + '</label>') };
    names.sort().forEach(appendName);
    selectedPipelinesField.show(250);
  }

  function showPipelinesToSelect(cctrayUrl, filterCriteria, excludeCriteria) {
    return repo.filteredPipelinesNames(cctrayUrl, filterCriteria, excludeCriteria)
      .then(showFilteredList)
      .then(function () {
        selectedPipelinesField.show(300)
      });
  }

  function searchNames() {
    var cctrayUrl = cctrayField.val();
    if (!_.isEmpty(cctrayUrl)) {
      showPipelinesToSelect(cctrayUrl, filterField.val(), excludeField.val());
    }
  }

  function show() {
    var cctrayUrl = getccTrayUrl();

    if (_.isEmpty(cctrayUrl)) {
      settings.show(200);
      cctrayField.focus();
    } else {
      showPipelinesToSelect(cctrayUrl, getFilterCriteria(), getExcludeCriteria())
        .then(settings.show(200))
        .fail(function () {
          settings.show(onFail);
        })
    }
  }

  return {
    cctrayUrl: function() { return store.get(cctrayUrlStoreKey); },
    show: show,
    pipelines: function () {
      return repo.pipelines(store.get(cctrayUrlStoreKey), store.get(filterFieldStoreKey), store.get(excludeFieldStoreKey));
    }

  };

});