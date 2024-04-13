document.addEventListener('DOMContentLoaded', function() {
    const terminal = document.getElementById('terminal');
    terminal.textContent = 'Press any key to boot PRAM ZP427...';

    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

    function beep(frequency, duration) {
        const oscillator = audioCtx.createOscillator();
        oscillator.type = 'square';
        oscillator.frequency.setValueAtTime(frequency, audioCtx.currentTime);
        oscillator.connect(audioCtx.destination);
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + duration / 1000);
    }

    document.addEventListener('keydown', function startSequence() {
        document.removeEventListener('keydown', startSequence);
        terminal.textContent = '';
        const menuBar = document.createElement('div');
        menuBar.className = 'menu-bar';
        terminal.appendChild(menuBar);
        loadDots();
    });

    let content = '';
    let loadPercentage = 0;

    function addToTerminal(text) {
        content += text;
        terminal.textContent = content;
        terminal.scrollTop = terminal.scrollHeight;
    }

    function updateMenuBar(text) {
        const menuBar = document.querySelector('.menu-bar');
        menuBar.textContent = text;
    }

    function loadDots() {
        let count = 0;
        const maxDots = 3;
        const dotInterval = setInterval(() => {
            addToTerminal('.');
            count++;
            beep(440, 100);
            if (count >= maxDots) {
                clearInterval(dotInterval);
                addToTerminal('\n');
                loadPercentageDisplay();
            }
        }, 300);
    }

    function loadPercentageDisplay() {
        const percentageInterval = setInterval(() => {
            if (loadPercentage < 100) {
                loadPercentage += Math.random() * 15;
                loadPercentage = Math.min(loadPercentage, 100);
                updateMenuBar(`Loading... ${Math.floor(loadPercentage)}%`);
                beep(880, 50);
            } else {
                clearInterval(percentageInterval);
                addToTerminal('\nBoot complete. Welcome to Vault-Tec Terminal.\n');
                randomMessages();
            }
        }, 100);
    }

    function randomMessages() {
        const messages = [
            'RAM OK...\n',
            'VRAM OK...\n',
            `System BIOS version 2.7.1, Date: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`,
            'Peripheral devices check...',
            'Primary drive: Boot OK...',
            'Secondary drive: Error detected...',
            'Press F1 to continue, F2 to enter setup.'
        ];

        messages.forEach((msg, index) => {
            setTimeout(() => {
                addToTerminal(msg);
                if (index === messages.length - 1) {
                    updateMenuBar(`SYSTEM BIOS - Date: ${new Date().toLocaleDateString()} - Time: ${new Date().toLocaleTimeString()}`);
                }
            }, 800 * (index + 1));
        });
    }

    function flashScreen() {
        terminal.style.visibility = 'hidden';
        setTimeout(() => {
            terminal.style.visibility = 'visible';
        }, 50);
    }
});
