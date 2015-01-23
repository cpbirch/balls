define(['three'], function () {

  var camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 10000 );

  function defaultLocation(){
    return  {x: 0, y: 0, z: 200}
  };

  function moveCamera(to, duration) {
    new TWEEN.Tween(camera.position)
      .to(to, duration)
      .easing(TWEEN.Easing.Exponential.Out)
      .onUpdate(function() {
        camera.position.x = this.x || camera.position.x;
        camera.position.y = this.y || camera.position.y;
        camera.position.z = this.z || camera.position.z;
      })
      .start();
  }

  camera.position.z = defaultLocation().z;

  camera.target = new THREE.Vector3();
  camera.target.set( 0, 0, 0 );
  camera.___moveCamera = moveCamera;

  return camera;

});