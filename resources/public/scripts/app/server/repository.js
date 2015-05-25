define(['settings'], function (settings) {

  function filteredPipelinesNames(cctrayUrl, filter, exclude) {
    return $.get("/filternames", {url: cctrayUrl, select: filter, exclude: exclude})
      .then(function (data) {
        return data.names;
      });
  }

  function pipelines(cctrayUrl, filter, exclude) {
    return $.get("/pipelines", {
      url: cctrayUrl,
      select: filter,
      exclude: exclude,
      "red-alert-threshold": settings.redAlertThreshold(),
      "glitch-effect-threshold": settings.glitchEffectThreshold(),
      timeout: 3000
    }).fail(function() {
      $('#error-overlay')
          .html("<span>Unable to fetch information from: </span>" + "<span>" + cctrayUrl +"</span>")
          .addClass("error-alert")
          .show(300);
    }).done(function() {
      $('#error-overlay').hide(300);
    });
  }

  return {
    filteredPipelinesNames: filteredPipelinesNames,
    pipelines: pipelines
  }

});