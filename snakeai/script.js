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
    let highScore = 0;



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

    function updateHighScore() {
        if (score > highScore) {
            highScore = score;
            const highScoreElement = document.getElementById('highScoreDisplay');
            highScoreElement.textContent = `High Score: ${highScore}`;
        }
    }

    function showGameOver() {
        const gameOverElement = document.createElement('div');
        gameOverElement.id = 'gameOverMessage';
        gameOverElement.textContent = 'GAME OVER';
        document.body.appendChild(gameOverElement);
        setTimeout(() => { gameOverElement.remove(); }, 650); // Remove the message after 0.5 seconds
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

    function midAIDirectionalpha() {
        let moveOptions = [
            { x: 1, y: 0 }, // Right
            { x: -1, y: 0 }, // Left
            { x: 0, y: 1 }, // Down
            { x: 0, y: -1 } // Up
        ];
    
        // Filter out moves that would hit the snake itself or the walls
        moveOptions = moveOptions.filter(move => {
            const newX = snake[0].x + move.x;
            const newY = snake[0].y + move.y;
            const hitsWall = newX <= 0 || newX >= cols - 1 || newY <= 0 || newY >= rows - 1;
            const hitsSelf = isSnake(newX, newY);
            return !hitsWall && !hitsSelf;
        });
    
        // Prefer moves that bring the snake closer to the power-up
        moveOptions.sort((a, b) => {
            const distA = Math.abs(powerUp.x - (snake[0].x + a.x)) + Math.abs(powerUp.y - (snake[0].y + a.y));
            const distB = Math.abs(powerUp.x - (snake[0].x + b.x)) + Math.abs(powerUp.y - (snake[0].y + b.y));
            return distA - distB;
        });
    
        // Set the direction to the first move option (the one that gets closest to the power-up)
        if (moveOptions.length > 0) {
            direction = moveOptions[0];
        } else {
            // If there are no valid move options, the game is essentially over (or the AI is trapped).
            // For now, we can simply keep the direction unchanged.
            // Future improvements might include a more complex strategy to escape traps.
        }
    }
    

    function startGame() {
        resetGame();
        gameInterval = setInterval(gameLoop, 10); // Adjust the interval as needed for your game speed
    }

    function gameLoop() {
        midAIDirectionalpha(); // Set direction towards the power-up using mid-level AI logic
        // simpleAIDirection();  // Set direction towards the power-up using simple AI logic
        const newHead = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
    
        // Check for game over conditions with border collision
        if (newHead.x <= 0 || newHead.x >= cols - 1 || newHead.y <= 0 || newHead.y >= rows - 1 || isSnake(newHead.x, newHead.y)) {
            // alert('Game Over!');
            showGameOver();
            updateHighScore();
            clearInterval(gameInterval);
            setTimeout(startGame, 1000); // Restart game after x seconds
            return;
        }
    
        snake.unshift(newHead);
        if (newHead.x === powerUp.x && newHead.y === powerUp.y) {
            score++; // Increment score
            // playBeep(); // Play beep sound
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
    

   startButton.addEventListener('click', startGame);


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
        // direction = { x: 1, y: 0 }; // The AI will determine the direction, but set a default to start moving
        score = 0;
        updateScore();
        const gameOverElement = document.getElementById('gameOverMessage');
        if (gameOverElement) {
            gameOverElement.remove();
        }
        createGrid();
        drawSnake();
        placePowerUp();
    }
    

    // resetButton.addEventListener('click', startGame);

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
