document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('colorCanvas');
    const ctx = canvas.getContext('2d');

    let numSquares = 10; // Initial resolution of the grid
    let colors = generateCornerColors(); // Initial corner colors

    function generateRandomColor() {
        return `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`;
    }

    function generateCornerColors() {
        return {
            topLeft: generateRandomColor(),
            topRight: generateRandomColor(),
            bottomLeft: generateRandomColor(),
            bottomRight: generateRandomColor()
        };
    }

    function drawGrid() {
        const squareWidth = canvas.width / numSquares;
        const squareHeight = canvas.height / numSquares;
    
        for (let x = 0; x < numSquares; x++) {
            for (let y = 0; y < numSquares; y++) {
                // Explicitly setting the corner colors
                if (x === 0 && y === 0) {
                    ctx.fillStyle = colors.topLeft; // Top-left corner
                } else if (x === numSquares - 1 && y === 0) {
                    ctx.fillStyle = colors.topRight; // Top-right corner
                } else if (x === 0 && y === numSquares - 1) {
                    ctx.fillStyle = colors.bottomLeft; // Bottom-left corner
                } else if (x === numSquares - 1 && y === numSquares - 1) {
                    ctx.fillStyle = colors.bottomRight; // Bottom-right corner
                } else {
                    ctx.fillStyle = blendColors(x, y, numSquares, colors);
                }
                ctx.fillRect(x * squareWidth, y * squareHeight, squareWidth, squareHeight);
            }
        }
    }
    

    function blendColors(x, y, numSquares, colors) {
        const proportionX = x / numSquares;
        const proportionY = y / numSquares;
        // Interpolating the RGB components separately
        function interpolateColor(minColor, maxColor, proportion) {
            const [rMin, gMin, bMin] = minColor.match(/\d+/g).map(Number);
            const [rMax, gMax, bMax] = maxColor.match(/\d+/g).map(Number);
            const r = rMin + (rMax - rMin) * proportion;
            const g = gMin + (gMax - gMin) * proportion;
            const b = bMin + (bMax - bMin) * proportion;
            return `rgb(${Math.floor(r)}, ${Math.floor(g)}, ${Math.floor(b)})`;
        }
        // Calculate interpolated colors for top and bottom
        const topColor = interpolateColor(colors.topLeft, colors.topRight, proportionX);
        const bottomColor = interpolateColor(colors.bottomLeft, colors.bottomRight, proportionX);
        // Final blend vertically
        return interpolateColor(topColor, bottomColor, proportionY);
    }

    function adjustGridSize(event) {
        const delta = event.deltaY > 0 ? -1 : 1;
        numSquares = Math.max(2, numSquares + delta);
        drawGrid();
    }

    function randomizeColors() {
        colors = generateCornerColors();
        drawGrid();
    }

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        drawGrid();
    });

    window.addEventListener('wheel', adjustGridSize);
    canvas.addEventListener('click', randomizeColors);

    canvas.addEventListener('contextmenu', function(event) {
        event.preventDefault(); // Prevent the default context menu from showing
        numSquares = 3; // Reset the grid resolution to 3x3
        drawGrid(); // Redraw the grid with the new resolution
    });
    

    drawGrid(); // Initial drawing
});

