define([], function () {

  function filteredPipelinesNames(cctrayUrl, filter) {
    return $.get("/filternames", {url: cctrayUrl, filter: filter})
      .then(function (data) {
        return data.names;
      });
  }

  function getGreenPipelines(cctrayUrl, filter) {
    return $.get("/successfulpipelines", {url: cctrayUrl, filter: filter})
  }

  function getNonGreenPipelines(cctrayUrl, filter) {
    return $.get("/nongreenpipelines", {url: cctrayUrl, filter: filter})
  }

  return {
    filteredPipelinesNames: filteredPipelinesNames,
    getGreenPipelines: getGreenPipelines,
    getNonGreenPipelines: getNonGreenPipelines
  }

});