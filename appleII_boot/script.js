document.addEventListener('DOMContentLoaded', function() {
    const terminal = document.getElementById('terminal');
    const menuBar = document.getElementById('menu-bar');

    // Function to update the menu bar with Vault-Tec info and the current date/time
    function updateMenuBar() {
        const date = new Date();
        menuBar.textContent = `Vault-Tec Systems - ${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
    }

    // Call this function immediately to update the menu bar, then set it to update every second
    updateMenuBar();
    setInterval(updateMenuBar, 1000);

    function flashScreen() {
        terminal.style.backgroundColor = 'green';
        setTimeout(() => {
            terminal.style.backgroundColor = '';
        }, 50);
    }

    function clearScreen() {
        terminal.textContent = '';
    }

    function bootSequence() {
        clearScreen();
        // Wait a bit before flashing to ensure it's visible
        setTimeout(flashScreen, 100);
        // Wait a bit more before showing the boot sequence to simulate the screen coming back on
        setTimeout(() => {
            terminal.textContent = '[SYSTEM BOOT SEQUfghfghENCE INITIATED...]\n';
            loadPercentage();
        }, 100);
    }
    
    function loadPercentage() {
        let loadPercentage = 0;
        const loader = setInterval(() => {
            if (loadPercentage < 100) {
                loadPercentage++;
                terminal.textContent = `System Boot Sequence Initiated......[${loadPercentage}%]\r`;
            } else {
                clearInterval(loader);
                // Here you can continue with more boot sequence logic as needed
            }
        }, 20); // The speed of incrementing the percentage
    }

    // Event listener for any key press to start the boot sequence
    document.addEventListener('keydown', bootSequence, { once: true });
});
