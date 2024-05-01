document.addEventListener('DOMContentLoaded', function () {
    const container = document.getElementById('ascii-container');

    document.addEventListener('click', function (e) {
        const x = e.clientX;
        const y = e.clientY;
        createWave(x, y);
    });

    function createWave(x, y) {
        const maxChars = 100; // Maximum number of characters in a wave
        const speed = 100; // Speed of wave spread in milliseconds
        const fadeStart = 500; // Time in milliseconds after which characters start to fade

        for (let i = 0; i < maxChars; i++) {
            setTimeout(() => {
                const charElement = document.createElement('span');
                charElement.textContent = getRandomChar();
                charElement.style.position = 'absolute';
                charElement.style.left = `${x}px`;
                charElement.style.top = `${y}px`;
                charElement.style.opacity = 1;
                container.appendChild(charElement);

                // Animation for moving
                const angle = Math.random() * 2 * Math.PI;
                const distance = Math.random() * 150; // Random distance for spread
                const targetX = x + distance * Math.cos(angle);
                const targetY = y + distance * Math.sin(angle);

                const moveDuration = 2000; // Duration in milliseconds for the move
                charElement.animate([
                    { transform: `translate(0, 0)`, opacity: 1 },
                    { transform: `translate(${targetX - x}px, ${targetY - y}px)`, opacity: 0 }
                ], {
                    duration: moveDuration,
                    easing: 'ease-out'
                });

                setTimeout(() => {
                    charElement.remove(); // Clean up the element after animation
                }, moveDuration);
            }, i * speed);
        }
    }

    function getRandomChar() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        return chars.charAt(Math.floor(Math.random() * chars.length));
    }
});
