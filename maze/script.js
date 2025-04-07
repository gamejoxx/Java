// script.js

document.addEventListener('DOMContentLoaded', initMaze);

// Maze variables
let canvas, ctx;
let cellSize = 20;
let cols, rows;
let grid = [];
let current;
let stack = [];
let visited = [];
let animationSpeed = 15; // ms between frames
let animationId;
let colorScheme = {
  background: '#1a1a2e', // dark blue/purple
  wall: '#16213e', // navy blue
  current: '#ff9f1c', // bright orange
  visited: '#2ec4b6', // teal
  trace: '#e71d36', // bright red
  start: '#b5179e', // magenta
  end: '#3a86ff', // bright blue
  hover: '#4cc9f0' // light blue for hover
};
let mouseX = 0;
let mouseY = 0;
let hoveredCell = null;
let mazeComplete = false;

// Add new variables for rooms
let rooms = [];
let roomCount = 5;
let minRoomSize = 3;
let maxRoomSize = 8;

function initMaze() {
  // Setup canvas
  canvas = document.getElementById('dungeonCanvas');
  ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  
  // Calculate grid size
  cols = Math.floor(canvas.width / cellSize);
  rows = Math.floor(canvas.height / cellSize);
  
  // Add mouse interaction
  canvas.addEventListener('mousemove', handleMouseMove);
  
  // Create button
  setupControls();
  
  // Initialize
  createGrid();
  startMazeGeneration();
}

function handleMouseMove(event) {
  const rect = canvas.getBoundingClientRect();
  mouseX = event.clientX - rect.left;
  mouseY = event.clientY - rect.top;
  
  // Find the cell under the mouse
  const cellX = Math.floor(mouseX / cellSize);
  const cellY = Math.floor(mouseY / cellSize);
  
  // Get the cell from the grid
  if (cellX >= 0 && cellX < cols && cellY >= 0 && cellY < rows) {
    const cellIndex = index(cellX, cellY);
    if (cellIndex !== -1) {
      hoveredCell = grid[cellIndex];
      
      // Only render if maze is complete to avoid interfering with generation
      if (mazeComplete) {
        // Redraw the entire grid
        redrawGrid();
        
        // Highlight the hovered cell
        ctx.fillStyle = colorScheme.hover;
        ctx.fillRect(
          hoveredCell.x * cellSize + 2,
          hoveredCell.y * cellSize + 2,
          cellSize - 4,
          cellSize - 4
        );
      }
    }
  }
}

function redrawGrid() {
  // Clear canvas
  ctx.fillStyle = colorScheme.background;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Draw all cells
  for (let cell of grid) {
    cell.show();
  }
  
  // Redraw start and end
  if (mazeComplete && visited.length > 0) {
    let startCell = visited[0];
    let endCell = visited[visited.length - 1];
    
    ctx.fillStyle = colorScheme.start;
    ctx.fillRect(
      startCell.x * cellSize + cellSize / 4, 
      startCell.y * cellSize + cellSize / 4, 
      cellSize / 2, 
      cellSize / 2
    );
    
    ctx.fillStyle = colorScheme.end;
    ctx.fillRect(
      endCell.x * cellSize + cellSize / 4, 
      endCell.y * cellSize + cellSize / 4, 
      cellSize / 2, 
      cellSize / 2
    );
  }
}

