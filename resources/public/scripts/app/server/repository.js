define([], function () {

  var pipelinesUrl = "/pipelines";

  //_.keys(data).forEach(function(name){
  //  if (!_.isEmpty(selectedPipelinesNames) && !_.contains(selectedPipelinesNames, name)) {
  //    delete data[name];
  //  }
  //});


  function getPipelines(cctrayUrl) {
    return $.get(pipelinesUrl, {url: cctrayUrl})
            .then(function (data) {
                    return _.indexBy(data.projects, "name");
                  });

    // todo: need to select on selected-pipelines
  }

  return {
    getPipelines: getPipelines
  }

});