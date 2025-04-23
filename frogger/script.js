// Frogger Game
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const GRID_SIZE = 32; // Size of each grid cell
const ROWS = 16;
const COLS = 14;

// Web Audio API setup
const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioCtx = new AudioContext();

// Sound generator
const sounds = {
    // Audio generator functions
    createOscillator(type, frequency, duration, volumeValue = 0.2) {
        if (!gameState.soundEnabled) return;
        
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        
        oscillator.type = type;
        oscillator.frequency.value = frequency;
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        gainNode.gain.value = volumeValue;
        oscillator.start();
        
        // Quick fade out for smoother sound
        gainNode.gain.exponentialRampToValueAtTime(
            0.01, audioCtx.currentTime + duration
        );
        
        oscillator.stop(audioCtx.currentTime + duration);
    },
    
    // Synth functions for different sound effects
    jump() {
        // High-pitched short blip
        this.createOscillator('square', 480, 0.1, 0.15);
    },
    
    splash() {
        // Descending bubbly sound
        this.createOscillator('sine', 200, 0.1, 0.2);
        setTimeout(() => this.createOscillator('sine', 150, 0.1, 0.2), 50);
        setTimeout(() => this.createOscillator('sine', 100, 0.1, 0.2), 100);
    },
    
    squash() {
        // Harsh flat sound
        this.createOscillator('sawtooth', 100, 0.2, 0.2);
    },
    
    success() {
        // Ascending happy tune
        this.createOscillator('square', 260, 0.1, 0.15);
        setTimeout(() => this.createOscillator('square', 380, 0.15, 0.15), 100);
    },
    
    levelComplete() {
        // Victory melody
        this.createOscillator('square', 260, 0.1, 0.15);
        setTimeout(() => this.createOscillator('square', 330, 0.1, 0.15), 120);
        setTimeout(() => this.createOscillator('square', 390, 0.1, 0.15), 240);
        setTimeout(() => this.createOscillator('square', 520, 0.2, 0.15), 360);
    },
    
    gameOver() {
        // Sad downward melody
        this.createOscillator('sawtooth', 280, 0.2, 0.2);
        setTimeout(() => this.createOscillator('sawtooth', 240, 0.2, 0.2), 200);
        setTimeout(() => this.createOscillator('sawtooth', 200, 0.2, 0.2), 400);
        setTimeout(() => this.createOscillator('sawtooth', 160, 0.3, 0.2), 600);
    },
    
    // Dummy functions to prevent errors when music functions are called
    playMusic() {},
    stopMusic() {}
};

// Game state
const gameState = {
    score: 0,
    highScore: localStorage.getItem('froggerHighScore') || 0,
    lives: 3,
    level: 1,
    frog: {
        x: 7 * GRID_SIZE, // Center of the bottom row
        y: 15 * GRID_SIZE, // Bottom row
        width: GRID_SIZE,
        height: GRID_SIZE,
        direction: 'up',
        jumping: false
    },
    gameOver: false,
    paused: false,
    gameStarted: false, // Track if game has started
    levelCompleted: 0, // Count of frogs that made it home
    homeBases: [
        { x: 1 * GRID_SIZE, y: 1 * GRID_SIZE, occupied: false },
        { x: 4 * GRID_SIZE, y: 1 * GRID_SIZE, occupied: false },
        { x: 7 * GRID_SIZE, y: 1 * GRID_SIZE, occupied: false },
        { x: 10 * GRID_SIZE, y: 1 * GRID_SIZE, occupied: false },
        { x: 13 * GRID_SIZE, y: 1 * GRID_SIZE, occupied: false }
    ],
    // Game objects will be defined here
    cars: [],
    logs: [],
    turtles: [],
    // Audio settings
    soundEnabled: true,
    musicEnabled: false, // Set music to disabled by default
    musicInterval: null,
    // Difficulty settings
    baseSpeed: 0.7, // Initial speed multiplier (slower to start)
    speedMultiplier: 1.0 // Increases with level
};

// Colors
const COLORS = {
    water: '#000080',
    road: '#505050',
    grass: '#00BC00',
    frog: '#00FF00',
    car1: '#FF0000',
    car2: '#FFFF00',
    car3: '#FF00FF',
    log: '#8B4513',
    turtle: '#008080',
    homeBase: '#000080',
    homeOccupied: '#00FF00',
    text: '#FFFFFF'
};

