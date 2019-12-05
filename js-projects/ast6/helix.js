var phase = 0;
var speed = 0.03;
var maxCircleRadius = 7;
var frameCount = 0;
var numRows = 10;
var numCols = 15;
var numWaves = 2; //waves
var y;

function draw() {
  // ctx.clearRect(83,112, canvas.width-165, canvas.height-219);
  ctx.clearRect(0,0, canvas.width, canvas.height);

  var x = 0
  var colOffset = 0;
  frameCount++;
  phase = frameCount * speed;

  for (var count = 0; count < numWaves; count++) {
    if (count === 0) {
      // phase gap
      var wavePhase = phase;
    } else {
      //like 0.03 + 2 * 3.14
      var wavePhase = phase + count * Math.PI ;
    }
    x = 0;
    for (var col = 0; col < numCols; col++) {
      //gap between the col
      x = x + 20 ;
      //wave of two shore 
      colOffset = (col * 2 * Math.PI) / 10;

      for (var row = 0; row < numRows; row += 1) {
        var y = canvas.height / 3 + row * 10 + Math.sin(wavePhase + colOffset) * 30;
        //sizeOffset changes the radius of the circle
        var sizeOffset = (Math.cos(wavePhase - (row * 0.1) + colOffset) + 1) * 0.5;
        var circleRadius = sizeOffset * maxCircleRadius;
        // var my_gradient = ctx.createLinearGradient('70deg', 'yellow','pink');

        ctx.beginPath();
        ctx.arc(x, y, circleRadius, 0, Math.PI * 2, false);
         // var grd=ctx.createLinearGradient(0,0,170,0);
         //  grd.addColorStop(0,colors);
         //  grd.addColorStop(1,"white");

         //  ctx.fillStyle=grd;
         //  ctx.fillRect(20,20,150,100);

        ctx.fillStyle = '#e17da4';    
        // '#ffae73'
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

setInterval(draw, 20);

//start
var canvas = document.getElementById('helix');
var ctx = canvas.getContext('2d');