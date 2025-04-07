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
        
        // Game level
        level: 1,
        
        // Simple maze layout (0=wall, 1=path, 2=exit)
        map: [],
        
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
    const EXIT_COLOR = '#00FF00';
    const EXIT_FLOOR_COLOR = '#003300'; // Darkest green used so far
    
    // Update level display
    function updateLevelDisplay() {
        document.getElementById('status-bar').textContent = `DUNGEON LEVEL ${state.level}`;
    }
    
    // Generate a random maze using improved algorithm to ensure connectivity
    function generateMaze(width, height) {
        // Initialize with all walls
        const maze = Array(height).fill().map(() => Array(width).fill(0));
        
        // Start position
        const startX = 1;
        const startY = 1;
        
        // Create a visit tracker separate from the maze
        const visited = Array(height).fill().map(() => Array(width).fill(false));
        
        // Mark start as path
        maze[startY][startX] = 1;
        visited[startY][startX] = true;
        
        // Function to get all valid neighbors to consider
        function getUnvisitedNeighbors(x, y) {
            const neighbors = [];
            
            // Check all 4 directions
            const directions = [
                {dx: 0, dy: -2, dir: 'N'},  // Up
                {dx: 2, dy: 0, dir: 'E'},   // Right
                {dx: 0, dy: 2, dir: 'S'},   // Down
                {dx: -2, dy: 0, dir: 'W'}   // Left
            ];
            
            for (const dir of directions) {
                const nx = x + dir.dx;
                const ny = y + dir.dy;
                
                // Check if neighbor is in bounds and unvisited
                if (nx > 0 && nx < width-1 && ny > 0 && ny < height-1 && !visited[ny][nx]) {
                    neighbors.push({x: nx, y: ny, dir: dir.dir});
                }
            }
            
            return neighbors;
        }
        
        // Stack for backtracking
        const stack = [{x: startX, y: startY}];
        
        // While we have cells in the stack
        while (stack.length > 0) {
            const current = stack[stack.length - 1];
            const neighbors = getUnvisitedNeighbors(current.x, current.y);
            
            if (neighbors.length === 0) {
                stack.pop();
                continue;
            }
            
            // Choose a random unvisited neighbor
            const next = neighbors[Math.floor(Math.random() * neighbors.length)];
            
            // Mark the chosen cell as visited
            visited[next.y][next.x] = true;
            maze[next.y][next.x] = 1;
            
            // Connect current cell to chosen cell by making the cell between them a path
            if (next.dir === 'N') {
                maze[current.y - 1][current.x] = 1;
            } else if (next.dir === 'S') {
                maze[current.y + 1][current.x] = 1;
            } else if (next.dir === 'E') {
                maze[current.y][current.x + 1] = 1;
            } else if (next.dir === 'W') {
                maze[current.y][current.x - 1] = 1;
            }
            
            // Add the chosen cell to the stack
            stack.push(next);
        }
        
        // Ensure outer walls
        for (let y = 0; y < height; y++) {
            maze[y][0] = 0;
            maze[y][width-1] = 0;
        }
        for (let x = 0; x < width; x++) {
            maze[0][x] = 0;
            maze[height-1][x] = 0;
        }
        
        // Ensure starting position is open
        maze[1][1] = 1;
        
        // Find the farthest cell from start for the exit
        let maxDistance = 0;
        let exitX = 1;
        let exitY = 1;
        
        // We'll use a breadth-first search to find distances
        const queue = [{x: startX, y: startY, dist: 0}];
        const distanceMap = Array(height).fill().map(() => Array(width).fill(-1));
        distanceMap[startY][startX] = 0;
        
        while (queue.length > 0) {
            const current = queue.shift();
            
            // Check all 4 directions
            const directions = [
                {dx: 0, dy: -1},  // Up
                {dx: 1, dy: 0},   // Right
                {dx: 0, dy: 1},   // Down
                {dx: -1, dy: 0}   // Left
            ];
            
            for (const dir of directions) {
                const nx = current.x + dir.dx;
                const ny = current.y + dir.dy;
                
                // Check if neighbor is in bounds, is a path, and hasn't been visited in BFS
                if (nx > 0 && nx < width-1 && ny > 0 && ny < height-1 && 
                    maze[ny][nx] === 1 && distanceMap[ny][nx] === -1) {
                    
                    const newDist = current.dist + 1;
                    distanceMap[ny][nx] = newDist;
                    queue.push({x: nx, y: ny, dist: newDist});
                    
                    // Update exit if this is the farthest valid cell
                    if (newDist > maxDistance) {
                        maxDistance = newDist;
                        exitX = nx;
                        exitY = ny;
                    }
                }
            }
        }
        
        // Place exit at the furthest reachable point
        if (maxDistance > 0) {
            maze[exitY][exitX] = 2;
        } else {
            // Fallback (should not happen with proper generation)
            maze[height-2][width-2] = 2;
        }
        
        return maze;
    }
    
    // Initialize level
    function initLevel() {
        // Generate a maze of size proportional to the level
        const size = 8 + Math.min(4, Math.floor(state.level / 2));
        state.map = generateMaze(size, size);
        state.playerX = 1.5;
        state.playerY = 1.5;
        state.playerDir = 0;
        
        updateLevelDisplay();
        render();
    }
    
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
                    // Wall
                    mapCtx.fillStyle = WALL_COLOR;
                    mapCtx.fillRect(
                        x * tileSize,
                        y * tileSize,
                        tileSize,
                        tileSize
                    );
                } else if (state.map[y][x] === 2) {
                    // Exit
                    mapCtx.fillStyle = EXIT_COLOR;
                    mapCtx.fillRect(
                        x * tileSize,
                        y * tileSize,
                        tileSize,
                        tileSize
                    );
                } else {
                    // Path
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
        
        // Calculate which exit cells are visible from the player's position
        // This prevents seeing the exit through walls
        const visibleExitCells = [];
        
        // Draw walls and track visible cells
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
            let cellType = 0; // Type of cell hit (0=wall, 1=path, 2=exit)
            
            // Keep track of cells we pass through before hitting a wall
            const rayPath = [];
            
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
                
                // Add cell to ray path
                if (mapX >= 0 && mapY >= 0 && mapX < state.map[0].length && mapY < state.map.length) {
                    rayPath.push({x: mapX, y: mapY, type: state.map[mapY][mapX]});
                    
                    // Check if ray has hit a wall
                    if (state.map[mapY][mapX] === 0) {
                        hit = 1;
                        cellType = state.map[mapY][mapX];
                    } else if (state.map[mapY][mapX] === 2) {
                        // Mark exit cell as visible for this ray
                        visibleExitCells.push({x: mapX, y: mapY, screenX: x});
                    }
                } else {
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
            
            // Choose wall color based on side
            ctx.fillStyle = side === 0 ? WALL_COLOR : '#004400';
            
            // Draw the wall stripe
            ctx.fillRect(x, drawStart, 1, drawEnd - drawStart);
        }
        
        // Draw exit floor for only visible exit cells
        // Loop through each ray
        for (let x = 0; x < numRays; x++) {
            const cameraX = 2 * x / numRays - 1;
            
            // For each vertical line on the floor
            for (let y = canvas.height / 2; y < canvas.height; y++) {
                // Calculate ray direction for floor
                const rayDirX0 = dirX[state.playerDir] - planeX[state.playerDir];
                const rayDirY0 = dirY[state.playerDir] - planeY[state.playerDir];
                const rayDirX1 = dirX[state.playerDir] + planeX[state.playerDir];
                const rayDirY1 = dirY[state.playerDir] + planeY[state.playerDir];
                
                // Calculate position on screen
                const p = y - canvas.height / 2;
                const posZ = 0.5 * canvas.height;
                const rowDistance = posZ / p;
                
                // Calculate real-world step vector
                const floorStepX = rowDistance * (rayDirX1 - rayDirX0) / canvas.width;
                const floorStepY = rowDistance * (rayDirY1 - rayDirY0) / canvas.width;
                
                // Calculate real-world coordinates
                let floorX = state.playerX + rowDistance * rayDirX0 + floorStepX * x;
                let floorY = state.playerY + rowDistance * rayDirY0 + floorStepY * x;
                
                // Get map coordinates
                const mapX = Math.floor(floorX);
                const mapY = Math.floor(floorY);
                
                // Check if this is the exit tile AND it's visible
                if (mapX >= 0 && mapY >= 0 && mapX < state.map[0].length && mapY < state.map.length && 
                    state.map[mapY][mapX] === 2) {
                    
                    // Check if this exit cell is visible from the player's position
                    const isVisible = visibleExitCells.some(cell => cell.x === mapX && cell.y === mapY);
                    
                    if (isVisible) {
                        // Draw exit floor - solid dark green with occasional brighter pixels
                        ctx.fillStyle = EXIT_FLOOR_COLOR;
                        ctx.fillRect(x, y, 1, 1);
                        
                        // Add subtle pulsing effect (less frequent bright dots)
                        if (Math.random() > 0.98) {
                            ctx.fillStyle = EXIT_COLOR;
                            ctx.fillRect(x, y, 1, 1);
                        }
                    }
                }
            }
        }
        
        // Update the map view
        renderMap();
    }
    
    // Check if a position is valid and what it contains
    function checkPosition(x, y) {
        const gridX = Math.floor(x);
        const gridY = Math.floor(y);
        
        if (gridX < 0 || gridY < 0 || gridX >= state.map[0].length || gridY >= state.map.length) {
            return { valid: false, type: 0 };
        }
        
        const cellType = state.map[gridY][gridX];
        return { 
            valid: cellType !== 0, 
            type: cellType
        };
    }
    
    // Handle level transition
    function nextLevel() {
        // Display level transition message with improved visibility
        const message = document.createElement('div');
        message.id = 'level-message';
        message.textContent = `ENTERING LEVEL ${state.level + 1}`;
        message.style.position = 'absolute';
        message.style.top = '50%';
        message.style.left = '50%';
        message.style.transform = 'translate(-50%, -50%)';
        message.style.color = '#FFFFFF';  // White text
        message.style.fontSize = '30px';
        message.style.fontFamily = 'PrintChar21, monospace';
        message.style.textShadow = '0 0 10px #00FF00, 0 0 20px #00FF00';  // Green glow
        message.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';  // Semi-transparent background
        message.style.padding = '20px';
        message.style.borderRadius = '10px';
        message.style.border = '2px solid #00FF00';
        message.style.zIndex = 100;
        document.getElementById('game-container').appendChild(message);
        
        // Increment level and generate new maze after a delay
        setTimeout(() => {
            state.level++;
            message.remove();
            initLevel();
            // Explicitly unlock movement after level initialization
            state.movementLocked = false;
        }, 1500);
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
                
                // Check position
                const forwardCheck = checkPosition(newX, newY);
                if (forwardCheck.valid) {
                    // Move one full grid cell forward
                    state.playerX = Math.floor(newX) + 0.5;
                    state.playerY = Math.floor(newY) + 0.5;
                    
                    // Check if we reached the exit
                    if (forwardCheck.type === 2) {
                        lockMovement(true); // Lock movement until next level loads
                        nextLevel();
                        return;
                    }
                    
                    // Lock movement briefly to prevent rapid key presses
                    lockMovement();
                }
                break;
                
            case 'ArrowDown':
                // Calculate backward position (1 full grid step backward)
                const backX = state.playerX - dirX[state.playerDir];
                const backY = state.playerY - dirY[state.playerDir];
                
                // Check backward position
                const backwardCheck = checkPosition(backX, backY);
                if (backwardCheck.valid) {
                    // Move one full grid cell backward
                    state.playerX = Math.floor(backX) + 0.5;
                    state.playerY = Math.floor(backY) + 0.5;
                    
                    // Check if we reached the exit
                    if (backwardCheck.type === 2) {
                        lockMovement(true); // Lock movement until next level loads
                        nextLevel();
                        return;
                    }
                    
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
    function lockMovement(permanent = false) {
        state.movementLocked = true;
        if (!permanent) {
            setTimeout(() => {
                state.movementLocked = false;
            }, 250); // 250ms delay between moves
        }
    }
    
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
    
    // Initialize first level
    initLevel();
});
