define(['views/scene', 'three'], function(scene){

  function directionalLight() {
    var light = new THREE.DirectionalLight( 0xffffff , 1.3);
    light.position.set( 300, 1000, 500 );
    light.target.position.set( 0, 0, 0 );
    light.castShadow = true;
    light.shadowCameraNear = 500;
    light.shadowCameraFar = 1600;
    light.shadowCameraFov = 70;
    light.shadowBias = 0.0001;
    light.shadowDarkness = 0.7;
    light.shadowMapWidth = light.shadowMapHeight = 1024;

    return light;
  }

  [
    new THREE.AmbientLight( 0x3D4143 ),
    directionalLight()
  ].forEach(function(light) {
    scene.add(light);
  });

});