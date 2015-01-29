define(['text!shaders/ballsVertex.shader', 'text!shaders/ballsFragment.shader', 'three'],
  function (vertexShader, fragmentShader) {

  var colors = {
    green: 0, yellow: 1, red: 2, sick_building: 3, sleeping: 4
  };

  function ballColor(pipelineData) {
    var color = colors.green;

    var buildStatus = pipelineData.prognosis;

    if (buildStatus === "healthy-building") {
      color = colors.yellow;
    } else if (buildStatus === "sick") {
      color = colors.red;
    } else if (buildStatus === "sick-building") {
      color = colors.sick_building;
    }

    return color;
  }

  function pipelineMaterial(pipelineData, verticesCount, options) {
    var fragmentShaderColor = ballColor(pipelineData);
    options = options || {};

    if (options.onlyBallColor) {
      return fragmentShaderColor;
    }

    var fragmentColorValues = [];
    while(verticesCount--) fragmentColorValues[verticesCount] = fragmentShaderColor;

    return new THREE.ShaderMaterial({
      uniforms: {
        positions: {type: 'v3v', value: null},
        scales: {type: 'fv1', value: null}
      },
      attributes: {
        fragmentColor: {
          type: 'f',
          value: fragmentColorValues
        }
      },
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      shading: THREE.FlatShading
    });
  }

  return pipelineMaterial;
});