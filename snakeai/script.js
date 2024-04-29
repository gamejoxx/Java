document.addEventListener('DOMContentLoaded', function () {
    const gameArea = document.getElementById('gameArea');
    const startButton = document.getElementById('startButton');
    const stopButton = document.getElementById('stopButton');
    const resetButton = document.getElementById('resetButton');
    const rows = 24;
    const cols = 32;
    let snake = [{ x: 16, y: 12 }];
    let direction = { x: 0, y: 0 };
    let powerUp = null;
    let gameInterval = null;
    let score = 0; // Initialize score


    function createGrid() {
        gameArea.innerHTML = '';
        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                const cell = document.createElement('div');
                if (y === 0 || y === rows - 1 || x === 0 || x === cols - 1) {
                    cell.classList.add('borderCell');
                } else {
                    cell.classList.add('gameCell');
                }
                gameArea.appendChild(cell);
            }
        }
    }
    

    function drawSnake() {
        gameArea.querySelectorAll('.snake').forEach(cell => cell.classList.remove('snake'));
        snake.forEach(segment => {
            const index = segment.y * cols + segment.x;
            gameArea.children[index].classList.add('snake');
        });
    }

    function placePowerUp() {
        do {
            powerUp = {
                x: Math.floor(Math.random() * (cols - 2)) + 1,
                y: Math.floor(Math.random() * (rows - 2)) + 1
            };
        } while (isSnake(powerUp.x, powerUp.y));
    
        const index = powerUp.y * cols + powerUp.x;
        gameArea.children[index].classList.add('powerUp');
    }
    
    function clearPowerUp() {
        const index = powerUp.y * cols + powerUp.x;
        gameArea.children[index].classList.remove('powerUp');
        powerUp = null; // Reset the powerUp variable
    }
    
    function updateScore() {
        const scoreElement = document.getElementById('scoreDisplay');
        scoreElement.textContent = `Score: ${score}`;
    }
    
    function isSnake(x, y) {
        return snake.some(segment => segment.x === x && segment.y === y);
    }
    
    function playBeep() {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain(); // Create a gain node
        oscillator.type = 'square';
        oscillator.frequency.setValueAtTime(640, audioCtx.currentTime);
        oscillator.connect(gainNode); // Connect oscillator to gain node
        gainNode.connect(audioCtx.destination); // Connect gain node to audio destination
        gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime); // Set the volume to 0.2 (20%)
        oscillator.start();
        setTimeout(() => {
            oscillator.stop();
            gainNode.disconnect(); // Disconnect gain node after stopping oscillator
        }, 50);
    }


    function showGameOver() {
        const gameOverElement = document.createElement('div');
        gameOverElement.id = 'gameOverMessage';
        gameOverElement.textContent = 'GAME OVER';
        document.body.appendChild(gameOverElement);
    }
    
    function simpleAIDirection() {
        // AI to move right towards the power-up
        if (snake[0].x < powerUp.x) {
            direction = { x: 1, y: 0 };
        } 
        // AI to move left towards the power-up
        else if (snake[0].x > powerUp.x) {
            direction = { x: -1, y: 0 };
        }
        // AI to move down towards the power-up
        else if (snake[0].y < powerUp.y) {
            direction = { x: 0, y: 1 };
        } 
        // AI to move up towards the power-up
        else if (snake[0].y > powerUp.y) {
            direction = { x: 0, y: -1 };
        }
        // Additional logic to handle wall and self-collision avoidance can go here
    }


    function gameLoop() {
        simpleAIDirection();  // Set direction towards the power-up using simple AI logic
        const newHead = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
    
        // Check for game over conditions with border collision
        if (newHead.x <= 0 || newHead.x >= cols - 1 || newHead.y <= 0 || newHead.y >= rows - 1 || isSnake(newHead.x, newHead.y)) {
            // alert('Game Over!');
            showGameOver();
            clearInterval(gameInterval);
            return;
        }
    
        snake.unshift(newHead);
        if (newHead.x === powerUp.x && newHead.y === powerUp.y) {
            score++; // Increment score
            playBeep(); // Play beep sound
            updateScore(); // Update score display
            clearPowerUp(); // Remove power-up
            placePowerUp(); // New power-up location
        } else {
            const tail = snake.pop();
            gameArea.children[tail.y * cols + tail.x].classList.remove('snake');
        }
        drawSnake();
    }
    

    function init() {
        createGrid();
        drawSnake();
        placePowerUp();
        updateScore();
    }

    function changeDirection(event) {
        if (gameInterval !== null) {  // Only allow direction change if the game is running
            const keyPressed = event.key;
            const newDirection = { x: direction.x, y: direction.y };  // Copy current direction
    
            if (keyPressed === 'ArrowUp' && direction.y !== 1) {
                newDirection.x = 0;
                newDirection.y = -1;
            } else if (keyPressed === 'ArrowDown' && direction.y !== -1) {
                newDirection.x = 0;
                newDirection.y = 1;
            } else if (keyPressed === 'ArrowLeft' && direction.x !== 1) {
                newDirection.x = -1;
                newDirection.y = 0;
            } else if (keyPressed === 'ArrowRight' && direction.x !== -1) {
                newDirection.x = 1;
                newDirection.y = 0;
            }
    
            // Avoid immediate reverse direction
            if (newDirection.x !== direction.x || newDirection.y !== direction.y) {
                direction = newDirection;
            }
        }
    }
    
   // document.addEventListener('keydown', changeDirection);
    

    startButton.addEventListener('click', function () {
        if (!gameInterval) {
           // direction = { x: 1, y: 0 }; // Set initial direction to right
            gameInterval = setInterval(gameLoop, 200);
        }
    });

    stopButton.addEventListener('click', function () {
        if (gameInterval) {
            clearInterval(gameInterval);
            gameInterval = null;
        }
    });

    function resetGame() {
        clearInterval(gameInterval);
        gameInterval = null;
        snake = [{ x: 16, y: 12 }];
        direction = { x: 0, y: 0 };
        score = 0;
        const gameOverElement = document.getElementById('gameOverMessage');
        if (gameOverElement) {
            gameOverElement.remove();
        }
        init();
    }
    

    resetButton.addEventListener('click', function () {
        clearInterval(gameInterval);
        gameInterval = null;
        snake = [{ x: 16, y: 12 }];
        direction = { x: 0, y: 0 };
        resetGame();
        init();
    });

    init();
});