// Play sound function
function playSound(soundName) {
    if (gameState.soundEnabled && sounds[soundName]) {
        // Resume audio context if it's suspended (browser policy)
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
        
        sounds[soundName]();
    }
}

// Toggle sound on/off
function toggleSound() {
    gameState.soundEnabled = !gameState.soundEnabled;
    
    document.getElementById('mute-button').textContent = gameState.soundEnabled ? '🔊' : '🔇';
}

// Handle keyboard input
function handleKeyDown(e) {
    // Only process key events if game has started
    if (!gameState.gameStarted) return;
    
    if (gameState.gameOver) {
        if (e.key === 'Enter' || e.key === ' ') {
            resetGame();
            return;
        }
    }
    
    if (e.key === 'p' || e.key === 'P') {
        gameState.paused = !gameState.paused;
        return;
    }
    
    if (gameState.paused) return;
    
    if (gameState.frog.jumping) return; // Don't allow movement while already jumping
    
    const oldX = gameState.frog.x;
    const oldY = gameState.frog.y;
    
    switch (e.key) {
        case 'ArrowUp':
            gameState.frog.y -= GRID_SIZE;
            gameState.frog.direction = 'up';
            if (gameState.frog.y < 0) gameState.frog.y = 0;
            break;
        case 'ArrowDown':
            gameState.frog.y += GRID_SIZE;
            gameState.frog.direction = 'down';
            if (gameState.frog.y > canvas.height - GRID_SIZE) gameState.frog.y = canvas.height - GRID_SIZE;
            break;
        case 'ArrowLeft':
            gameState.frog.x -= GRID_SIZE;
            gameState.frog.direction = 'left';
            if (gameState.frog.x < 0) gameState.frog.x = 0;
            break;
        case 'ArrowRight':
            gameState.frog.x += GRID_SIZE;
            gameState.frog.direction = 'right';
            if (gameState.frog.x > canvas.width - GRID_SIZE) gameState.frog.x = canvas.width - GRID_SIZE;
            break;
        default:
            return; // Don't trigger jump animation for other keys
    }
    
    // If frog moved, update score and play sound
    if (oldX !== gameState.frog.x || oldY !== gameState.frog.y) {
        // Give points for moving forward
        if (oldY > gameState.frog.y) {
            gameState.score += 10;
        }
        
        // Play jump sound
        playSound('jump');
        
        // Animate the jump
        gameState.frog.jumping = true;
        setTimeout(() => { gameState.frog.jumping = false; }, 150);
    }
}

// Start the game when the start button is clicked
function startGame() {
    gameState.gameStarted = true;
    document.getElementById('start-screen').classList.add('hidden');
    
    resetGame();
    gameLoop();
}

// Initialize the game
function init() {
    const startButton = document.getElementById('start-button');
    startButton.addEventListener('click', startGame);
    
    const muteButton = document.getElementById('mute-button');
    muteButton.addEventListener('click', toggleSound);
    
    setupEventListeners();
    
    // Draw initial background
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawBackground();
}

// Setup event listeners for keyboard controls
function setupEventListeners() {
    window.addEventListener('keydown', handleKeyDown);
}

