function Box(boxElement, boxCount) {
  this.boxElement = boxElement;
  this.X_AXIS = 0;
  this.Y_AXIS = 0;
  this.BOX_ELEMENT_WIDTH = 600;
  this.BOX_ELEMENT_HEIGHT = 500;
  this.BOX_WIDTH = 40;
  this.BOX_HEIGHT = 40;
  this.boxCount = boxCount || 10;
  this.velocity = {
    dx: 2,
    dy: 2
  }
  this.rect = null;

  //creates img tag having class rect.
  this.setUpGame = function (index) {
    var rect = document.createElement('img');
    rect.setAttribute('class', 'rect');
    rect.setAttribute('id', index);
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
  var interval;
  var boxArray = [];
  this.boxElement = boxElement;
  this.BOX_ELEMENT_WIDTH = 600;
  this.BOX_ELEMENT_HEIGHT = 500;
  this.BOX_WIDTH = 40;
  this.BOX_HEIGHT = 40;
  this.boxCount = boxCount || 10;

  this.remove = function(id){
    boxArray.splice(id, 1);
    this.animateElements();
  }

  this.generateRandomElements = function () {
    for (var i = 0; i < this.boxCount; i++) {
      var box = new Box(boxElement, 10).setUpGame(i);
      this.X_AXIS = box.generateRandomNumber(this.BOX_WIDTH, this.BOX_ELEMENT_WIDTH - this.BOX_WIDTH);
      this.Y_AXIS = box.generateRandomNumber(this.BOX_WIDTH, this.BOX_ELEMENT_HEIGHT - this.BOX_HEIGHT);
      box.setCoordinates(this.X_AXIS, this.Y_AXIS);
      boxArray.push(box);
    }
    this.animateElements();
  }

  this.checkCollision = function (rect1, rect2) {
    if (rect1.X_AXIS < rect2.X_AXIS + rect2.BOX_WIDTH &&
      rect1.X_AXIS + rect1.BOX_WIDTH > rect2.X_AXIS &&
      rect1.Y_AXIS < rect2.Y_AXIS + rect2.BOX_HEIGHT &&
      rect1.Y_AXIS + rect1.BOX_HEIGHT > rect2.Y_AXIS) {
      return true;
    }
  }
   //this function moves every box in the main box
  this.animateElements = function () {
    clearInterval(interval);
    for (var i = 0; i < boxArray.length; i++) {
      boxArray[i].moveElements();

      for (var j = 0; j < boxArray.length; j++) {
        //one box to itself doesnot collide so continue.
        if (i == j) {
          continue;
        }
        //reverse direction 
        if(this.checkCollision(boxArray[i], boxArray[j])){
          boxArray[i].velocity.dx = -boxArray[i].velocity.dx ;
          boxArray[i].velocity.dy = -boxArray[i].velocity.dy ; 
          boxArray[j].velocity.dx = -boxArray[j].velocity.dx ;
          boxArray[j].velocity.dy = -boxArray[j].velocity.dy ;
        }
      }
    }
    interval=setInterval(this.animateElements.bind(this), 40);
  }
}

//start
var boxElement = document.getElementById('box-wrapper');
var game = new Game(boxElement, 10);
game.generateRandomElements();

var element = boxElement.getElementsByTagName('img');
for (var i = 0; i < element.length; i++) {
  element[i].addEventListener('click', function (e) {
    e.preventDefault();
    var id = e.target.parentNode.getAttribute('id');
    this.remove(e.target.parentNode);
    game.remove(id);
  })
}