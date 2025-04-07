document.addEventListener('DOMContentLoaded', function() {
    // Canvas setup
    const canvas = document.getElementById('dungeon-view');
    const ctx = canvas.getContext('2d');
    
    // Create map canvas and add to DOM
    const mapCanvas = document.createElement('canvas');
    mapCanvas.id = 'map-view';
    mapCanvas.width = 160;
    mapCanvas.height = 160;
    mapCanvas.style.position = 'absolute';
    mapCanvas.style.bottom = '10px';
    mapCanvas.style.right = '10px';
    mapCanvas.style.border = '2px solid rgb(0, 158, 0)';
    document.getElementById('game-container').appendChild(mapCanvas);
    const mapCtx = mapCanvas.getContext('2d');
    
    // Game state
    const state = {
        // Player position and direction
        playerX: 1.5,
        playerY: 1.5,
        playerDir: 0, // 0=North, 1=East, 2=South, 3=West
        
        // Simple maze layout (0=wall, 1=path)
        map: [
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 1, 1, 1, 1, 1, 1, 0],
            [0, 1, 0, 0, 0, 0, 1, 0],
            [0, 1, 0, 1, 1, 0, 1, 0],
            [0, 1, 0, 1, 0, 0, 1, 0],
            [0, 1, 0, 1, 1, 1, 1, 0],
            [0, 1, 1, 1, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0]
        ],
        
        // Movement lock to prevent rapid key presses
        movementLocked: false
    };
    
    // Direction vectors for movement
    const dirX = [0, 1, 0, -1]; // N, E, S, W
    const dirY = [-1, 0, 1, 0]; // N, E, S, W
    
    // Plane vectors for camera plane (perpendicular to direction)
    const planeX = [0.66, 0, -0.66, 0]; // N, E, S, W
    const planeY = [0, 0.66, 0, -0.66]; // N, E, S, W
    
    // Colors
    const WALL_COLOR = '#005500';
    const FLOOR_COLOR = '#001100';
    const CEILING_COLOR = '#003300';
    
    // Draw top-down map
    function renderMap() {
        const tileSize = mapCanvas.width / state.map[0].length;
        
        // Clear map
        mapCtx.fillStyle = 'black';
        mapCtx.fillRect(0, 0, mapCanvas.width, mapCanvas.height);
        
        // Draw map tiles
        for (let y = 0; y < state.map.length; y++) {
            for (let x = 0; x < state.map[y].length; x++) {
                if (state.map[y][x] === 0) {
                    mapCtx.fillStyle = WALL_COLOR;
                    mapCtx.fillRect(
                        x * tileSize,
                        y * tileSize,
                        tileSize,
                        tileSize
                    );
                } else {
                    // Draw path
                    mapCtx.fillStyle = '#001100';
                    mapCtx.fillRect(
                        x * tileSize,
                        y * tileSize,
                        tileSize,
                        tileSize
                    );
                }
            }
        }
        
        // Draw player position
        mapCtx.fillStyle = 'rgb(0, 255, 0)';
        mapCtx.beginPath();
        mapCtx.arc(
            state.playerX * tileSize,
            state.playerY * tileSize,
            tileSize / 3,
            0,
            Math.PI * 2
        );
        mapCtx.fill();
        
        // Draw player direction
        mapCtx.strokeStyle = 'rgb(0, 255, 0)';
        mapCtx.lineWidth = 2;
        mapCtx.beginPath();
        mapCtx.moveTo(
            state.playerX * tileSize,
            state.playerY * tileSize
        );
        mapCtx.lineTo(
            (state.playerX + dirX[state.playerDir] * 0.5) * tileSize,
            (state.playerY + dirY[state.playerDir] * 0.5) * tileSize
        );
        mapCtx.stroke();
    }
    
    // Draw 3D view
    function render() {
        // Clear screen
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw floor
        ctx.fillStyle = FLOOR_COLOR;
        ctx.fillRect(0, canvas.height / 2, canvas.width, canvas.height / 2);
        
        // Draw ceiling
        ctx.fillStyle = CEILING_COLOR;
        ctx.fillRect(0, 0, canvas.width, canvas.height / 2);
        
        // Draw walls
        const numRays = canvas.width;
        
        for (let x = 0; x < numRays; x++) {
            // Calculate ray position and direction
            const cameraX = 2 * x / numRays - 1; // x-coordinate in camera space
            const rayDirX = dirX[state.playerDir] + planeX[state.playerDir] * cameraX;
            const rayDirY = dirY[state.playerDir] + planeY[state.playerDir] * cameraX;
            
            // Map position
            let mapX = Math.floor(state.playerX);
            let mapY = Math.floor(state.playerY);
            
            // Length of ray from current position to next x or y-side
            let sideDistX, sideDistY;
            
            // Length of ray from one x or y-side to next x or y-side
            const deltaDistX = Math.abs(1 / rayDirX);
            const deltaDistY = Math.abs(1 / rayDirY);
            
            // What direction to step in x or y direction (either +1 or -1)
            let stepX, stepY;
            
            // Calculate step and initial sideDist
            if (rayDirX < 0) {
                stepX = -1;
                sideDistX = (state.playerX - mapX) * deltaDistX;
            } else {
                stepX = 1;
                sideDistX = (mapX + 1 - state.playerX) * deltaDistX;
            }
            
            if (rayDirY < 0) {
                stepY = -1;
                sideDistY = (state.playerY - mapY) * deltaDistY;
            } else {
                stepY = 1;
                sideDistY = (mapY + 1 - state.playerY) * deltaDistY;
            }
            
            // Perform DDA (Digital Differential Analysis)
            let hit = 0; // Was there a wall hit?
            let side; // Was a N/S or E/W wall hit?
            
            while (hit === 0) {
                // Jump to next map square
                if (sideDistX < sideDistY) {
                    sideDistX += deltaDistX;
                    mapX += stepX;
                    side = 0;
                } else {
                    sideDistY += deltaDistY;
                    mapY += stepY;
                    side = 1;
                }
                
                // Check if ray has hit a wall
                if (mapX < 0 || mapY < 0 || mapX >= state.map[0].length || mapY >= state.map.length) {
                    hit = 1;
                } else if (state.map[mapY][mapX] === 0) {
                    hit = 1;
                }
            }
            
            // Calculate distance projected on camera direction
            let perpWallDist;
            if (side === 0) {
                perpWallDist = (mapX - state.playerX + (1 - stepX) / 2) / rayDirX;
            } else {
                perpWallDist = (mapY - state.playerY + (1 - stepY) / 2) / rayDirY;
            }
            
            // Calculate height of line to draw on screen
            const lineHeight = Math.floor(canvas.height / perpWallDist);
            
            // Calculate lowest and highest pixel to fill in current stripe
            let drawStart = Math.floor(-lineHeight / 2 + canvas.height / 2);
            if (drawStart < 0) drawStart = 0;
            
            let drawEnd = Math.floor(lineHeight / 2 + canvas.height / 2);
            if (drawEnd >= canvas.height) drawEnd = canvas.height - 1;
            
            // Choose wall color based on side (for simple shading)
            ctx.fillStyle = side === 0 ? WALL_COLOR : '#004400';
            
            // Make y sides darker
            ctx.fillRect(x, drawStart, 1, drawEnd - drawStart);
        }
        
        // Update the map view
        renderMap();
    }
    
    // Check if a move is valid (no wall in the way)
    function isValidMove(x, y) {
        const gridX = Math.floor(x);
        const gridY = Math.floor(y);
        
        return gridX >= 0 && 
               gridY >= 0 && 
               gridX < state.map[0].length && 
               gridY < state.map.length && 
               state.map[gridY][gridX] === 1;
    }
    
    // Handle keyboard input
    document.addEventListener('keydown', function(e) {
        // Skip if movement is locked
        if (state.movementLocked) return;
        
        // Handle movement
        switch(e.key) {
            case 'ArrowUp':
                // Calculate forward position (1 full grid step forward)
                const newX = state.playerX + dirX[state.playerDir];
                const newY = state.playerY + dirY[state.playerDir];
                
                // Check if move is valid (no wall)
                if (isValidMove(newX, newY)) {
                    // Move one full grid cell forward
                    state.playerX = Math.floor(newX) + 0.5;
                    state.playerY = Math.floor(newY) + 0.5;
                    
                    // Lock movement briefly to prevent rapid key presses
                    lockMovement();
                }
                break;
                
            case 'ArrowDown':
                // Calculate backward position (1 full grid step backward)
                const backX = state.playerX - dirX[state.playerDir];
                const backY = state.playerY - dirY[state.playerDir];
                
                // Check if backward move is valid
                if (isValidMove(backX, backY)) {
                    // Move one full grid cell backward
                    state.playerX = Math.floor(backX) + 0.5;
                    state.playerY = Math.floor(backY) + 0.5;
                    
                    // Lock movement briefly
                    lockMovement();
                }
                break;
                
            case 'ArrowLeft':
                // Rotate left (90 degrees)
                state.playerDir = (state.playerDir + 3) % 4;
                lockMovement();
                break;
                
            case 'ArrowRight':
                // Rotate right (90 degrees)
                state.playerDir = (state.playerDir + 1) % 4;
                lockMovement();
                break;
        }
        
        // Re-render after movement
        render();
    });
    
    // Lock movement temporarily to create a more deliberate pace
    function lockMovement() {
        state.movementLocked = true;
        setTimeout(() => {
            state.movementLocked = false;
        }, 250); // 250ms delay between moves
    }
    
    // Initial render
    render();
    
    // Add touch controls for mobile
    if ('ontouchstart' in window) {
        // Touch areas
        const touchControls = [
            { x: 0, y: 0, width: canvas.width/3, height: canvas.height, action: 'left' },
            { x: canvas.width/3, y: 0, width: canvas.width/3, height: canvas.height/2, action: 'up' },
            { x: canvas.width/3, y: canvas.height/2, width: canvas.width/3, height: canvas.height/2, action: 'down' },
            { x: 2*canvas.width/3, y: 0, width: canvas.width/3, height: canvas.height, action: 'right' }
        ];
        
        canvas.addEventListener('touchstart', function(e) {
            e.preventDefault();
            const touch = e.touches[0];
            const touchX = touch.clientX - canvas.offsetLeft;
            const touchY = touch.clientY - canvas.offsetTop;
            
            for (const control of touchControls) {
                if (touchX >= control.x && touchX < control.x + control.width &&
                    touchY >= control.y && touchY < control.y + control.height) {
                    // Simulate key press
                    const keyEvent = new KeyboardEvent('keydown', {
                        key: control.action === 'up' ? 'ArrowUp' : 
                             control.action === 'down' ? 'ArrowDown' :
                             control.action === 'left' ? 'ArrowLeft' : 'ArrowRight'
                    });
                    document.dispatchEvent(keyEvent);
                    break;
                }
            }
        });
    }
});
