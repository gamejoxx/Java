// Get the canvas and context
const canvas = document.getElementById('pongCanvas');
const context = canvas.getContext('2d');

// Set the canvas width and height to match the actual element size
canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

// Game elements properties
const netWidth = 6;
const paddleWidth = 12;
const paddleHeight = 100;
const ballDiameter = 14;
let upArrowPressed = false;
let downArrowPressed = false;
let gameInterval;

// Net
const net = {
    x: (canvas.width - netWidth) / 2,
    y: 0,
    width: netWidth,
    height: canvas.height,
};

// Paddles
const leftPaddle = {
    x: 30,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    dy: 0 // dy is the change in the y direction
};

const rightPaddle = {
    x: canvas.width - paddleWidth - 30,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    dy: 0
};

// Ball
const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    diameter: ballDiameter,
    dx: 5, // Ball movement speed in x
    dy: 5 // Ball movement speed in y
};

// Scores
let leftScore = 0;
let rightScore = 0;

// Draw net
function drawNet() {
    // Dotted line
    context.setLineDash([15, 15]);
    context.beginPath();
    context.moveTo(net.x, net.y);
    context.lineTo(net.x, net.height);
    context.strokeStyle = 'green';
    context.lineWidth = netWidth;
    context.stroke();
    context.setLineDash([]);
}

// Draw paddle
function drawPaddle(x, y, width, height) {
    context.fillStyle = 'green';
    context.fillRect(x, y, width, height);
}

// Draw square ball
function drawBall(x, y, diameter) {
    context.fillStyle = 'green';
    context.fillRect(x - diameter / 2, y - diameter / 2, diameter, diameter);
}

// Draw score
function drawScore(x, y, score) {
    context.fillStyle = 'green';
    context.font = '75px PrintChar21';
    context.fillText(score.toString(), x, y);
}

// Move paddles
function movePaddle(paddle, y) {
    paddle.y = y - paddle.height / 2;
}

// Collision detection
function collisionDetect(paddle, ball) {
    if (ball.y + ball.diameter / 2 >= paddle.y && ball.y - ball.diameter / 2 <= paddle.y + paddle.height &&
        ball.x + ball.diameter / 2 >= paddle.x && ball.x - ball.diameter / 2 <= paddle.x + paddle.width) {
        ball.dx = -ball.dx;
    }
}

// Reset ball
function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.dx = -ball.dx;
    ball.dy = -ball.dy;
}

// Update the game
function update() {
    // Move the ball
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Simple AI to control the paddles
    movePaddle(leftPaddle, ball.y);
    movePaddle(rightPaddle, ball.y);

    // Ball collision with top and bottom
    if (ball.y + ball.diameter / 2 >= canvas.height || ball.y - ball.diameter / 2 <= 0) {
        ball.dy = -ball.dy;
    }

    // Ball collision with paddles
    collisionDetect(leftPaddle, ball);
    collisionDetect(rightPaddle, ball);

    // Scoring
    if (ball.x - ball.diameter / 2 <= 0) {
        rightScore++;
        resetBall();
    } else if (ball.x + ball.diameter / 2 >= canvas.width) {
        leftScore++;
        resetBall();
    }
}

// Render the game
function render() {
    // Clear the canvas
    context.clearRect(0, 0, canvas.width, canvas.height);
    // Draw the net, ball, paddles, and scores
    drawNet();
    drawBall(ball.x, ball.y, ball.diameter);
    drawPaddle(leftPaddle.x, leftPaddle.y, leftPaddle.width, leftPaddle.height);
    drawPaddle(rightPaddle.x, rightPaddle.y, rightPaddle.width, rightPaddle.height);
    drawScore(canvas.width / 4, canvas.height / 6, leftScore);
    drawScore(3 * canvas.width / 4, canvas.height / 6, rightScore);
}

// Game loop
function gameLoop() {
    update();
    render();
}



function stopGame() {
    clearInterval(gameInterval);
    gameInterval = null; // Clear the interval ID
}


// Reset the game
function resetGame() {
    leftScore = 0;
    rightScore = 0;
    resetBall();
    render();
}

document.getElementById('startButton').addEventListener('click', function() {
    // Only set a new interval if the game isn't already running
    if (!gameInterval) {
        gameInterval = setInterval(gameLoop, 1000 / 60); // 60 FPS
    }
});


document.getElementById('stopButton').addEventListener('click', stopGame);

document.getElementById('resetButton').addEventListener('click', resetGame);

// Initial render call
render();