// Generate obstacles (cars, logs, turtles)
function generateObstacles() {
    gameState.cars = [];
    gameState.logs = [];
    gameState.turtles = [];
    
    // Calculate current speed based on level
    const speedFactor = gameState.baseSpeed * gameState.speedMultiplier;
    
    // Cars - rows 10-14 (5 rows of road)
    // Row 10 - Fast cars moving right
    for (let i = 0; i < 3; i++) {
        gameState.cars.push({
            x: i * GRID_SIZE * 4,
            y: 10 * GRID_SIZE,
            width: GRID_SIZE * 2,
            height: GRID_SIZE,
            speed: 2 * speedFactor,
            direction: 'right',
            color: COLORS.car1
        });
    }
    
    // Row 11 - Medium speed cars moving left
    for (let i = 0; i < 2; i++) {
        gameState.cars.push({
            x: canvas.width - (i * GRID_SIZE * 5),
            y: 11 * GRID_SIZE,
            width: GRID_SIZE * 2,
            height: GRID_SIZE,
            speed: 1.5 * speedFactor,
            direction: 'left',
            color: COLORS.car2
        });
    }
    
    // Row 12 - Slow cars moving right
    for (let i = 0; i < 4; i++) {
        gameState.cars.push({
            x: i * GRID_SIZE * 3.5,
            y: 12 * GRID_SIZE,
            width: GRID_SIZE * 1.5,
            height: GRID_SIZE,
            speed: 1 * speedFactor,
            direction: 'right',
            color: COLORS.car3
        });
    }
    
    // Row 13 - Fast cars moving left
    for (let i = 0; i < 3; i++) {
        gameState.cars.push({
            x: canvas.width - (i * GRID_SIZE * 4),
            y: 13 * GRID_SIZE,
            width: GRID_SIZE * 2,
            height: GRID_SIZE,
            speed: 1.8 * speedFactor,
            direction: 'left',
            color: COLORS.car1
        });
    }
    
    // Row 14 - Medium speed cars moving right
    for (let i = 0; i < 3; i++) {
        gameState.cars.push({
            x: i * GRID_SIZE * 5,
            y: 14 * GRID_SIZE,
            width: GRID_SIZE * 2,
            height: GRID_SIZE,
            speed: 1.3 * speedFactor,
            direction: 'right',
            color: COLORS.car2
        });
    }
    
    // Logs and Turtles - rows 3-7 (5 rows of water)
    // Row 3 - Short logs moving right
    for (let i = 0; i < 3; i++) {
        gameState.logs.push({
            x: i * GRID_SIZE * 5,
            y: 3 * GRID_SIZE,
            width: GRID_SIZE * 3,
            height: GRID_SIZE,
            speed: 1 * speedFactor,
            direction: 'right'
        });
    }
    
    // Row 4 - Turtles moving left
    for (let i = 0; i < 4; i++) {
        gameState.turtles.push({
            x: canvas.width - (i * GRID_SIZE * 4),
            y: 4 * GRID_SIZE,
            width: GRID_SIZE * 2,
            height: GRID_SIZE,
            speed: 1.2 * speedFactor,
            direction: 'left',
            diving: false
        });
    }
    
    // Row 5 - Long logs moving right
    for (let i = 0; i < 2; i++) {
        gameState.logs.push({
            x: i * GRID_SIZE * 7,
            y: 5 * GRID_SIZE,
            width: GRID_SIZE * 4,
            height: GRID_SIZE,
            speed: 0.8 * speedFactor,
            direction: 'right'
        });
    }
    
    // Row 6 - Turtles moving left
    for (let i = 0; i < 3; i++) {
        gameState.turtles.push({
            x: canvas.width - (i * GRID_SIZE * 3),
            y: 6 * GRID_SIZE,
            width: GRID_SIZE * 3,
            height: GRID_SIZE,
            speed: 1.5 * speedFactor,
            direction: 'left',
            diving: false
        });
    }
    
    // Row 7 - Medium logs moving right
    for (let i = 0; i < 3; i++) {
        gameState.logs.push({
            x: i * GRID_SIZE * 6,
            y: 7 * GRID_SIZE,
            width: GRID_SIZE * 2,
            height: GRID_SIZE,
            speed: 1.3 * speedFactor,
            direction: 'right'
        });
    }
}

// Update game state
function update() {
    updateObstacles();
    checkCollisions();
    checkHomeBase();
}

