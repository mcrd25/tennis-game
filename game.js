//canvas variables
var canvas;
var canvasContext;

//ball variables
var ballX = 50;
var ballSpeedX = 10;
var ballSpeedY = 4;
var vectorX = 1;
var ballY = 25;
const RADIUS = 10;

//paddle variables
var paddle = 210;
var paddle2 = 300;
const PADDLE_HEIGHT = 100;
const PADDLE_WIDTH = 10;

//score variables
var playerScore = 0;
var compScore = 0;
const WIN_SCORE = 3;
var showWinScreen = false;
var winMsg = '';

function handleMouseClick(evt) {
   if (showWinScreen) {
        playerScore =0;
        compScore = 0;
        showWinScreen = false;

   }     
}


window.onload = function(){
    canvas = document.getElementById("gameCanvas");
    canvasContext = canvas.getContext('2d');
    var framesPerSecond = 30;
   
    setInterval(function(){
        drawEverything(); 
        moveEverything();
    },1000/framesPerSecond);

    canvas.addEventListener('mousedown', handleMouseClick);

    canvas.addEventListener('mousemove', function(evt) {
        var mousePos = calculateMousePos(evt);
        paddle = mousePos.y - (PADDLE_HEIGHT/2); //if only paddle = mousePos.y then the mouse moves paddle from top so paddle - PADDLE_HEIGHT/2 makes it center. It moves from center
    });
}

/*Code below allows for mousex and y be ralative to canvas so 0,0 would be top left of canvas where as it would have been top left of screen before regardless where canvas is on screen and how far one had to scroll to get there*/
function calculateMousePos(evt) {
    var rect = canvas.getBoundingClientRect();
    var root = document.documentElement;
    var mouseX = evt.clientX - rect.left - root.scrollLeft;
    var mouseY = evt.clientY - rect.top - root.scrollTop;
    return {
        x: mouseX,
        y: mouseY
    }
}

function ballReset() {
    if(playerScore >= WIN_SCORE || compScore >= WIN_SCORE){
        showWinScreen = true;
        
        
        if(playerScore >= WIN_SCORE) {
            winMsg = "YOU WON!";
        }else {
            winMsg = "COMPUTER WON!";
        }
    }
  
    
    ballX = canvas.width/2;
    ballY = canvas.height/2;
    ballSpeedY = 4;
}

function drawNet() {
    for (var i = 0; i < canvas.height; i+=40) {
        colorRect(canvas.width/2 - 1, i, 2, 20, 'white');
    }
}

function drawEverything(){
    //blacks out screen with black - background
    colorRect(0, 0, canvas.width, canvas.height, 'black');
    if (showWinScreen) {//if true nothing else will run in function after return
        canvasContext.fillStyle = 'white';           
        canvasContext.fillText(winMsg,380, 150);
        canvasContext.fillText("Click to continue..",380, 450);
        return;
    }

    drawNet();

    //left paddle
    colorRect(0, paddle, PADDLE_WIDTH, PADDLE_HEIGHT, 'white');
    //right paddle
    colorRect(canvas.width - PADDLE_WIDTH, paddle2, PADDLE_WIDTH, PADDLE_HEIGHT, 'white');
    //ball
    colorCircle(ballX, ballY, RADIUS, 'white');

    canvasContext.fillText(playerScore, 100, 100);
    canvasContext.fillText(compScore, canvas.width - 100, 100);
}

function compMovement() {
    var paddle2Center = paddle2 + (PADDLE_HEIGHT/2);
    if(paddle2Center < (ballY - 35)) {
        paddle2+=10;
    }else if(paddle2Center > (ballY + 35)){
        paddle2-=10;
    }
}

function moveEverything(){
    if (showWinScreen) {
        return;
    }
    compMovement();
    ballX+=ballSpeedX;
    ballY+=ballSpeedY;

    if(ballX >= (canvas.width - PADDLE_WIDTH)) {
        if((ballY >= paddle2 - RADIUS) && (ballY <= (paddle2+PADDLE_HEIGHT + RADIUS))){
            ballSpeedX = -(ballSpeedX);
            var deltaY = ballY -(paddle2+PADDLE_HEIGHT/2);
            ballSpeedY = deltaY * .35;
        }else {
            playerScore++;

            ballReset();
            

        }
    }else if (ballX <= PADDLE_WIDTH) {
        if((ballY >= paddle - RADIUS) && (ballY <= (paddle+PADDLE_HEIGHT + RADIUS))){
            ballSpeedX = -(ballSpeedX);
            var deltaY = ballY -(paddle+PADDLE_HEIGHT/2);
            ballSpeedY = deltaY * .35;
        }else {
            compScore++;
            ballReset();
            
        }
    } 
    if(ballY >= (canvas.height - PADDLE_WIDTH )) {
        ballSpeedY = -(ballSpeedY);
    }else if (ballY <= PADDLE_WIDTH) {
        ballSpeedY = -(ballSpeedY);
    }
    
}

function colorCircle(centerX, centerY, radius, drawColor) {
    canvasContext.fillStyle = 'white';
    canvasContext.beginPath();
    canvasContext.arc(centerX, centerY, radius, 0, Math.PI * 2, true );//first two args are centre of circle, third is radius, 4th and 5th are angles for circle (pi * 2 is circle if pi it would be semi-circle) 4th is start angle and 5th is end angle
    canvasContext.fill();
}

function colorRect(leftX, topY, width, height, drawColor) {
    canvasContext.fillStyle = drawColor;
    canvasContext.fillRect(leftX, topY, width, height);
}

