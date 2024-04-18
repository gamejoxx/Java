document.addEventListener('DOMContentLoaded', function() {
    const terminal = document.getElementById('terminal');
    const menuBar = document.getElementById('menu-bar');

    function updateMenuBar() {
        const date = new Date();
        menuBar.textContent = `Vault-Tec Systems - ${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
    }

    updateMenuBar();
    setInterval(updateMenuBar, 1000);

    function playBeep() {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioCtx.createOscillator();
        oscillator.type = 'square';
        oscillator.frequency.setValueAtTime(680, audioCtx.currentTime);
        oscillator.connect(audioCtx.destination);
        oscillator.start();
        setTimeout(() => oscillator.stop(), 50);
    }

    function playMultipleBeeps() {
        let count = Math.floor(Math.random() * 3) + 1; // Random number of beeps between 1 and 10
        let beepInterval = 20; // Interval between beeps in milliseconds
        let frequency = 50; // Low frequency for beeps
    
        (function beepLoop(i) {
            if (i < count) {
                const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
                const oscillator = audioCtx.createOscillator();
                oscillator.type = 'square';
                oscillator.frequency.setValueAtTime(frequency, audioCtx.currentTime); // Low frequency beep
                oscillator.connect(audioCtx.destination);
                oscillator.start();
                setTimeout(() => oscillator.stop(), 50); // Short beep
    
                setTimeout(() => beepLoop(i + 1), beepInterval);
            }
        })(0);
    }
    

    function flashScreen() {
        terminal.style.backgroundColor = 'green';
        setTimeout(() => terminal.style.backgroundColor = '', 50);
    }

    function clearScreen() {
        terminal.textContent = '';
    }

    const bootMessages = [
        { text: 'PERFORMING MEMORY INTEGRITY CHECK.........', followUp: 'COMPLETE - ALL 2048KB FUNCTIONAL AND SECURE.\n' },
        { text: 'LOADING PRIMARY KERNEL........', followUp: 'KERNEL LOADED. "A SECURE TOMORROW STARTS TODAY WITH VAULT-TEC."\n' },
        { text: 'ESTABLISHING NETWORK CONNECTIONS........', followUp: 'CONNECTING...CONNECTING...SUCCESS!\n' },
        { text: 'BOOTSTRAP LOADER INITIALIZED........', followUp: 'CONFIGURING SYSTEM MODULES...\n' },
        { text: 'TEST........', followUp: '\n' },
//        { text: 'LOADING RESOURCE PACKAGES........', followUp: 'INITIATING SYSTEM PROTOCOLS ' animateDots(), ' ENABLING SURVIVAL MECHANISMS...\n' },
        { text: 'SYSTEM DIAGNOSTICS RUNNING........', followUp: 'PRIMARY: OKAY, SECONDARY: OKAY, TERTIARY: (THAT\'S CLASSIFIED)\n' },
        { text: 'ACTIVATING USER INTERFACE........', followUp: 'VAULT-TEC INTERFACE ONLINE. WELCOME, OVERSEER!\n' },
        { text: 'LOADING PERSONALIZED SETTINGS........', followUp: 'PREFERENCES SET, VAULT LIVING MADE COMFORTABLE (CONDITIONALLY).\n' },
        { text: 'FINALIZING BOOT SEQUENCE........', followUp: 'SYSTEM STABILIZATION COMPLETE. READY TO ASSIST.\n' },
    ];

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function animateDots(element, numDots, interval, callback) {
        let currentDots = 0;
        const addDot = () => {
            if (currentDots < numDots) {
                element.textContent += '.';
                currentDots++;
                // playMultipleBeeps();
                setTimeout(addDot, interval);
            } else if (callback) {
                callback();
            }
        };
        addDot();
    }

function maybeAnimateDots(index, batchMessages, nextAction) {
    const randomChance = Math.random();
    const randomNumDots = Math.floor(Math.random() * 10) + 10;
    const randomInterval = Math.random() * (100 - 10) + 10;
    if (randomChance < 0.6) {
        animateDots(terminal, randomNumDots, randomInterval, () => {
            // playBeep();
           // playMultipleBeeps();
           // flashScreen();
            nextAction();
            
        });
    } else {
        nextAction();
    }
}


    function displayBootMessages(messages) {
        let i = 0;

        function displayBatch() {
            clearScreen();
            let numessages = Math.floor(Math.random() * 4) + 2;
            let batchMessages = messages.slice(i, i + numessages);
            updateMessage(0, batchMessages);
        }

        function updateMessage(index, batchMessages) {
            if (index < batchMessages.length) {
                let message = batchMessages[index];
                terminal.textContent += `${message.text}...0%\n`;
                updateLoadingPercentage(0, index, message, batchMessages);
            }
        }

        function updateLoadingPercentage(loadPercentage, index, message, batchMessages) {
            const randomDelay = Math.random() * (100 - 2)-50;
            const randomIncrement = Math.floor(Math.random() * 1) + 1;
            const maxPercentage = 100 + Math.round(Math.random() * -1);
            
            if (loadPercentage <= maxPercentage) {
                setTimeout(() => {
                    terminal.textContent = terminal.textContent.replace(
                      `${message.text}...${loadPercentage}%`,
                      `${message.text}...${loadPercentage + randomIncrement}%`
                    );
                    updateLoadingPercentage(loadPercentage + randomIncrement, index, message, batchMessages);
                }, randomDelay);
            } else {
                terminal.textContent += `${message.followUp}\n`;
                maybeAnimateDots(index, batchMessages, () => {
                    if (index + 1 < batchMessages.length) {
                        setTimeout(() => updateMessage(index + 1, batchMessages), Math.random() * 750);
                    } else {
                        i += 3;
                        if (i < messages.length) {
                            setTimeout(displayBatch, Math.random() * 1500);
                        } else {
                            terminal.textContent += '\nSYSTEM READY. ENJOY YOUR DAY!\n';
                            playMultipleBeeps();
                            flashScreen();
                            appendCursor();
                        }
                    }
                });
            }
        }

        displayBatch();
    }

    function appendCursor() {
        const cursorSpan = document.createElement('span');
        cursorSpan.id = 'cursor';
        cursorSpan.className = 'cursor';
        cursorSpan.textContent = '█';
        terminal.appendChild(cursorSpan);
    }

    function bootSequence() {
        shuffleArray(bootMessages);
        displayBootMessages(bootMessages);
    }

    function bootSequenceOnce(event) {
        if (event.type === 'keydown' || event.type === 'click') {
            playBeep();
            // playMultipleBeeps();
            flashScreen();
            bootSequence();
        }
    }


    document.addEventListener('click', flashScreen);
    document.addEventListener('keydown', flashScreen);
    document.addEventListener('keydown', bootSequenceOnce, { once: true });
    document.addEventListener('click', bootSequenceOnce, { once: true });
});
