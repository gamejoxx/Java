document.addEventListener('DOMContentLoaded', function() {
    const gridContainer = document.getElementById('grid-container');
    const numRows = Math.floor(window.innerHeight / 20);
    const numCols = Math.floor(window.innerWidth / 20);

    // Populate grid with cells
    for (let i = 0; i < numRows * numCols; i++) {
        const cell = document.createElement('div');
        cell.style.width = '20px';
        cell.style.height = '20px';
        gridContainer.appendChild(cell);
    }

    gridContainer.addEventListener('click', function(e) {
        const x = Math.floor(e.clientX / 20);
        const y = Math.floor(e.clientY / 20);
        const index = y * numCols + x;
        rippleEffect(index, 0);
    });

    function rippleEffect(index, stage) {
        if (stage > 5) return; // Stop the ripple after 5 stages
        setTimeout(() => {
            const currentCell = gridContainer.children[index];
            if (currentCell && !currentCell.textContent) {
                currentCell.textContent = getRandomChar();
            }
            const nextIndices = [
                index - 1, index + 1, // left and right
                index - numCols, index + numCols, // top and bottom
                index - numCols - 1, index - numCols + 1, // top-left and top-right
                index + numCols - 1, index + numCols + 1 // bottom-left and bottom-right
            ];

            nextIndices.forEach(i => {
                if (i >= 0 && i < gridContainer.children.length) {
                    rippleEffect(i, stage + 1);
                }
            });
        }, 100 * stage); // Delay increases with each stage
    }

    function getRandomChar() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        return chars[Math.floor(Math.random() * chars.length)];
    }
});
