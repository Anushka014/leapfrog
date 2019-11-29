function Box(boxElement, boxCount) {
  this.boxElement = boxElement;
  this.X_AXIS = 0;
  this.Y_AXIS = 0;
  this.BOX_ELEMENT_WIDTH = 600;
  this.BOX_ELEMENT_HEIGHT = 500;
  this.BOX_WIDTH = 30;
  this.BOX_HEIGHT = 30;
  this.boxCount = boxCount || 10;
  this.velocity = {
    dx: 2,
    dy: 2
  }
  this.rect = null;
  var that = this;

  //creates img tag having class rect.
  this.setUpGame = function () {
    var rect = document.createElement('img');
    rect.setAttribute('class', 'rect');
    // rect.setAttribute('id', index);
    rect.setAttribute('src', 'images/ant.png');
    this.boxElement.appendChild(rect);
    rect.style.width = this.BOX_WIDTH + 'px';
    rect.style.height = this.BOX_HEIGHT + 'px';
    this.rect = rect;
    return this;
  }

  this.setCoordinates = function (x, y) {
    this.X_AXIS = x;
    this.Y_AXIS = y;
  }

  this.setPosition = function () {
    this.rect.style.left = this.X_AXIS + 'px';
    this.rect.style.top = this.Y_AXIS + 'px';
  }

  // this.animateElements.onclick = function(e) {
  //     console.log((e.target.style.display = 'none'));
  // };

  //condition to limit the box inside the wrapper.

  this.moveElements = function () {
    if ((this.X_AXIS + this.BOX_WIDTH + this.velocity.dx) > this.BOX_ELEMENT_WIDTH || (this.X_AXIS + this.velocity.dx) < 0) {
      this.velocity.dx = -this.velocity.dx;
    }
    if ((this.Y_AXIS + this.BOX_HEIGHT + this.velocity.dy) > this.BOX_ELEMENT_HEIGHT || (this.Y_AXIS + this.velocity.dy) < 0) {
      this.velocity.dy = -this.velocity.dy;
    }
    this.X_AXIS += this.velocity.dx;
    this.Y_AXIS += this.velocity.dy;
    this.setPosition();
  }

//math.floor returns the largest integer. and math.random generates random number upto its last max but doesnot include max number.
  this.generateRandomNumber = function (min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }
}

function Game(boxElement, boxCount) {
  var boxArray = [];
  this.boxElement = boxElement;
  this.BOX_ELEMENT_WIDTH = 600;
  this.BOX_ELEMENT_HEIGHT = 500;
  this.BOX_WIDTH = 30;
  this.BOX_HEIGHT = 30;
  this.boxCount = boxCount || 10;

  this.generateRandomElements = function () {

    for (var i = 0; i < this.boxCount; i++) {
      var box = new Box(boxElement, 10).setUpGame();
      this.X_AXIS = box.generateRandomNumber(this.BOX_WIDTH, this.BOX_ELEMENT_WIDTH - this.BOX_WIDTH);
      this.Y_AXIS = box.generateRandomNumber(this.BOX_WIDTH, this.BOX_ELEMENT_HEIGHT - this.BOX_HEIGHT);
      box.setCoordinates(this.X_AXIS, this.Y_AXIS);
      boxArray.push(box);
    }
    setInterval(this.animateElements.bind(this), 10);
  }

  // this.calculateDistance = function (x1, y1, x2, y2) {
  //   return (x2 - (x1 + this.BOX_WIDTH)) + (y2 - y1);
  // }

  this.checkCollision = function (rect1, rect2) {
    if (rect1.X_AXIS < rect2.X_AXIS + rect2.BOX_WIDTH &&
      rect1.X_AXIS + rect1.BOX_WIDTH > rect2.X_AXIS &&
      rect1.Y_AXIS < rect2.Y_AXIS + rect2.BOX_HEIGHT &&
      rect1.Y_AXIS + rect1.BOX_HEIGHT > rect2.Y_AXIS) {

        if(rect2.X_AXIS-rect1.X_AXIS- rect1.BOX_WIDTH <= 0){
          rect1.velocity.dx = -rect1.velocity.dx;
          rect1.velocity.dy = rect1.velocity.dy;
          rect2.velocity.dx = rect2.velocity.dx;
          rect2.velocity.dy = rect2.velocity.dy;
        }
        if(rect2.Y_AXIS-rect1.Y_AXIS-rect1.BOX_HEIGHT <= 0){
          rect1.velocity.dx = rect1.velocity.dx;
          rect1.velocity.dy = -rect1.velocity.dy;
          rect2.velocity.dx = rect2.velocity.dx;
          rect2.velocity.dy = rect2.velocity.dy;
        }
    }
  }
   //this function moves every box in the main box
  this.animateElements = function () {
    for (var i = 0; i < this.boxCount; i++) {
      boxArray[i].moveElements();

      for (var j = 0; j < this.boxCount; j++) {
        if (i == j) {
          continue;
        }
        this.checkCollision(boxArray[i], boxArray[j]);
        
      }
    }
  }
}

//start
var boxElement = document.getElementById('box-wrapper');
new Game(boxElement, 10).generateRandomElements();
// var element = boxElement.getElementsByTagName('img');
// for (var i = 0; i < element.length; i++) {
//   element[i].addEventListener('click', function (e) {
//     e.preventDefault();
//     var id = e.target.parentNode.getAttribute('id');
//     console.log(id);
//     game.remove(id);
//     this.remove(e.target.parentNode);

//   })
// }