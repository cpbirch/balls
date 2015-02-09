define(['views/materials'], function (materials) {

  function generateRandomPosition() {
    var radians = 15;
    var phi = Math.random() * 2 * Math.PI;
    var theta = Math.random() * Math.PI;

    var position = new THREE.Vector3();
    position.set(radians * Math.sin(theta) * Math.cos(phi),
      radians * Math.sin(theta) * Math.sin(phi),
      radians * Math.cos(theta));

    return position;
  }

  function createSphere(scale, projectData) {
    var position = generateRandomPosition();

    var g = new THREE.IcosahedronGeometry(.5, 1);

    var material = materials(projectData);

    var mesh = new THREE.Mesh(g, material);
    mesh.position.copy(position);
    mesh.scale.set(scale, scale, scale);
    mesh.rotation.set(Math.random() * 2 * Math.PI, Math.random() * 2 * Math.PI, Math.random() * 2 * Math.PI);

    var rotationAxis = new THREE.Vector3(.5 - Math.random(), .5 - Math.random(), .5 - Math.random());
    rotationAxis.normalize();

    var rotationSpeed =.01 + .02 * Math.random();

    mesh.__rotateOnAxis = function() {
      mesh.rotateOnAxis(rotationAxis, rotationSpeed);
    };

    return mesh;
  }

  function create(projectData, scale) {
    var scaleFactor = 1 - (scale - 5) / 25;

    var originals = {
      attractionPosition: new THREE.Vector3(0, 0, 0),
      directionVelocity: 2. * ( 2. * ( .8 + .2 * scaleFactor ))
    };

    var sphere = createSphere(scale, projectData);

    $.extend(sphere, originals);

    return sphere;
  }

  return {
    create: create
  };
});