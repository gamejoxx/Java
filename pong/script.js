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
let ballPositions = [];



// Net
const net = {
    x: (canvas.width - netWidth) / 2,
    y: 0,
    width: netWidth,
    height: canvas.height,
};

// Paddles
const leftPaddle = {
    x: 5,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    // dy: parseFloat(leftPaddleSpeedSlider.value) // Add this line
};

const rightPaddle = {
    x: canvas.width - paddleWidth - 5,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    // dy: parseFloat(rightPaddleSpeedSlider.value) // Add this line
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

// Draw square ball with a fading trail
function drawBall() {
    // Only add a new trail position if the ball has moved more than its diameter from the last trail position
    if (ballPositions.length === 0 ||
        Math.abs(ball.x - ballPositions[ballPositions.length - 1].x) >= ball.diameter ||
        Math.abs(ball.y - ballPositions[ballPositions.length - 1].y) >= ball.diameter) {
        
        if (ballPositions.length === 0) {
            // If it's the first position, start at full opacity
            ballPositions.push({x: ball.x, y: ball.y, opacity: 1.0});
        } else {
            // Next positions start at 60% opacity
            ballPositions.push({x: ball.x, y: ball.y, opacity: 0.4});
        }
    }

    // Draw each position in the trail
    ballPositions.forEach((pos, index) => {
        context.fillStyle = `rgba(0, 255, 0, ${pos.opacity})`; // Green with fading opacity
        context.fillRect(pos.x - ball.diameter / 2, pos.y - ball.diameter / 2, ball.diameter, ball.diameter);

        // Reduce opacity for the next frame
        pos.opacity -= 0.02; // Decrease this value to make the trail last longer
    });

    // Remove the faded positions
    ballPositions = ballPositions.filter(pos => pos.opacity > 0);
}



// Draw score
function drawScore(x, y, score) {
    context.fillStyle = 'green';
    context.font = '75px PrintChar21';
    context.fillText(score.toString(), x, y);
}

// Simple AI to control the paddles
function movePaddle(paddle, ball) {
    // Calculate the center position of the paddle
    let paddleCenter = paddle.y + paddle.height / 2;

    // Move paddle towards the ball
    if (ball.y < paddleCenter) {
        paddle.dy = -Math.abs(paddle.dy);  // Move up
    } else {
        paddle.dy = Math.abs(paddle.dy);   // Move down
    }

    // Calculate potential new position
    let newY = paddle.y + paddle.dy;

    // Check for boundaries and adjust if necessary
    if (newY < 0) {
        newY = 0;
    } else if (newY + paddle.height > canvas.height) {
        newY = canvas.height - paddle.height;
    }

    // Update paddle position
    paddle.y = newY;
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
    movePaddle(leftPaddle, ball);
    movePaddle(rightPaddle, ball);

    // Check for ball collision with the canvas boundaries
    if (ball.y + ball.diameter / 2 >= canvas.height || ball.y - ball.diameter / 2 <= 0) {
        ball.dy = -ball.dy;
    }

    // Check for ball collision with paddles
    collisionDetect(leftPaddle, ball);
    collisionDetect(rightPaddle, ball);

    // Check for scoring
    if (ball.x - ball.diameter / 2 <= 0) {
        beepSound();
        rightScore++;
        resetBall();
    } else if (ball.x + ball.diameter / 2 >= canvas.width) {
        beepSound();
        leftScore++;
        resetBall();
    }
}

// make a retro beep soud function using oscillator and pitch
function beepSound() {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();
    oscillator.type = 'square';
    oscillator.frequency.setValueAtTime(300, audioCtx.currentTime); // value in hertz
    oscillator.connect(audioCtx.destination);
    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.1);
}


function collisionDetect(paddle, ball) {
    if (ball.y + ball.diameter / 2 >= paddle.y && ball.y - ball.diameter / 2 <= paddle.y + paddle.height &&
        ball.x + ball.diameter / 2 >= paddle.x && ball.x - ball.diameter / 2 <= paddle.x + paddle.width) {
        ball.dx = -ball.dx; // reverse the ball direction
        
        // Trigger shake
        document.body.classList.add('shake-animation');
        
        // Remove the class after animation ends (500ms)
        setTimeout(() => {
            document.body.classList.remove('shake-animation');
        }, 500);
    }
}


// Render the game
function render() {
    // Clear the canvas
    context.fillStyle = 'rgba(0, 0, 0, 0.2)'; // Change the alpha value to adjust the trail length
    context.fillRect(0, 0, canvas.width, canvas.height);
   //  context.clearRect(0, 0, canvas.width, canvas.height);
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
        gameInterval = setInterval(gameLoop, 1000 / 0); // 120 FPS
    }
});


document.getElementById('stopButton').addEventListener('click', stopGame);

document.getElementById('resetButton').addEventListener('click', resetGame);

// Define variables without assigning DOM elements yet
let leftPaddleSpeedSlider, ballSpeedSlider, rightPaddleSpeedSlider;

// Wrap the references and event listeners setup in a DOMContentLoaded event to ensure DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Grab references to the sliders
    leftPaddleSpeedSlider = document.getElementById('leftPaddleSpeed');
    ballSpeedSlider = document.getElementById('ballSpeed');
    rightPaddleSpeedSlider = document.getElementById('rightPaddleSpeed');

    // Update paddle speed based on the slider
    leftPaddleSpeedSlider.addEventListener('input', function() {
        leftPaddle.dy = parseFloat(this.value);
    });

// Update ball speed based on the slider
ballSpeedSlider.addEventListener('input', function() {
    let magnitude = parseFloat(this.value);
    let directionX = ball.dx / Math.abs(ball.dx); // Retain current direction
    let directionY = ball.dy / Math.abs(ball.dy); // Retain current direction

    ball.dx = directionX * magnitude; // Apply new magnitude while keeping direction
    ball.dy = directionY * magnitude; // Apply new magnitude while keeping direction
});


    // Update right paddle speed based on the slider
    rightPaddleSpeedSlider.addEventListener('input', function() {
        rightPaddle.dy = parseFloat(this.value);
    });

    // Set initial paddle speeds based on the sliders
    leftPaddle.dy = parseFloat(leftPaddleSpeedSlider.value);
    rightPaddle.dy = parseFloat(rightPaddleSpeedSlider.value);
});



// Initial render call
render();
