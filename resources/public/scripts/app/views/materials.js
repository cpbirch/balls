define(['utils/pipelineStatus', 'text!shaders/ballsVertex.shader', 'text!shaders/ballsFragment.shader', 'three'],
  function (pipelineStatus, vertexShader, fragmentShader) {

  var colors = {
    green: 0, yellow: 1, red: 2, sleeping: 3
  };

  function ballColor(pipelineData) {
    var color = colors.green;

    var status = pipelineStatus(pipelineData);

    if (status.isBuilding) {
      color = colors.yellow;
    } else if (status.isBroken) {
      color = colors.red;
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