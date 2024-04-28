document.addEventListener('DOMContentLoaded', function() {
    const terminal = document.getElementById('terminal');
    const menuBar = document.getElementById('menu-bar');

    function updateMenuBar() {
        const date = new Date();
        menuBar.textContent = `Vault-Tec Systems - ${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
    }

    updateMenuBar();
    setInterval(updateMenuBar, 1000);

    function playBeep(frequency = 680, duration = 50) {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioCtx.createOscillator();
        oscillator.type = 'square';
        oscillator.frequency.setValueAtTime(frequency, audioCtx.currentTime);
        oscillator.connect(audioCtx.destination);
        oscillator.start();
        setTimeout(() => oscillator.stop(), duration);
    }

    function flashScreen() {
        terminal.style.backgroundColor = 'rgba(0,255,0,0.6)';
        setTimeout(() => terminal.style.backgroundColor = '', 50);
    }

    function spinningSymbol() {
        const symbols = ['/', '--', '|', '\\', ' -.', '  -.', '   -.', '       -.'];
        let index = 0;
        const intervalId = setInterval(() => {
            terminal.textContent = symbols[index % symbols.length];
            index++;
        }, 100);
        setTimeout(() => clearInterval(intervalId), 400);
    }

    function hexDump() {
        const lines = 4;
        const columns = 4;
        let dump = "";
        for (let i = 0; i < lines; i++) {
            for (let j = 0; j < columns; j++) {
                const hexValue = Math.floor(Math.random() * 0xFFFFFF).toString(16).padStart(6, '0');
                dump += `0x${hexValue} `;
            }
            dump += '\n';
        }
        terminal.textContent += dump;
    }

    const bootMessages = [
        'PERFORMING MEMORY INTEGRITY CHECK.........',
        'LOADING PRIMARY KERNEL........',
        'ESTABLISHING NETWORK CONNECTIONS........',
        'BOOTSTRAP LOADER INITIALIZED........',
        'SYSTEM DIAGNOSTICS RUNNING........',
        'ACTIVATING USER INTERFACE........',
        'LOADING PERSONALIZED SETTINGS........',
        'FINALIZING BOOT SEQUENCE........',
    ];

    function animateMessage(message) {
        const interval = 20;
        let i = 0;
        const maxI = message.length;
        terminal.textContent = '';
        const intervalId = setInterval(() => {
            terminal.textContent += message[i];
            i++;
            if (i >= maxI) {
                clearInterval(intervalId);
                terminal.textContent += '\n';
                // randomEvent();  // Trigger another event after message
            }
        }, interval);
    }

    function randomEvent() {
        const events = [playBeep, flashScreen, spinningSymbol, hexDump, () => animateMessage(bootMessages[Math.floor(Math.random() * bootMessages.length)])];
        const randomIndex = Math.floor(Math.random() * events.length);
        events[randomIndex]();
    }

    function hecticSequence() {
        const numCycles = 10;
        let cycleCount = 1;
        const cycleInterval = setInterval(() => {
            // clearScreen();
            randomEvent();
            cycleCount++;
            if (cycleCount >= numCycles) {
                clearInterval(cycleInterval);
                // clearScreen();
                terminal.textContent = '\nSYSTEM READY. ENJOY YOUR DAY!\n';
                playBeep(440, 100);
                appendCursor();
            }
        }, 200);
    }

    function clearScreen() {
        terminal.textContent = '';
    }

    function appendCursor() {
        const cursorSpan = document.createElement('span');
        cursorSpan.id = 'cursor';
        cursorSpan.className = 'cursor';
        cursorSpan.textContent = '█';
        terminal.appendChild(cursorSpan);
    }

    document.addEventListener('click', hecticSequence);
    document.addEventListener('keydown', hecticSequence);
});
