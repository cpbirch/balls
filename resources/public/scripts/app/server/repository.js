define([], function () {

  function getPipelines(cctrayUrl, filter) {
    return $.get("/pipelines", {url: cctrayUrl, filter: filter})
      .then(function (data) {
        return data.projects;
      });
  }

  function filteredPipelinesNames(cctrayUrl, filter) {
    return $.get("/filternames", {url: cctrayUrl, filter: filter})
      .then(function (data) {
        return data.names;
      });
  }

  return {
    getPipelines: getPipelines,
    filteredPipelinesNames: filteredPipelinesNames
  }

});