// Update obstacle positions
function updateObstacles() {
    // Update cars
    gameState.cars.forEach(car => {
        if (car.direction === 'right') {
            car.x += car.speed;
            if (car.x > canvas.width) {
                car.x = -car.width;
            }
        } else {
            car.x -= car.speed;
            if (car.x + car.width < 0) {
                car.x = canvas.width;
            }
        }
    });
    
    // Update logs
    gameState.logs.forEach(log => {
        if (log.direction === 'right') {
            log.x += log.speed;
            if (log.x > canvas.width) {
                log.x = -log.width;
            }
        } else {
            log.x -= log.speed;
            if (log.x + log.width < 0) {
                log.x = canvas.width;
            }
        }
    });
    
    // Update turtles and random diving
    gameState.turtles.forEach(turtle => {
        if (turtle.direction === 'right') {
            turtle.x += turtle.speed;
            if (turtle.x > canvas.width) {
                turtle.x = -turtle.width;
            }
        } else {
            turtle.x -= turtle.speed;
            if (turtle.x + turtle.width < 0) {
                turtle.x = canvas.width;
            }
        }
        
        // Random diving for turtles (every 5 seconds on average)
        if (Math.random() < 0.005 && !turtle.diving) {
            turtle.diving = true;
            setTimeout(() => { turtle.diving = false; }, 3000);
        }
    });
    
    // Move frog with logs/turtles if on water
    if (gameState.frog.y >= 3 * GRID_SIZE && gameState.frog.y <= 7 * GRID_SIZE) {
        let onPlatform = false;
        
        // Check if on log
        gameState.logs.forEach(log => {
            if (collides(gameState.frog, log)) {
                gameState.frog.x += log.direction === 'right' ? log.speed : -log.speed;
                onPlatform = true;
            }
        });
        
        // Check if on turtle that's not diving
        gameState.turtles.forEach(turtle => {
            if (!turtle.diving && collides(gameState.frog, turtle)) {
                gameState.frog.x += turtle.direction === 'right' ? turtle.speed : -turtle.speed;
                onPlatform = true;
            }
        });
        
        // If in water but not on platform, frog dies
        if (!onPlatform) {
            frogDies('drowned');
        }
        
        // Keep frog in bounds
        if (gameState.frog.x < 0) gameState.frog.x = 0;
        if (gameState.frog.x > canvas.width - GRID_SIZE) gameState.frog.x = canvas.width - GRID_SIZE;
    }
}

// Check for collisions with obstacles
function checkCollisions() {
    // Check for car collisions
    gameState.cars.forEach(car => {
        if (collides(gameState.frog, car)) {
            frogDies('hit by car');
        }
    });
}

// Check if frog reached a home base
function checkHomeBase() {
    if (gameState.frog.y === GRID_SIZE) {
        let reachedHome = false;
        
        gameState.homeBases.forEach(home => {
            if (!home.occupied && 
                gameState.frog.x >= home.x - GRID_SIZE/2 && 
                gameState.frog.x <= home.x + GRID_SIZE/2) {
                
                // Frog reached an unoccupied home
                home.occupied = true;
                gameState.score += 50; // 50 points for reaching home
                gameState.levelCompleted++;
                reachedHome = true;
                
                // Play success sound
                playSound('success');
                
                // Reset frog position
                resetFrog();
                
                // If all homes are occupied, level complete
                if (gameState.levelCompleted === 5) {
                    levelUp();
                }
            }
        });
        
        // If frog reached the top but not in a valid home
        if (!reachedHome) {
            frogDies('missed home');
        }
    }
}

// Draw the game screen
function draw() {
    // Draw background
    drawBackground();
    
    // Draw obstacles
    drawObstacles();
    
    // Draw home bases
    drawHomeBases();
    
    // Draw frog
    drawFrog();
    
    // Draw game over or paused message
    if (gameState.gameOver) {
        drawGameOver();
    } else if (gameState.paused) {
        drawPaused();
    }
}

// Draw the game background
function drawBackground() {
    // Draw grass (rows 0, 2, 8, 9, 15)
    ctx.fillStyle = COLORS.grass;
    [0, 2, 8, 9, 15].forEach(row => {
        ctx.fillRect(0, row * GRID_SIZE, canvas.width, GRID_SIZE);
    });
    
    // Draw water (rows 3-7)
    ctx.fillStyle = COLORS.water;
    ctx.fillRect(0, 3 * GRID_SIZE, canvas.width, 5 * GRID_SIZE);
    
    // Draw road (rows 10-14)
    ctx.fillStyle = COLORS.road;
    ctx.fillRect(0, 10 * GRID_SIZE, canvas.width, 5 * GRID_SIZE);
}

