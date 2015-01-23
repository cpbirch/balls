define(['settings'], function (settings) {

  var radius = 150;
  var angle = Math.PI * 1.5;
  var size = 500;

  function textMaterial(canvas) {
    var amap = new THREE.Texture(canvas);
    amap.needsUpdate = true;

    return new THREE.SpriteMaterial({
      map: amap,
      transparent: false,
      useScreenCoordinates: false,
      color: 0xffffff
    });
  }

  function createCanvas() {
    var canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;

    return canvas;
  }

  function setTextStyling(context) {
    context.font = '20pt Calibri';
    context.textAlign = 'center';
    context.fillStyle = 'white';
    context.lineWidth = 4;
  }

  function drawTextAlongArc(canvas, text) {
    var context = canvas.getContext('2d');

    setTextStyling(context);

    var x = size / 2;
    var y = size / 2;

    var numRadsPerLetter = Math.PI / text.length;
    context.save();
    context.translate(x,y);
    context.rotate(angle);

    for(var i=0;i<text.length;i++){
      context.save();
      context.rotate(i*numRadsPerLetter);

      context.fillText(text[i],0,-radius);
      context.restore();
    }
    context.restore();
    context.stroke();
  }

  function create(text) {
    var canvas = createCanvas();

    drawTextAlongArc(canvas, text);

    var mat = textMaterial(canvas);
    var sp = new THREE.Sprite(mat);

    sp.___rotate = function() {
      if (settings.rotateNonGreenText()) {
        sp.material.rotation -= 0.008;
      }
    }

    return sp;
  }

  return {
    create: create
  };

});