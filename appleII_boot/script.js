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
        oscillator.frequency.setValueAtTime(680, audioCtx.currentTime);
        oscillator.connect(audioCtx.destination);
        oscillator.start();
        setTimeout(() => oscillator.stop(), 50);
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
        { text: 'PERFORMING MEMORY INTEGRITY CHECK.........', followUp: 'COMPLETE - ALL 2048KB FUNCTIONAL AND SECURE.' },
        { text: 'LOADING PRIMARY KERNEL........', followUp: 'KERNEL LOADED. "A SECURE TOMORROW STARTS TODAY WITH VAULT-TEC."' },
        { text: 'ESTABLISHING NETWORK CONNECTIONS........', followUp: 'CONNECTING...CONNECTING...SUCCESS!' },
        { text: 'BOOTSTRAP LOADER INITIALIZED........', followUp: 'CONFIGURING SYSTEM MODULES...' },
        { text: 'LOADING RESOURCE PACKAGES........', followUp: 'INITIATING SYSTEM PROTOCOLS... ENABLING SURVIVAL MECHANISMS...' },
        { text: 'SYSTEM DIAGNOSTICS RUNNING........', followUp: 'PRIMARY: OKAY, SECONDARY: OKAY, TERTIARY: (THAT\'S CLASSIFIED)' },
        { text: 'ACTIVATING USER INTERFACE........', followUp: 'VAULT-TEC INTERFACE ONLINE. WELCOME, OVERSEER!' },
        { text: 'LOADING PERSONALIZED SETTINGS........', followUp: 'PREFERENCES SET, VAULT LIVING MADE COMFORTABLE (CONDITIONALLY).' },
        { text: 'FINALIZING BOOT SEQUENCE........', followUp: 'SYSTEM STABILIZATION COMPLETE. READY TO ASSIST.' },
        //{ text: 'SYSTEM READY. ENJOY YOUR VAULT-TEC DAY!', followUp: '' }
    ];

    // Shuffle the array to ensure the boot messages appear in random order
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

// Function to initiate the boot sequence
function bootSequence() {
    shuffleArray(bootMessages); // Shuffle messages for random order
    displayBootMessages(bootMessages); // Display the boot messages
    document.removeEventListener('keydown', bootSequenceOnce);
    document.removeEventListener('click', bootSequenceOnce);
}

// Single handler function to be used for both events
function bootSequenceOnce(event) {
    if (event.type === 'keydown' || event.type === 'click') {
        bootSequence();
    }
}

// Attach the event listeners for mouse click and key press to start the boot sequence
document.addEventListener('keydown', bootSequenceOnce, { once: true });
document.addEventListener('click', bootSequenceOnce, { once: true });

// After boot messages, display the cursor
function displayCursor() {
    const cursor = document.getElementById('cursor');
    cursor.style.display = 'inline-block'; // Show cursor
}

// Call displayCursor at the end of the displayBootMessages function
function displayBootMessages(messages) {
    let i = 0; // Index for messages array

    function displayBatch() {
        clearScreen();
        let batchMessages = messages.slice(i, i + 3); // Get the next batch of three messages
        updateMessage(0, batchMessages); // Start updating messages, beginning with the first one
    }

    function updateMessage(index, batchMessages) {
        if (index < batchMessages.length) {
            let message = batchMessages[index];
            terminal.textContent += `[${message.text}...0%]\n`;
            updateLoadingPercentage(0, index, message, batchMessages);
        }
    }

    function updateLoadingPercentage(loadPercentage, index, message, batchMessages) {
        if (loadPercentage <= 100) {
            setTimeout(() => {
                terminal.textContent = terminal.textContent.replace(`${message.text}...${loadPercentage}%`, `${message.text}...${loadPercentage + 10}%`);
                updateLoadingPercentage(loadPercentage + 10, index, message, batchMessages);
            }, 100);
        } else {
            terminal.textContent += `${message.followUp}\n.......\n`;
            if (index + 1 < batchMessages.length) {
                updateMessage(index + 1, batchMessages);
            } else {
                i += 3;
                if (i < messages.length) {
                    setTimeout(displayBatch, 1000);
                } else {
                    terminal.textContent += '\nSYSTEM READY. ENJOY YOUR DAY!\n]';
                    appendCursor();
                    // setTimeout(displayCursor, 1000); // Display cursor after all messages are displayed
                }
            }
        }
    }

    displayBatch(); // Start displaying messages in batches of three
}

// After all boot messages have been displayed, append the cursor
function appendCursor() {
    const cursorSpan = document.createElement('span');
    cursorSpan.id = 'cursor';
    cursorSpan.className = 'cursor';
    cursorSpan.textContent = '█'; // Your cursor block character
    terminal.appendChild(cursorSpan);
}


    
// Function to initiate the boot sequence
function bootSequence() {
    // clearScreen();
    // flashScreen();
    setTimeout(() => {
        shuffleArray(bootMessages); // Shuffle messages for random order
        displayBootMessages(bootMessages); // Display the boot messages
    }, 100);
    // Remove event listeners after the boot sequence starts
    document.removeEventListener('keydown', bootSequenceOnce);
    document.removeEventListener('click', bootSequenceOnce);
}

// Single handler function to be used for both events
function bootSequenceOnce(event) {
    if (event.type === 'keydown' || event.type === 'click') {
        bootSequence();
    }
}

// Attach the event listeners for mouse click and key press to start the boot sequence
document.addEventListener('keydown', bootSequenceOnce, { once: true });
document.addEventListener('click', bootSequenceOnce, { once: true });
});
