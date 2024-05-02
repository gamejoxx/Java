document.addEventListener('DOMContentLoaded', function() {
    const gridContainer = document.getElementById('grid-container');
    const numRows = Math.floor(window.innerHeight / 20);
    const numCols = Math.floor(window.innerWidth / 20);

    // Populate grid with cells
    for (let i = 0; i < numRows * numCols; i++) {
        const cell = document.createElement('div');
        cell.style.width = '10px';
        cell.style.height = '10px';
        gridContainer.appendChild(cell);
    }

    gridContainer.addEventListener('click', function(e) {
        const x = Math.floor(e.clientX / 20);
        const y = Math.floor(e.clientY / 20);
        const index = y * numCols + x;
        rippleEffect(index, 0);
    });

    function rippleEffect(index, stage) {
        if (stage > Math.floor(Math.random() * 6) + 1) return; // Reduce ripple range to manage performance
        setTimeout(() => {
            const currentCell = gridContainer.children[index];
            if (currentCell && !currentCell.textContent) { // Only update empty cells
                currentCell.textContent = getRandomChar();

                // Set a "lifetime" for the character to clear it efficiently
                setTimeout(() => {
                    if (currentCell) { // Ensure the cell exists when attempting to clear
                        currentCell.textContent = '';
                    }
                }, 400); // Short lifetime for each character
            }
            // Define neighbors indices for the ripple effect
            const nextIndices = [
                index - Math.floor(Math.random() * 2) + 1, index + Math.floor(Math.random() * 2) + 1, // left and right
                index - numCols + Math.floor(Math.random() * 2) + 1, index + numCols + Math.floor(Math.random() * 2) + 1, // top and bottom
                index - numCols - Math.floor(Math.random() * 2) + 1, index - numCols + Math.floor(Math.random() * 2) + 1, // top-left and top-right
                index + numCols - Math.floor(Math.random() * 2) + 1, index + numCols + Math.floor(Math.random() * 2) + 1 // bottom-left and bottom-right
            ];

            nextIndices.forEach(i => {
                if (i >= 0 && i < gridContainer.children.length) {
                    rippleEffect(i, stage + 1);
                }
            });
        }, 25 * stage); // Maintain fast ripple speed
    }

    function getRandomChar() {
        const chars = 'ABCDEFGHIJKLMNO345968702-=-?_PQRSTUVWXYZ%#^$%^#%@$^*&(*($&*#^&@$%^#$%';
        return chars[Math.floor(Math.random() * chars.length)];
    }
});
