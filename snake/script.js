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

    function createGrid() {
        gameArea.innerHTML = '';
        for (let i = 0; i < rows * cols; i++) {
            const cell = document.createElement('div');
            cell.classList.add('gameCell');
            gameArea.appendChild(cell);
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
                x: Math.floor(Math.random() * cols),
                y: Math.floor(Math.random() * rows)
            };
        } while (isSnake(powerUp.x, powerUp.y));

        const index = powerUp.y * cols + powerUp.x;
        gameArea.children[index].classList.add('powerUp');
    }

    function isSnake(x, y) {
        return snake.some(segment => segment.x === x && segment.y === y);
    }

    function gameLoop() {
        const newHead = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

        if (newHead.x < 0 || newHead.x >= cols || newHead.y < 0 || newHead.y >= rows || isSnake(newHead.x, newHead.y)) {
            alert('Game Over!');
            clearInterval(gameInterval);
            return;
        }

        snake.unshift(newHead);
        if (newHead.x === powerUp.x && newHead.y === powerUp.y) {
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
    
    document.addEventListener('keydown', changeDirection);
    

    startButton.addEventListener('click', function () {
        if (!gameInterval) {
            direction = { x: 1, y: 0 }; // Set initial direction to right
            gameInterval = setInterval(gameLoop, 200);
        }
    });

    stopButton.addEventListener('click', function () {
        if (gameInterval) {
            clearInterval(gameInterval);
            gameInterval = null;
        }
    });

    resetButton.addEventListener('click', function () {
        clearInterval(gameInterval);
        gameInterval = null;
        snake = [{ x: 16, y: 12 }];
        direction = { x: 0, y: 0 };
        init();
    });

    init();
});
