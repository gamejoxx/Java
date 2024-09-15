document.addEventListener('DOMContentLoaded', function () {
    const terminal = document.getElementById('terminal');
    const menuBar = document.getElementById('menu-bar');

    // Play a beep sound
    function playBeep(frequency = 680, duration = 100) {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioCtx.createOscillator();
        oscillator.type = 'square';
        oscillator.frequency.setValueAtTime(frequency, audioCtx.currentTime);
        oscillator.connect(audioCtx.destination);
        oscillator.start();
        setTimeout(() => oscillator.stop(), duration);
    }

    // Single flash of the screen at the start
    function flashScreen() {
        terminal.style.backgroundColor = 'white';
        setTimeout(() => terminal.style.backgroundColor = 'black', 100);
    }

    // Spinner animation
    const spinnerChars = ['/', '-', '\\', '|'];
    let spinnerIndex = 0;

    function updateSpinner() {
        spinnerIndex = (spinnerIndex + 1) % spinnerChars.length;
        return spinnerChars[spinnerIndex];
    }

    // Dots animation under the current line
    function animateDots(underElement) {
        const dotsElement = document.createElement('div');
        dotsElement.textContent = '';
        dotsElement.style.color = 'lime';
        underElement.appendChild(dotsElement);
        
        function moveDots() {
            dotsElement.textContent += '.';
            if (dotsElement.textContent.length > 30) {
                dotsElement.textContent = '';
            }
            setTimeout(moveDots, 100);
        }
        moveDots();
    }

    // Update the menu bar with the current date and time
    function updateMenuBar() {
        const date = new Date();
        menuBar.textContent = `System Boot - ${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
    }
    updateMenuBar();
    setInterval(updateMenuBar, 1000);

    // Boot messages
    const bootMessages = [
        { text: 'INITIALIZING SYSTEM MEMORY', followUp: 'MEMORY CHECK COMPLETE: ALL MODULES FUNCTIONAL', color: 'lime' },
        { text: 'LOADING KERNEL MODULES', followUp: 'KERNEL MODULES LOADED SUCCESSFULLY', color: 'lime' },
        { text: 'CHECKING SYSTEM INTEGRITY', followUp: 'SYSTEM INTEGRITY: STABLE', color: 'lime' },
        { text: 'ESTABLISHING NETWORK CONNECTION', followUp: 'NETWORK CONNECTION ESTABLISHED', color: 'lime' },
        { text: 'LOADING USER INTERFACE', followUp: 'USER INTERFACE LOADED', color: 'lime' },
        { text: 'FINALIZING SETUP', followUp: 'SETUP COMPLETE', color: 'lime' },
    ];

    // Alien virus messages
    const alienMessages = [
        { text: '***ERROR*** FOREIGN ENTITY DETECTED', color: 'red' },
        { text: '▓▒▓▒▓▒▓▒▓▒▓▒▓▒▓▒▓▒▓▒▓▒▓▒▓▒▓▒▓▒▓▒▓▒▓▒█', color: 'red' },
        { text: 'ALERT: SYSTEM INFILTRATED BY XENO PROTOCOL', color: 'red' },
        { text: '▒▓▒▓▒▓▒▓▒▓▒▓▒▓▒▓▒▓▒▓▒▓▒▓▒▓▒▓▒▓▒▓▒▓▒▓▒▓▒▓▒▓▒▓▒▓▒▓▒▓▒▓', color: 'lime' },
        { text: 'ERROR: SYSTEM CONTROL OVERRIDDEN BY UNKNOWN ENTITY', color: 'red' },
        { text: '█▒▓▒▓▒▓▒▓▒▓▒▓▒▓▒▓▒▓▒▓▒▓▒▓▒▓▒▓▒▓▒▓▒▓▒█', color: 'lime' },
    ];

    // Randomly position alien messages
    function randomizeAlienPosition(alienElement) {
        alienElement.style.position = 'absolute';
        alienElement.style.left = `${Math.random() * 90}%`;
        alienElement.style.top = `${Math.random() * 80}%`;
        alienElement.style.zIndex = Math.floor(Math.random() * 10);
    }

    // Hex number scrubbing effect
    function hexScrubbingEffect() {
        const hexElement = document.createElement('div');
        hexElement.style.color = 'lime';
        terminal.appendChild(hexElement);

        const hexChars = '0123456789ABCDEF';
        function updateHex() {
            let randomHex = '';
            for (let i = 0; i < 40; i++) {
                randomHex += hexChars[Math.floor(Math.random() * hexChars.length)];
            }
            hexElement.textContent = randomHex;
            setTimeout(updateHex, 100);
        }
        updateHex();

        // Remove the hex scrubbing effect after some time
        setTimeout(() => terminal.removeChild(hexElement), 5000);
    }

    // ASCII animation effect
    function asciiAnimation() {
        const asciiArt = [
            '▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀',
            '█░█░█░█░█░█░█░█░█░█░█',
            '▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀',
        ];
        let asciiIndex = 0;

        const asciiElement = document.createElement('div');
        asciiElement.style.color = 'lime';
        terminal.appendChild(asciiElement);

        function updateAscii() {
            asciiElement.textContent = asciiArt[asciiIndex];
            asciiIndex = (asciiIndex + 1) % asciiArt.length;
            setTimeout(updateAscii, 150);
        }
        updateAscii();

        // Remove the ASCII animation after some time
        setTimeout(() => terminal.removeChild(asciiElement), 6000);
    }

    // Display boot messages with randomness
    function displayBootMessages(messages, alienChance = 0.5) {
        let index = 0;

        function showMessage() {
            const isAlienMessage = Math.random() < alienChance;

            if (index < messages.length) {
                const message = isAlienMessage ? alienMessages[Math.floor(Math.random() * alienMessages.length)] : messages[index];
                const messageElement = document.createElement('div');
                messageElement.style.color = message.color;
                messageElement.textContent = `${message.text} ${updateSpinner()}...`;
                terminal.appendChild(messageElement);

                if (isAlienMessage) {
                    randomizeAlienPosition(messageElement);
                }

                let loadPercentage = 0;
                const randomDelay = Math.random() * 50 + 50;
                const loadingInterval = setInterval(() => {
                    loadPercentage += Math.floor(Math.random() * 20) + 10;

                    if (loadPercentage >= 100 || Math.random() < 0.05) {
                        clearInterval(loadingInterval);
                        messageElement.textContent = `${message.text} 100%`;
                        setTimeout(showMessage, 500 + Math.random() * 500);
                        index++;
                    } else {
                        messageElement.textContent = `${message.text} ${loadPercentage}% ${updateSpinner()}`;
                    }
                }, randomDelay);

                if (!isAlienMessage) {
                    animateDots(messageElement); // Dots move under the current line
                }

            } else {
                playBeep(1000, 200);
                const completeElement = document.createElement('div');
                completeElement.style.color = 'lime';
                completeElement.textContent = '\nSYSTEM READY.\n';
                terminal.appendChild(completeElement);
            }
        }
        showMessage();
    }

    // Start boot sequence after initial flash
    setTimeout(() => {
        flashScreen(); // Single screen flash at start
        playBeep(); // Initial beep
        hexScrubbingEffect(); // Hex scrubbing effect
        asciiAnimation(); // ASCII animation
        displayBootMessages(bootMessages);
    }, 1000);
});
