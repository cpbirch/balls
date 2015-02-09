define(['views/materials'], function(materials) {

  function update(sphere, pipelineData) {
    var ballColor = materials(pipelineData, {onlyBallColor: true});
    sphere.material.color = ballColor;
  }

  return update;

});