
function CarGame(playButton, gameContainer, scoreBoard, highestScore) {
  this.playButton = playButton;
  this.gameContainer = gameContainer;
  this.scoreBoard = scoreBoard;
  this.highestScore = highestScore;
  this.opponent = null;
  this.playGame = null;
  //it access the highest key and returns the value as string.
  this.highest = window.localStorage.getItem('highest') || 0;
  this.frames = 0;
  this.countTime = 2;
  this.car;
  this.canPlayGame = false;
  //lane position.
  this.opponentPositionArray = [80, 230, 380];
  this.obstacleBackgroundArray = ['images/car1.png', 'images/car1.png', 'images/car1.png'];
  this.obstacleArray = [];
  this.increaseDifficulty = true;
  this.playerCar = {
    xPosition: 230,//left
    yPosition: 490 //top
  };
  this.obstacleCar = {
    xPosition: Math.random()-0.5,
    yPosition: -1*(Math.floor(Math.random()*100))
  };
  this.yPosition = [-100, -100, -100];
  this.animFrame; 
  var setUpGameContainer;
  var that = this;

  //first step
  this.playButton.onclick = function (e) {
    if (that.canPlayGame) {
      return;
    }
    that.canPlayGame = true;
    that.highestScore.innerHTML = that.highest;
    setUpGameContainer = new SetUpGameContainer(that.gameContainer);
    setUpGameContainer.animateBackground();
    that.startGame();
  }
  //creates div for opponent car.
  this.setupGameAssets = function () {
    var opponent = document.createElement('div');
    opponent.setAttribute('class', 'opponent');
    this.gameContainer.appendChild(opponent);
    return opponent;
  }

  //sets the opponent car background pixel.
  this.drawGameAssets = function (i) {
    var yPosition = -100;
    var obstacle = this.setupGameAssets();
    obstacle.style.background = 'url("' + this.obstacleBackgroundArray[i] + '")';
    obstacle.style.left = this.opponentPositionArray[i] + 'px';
    obstacle.style.top = yPosition + 'px';
    this.obstacleArray.push(obstacle);
  }

  //if  opponent pass the lane frame increases with 1 point.
  this.updateGameAssets = function (opponent, i) {
    if (this.yPosition[i] >= 560) {
      this.frames++;
      //increases the speed when frame is more than 10 .
      this.increaseDifficulty = true;
      var random = -1 * (Math.floor(Math.random() * 500 + 500));
      this.yPosition[i] = random;
      this.scoreBoard.innerHTML = this.frames;
    }
    if (this.frames % 10 == 0 && this.increaseDifficulty && this.frames!==50) {
      this.countTime += 0.5;
      this.increaseDifficulty=false;  
    }
    this.yPosition[i] += this.countTime;
    opponent.style.top = this.yPosition[i] + 'px';
  }

  //4th
  this.animateGameAssets = function () {
    //returns random integer from 0 to 269.
    var random = Math.floor(Math.random() * 270) + 100;
    // opponent car ending point is animframe.
    this.animFrame = requestAnimationFrame(this.animateGameAssets.bind(this));
    //delays each opponent car.
    if (this.animFrame % random == 0 && this.obstacleArray.length < 3 && Math.random() < 1) {
      this.drawGameAssets(this.obstacleArray.length);
    }
    //obstacle car x position value 
    for (var i = 0; i < this.obstacleArray.length; i++) {
      this.obstacleCar.xPosition = this.opponentPositionArray[i];
      this.updateGameAssets(this.obstacleArray[i], i);

      if (this.checkCollision(i)) {
        if (this.frames > this.highest) {
          window.localStorage.setItem('highest', that.frames);
        }
        this.playGame.resetGame();
      }
    }
  }

  this.checkCollision = function (i) {
    if (this.playerCar.xPosition < this.obstacleCar.xPosition + 90 &&
      this.playerCar.xPosition + 90 > this.obstacleCar.xPosition &&
      this.playerCar.yPosition < this.yPosition[i] + 90 &&
      this.playerCar.yPosition + 90 > this.yPosition[i]) {
      return true;
    }
  }
  //3rd step
  this.startGame = function () {
    if (this.canPlayGame) {
      this.animateGameAssets();
      this.car = setUpGameContainer.positionPlayerCar();
      this.playGame = new PlayGame(this.car, setUpGameContainer, this);
    }
  }
}