// Draw cars, logs, and turtles
function drawObstacles() {
    // Draw cars
    gameState.cars.forEach(car => {
        ctx.fillStyle = car.color;
        ctx.fillRect(car.x, car.y, car.width, car.height);
        
        // Draw car details
        ctx.fillStyle = 'black';
        ctx.fillRect(car.x + car.width * 0.1, car.y + car.height * 0.2, car.width * 0.2, car.height * 0.6);
        ctx.fillRect(car.x + car.width * 0.7, car.y + car.height * 0.2, car.width * 0.2, car.height * 0.6);
    });
    
    // Draw logs
    gameState.logs.forEach(log => {
        ctx.fillStyle = COLORS.log;
        ctx.fillRect(log.x, log.y, log.width, log.height);
        
        // Draw log details
        ctx.fillStyle = '#6A3500';
        for (let i = 0; i < log.width; i += GRID_SIZE/2) {
            ctx.fillRect(log.x + i, log.y, 2, log.height);
        }
    });
    
    // Draw turtles
    gameState.turtles.forEach(turtle => {
        if (turtle.diving) {
            // Diving turtle - only show a bit of shell
            ctx.fillStyle = COLORS.water;
            ctx.fillRect(turtle.x, turtle.y, turtle.width, turtle.height);
            ctx.fillStyle = COLORS.turtle;
            ctx.fillRect(turtle.x + turtle.width * 0.3, turtle.y + turtle.height * 0.6, turtle.width * 0.4, turtle.height * 0.4);
        } else {
            // Regular turtle
            ctx.fillStyle = COLORS.turtle;
            // Draw multiple turtle shells
            const turtleCount = Math.floor(turtle.width / GRID_SIZE);
            for (let i = 0; i < turtleCount; i++) {
                ctx.beginPath();
                ctx.arc(turtle.x + GRID_SIZE/2 + i * GRID_SIZE, turtle.y + GRID_SIZE/2, GRID_SIZE/2 - 2, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = '#006060';
                ctx.beginPath();
                ctx.arc(turtle.x + GRID_SIZE/2 + i * GRID_SIZE, turtle.y + GRID_SIZE/2, GRID_SIZE/4, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = COLORS.turtle;
            }
        }
    });
}

// Draw home bases
function drawHomeBases() {
    gameState.homeBases.forEach(home => {
        ctx.fillStyle = home.occupied ? COLORS.homeOccupied : COLORS.homeBase;
        ctx.beginPath();
        ctx.arc(home.x + GRID_SIZE/2, home.y + GRID_SIZE/2, GRID_SIZE/2, 0, Math.PI * 2);
        ctx.fill();
    });
}

// Draw the frog
function drawFrog() {
    ctx.fillStyle = COLORS.frog;
    
    // Apply jump animation if jumping
    const scale = gameState.frog.jumping ? 1.2 : 1;
    const offset = gameState.frog.jumping ? GRID_SIZE * 0.1 : 0;
    
    // Draw frog body
    ctx.beginPath();
    ctx.arc(gameState.frog.x + GRID_SIZE/2, gameState.frog.y + GRID_SIZE/2, 
            (GRID_SIZE/2 - 2) * scale, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw frog legs based on direction
    switch(gameState.frog.direction) {
        case 'up':
            // Draw front legs
            ctx.fillRect(gameState.frog.x + GRID_SIZE * 0.2 - offset, 
                        gameState.frog.y, GRID_SIZE * 0.15, GRID_SIZE * 0.3);
            ctx.fillRect(gameState.frog.x + GRID_SIZE * 0.65 + offset, 
                        gameState.frog.y, GRID_SIZE * 0.15, GRID_SIZE * 0.3);
            // Draw back legs
            ctx.fillRect(gameState.frog.x + GRID_SIZE * 0.1, 
                        gameState.frog.y + GRID_SIZE * 0.6, GRID_SIZE * 0.2, GRID_SIZE * 0.3);
            ctx.fillRect(gameState.frog.x + GRID_SIZE * 0.7, 
                        gameState.frog.y + GRID_SIZE * 0.6, GRID_SIZE * 0.2, GRID_SIZE * 0.3);
            break;
        case 'down':
            // Draw front legs
            ctx.fillRect(gameState.frog.x + GRID_SIZE * 0.2 - offset, 
                        gameState.frog.y + GRID_SIZE * 0.7, GRID_SIZE * 0.15, GRID_SIZE * 0.3);
            ctx.fillRect(gameState.frog.x + GRID_SIZE * 0.65 + offset, 
                        gameState.frog.y + GRID_SIZE * 0.7, GRID_SIZE * 0.15, GRID_SIZE * 0.3);
            // Draw back legs
            ctx.fillRect(gameState.frog.x + GRID_SIZE * 0.1, 
                        gameState.frog.y + GRID_SIZE * 0.1, GRID_SIZE * 0.2, GRID_SIZE * 0.3);
            ctx.fillRect(gameState.frog.x + GRID_SIZE * 0.7, 
                        gameState.frog.y + GRID_SIZE * 0.1, GRID_SIZE * 0.2, GRID_SIZE * 0.3);
            break;
        case 'left':
            // Draw front legs
            ctx.fillRect(gameState.frog.x, 
                        gameState.frog.y + GRID_SIZE * 0.2 - offset, GRID_SIZE * 0.3, GRID_SIZE * 0.15);
            ctx.fillRect(gameState.frog.x, 
                        gameState.frog.y + GRID_SIZE * 0.65 + offset, GRID_SIZE * 0.3, GRID_SIZE * 0.15);
            // Draw back legs
            ctx.fillRect(gameState.frog.x + GRID_SIZE * 0.6, 
                        gameState.frog.y + GRID_SIZE * 0.1, GRID_SIZE * 0.3, GRID_SIZE * 0.2);
            ctx.fillRect(gameState.frog.x + GRID_SIZE * 0.6, 
                        gameState.frog.y + GRID_SIZE * 0.7, GRID_SIZE * 0.3, GRID_SIZE * 0.2);
            break;
        case 'right':
            // Draw front legs
            ctx.fillRect(gameState.frog.x + GRID_SIZE * 0.7, 
                        gameState.frog.y + GRID_SIZE * 0.2 - offset, GRID_SIZE * 0.3, GRID_SIZE * 0.15);
            ctx.fillRect(gameState.frog.x + GRID_SIZE * 0.7, 
                        gameState.frog.y + GRID_SIZE * 0.65 + offset, GRID_SIZE * 0.3, GRID_SIZE * 0.15);
            // Draw back legs
            ctx.fillRect(gameState.frog.x + GRID_SIZE * 0.1, 
                        gameState.frog.y + GRID_SIZE * 0.1, GRID_SIZE * 0.3, GRID_SIZE * 0.2);
            ctx.fillRect(gameState.frog.x + GRID_SIZE * 0.1, 
                        gameState.frog.y + GRID_SIZE * 0.7, GRID_SIZE * 0.3, GRID_SIZE * 0.2);
            break;
    }
    
    // Draw eyes
    ctx.fillStyle = 'white';
    let eyeX1, eyeX2, eyeY1, eyeY2;
    
    switch(gameState.frog.direction) {
        case 'up':
            eyeX1 = gameState.frog.x + GRID_SIZE * 0.3;
            eyeX2 = gameState.frog.x + GRID_SIZE * 0.7;
            eyeY1 = eyeY2 = gameState.frog.y + GRID_SIZE * 0.2;
            break;
        case 'down':
            eyeX1 = gameState.frog.x + GRID_SIZE * 0.3;
            eyeX2 = gameState.frog.x + GRID_SIZE * 0.7;
            eyeY1 = eyeY2 = gameState.frog.y + GRID_SIZE * 0.8;
            break;
        case 'left':
            eyeX1 = eyeX2 = gameState.frog.x + GRID_SIZE * 0.2;
            eyeY1 = gameState.frog.y + GRID_SIZE * 0.3;
            eyeY2 = gameState.frog.y + GRID_SIZE * 0.7;
            break;
        case 'right':
            eyeX1 = eyeX2 = gameState.frog.x + GRID_SIZE * 0.8;
            eyeY1 = gameState.frog.y + GRID_SIZE * 0.3;
            eyeY2 = gameState.frog.y + GRID_SIZE * 0.7;
            break;
    }
    
    ctx.beginPath();
    ctx.arc(eyeX1, eyeY1, GRID_SIZE * 0.1, 0, Math.PI * 2);
    ctx.arc(eyeX2, eyeY2, GRID_SIZE * 0.1, 0, Math.PI * 2);
    ctx.fill();
}

// Draw game over message
function drawGameOver() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = COLORS.text;
    ctx.font = '32px PrintChar21, monospace';
    ctx.textAlign = 'center';
    ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2 - 20);
    
    ctx.font = '16px PrintChar21, monospace';
    ctx.fillText(`FINAL SCORE: ${gameState.score}`, canvas.width / 2, canvas.height / 2 + 20);
    ctx.fillText('PRESS ENTER TO PLAY AGAIN', canvas.width / 2, canvas.height / 2 + 50);
}

// Draw paused message
function drawPaused() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = COLORS.text;
    ctx.font = '32px PrintChar21, monospace';
    ctx.textAlign = 'center';
    ctx.fillText('PAUSED', canvas.width / 2, canvas.height / 2);
    
    ctx.font = '16px PrintChar21, monospace';
    ctx.fillText('PRESS P TO RESUME', canvas.width / 2, canvas.height / 2 + 30);
}