function setupControls() {
  // Clean up existing controls
  const controlsContainer = document.getElementById('controls');
  controlsContainer.innerHTML = '';
  
  // Add new generate button
  const generateBtn = document.createElement('button');
  generateBtn.textContent = 'Generate New Dungeon';
  generateBtn.addEventListener('click', () => {
    if (animationId) {
      cancelAnimationFrame(animationId);
    }
    mazeComplete = false;
    createGrid();
    startMazeGeneration();
  });
  
  // Add dark mode toggle
  const darkModeBtn = document.createElement('button');
  darkModeBtn.textContent = 'Toggle Theme';
  darkModeBtn.addEventListener('click', () => {
    // Toggle between color schemes
    if (colorScheme.background === '#1a1a2e') {
      // Switch to light theme
      colorScheme = {
        background: '#f8f9fa',
        wall: '#6c757d',
        current: '#e63946',
        visited: '#a8dadc',
        trace: '#457b9d',
        start: '#bc6c25',
        end: '#073b4c',
        hover: '#118ab2'
      };
    } else {
      // Switch to dark theme
      colorScheme = {
        background: '#1a1a2e',
        wall: '#16213e',
        current: '#ff9f1c',
        visited: '#2ec4b6',
        trace: '#e71d36',
        start: '#b5179e',
        end: '#3a86ff',
        hover: '#4cc9f0'
      };
    }
    
    // Redraw the grid with new colors
    redrawGrid();
  });
  
  // Room count control
  const roomCountSlider = document.createElement('input');
  roomCountSlider.type = 'range';
  roomCountSlider.min = '3';
  roomCountSlider.max = '10';
  roomCountSlider.value = roomCount;
  roomCountSlider.addEventListener('input', (e) => {
    roomCount = parseInt(e.target.value);
  });
  
  const roomCountLabel = document.createElement('label');
  roomCountLabel.textContent = 'Room Count: ';
  
  // Room size control
  const roomSizeSlider = document.createElement('input');
  roomSizeSlider.type = 'range';
  roomSizeSlider.min = '3';
  roomSizeSlider.max = '12';
  roomSizeSlider.value = maxRoomSize;
  roomSizeSlider.addEventListener('input', (e) => {
    maxRoomSize = parseInt(e.target.value);
    minRoomSize = Math.max(3, Math.floor(maxRoomSize / 2));
  });
  
  const roomSizeLabel = document.createElement('label');
  roomSizeLabel.textContent = 'Max Room Size: ';
  
  // Add speed control
  const speedSlider = document.createElement('input');
  speedSlider.type = 'range';
  speedSlider.min = '1';
  speedSlider.max = '50';
  speedSlider.value = animationSpeed;
  speedSlider.addEventListener('input', (e) => {
    animationSpeed = parseInt(e.target.value);
  });
  
  const speedLabel = document.createElement('label');
  speedLabel.textContent = 'Speed: ';
  
  // Add cell size control
  const sizeSlider = document.createElement('input');
  sizeSlider.type = 'range';
  sizeSlider.min = '10';
  sizeSlider.max = '30';
  sizeSlider.value = cellSize;
  sizeSlider.addEventListener('input', (e) => {
    cellSize = parseInt(e.target.value);
  });
  
  const sizeLabel = document.createElement('label');
  sizeLabel.textContent = 'Cell Size: ';
  
  controlsContainer.appendChild(generateBtn);
  controlsContainer.appendChild(darkModeBtn);
  controlsContainer.appendChild(document.createElement('br'));
  controlsContainer.appendChild(roomCountLabel);
  controlsContainer.appendChild(roomCountSlider);
  controlsContainer.appendChild(document.createElement('br'));
  controlsContainer.appendChild(roomSizeLabel);
  controlsContainer.appendChild(roomSizeSlider);
  controlsContainer.appendChild(document.createElement('br'));
  controlsContainer.appendChild(speedLabel);
  controlsContainer.appendChild(speedSlider);
  controlsContainer.appendChild(document.createElement('br'));
  controlsContainer.appendChild(sizeLabel);
  controlsContainer.appendChild(sizeSlider);
}

function createGrid() {
  grid = [];
  rooms = [];
  
  // Initialize the grid
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      grid.push(new Cell(x, y));
    }
  }
  
  // Create random rooms
  createRooms();
  
  // Set a random starting point
  current = grid[Math.floor(Math.random() * grid.length)];
  visited = [current];
  stack = [current];
  
  // Clear canvas
  ctx.fillStyle = colorScheme.background;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Draw initial grid with rooms
  for (let cell of grid) {
    cell.show();
  }
}

