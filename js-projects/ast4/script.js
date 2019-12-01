function CarGame(playButton, gameContainer){
	this.playButton = playButton;
	this.gameContainer = gameContainer;
	this.opponent = null;
	this.car;
	this.canPlayGame = false;
	this.opponentPositionArray = [110, 260, 410];
	this.xPosition = 0;
	this.delay;
	var setUpGameContainer;
	var that = this;
	var x = 0;

	//onbutton click the lane moves with animatebackground function.
	this.playButton.onclick = function(e){
		e.preventDefault();
		if(that.canPlayGame){
			return;
		}
		that.canPlayGame = true;
		setUpGameContainer = new SetUpGameContainer(that.gameContainer);
		setUpGameContainer.animateBackground();
		that.startGame();
	}

	this.setupGameAssets = function(){
		var opponent = document.createElement('div');
		opponent.setAttribute('class','opponent');
		this.gameContainer.appendChild();
		this.opponent = opponent;
	}

	this.drawGameAssets = function(){
		for(var i = 0; i < this.opponentPositionArray.length; i ++){
			this.setupGameAssets();
		}
	}

	this.updateGameAssets = function(opponent){
		this.xPosition += 2;
		opponent.style.top = this.xPosition + 'px';
	}

	this.animateGameAssets = function(opponent){
		this.updateGameAssets(opponent);
		requestAnimationFrame(function(){

			that.updateGameAssets(opponent);
			if(x !== 10){
				x++;

			}
		});
	}

	this.startGame = function(){
		if(this.canPlayGame){
			new PlayGame(setUpGameContainer.positionPlayerCar(),setUpGameContainer, this);
		}
	}
}

function PlayGame(player, setUpGameContainer, carGame){
	this.player = player;
	this.setUpGameContainer = setUpGameContainer;
	this.carGame = carGame;
	this.playerPosition = 240;
	this.isCrashed = false;
	var that = this;
	document.onkeydown = function(e){
		if(!this.isCrashed){
			switch(e.which){
				case 37:
				that.playerPosition -= 2;
                    break;
                case 39:
                    that.playerPosition += 2;
                    break;
            }
            that.isCrashed = that.movePlayer(that.playerPosition);
			}
			else{
				that.resetGame();
			}
		}
		this.resetGame = function () {
        cancelAnimationFrame(this.setUpGameContainer.animationFrame);
        alert("Game Over");
        this.player.remove();
        this.isCrashed = false;
        this.setUpGameContainer.animateBackground();
        this.carGame.startGame();
    }

    this.movePlayer = function (position) {
        if (position < 82 || position > 450) {
            return true;
        }
        this.player.style.left = position + 'px';
        return false;
    }
}

function SetUpGameContainer(gameContainer){
	this.gameContainer = gameContainer;
	this.animationFrame;
	var position = 0;

	this.animateBackground = function(){
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

//start
var playButton = document.getElementById('start-game');
var gameContainer = document.getElementById('game-container');
new CarGame(playButton, gameContainer);