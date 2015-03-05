define(['views/camera', 'views/scene'], function (camera, scene) {

  var moveFn;
  var moveOffset = 0.5, originalMoveOffset = 0.5;
  var mesh;

  function init() {
    if (mesh) { return; }
    moveFn = function() {
      mesh.position.x += 2;
      moveUpDownFn();
      if (mesh.position.x > -300) {
        moveFn = moveRight;
      }
    };

    var texture = THREE.ImageUtils.loadTexture( '/images/cloud.png', null );
    texture.magFilter = THREE.LinearMipMapLinearFilter;
    texture.minFilter = THREE.LinearMipMapLinearFilter;

    var fog = new THREE.Fog( 0x4584b4, - 100, 1000 );

    var material = new THREE.ShaderMaterial( {

      uniforms: {

        "map": { type: "t", value: texture },
        "fogColor" : { type: "c", value: fog.color },
        "fogNear" : { type: "f", value: fog.near },
        "fogFar" : { type: "f", value: fog.far }

      },
      vertexShader: document.getElementById( 'dark-cloud-vs' ).textContent,
      fragmentShader: document.getElementById( 'dark-cloud-fs' ).textContent,
      depthWrite: false,
      depthTest: false,
      transparent: true

    } );

    var geometry = new THREE.Geometry();
    var plane = new THREE.Mesh( new THREE.PlaneGeometry( 64, 64 ) );

    for ( var i = 0; i < 800; i++ ) {

      plane.position.x = Math.random() * 1000 - 500;
      plane.position.y = - Math.random() * Math.random() * 200 - 50;
      plane.position.z = i;
      plane.rotation.z = Math.random() * Math.PI;
      plane.scale.x = plane.scale.y = Math.random() * Math.random() * 1.5 + 0.5;

      plane.updateMatrix();

      geometry.merge(plane.geometry, plane.matrix)
    }

    mesh = new THREE.Mesh( geometry, material );
    mesh.position.x = -1000;
    scene.add( mesh );
  }

  var moveUpDownFn = moveUp;
  var moveUpDownOffset = 1, orignalMoveUpDownOffset = 1;

  function moveUp() {
    mesh.position.y += moveUpDownOffset;

    if (mesh.position.y > 70) {
      if (moveUpDownOffset > 0) {
        moveUpDownOffset -= 0.1;
      } else {
        moveUpDownOffset = orignalMoveUpDownOffset;
        moveUpDownFn = moveDown;
      }
    }
  }

  function moveDown() {
    mesh.position.y -= moveUpDownOffset;

    if (mesh.position.y < -50) {
      if (moveUpDownOffset > 0) {
        moveUpDownOffset -= 0.1;
      } else {
        moveUpDownOffset = orignalMoveUpDownOffset;
        moveUpDownFn = moveUp;
      }
    }
  }

  function moveRight() {
    mesh.position.x += moveOffset;
    moveUpDownFn();
    if (mesh.position.x > 230) {
      if (moveOffset > 0) {
        moveOffset -= 0.1;
      } else {
        moveOffset = originalMoveOffset;
        moveFn = moveBack;
      }
    }
  }

  function moveBack() {
    mesh.position.z -= moveOffset;
    moveUpDownFn();
    if (mesh.position.z < 100) {
      if (moveOffset > 0) {
        moveOffset -= 0.1;
      } else {
        moveOffset = originalMoveOffset;
        moveFn = moveLeft;
      }
    }
  }

  function moveLeft() {
    mesh.position.x -= moveOffset;
    moveUpDownFn();
    if (mesh.position.x < -200) {
      if (moveOffset > 0) {
        moveOffset -= 0.1;
      } else {
        moveOffset = originalMoveOffset;
        moveFn = moveForward;
      }
    }
  }

  function moveForward() {
    mesh.position.z += moveOffset;
    moveUpDownFn();
    if (mesh.position.z > 100) {
      if (moveOffset > 0) {
        moveOffset -= 0.1;
      } else {
        moveOffset = originalMoveOffset;
        moveFn = moveRight;
      }
    }
  }

  function disperse() {
    if (mesh) {
      mesh.position.y -= 1.8;
      if (mesh.position.y < -200) {
        scene.remove(mesh);
        mesh = null;
      }
    }
  }

  function animate(cloudsEnabled) {
    if (cloudsEnabled) {
      init();
    } else {
      moveFn = disperse;
    }
    moveFn();
  }

  return {
    init: init,
    animate: animate
  }
});