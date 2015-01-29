define([], function () {

  function request(endpoint, cctrayUrl, filter) {
    return $.get(endpoint, {url: cctrayUrl, filter: filter})
  }

  function filteredPipelinesNames(cctrayUrl, filter) {
    return request("/filternames", cctrayUrl, filter)
      .then(function (data) {
        return data.names;
      });
  }

  function pipelines(cctrayUrl, filter) {
    return request("/pipelines", cctrayUrl, filter)
  }

  return {
    filteredPipelinesNames: filteredPipelinesNames,
    pipelines: pipelines
  }

});