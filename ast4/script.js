function CarGame(playButton, gameContainer, scoreBoard, highestScore) {
  this.playButton = playButton;
  this.gameContainer = gameContainer;
  this.scoreBoard = scoreBoard;
  this.highestScore = highestScore;
  this.opponent = null;
  this.playGame = null;
  this.highest = window.localStorage.getItem('highest') || 0;
  this.frames = 0;
  this.car;
  this.canPlayGame = false;
  this.opponentPositionArray = [110, 260, 410];
  this.obstacleBackgroundArray = ['images/car4.png', 'images/car2.png', 'images/car3.png'];
  this.obstacleArray = [];
  this.playerCar = {
    xPosition: 260,
    yPosition: 530
  };
  this.obstacleCar = {
    xPosition: Math.random()-0.5,
    yPosition: -1*(Math.floor(Math.random()*100))
  };
  this.yPosition = [0, 0, 0];
  this.animFrame;
  this.delay;
  var setUpGameContainer;
  var that = this;
  const SPEED = 0.5;

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

  this.setupGameAssets = function () {
    var opponent = document.createElement('div');
    opponent.setAttribute('class', 'opponent');
    this.gameContainer.appendChild(opponent);
    return opponent;
  }

  this.drawGameAssets = function (i) {
    var yPosition = 0;
    var obstacle = this.setupGameAssets();
    obstacle.style.background = 'url("' + this.obstacleBackgroundArray[i] + '")';
    obstacle.style.left = this.opponentPositionArray[i] + 'px';
    obstacle.style.top = yPosition + 'px';
    this.obstacleArray.push(obstacle);
  }

  this.updateGameAssets = function (opponent, i) {
    if (this.yPosition[i] >= 640) {
      this.frames++;
      this.yPosition[i] = -1*(Math.floor(Math.random()*1000));
      console.log(this.yPosition[i])
      this.scoreBoard.innerHTML = this.frames;
    }
    this.yPosition[i] += 2;
    opponent.style.top = this.yPosition[i] + 'px';
  }

  this.animateGameAssets = function () {
    var random = Math.floor(Math.random() * 270) + 100;
    this.animFrame = requestAnimationFrame(this.animateGameAssets.bind(this));
    if (this.animFrame % random == 0 && this.obstacleArray.length < 3 && Math.random() < 0.5) {
      this.drawGameAssets(this.obstacleArray.length);
    }
    for (var i = 0; i < this.obstacleArray.length; i++) {
      this.obstacleCar.xPosition = this.opponentPositionArray[i];
      // for(var j=0;j<this.obstacleArray.length;j++){
      //   if(i==j){
      //     continue;
      //   }
      //   else if(this.obstacleArray.length==3){
      //     if(Math.abs(this.yPosition[i] - this.yPosition[j]) <= 200)
      //       break;
      //   }
      // }
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
    if (this.playerCar.xPosition < this.obstacleCar.xPosition + 70 &&
      this.playerCar.xPosition + 70 > this.obstacleCar.xPosition &&
      this.playerCar.yPosition < this.yPosition[i] + 100 &&
      this.playerCar.yPosition + 100 > this.yPosition[i]) {
      return true;
    }
  }

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
    if (position < 82 || position > 450) {
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

  this.animateBackground = function () {
    ++position;
    this.gameContainer.style.backgroundPosition = '0 ' + position + 'px';
    this.animationFrame = requestAnimationFrame(this.animateBackground.bind(this));
  }

  this.positionPlayerCar = function () {
    var car = document.createElement('div');
    car.setAttribute('class', 'player-car');
    this.gameContainer.appendChild(car);
    return car;
  }

}

var playButton = document.getElementById('start-game');
var gameContainer = document.getElementById('game-container');
var scoreBoard = document.getElementById('score-board');
var highestScore = document.getElementsByTagName('span')[0];
new CarGame(playButton, gameContainer, scoreBoard, highestScore);