// Helper function to check for collisions
function collides(obj1, obj2) {
    return obj1.x < obj2.x + obj2.width &&
           obj1.x + obj1.width > obj2.x &&
           obj1.y < obj2.y + obj2.height &&
           obj1.y + obj1.height > obj2.y;
}

// Frog dies
function frogDies(cause) {
    gameState.lives--;
    
    // Play appropriate death sound
    if (cause === 'drowned') {
        playSound('splash');
    } else {
        playSound('squash');
    }
    
    if (gameState.lives <= 0) {
        gameOver();
    } else {
        resetFrog();
    }
}

// Reset frog to starting position
function resetFrog() {
    gameState.frog.x = 7 * GRID_SIZE;
    gameState.frog.y = 15 * GRID_SIZE;
    gameState.frog.direction = 'up';
    gameState.frog.jumping = false;
}

// Game over
function gameOver() {
    gameState.gameOver = true;
    
    // Play game over sound
    playSound('gameOver');
    
    // Update high score
    if (gameState.score > gameState.highScore) {
        gameState.highScore = gameState.score;
        localStorage.setItem('froggerHighScore', gameState.highScore);
    }
}

// Level up
function levelUp() {
    gameState.level++;
    gameState.levelCompleted = 0;
    gameState.score += 100 * gameState.level; // Bonus for completing level
    
    // Play level complete sound
    playSound('levelComplete');
    
    // Reset home bases
    gameState.homeBases.forEach(home => {
        home.occupied = false;
    });
    
    // Reset frog
    resetFrog();
    
    // Increase speed for higher levels, but reset after reaching a new level
    gameState.baseSpeed = 0.7; // Reset to base speed
    gameState.speedMultiplier = 1.0 + (gameState.level - 1) * 0.2; // Increase with level
    
    // Generate new obstacles with adjusted difficulty
    generateObstacles();
}

// Reset game
function resetGame() {
    gameState.score = 0;
    gameState.lives = 3;
    gameState.level = 1;
    gameState.gameOver = false;
    gameState.paused = false;
    gameState.levelCompleted = 0;
    
    // Reset difficulty
    gameState.baseSpeed = 0.7;
    gameState.speedMultiplier = 1.0;
    
    // Reset home bases
    gameState.homeBases.forEach(home => {
        home.occupied = false;
    });
    
    // Reset frog
    resetFrog();
    
    // Generate obstacles
    generateObstacles();
}

// Game loop
function gameLoop() {
    // Clear the canvas
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    if (!gameState.paused && !gameState.gameOver && gameState.gameStarted) {
        update();
    }
    
    draw();
    
    // Update score display
    document.getElementById('score').textContent = `SCORE: ${gameState.score}`;
    document.getElementById('high-score').textContent = `HI-SCORE: ${gameState.highScore}`;
    document.getElementById('lives').textContent = `LIVES: ${gameState.lives}`;
    document.getElementById('level').textContent = `LEVEL: ${gameState.level}`;
    
    requestAnimationFrame(gameLoop);
}

// Initialize the game when DOM is loaded
document.addEventListener('DOMContentLoaded', init);
