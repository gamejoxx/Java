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
    function displayBootMessages(messages) {
        let i = 0; // Index for messages array
    
        function displayBatch() {
            clearScreen();
            let batchMessages = messages.slice(i, i + 3); // Get the next batch of three messages
    
            // Function to update each message with a delay
            function updateMessage(index) {
                // If it's within our batch array bounds
                if (index < batchMessages.length) {
                    let message = batchMessages[index];
                    let loadPercentage = 0; // Start loading percentage at 0 for each message
                    // Update the display for the new message
                    terminal.textContent += `[${message.text}...][${loadPercentage}%]\n`;
    
                    // Function to update the loading percentage for this message
                    function updateLoadingPercentage() {
                        if (loadPercentage < 100) {
                            loadPercentage += 10; // Increment the loading percentage
                            // Update the display with the new percentage
                            let lines = terminal.textContent.split('\n');
                            lines[index * 2] = `[${message.text}...][${loadPercentage}%]`; // Adjust line index for batch
                            terminal.textContent = lines.join('\n');
                            setTimeout(updateLoadingPercentage, 100); // Update the percentage every 100ms
                        } else {
                            // Once message is fully loaded, display its follow-up
                            terminal.textContent += `${message.followUp}\n`;
                            // If this is the last message in the batch, initiate the beep and next batch
                            if (index === batchMessages.length - 1) {
                                playBeep();
                                i += 3; // Move to the next batch
                                if (i < messages.length) {
                                    // Wait 1 second after the last message to display the next batch
                                    setTimeout(displayBatch, 1000);
                                }
                            } else {
                                // Otherwise, call updateMessage to display the next message after a delay
                                setTimeout(() => updateMessage(index + 1), 500); // Delay before next message
                            }
                        }
                    }
    
                    updateLoadingPercentage();
                }
            }
    
            // Start updating messages, beginning with the first one
            updateMessage(0);
        }
    
        displayBatch(); // Start displaying messages in batches of three
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
