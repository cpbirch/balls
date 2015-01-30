define([], function () {

  function request(endpoint, cctrayUrl, filter, exclude) {
    return $.get(endpoint, {url: cctrayUrl, select: filter, exclude: exclude})
  }

  function filteredPipelinesNames(cctrayUrl, filter, exclude) {
    return request("/filternames", cctrayUrl, filter, exclude)
      .then(function (data) {
        return data.names;
      });
  }

  function pipelines(cctrayUrl, filter, exclude) {
    return request("/pipelines", cctrayUrl, filter, exclude)
  }

  return {
    filteredPipelinesNames: filteredPipelinesNames,
    pipelines: pipelines
  }

});