function PlayGame(player, setUpGameContainer, carGame) {
  this.player = player;
  this.boostObject = null;
  this.setUpGameContainer = setUpGameContainer;
  this.carGame = carGame;
  this.isCrashed = false;
  this.bulletObject = null;
  this.bulletPosition = {
    yPosition: 490
  }
  this.boostPosition = {
    xPosition: 0,
    yPosition: 0
  }
  this.boostYPos = [0, 0, 0];
  this.bulletArray = [];
  this.maximumAmmo = 20;
  this.bulletCount = this.maximumAmmo;
  this.aniFrame = null;
  this.boostArray = [];
  var that = this;
  var f;
  document.onkeydown = function (e) {
    if (!that.isCrashed) {
      switch (e.which) {
        case 65:
          that.carGame.playerCar.xPosition -= 150;
          break;
        case 68:
          that.carGame.playerCar.xPosition += 150;
          break;
        case 32:
          that.fireBullets();
            break;
      }
      that.isCrashed = that.movePlayer(that.carGame.playerCar.xPosition);
    if (that.isCrashed) {
        that.isCrashed = false;
        if (that.carGame.playerCar.xPosition > 450) {
          that.carGame.playerCar.xPosition -= 150;
        }
    else {
      that.carGame.playerCar.xPosition += 150;
    }
  }
}
}

  this.loadBullets = function () {
    var bullet = document.createElement('div');
    bullet.setAttribute('class', 'bullet');
    bullet.style.background = 'url("images/bullet.png")';
    bullet.style.top = this.bulletPosition.yPosition + 'px';
    bullet.style.left = this.carGame.playerCar.xPosition + 20 + 'px';
    this.setUpGameContainer.gameContainer.appendChild(bullet);
    return bullet;
  }
  this.fireBullets = function () {
    if (this.bulletCount !== 0) {
      this.bulletCount--;
      this.bulletPosition.yPosition = 503;
      var bulletObject = this.loadBullets();
      this.bulletObject = bulletObject;
      this.moveBullets();
    }
  }
  this.updateBulletPosition = function () {
    this.bulletPosition.yPosition -= 3;
    this.bulletObject.style.top = this.bulletPosition.yPosition + 'px';
  }

  this.moveBullets = function () {
    this.updateBulletPosition();
    this.aniFrame=requestAnimationFrame(this.moveBullets.bind(this));
    for (var i = 0; i < this.carGame.obstacleArray.length ; i++) {
      // console.log(this.carGame.playerCar.xPosition,this.bulletPosition.yPosition);
      if (this.carGame.playerCar.xPosition === this.carGame.opponentPositionArray[i]) {
        // console.log(i,this.bulletPosition.yPosition);
        if (this.checkBulletCollision(i, this.bulletPosition.yPosition)) {
          this.carGame.obstacleArray[i].display='none';
          this.carGame.yPosition[i] = -1*Math.floor(Math.random()*300+200);
          this.bulletObject.remove();
          cancelAnimationFrame(that.aniFrame);
          break;
        }
      }
    }
  }
   this.checkBulletCollision = function (i, y) {

    if (y <= this.carGame.yPosition[i] + 90 && y + 27 > this.carGame.yPosition[i]) {
      // console.log("collided");
      return true;
    }
  }
  this.generateRandomBoosters = function (i) {
    this.boostPosition.yPosition = Math.floor(Math.random() * 605);
    var boost = document.createElement('div');
    boost.setAttribute('class', 'boost');
    boost.style.background = 'url("images/coin.png")';
    boost.style.left = this.carGame.opponentPositionArray[i] +'px';
    boost.style.top = this.boostPosition.yPosition + 'px';
    this.carGame.gameContainer.appendChild(boost);
    this.boostObject = boost;
    this.boostArray.push(boost);
    this.boostYPos[i] = this.boostPosition.yPosition;
  }
  this.updateBoosters = function (i) {
    this.boostYPos[i] += 1;
    this.boostArray[i].style.top = this.boostYPos[i] + 'px';
  }

  this.moveBoosters = function () {
    f = requestAnimationFrame(this.moveBoosters.bind(this));
    if (f % 100 == 0 && this.boostArray.length < 3 && Math.random() < 0.5) {
      this.generateRandomBoosters(this.boostArray.length);
    }
    for (var i = 0; i < this.boostArray.length; i++) {
      this.boostPosition.xPosition = this.carGame.opponentPositionArray[i];
      this.updateBoosters(i);
      if (this.collectBoost(i)) {
        this.boostYPos[i] = -1 * Math.floor(Math.random() * 300 + 200);
        if (this.bulletCount < this.maximumAmmo)
          this.bulletCount++;
        console.log(this.bulletCount);
        break;
      }
    }
  }

this.collectBoost = function (i) {
    if (this.carGame.playerCar.xPosition < this.boostPosition.xPosition + 30 &&
      this.carGame.playerCar.xPosition + 70 > this.boostPosition.xPosition &&
      this.carGame.playerCar.yPosition < this.boostYPos[i] + 35 &&
      this.carGame.playerCar.yPosition + 70 > this.boostYPos[i]) {
      return true;
    }
  }
  this.moveBoosters();

  this.resetGame = function () {
    cancelAnimationFrame(this.setUpGameContainer.animationFrame);
    cancelAnimationFrame(this.carGame.animFrame);
    alert("Game Over");
    // location.reload();
    this.player.remove();
    while (this.carGame.gameContainer.hasChildNodes()) {
      this.carGame.gameContainer.removeChild(this.carGame.gameContainer.lastChild);
    }
    this.carGame.scoreBoard.innerHTML = '0';
    this.carGame.highestScore.innerHTML = '0';
    init();
  }

  this.movePlayer = function (position) {
    if (position < 0 || position > 450) {
      return true;
    }
    this.player.style.left = position + 'px';
    return false;
  }
  
}