function createRooms() {
  // Generate random rooms
  for (let i = 0; i < roomCount; i++) {
    // Random room size
    const width = Math.floor(Math.random() * (maxRoomSize - minRoomSize + 1)) + minRoomSize;
    const height = Math.floor(Math.random() * (maxRoomSize - minRoomSize + 1)) + minRoomSize;
    
    // Random position (avoid edges)
    const x = Math.floor(Math.random() * (cols - width - 2)) + 1;
    const y = Math.floor(Math.random() * (rows - height - 2)) + 1;
    
    // Check for overlap with existing rooms
    let overlaps = false;
    for (let room of rooms) {
      if (
        x < room.x + room.width + 1 &&
        x + width + 1 > room.x &&
        y < room.y + room.height + 1 &&
        y + height + 1 > room.y
      ) {
        overlaps = true;
        break;
      }
    }
    
    // If no overlap, add the room
    if (!overlaps) {
      const room = { x, y, width, height };
      rooms.push(room);
      
      // Mark all cells in the room as visited
      for (let ry = y; ry < y + height; ry++) {
        for (let rx = x; rx < x + width; rx++) {
          const cell = grid[index(rx, ry)];
          if (cell) {
            cell.visited = true;
            cell.inRoom = true;
            visited.push(cell);
            
            // Remove inner walls
            if (rx > x) cell.walls.left = false;
            if (rx < x + width - 1) cell.walls.right = false;
            if (ry > y) cell.walls.top = false;
            if (ry < y + height - 1) cell.walls.bottom = false;
          }
        }
      }
    }
  }
  
  // Connect rooms with corridors
  if (rooms.length > 1) {
    for (let i = 0; i < rooms.length - 1; i++) {
      connectRooms(rooms[i], rooms[i + 1]);
    }
    
    // Connect a few more rooms randomly for more paths
    for (let i = 0; i < Math.min(2, Math.floor(rooms.length / 2)); i++) {
      const roomA = rooms[Math.floor(Math.random() * rooms.length)];
      const roomB = rooms[Math.floor(Math.random() * rooms.length)];
      if (roomA !== roomB) {
        connectRooms(roomA, roomB);
      }
    }
  }
}

function connectRooms(roomA, roomB) {
  // Choose random points in each room
  const pointA = {
    x: Math.floor(Math.random() * roomA.width) + roomA.x,
    y: Math.floor(Math.random() * roomA.height) + roomA.y
  };
  
  const pointB = {
    x: Math.floor(Math.random() * roomB.width) + roomB.x,
    y: Math.floor(Math.random() * roomB.height) + roomB.y
  };
  
  // Randomly choose horizontal or vertical first
  if (Math.random() < 0.5) {
    // Horizontal then vertical
    createHorizontalCorridor(pointA.x, pointB.x, pointA.y);
    createVerticalCorridor(pointA.y, pointB.y, pointB.x);
  } else {
    // Vertical then horizontal
    createVerticalCorridor(pointA.y, pointB.y, pointA.x);
    createHorizontalCorridor(pointA.x, pointB.x, pointB.y);
  }
}

function createHorizontalCorridor(x1, x2, y) {
  const start = Math.min(x1, x2);
  const end = Math.max(x1, x2);
  
  for (let x = start; x <= end; x++) {
    const cell = grid[index(x, y)];
    if (cell) {
      cell.visited = true;
      cell.inCorridor = true;
      visited.push(cell);
      
      // Remove horizontal walls
      if (x < end) cell.walls.right = false;
      if (x > start) cell.walls.left = false;
    }
  }
}

function createVerticalCorridor(y1, y2, x) {
  const start = Math.min(y1, y2);
  const end = Math.max(y1, y2);
  
  for (let y = start; y <= end; y++) {
    const cell = grid[index(x, y)];
    if (cell) {
      cell.visited = true;
      cell.inCorridor = true;
      visited.push(cell);
      
      // Remove vertical walls
      if (y < end) cell.walls.bottom = false;
      if (y > start) cell.walls.top = false;
    }
  }
}

function startMazeGeneration() {
  mazeComplete = false;
  let lastFrameTime = 0;
  
  function animate(timestamp) {
    if (timestamp - lastFrameTime > animationSpeed) {
      if (stack.length > 0) {
        current = stack[stack.length - 1];
        current.visited = true;
        current.highlight();
        
        // Get next cell
        let next = current.checkNeighbors();
        
        if (next) {
          // Mark as visited
          next.visited = true;
          visited.push(next);
          
          // Remove walls between cells
          removeWalls(current, next);
          
          // Move to next cell
          stack.push(next);
        } else {
          stack.pop();
          // Draw trace path
          if (stack.length > 0) {
            let prevCell = stack[stack.length - 1];
            drawPath(current, prevCell);
          }
        }
      } else if (visited.length > 0) {
        // Mark start and end
        let startCell = visited[0];
        let endCell = visited[visited.length - 1];
        
        // Mark start and end with special colors
        ctx.fillStyle = colorScheme.start;
        ctx.fillRect(
          startCell.x * cellSize + cellSize / 4, 
          startCell.y * cellSize + cellSize / 4, 
          cellSize / 2, 
          cellSize / 2
        );
        
        ctx.fillStyle = colorScheme.end;
        ctx.fillRect(
          endCell.x * cellSize + cellSize / 4, 
          endCell.y * cellSize + cellSize / 4, 
          cellSize / 2, 
          cellSize / 2
        );
        
        // Maze generation completed
        mazeComplete = true;
        return;
      }
      
      lastFrameTime = timestamp;
    }
    
    animationId = requestAnimationFrame(animate);
  }
  
  animationId = requestAnimationFrame(animate);
}

