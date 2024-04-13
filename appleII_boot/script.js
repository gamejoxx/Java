document.addEventListener('DOMContentLoaded', function() {
    const terminal = document.getElementById('terminal');
    const menuBar = document.getElementById('menu-bar');

    // Function to update the menu bar with Vault-Tec info and the current date/time
    function updateMenuBar() {
        const date = new Date();
        menuBar.textContent = `Vault-Tec Systems - ${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
    }

    // Update the menu bar every second with the current date and time
    updateMenuBar();
    setInterval(updateMenuBar, 1000);

    // Function to play a beep sound
    function playBeep() {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioCtx.createOscillator();
        oscillator.type = 'square';
        oscillator.frequency.setValueAtTime(440, audioCtx.currentTime);
        oscillator.connect(audioCtx.destination);
        oscillator.start();
        setTimeout(() => oscillator.stop(), 200);
    }

    // Function to flash the screen
    function flashScreen() {
        terminal.style.backgroundColor = 'green';
        setTimeout(() => terminal.style.backgroundColor = '', 50);
    }

    // Function to clear the terminal screen
    function clearScreen() {
        terminal.textContent = '';
    }

    // Boot message sequence and follow-ups
    const bootMessages = [
        { text: 'PERFORMING MEMORY INTEGRITY CHECK...', followUp: 'COMPLETE - ALL 2048KB FUNCTIONAL AND SECURE.' },
        { text: 'LOADING PRIMARY KERNEL...', followUp: 'KERNEL LOADED. "A SECURE TOMORROW STARTS TODAY WITH VAULT-TEC."' },
        { text: 'ESTABLISHING NETWORK CONNECTIONS...', followUp: 'CONNECTING...CONNECTING...SUCCESS!' },
        { text: 'BOOTSTRAP LOADER INITIALIZED...', followUp: 'CONFIGURING SYSTEM MODULES...' },
        { text: 'LOADING RESOURCE PACKAGES...', followUp: 'INITIATING SYSTEM PROTOCOLS... ENABLING SURVIVAL MECHANISMS...' },
        { text: 'SYSTEM DIAGNOSTICS RUNNING...', followUp: 'PRIMARY: OKAY, SECONDARY: OKAY, TERTIARY: (THAT\'S CLASSIFIED)' },
        { text: 'ACTIVATING USER INTERFACE...', followUp: 'VAULT-TEC INTERFACE ONLINE. WELCOME, OVERSEER!' },
        { text: 'LOADING PERSONALIZED SETTINGS...', followUp: 'PREFERENCES SET, VAULT LIVING MADE COMFORTABLE (CONDITIONALLY).' },
        { text: 'FINALIZING BOOT SEQUENCE...', followUp: 'SYSTEM STABILIZATION COMPLETE. READY TO ASSIST.' },
        { text: 'SYSTEM READY. ENJOY YOUR VAULT-TEC DAY!', followUp: '' }
    ];

    // Shuffle the array to ensure the boot messages appear in random order
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    // Function to display boot messages with loading percentages
    function displayBootMessages(messages) {
        let i = 0;
        let loadPercentage = 0;

        function nextMessage() {
            if (i < messages.length) {
                let message = messages[i];
                terminal.textContent = `[${message.text}...][${loadPercentage}%]`;
                if (loadPercentage === 100) {
                    terminal.textContent += '\n' + message.followUp;
                    playBeep();
                    loadPercentage = 0;
                    i++;
                    setTimeout(nextMessage, 1000); // Wait 2 seconds before the next message
                } else {
                    loadPercentage += 10; // Increase the percentage in increments
                    setTimeout(nextMessage, 100); // Update the percentage every 100ms
                }
            }
        }

        nextMessage(); // Start displaying messages
    }

    // Function to initiate the boot sequence
    function bootSequence() {
        clearScreen();
        flashScreen();
        setTimeout(() => {
            shuffleArray(bootMessages); // Shuffle messages for random order
            displayBootMessages(bootMessages); // Display the boot messages
        }, 100);
    }

    // Event listeners for mouse click or key press to start the boot sequence
    document.addEventListener('keydown', bootSequence, { once: true });
    document.addEventListener('click', bootSequence, { once: true });
});