function SetUpGameContainer(gameContainer) {
  this.gameContainer = gameContainer;
  this.animationFrame;
  var position = 0;
  //moves the lane
  this.animateBackground = function () {
    position += 2;
    this.gameContainer.style.backgroundPosition = '0 ' + position + 'px';
    this.animationFrame = requestAnimationFrame(this.animateBackground.bind(this));
  }

  //initiate the car div
  this.positionPlayerCar = function () {
    var car = document.createElement('div');
    car.setAttribute('class', 'player-car');
    this.gameContainer.appendChild(car);
    return car;
  }

}

//start
function init() {
var playButton = document.getElementById('start-game');
var gameContainer = document.getElementById('game-container');
var scoreBoard = document.getElementById('score-board');
var highestScore = document.getElementsByTagName('span')[0];
new CarGame(playButton, gameContainer, scoreBoard, highestScore);
}

function Car(){
  var gameWrapper = document.createElement('div');
  gameWrapper.setAttribute('class', 'game-wrapper');
  var gameControls = document.createElement('div');
  gameControls.setAttribute('class','game-controls');
  var button = document.createElement('button');
  button.setAttribute('class', 'start-game');
  button.setAttribute('id','start-game');
  button.innerHTML = "Start";
  var scoreBoard = document.createElement('div');
  scoreBoard.setAttribute('class', 'score-board');
  scoreBoard.setAttribute('id','score-board');
  scoreBoard.innerHTML = "0";
  var highest = document.createElement('div');
  highest.innerHTML = "Highest Score: ";
  highest.setAttribute('class', 'highest');
  var highestScore = document.createElement('span');
  highestScore.innerHTML="0";
  var gameContainer = document.createElement('div');
  gameContainer.setAttribute('class','game-container');
  gameContainer.setAttribute('id', 'game-container');
  gameWrapper.appendChild(gameControls);
  gameControls.appendChild(button);
  gameControls.appendChild(scoreBoard);
  gameControls.appendChild(highest);
  highest.appendChild(highestScore);
  gameWrapper.appendChild(gameContainer);
  document.body.appendChild(gameWrapper);
  init();
}

new Car();