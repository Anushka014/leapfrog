
function CarGame(playButton, gameContainer, scoreBoard, highestScore) {
  this.playButton = playButton;
  this.gameContainer = gameContainer;
  this.scoreBoard = scoreBoard;
  this.highestScore = highestScore;
  // this.bulletWidth = 70;
  // this.bulletHeight = 70;
  this.opponent = null;
  this.playGame = null;
  //it access the highest key and returns the value as string.
  this.highest = window.localStorage.getItem('highest') || 0;
  this.frames = 0;
  this.countTime = 2;
  this.car;
  this.canPlayGame = false;
  //lane position.
  this.opponentPositionArray = [80, 220, 370];
  this.obstacleBackgroundArray = ['images/car1.png', 'images/car1.png', 'images/car1.png'];
  this.obstacleArray = [];
  this.increaseDifficulty = true;
  this.playerCar = {
    xPosition: 240,//left
    yPosition: 490 //top
  };
  this.obstacleCar = {
    xPosition: Math.random()-0.5,
    yPosition: -1*(Math.floor(Math.random()*100))
  };
  this.yPosition = [0, 0, 0];
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

  //bullet div
  this.bulletAssets = function(){
    var bullet = document.createElement('div');
    bullet.setAttribute('class','bullet');
    this.gameContainer.appendChild(bullet);
    return bullet;
  }
  //sets the opponent car background pixel.
  this.drawGameAssets = function (i) {
    var yPosition = 0;
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
      // if(Math.abs(random) - Math.abs(this.yPosition[i-1]) <= 200){
        
      //  random = -1 * (Math.floor(Math.random() * 1000));
      // }
      this.yPosition[i] = random;
      this.scoreBoard.innerHTML = this.frames;
    }
    if (this.frames % 10 == 0 && this.increaseDifficulty && this.frames!==50) {
      this.countTime += 1;
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
  this.setUpGameContainer = setUpGameContainer;
  this.carGame = carGame;
  this.isCrashed = false;
  var that = this;
  document.onkeydown = function (e) {
    if (!that.isCrashed) {
      switch (e.which) {
        case 65:
          that.carGame.playerCar.xPosition -= 150;
          break;
        case 68:
          that.carGame.playerCar.xPosition += 150;
          break;
      }
      that.isCrashed = that.movePlayer(that.carGame.playerCar.xPosition);
    }
    else {
      that.resetGame();
    }
  }

  this.resetGame = function () {
    cancelAnimationFrame(this.setUpGameContainer.animationFrame);
    cancelAnimationFrame(this.carGame.animFrame);
    alert("Game Over");
    location.reload();
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
    ++position;
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
var playButton = document.getElementById('start-game');
var gameContainer = document.getElementById('game-container');
var scoreBoard = document.getElementById('score-board');
var highestScore = document.getElementsByTagName('span')[0];
new CarGame(playButton, gameContainer, scoreBoard, highestScore);