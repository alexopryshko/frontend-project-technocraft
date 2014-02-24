var humanX = 0; 
var humanY = 0;
var canvas; 
var ctx; 

var prevBackground = new Image(); 
var human = new Image(); 
var prevHumanX = 0; 
var prevHumanY = 0; 

function StartGame() {
    canvas = document.getElementById("myCanvas");
    if (canvas.getContext) {
        ctx = canvas.getContext("2d");

        ctx.fillStyle = "black";
        ctx.rect(0, 0, 810, 600);
        ctx.fill();

        prevBackground = ctx.getImageData(0, 0, 810, 600);

        makeHuman();
    }
    gameLoop = setInterval(doGameLoop, 10);
    window.addEventListener('keydown', whatKey, true);
}

function makeHuman() {
    ctx.beginPath();
    ctx.arc(15, 15, 15, 0, 2*Math.PI, true);
    ctx.closePath();
    ctx.fillStyle = "rgb(222, 103, 0)";
    ctx.fill();

    human = ctx.getImageData(0, 0, 30, 30);
    ctx.putImageData(prevBackground, 0, 0);
}

function doGameLoop() {
    ctx.putImageData(prevBackground, 0, 0);
    ctx.putImageData(human, humanX, humanY);
}

function whatKey(evt) {
    var flag = 0;

    prevHumanX = humanX;
    prevHumanY = humanY;
    
    switch (evt.keyCode) {
        case 37:
          	humanX = humanX - 5;
          	if (humanX < 0) {
            	humanX = 0;
            	flag = 1;
          	}	
          	break;

        case 39:
          	humanX = humanX + 5;
          	if (humanX > 770) {
            	humanX = 770;
            	flag = 1;
          	}
          	break;

      	case 40:
	        humanY = humanY + 5;
          	if (humanY > 570) {
            	humanY = 570;
            	flag = 1;
          	}
          	break;

        case 38:
          	humanY = humanY - 5;
          	if (humanY < 0) {
            	humanY = 0;
            	flag = 1;
          	}
          	break;
    }

    if (flag) {
       	humanX = prevHumanX;
       	humanY = prevHumanY;
          
    } 
}