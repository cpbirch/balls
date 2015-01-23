define(['views/materials'], function(materials) {

  function update(sphere, pipelineData) {
    var verticesCount = sphere.geometry.vertices.length;
    var ballColor = materials(pipelineData, verticesCount, {onlyBallColor: true});

    for (var i = 0; i < verticesCount; i++) {
      sphere.material.attributes.fragmentColor.value[i] = ballColor;
    }

    sphere.material.attributes.fragmentColor.needsUpdate = true;
  }

  return update;

});