function drawPath(a, b) {
  ctx.beginPath();
  ctx.strokeStyle = colorScheme.trace;
  ctx.lineWidth = cellSize / 5;
  ctx.moveTo(a.x * cellSize + cellSize / 2, a.y * cellSize + cellSize / 2);
  ctx.lineTo(b.x * cellSize + cellSize / 2, b.y * cellSize + cellSize / 2);
  ctx.stroke();
}

function index(x, y) {
  // Return -1 if outside the grid
  if (x < 0 || y < 0 || x >= cols || y >= rows) return -1;
  return x + y * cols;
}

function removeWalls(a, b) {
  // Find the relative positions
  let x = a.x - b.x;
  let y = a.y - b.y;
  
  if (x === 1) {
    // a is to the right of b
    a.walls.left = false;
    b.walls.right = false;
  } else if (x === -1) {
    // a is to the left of b
    a.walls.right = false;
    b.walls.left = false;
  }
  
  if (y === 1) {
    // a is below b
    a.walls.top = false;
    b.walls.bottom = false;
  } else if (y === -1) {
    // a is above b
    a.walls.bottom = false;
    b.walls.top = false;
  }
}

class Cell {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.visited = false;
    this.inRoom = false;
    this.inCorridor = false;
    this.walls = {
      top: true,
      right: true,
      bottom: true,
      left: true
    };
  }
  
  highlight() {
    ctx.fillStyle = colorScheme.current;
    ctx.fillRect(
      this.x * cellSize + 2, 
      this.y * cellSize + 2, 
      cellSize - 4, 
      cellSize - 4
    );
  }
  
  show() {
    let x = this.x * cellSize;
    let y = this.y * cellSize;
    
    // Draw different cells based on type
    if (this.visited) {
      if (this.inRoom) {
        // Room cells are slightly different color
        ctx.fillStyle = colorScheme.visited;
        // Make rooms slightly brighter
        ctx.globalAlpha = 1.2;
        ctx.fillRect(x, y, cellSize, cellSize);
        ctx.globalAlpha = 1.0;
      } else if (this.inCorridor) {
        // Corridor cells
        ctx.fillStyle = colorScheme.visited;
        // Make corridors slightly darker
        ctx.globalAlpha = 0.85;
        ctx.fillRect(x, y, cellSize, cellSize);
        ctx.globalAlpha = 1.0;
      } else {
        // Regular visited cells
        ctx.fillStyle = colorScheme.visited;
        ctx.fillRect(x, y, cellSize, cellSize);
      }
    }
    
    // Draw walls
    ctx.strokeStyle = colorScheme.wall;
    ctx.lineWidth = 2;
    
    if (this.walls.top) {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + cellSize, y);
      ctx.stroke();
    }
    
    if (this.walls.right) {
      ctx.beginPath();
      ctx.moveTo(x + cellSize, y);
      ctx.lineTo(x + cellSize, y + cellSize);
      ctx.stroke();
    }
    
    if (this.walls.bottom) {
      ctx.beginPath();
      ctx.moveTo(x, y + cellSize);
      ctx.lineTo(x + cellSize, y + cellSize);
      ctx.stroke();
    }
    
    if (this.walls.left) {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x, y + cellSize);
      ctx.stroke();
    }
  }
  
  checkNeighbors() {
    let neighbors = [];
    
    // Get all possible neighbors
    let top = grid[index(this.x, this.y - 1)];
    let right = grid[index(this.x + 1, this.y)];
    let bottom = grid[index(this.x, this.y + 1)];
    let left = grid[index(this.x - 1, this.y)];
    
    // Add unvisited neighbors
    if (top && !top.visited) neighbors.push(top);
    if (right && !right.visited) neighbors.push(right);
    if (bottom && !bottom.visited) neighbors.push(bottom);
    if (left && !left.visited) neighbors.push(left);
    
    // Pick a random unvisited neighbor
    if (neighbors.length > 0) {
      return neighbors[Math.floor(Math.random() * neighbors.length)];
    }
    
    return undefined;
  }
} 