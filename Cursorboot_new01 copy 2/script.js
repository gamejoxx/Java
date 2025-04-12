document.addEventListener('DOMContentLoaded', function() {
    // Get elements references
    const startScreen = document.getElementById('start-screen');
    const startButton = document.getElementById('start-button');
    const mainScreen = document.querySelector('.screen');
    const terminal = document.getElementById('terminal');
    const statusBar = document.getElementById('status-bar');
    const securityLevel = document.getElementById('security-level');
    const progressBar = document.getElementById('progress-bar');
    const progressPercentage = document.getElementById('progress-percentage');
    const coreStatus = document.getElementById('core-status');
    const neuralStatus = document.getElementById('neural-status');
    const quantumStatus = document.getElementById('quantum-status');
    const hologramCanvas = document.getElementById('hologram-canvas');
    const rotationValue = document.getElementById('rotation-value');
    const densityValue = document.getElementById('density-value');
    const stabilityValue = document.getElementById('stability-value');
    const diagnosticsPane = document.getElementById('diagnostics');
    const alertContainer = document.getElementById('alert-container');
    const glitchOverlay = document.querySelector('.glitch-overlay');
    const particleOverlay = document.querySelector('.particle-overlay');

    // Ensure start screen is visible
    startScreen.style.display = 'flex';
    startScreen.style.opacity = '1';
    mainScreen.style.display = 'none';

    // Audio context for sound effects
    let audioCtx = null;

    // Initialize audio on user interaction
    startButton.addEventListener('click', initAudio);

    // Start button click handler
    startButton.addEventListener('click', async () => {
        startScreen.style.opacity = '0';
        setTimeout(() => {
            startScreen.style.display = 'none';
            mainScreen.style.display = 'block';
            setTimeout(() => {
                mainScreen.style.opacity = '1';
                startBootSequence();
            }, 100);
        }, 1000);
    });

    // Initialize audio context
    function initAudio() {
        if (audioCtx === null) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            playStartupSound();
        }
    }

    // Startup sound effect - replaced with professional bleep
    function playStartupSound() {
        if (!audioCtx) return;
        
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(800, audioCtx.currentTime);
        oscillator.frequency.linearRampToValueAtTime(1200, audioCtx.currentTime + 0.1);
        
        gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.2);
        
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.2);
    }

    // Error sound effect - replaced with professional bleep
    function playErrorSound() {
        if (!audioCtx) return;
        
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(400, audioCtx.currentTime);
        oscillator.frequency.linearRampToValueAtTime(200, audioCtx.currentTime + 0.1);
        
        gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.2);
        
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.2);
    }

    // Alert sound effect - replaced with professional bleep
    function playAlertSound() {
        if (!audioCtx) return;
        
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(600, audioCtx.currentTime);
        oscillator.frequency.linearRampToValueAtTime(800, audioCtx.currentTime + 0.1);
        
        gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.2);
        
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.2);
    }

    // Regular beep sound for terminal output
    function playBeep(frequency = 440, duration = 40, type = 'sine', volume = 0.1) {
        if (!audioCtx) return;
        
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        
        oscillator.type = type;
        oscillator.frequency.value = frequency;
        gainNode.gain.value = volume;
        
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        oscillator.start();
        setTimeout(() => oscillator.stop(), duration);
    }

    // Glitch effect for elements
    function glitchElement(element) {
        element.classList.add('glitch');
        setTimeout(() => element.classList.remove('glitch'), 300);
    }

    // Activate full screen glitch effect
    function activateGlitchOverlay() {
        glitchOverlay.classList.add('active');
        setTimeout(() => glitchOverlay.classList.remove('active'), 300);
    }

    // Trigger screen flicker
    function triggerScreenFlicker() {
        document.body.classList.add('screen-flicker');
        setTimeout(() => document.body.classList.remove('screen-flicker'), 200);
    }

    // Type text with terminal effect
    async function typeText(text, element, speed = 25) {
        for (let i = 0; i < text.length; i++) {
            element.textContent += text[i];
            playBeep(440 + Math.random() * 100, 20, 'square', 0.05);
            await new Promise(resolve => setTimeout(resolve, speed));
        }
    }

    // Add text to terminal with typing effect
    async function addToTerminal(text, speed = 25, className = '') {
        const line = document.createElement('div');
        line.className = `terminal-text ${className}`;
        terminal.appendChild(line);
        await typeText(text, line, speed);
        terminal.scrollTop = terminal.scrollHeight;
    }

    // Update progress bar
    function updateProgress(percent) {
        progressBar.style.width = `${percent}%`;
        progressPercentage.textContent = `${percent}%`;
    }

    // Show alert message
    function showAlert(title, message, type = 'info', duration = 5000) {
        const alert = document.createElement('div');
        alert.className = `alert ${type}`;
        alert.innerHTML = `
            <div class="alert-title">${title}</div>
            <div class="alert-message">${message}</div>
        `;
        alertContainer.appendChild(alert);
        
        setTimeout(() => {
            alert.classList.add('fade-out');
            setTimeout(() => alert.remove(), 500);
        }, duration);
    }

    // Create particle effect
    function createParticle() {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        particle.style.animationDuration = `${1 + Math.random() * 2}s`;
        particle.style.color = Math.random() < 0.1 ? '#f00' : Math.random() < 0.2 ? '#ff7b00' : '#0f0';
        particleOverlay.appendChild(particle);
        
        setTimeout(() => particle.remove(), 3000);
    }

    // Main boot sequence
    async function startBootSequence() {
        // Initial system check
        await addToTerminal('> INITIALIZING NEXUS-7 TERMINAL PROTOCOL...', 20);
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Core initialization with errors
        await addToTerminal('> CORE SYSTEMS CHECK...', 20);
        coreStatus.textContent = 'INITIALIZING';
        await new Promise(resolve => setTimeout(resolve, 300));
        await addToTerminal('> WARNING: CORE TEMPERATURE CRITICAL', 20, 'warning-text');
        await addToTerminal('> EMERGENCY COOLING INITIATED', 20, 'error-text');
        coreStatus.textContent = 'ONLINE';
        coreStatus.style.color = '#0f0';
        updateProgress(33);
        
        // Neural network sync with warnings
        await addToTerminal('> NEURAL NETWORK SYNCHRONIZATION...', 20);
        neuralStatus.textContent = 'INITIALIZING';
        await new Promise(resolve => setTimeout(resolve, 300));
        await addToTerminal('> WARNING: NEURAL PATHWAY 43-A EXPERIENCING DRIFT', 20, 'warning-text');
        await addToTerminal('> RECALIBRATING...', 20);
        neuralStatus.textContent = 'ONLINE';
        neuralStatus.style.color = '#0f0';
        updateProgress(66);
        
        // Quantum systems with critical errors
        await addToTerminal('> QUANTUM SYSTEMS INITIALIZATION...', 20);
        quantumStatus.textContent = 'INITIALIZING';
        await new Promise(resolve => setTimeout(resolve, 300));
        await addToTerminal('> CRITICAL: QUANTUM FLUCTUATION DETECTED', 20, 'error-text');
        await addToTerminal('> STABILIZING QUANTUM MATRIX...', 20);
        quantumStatus.textContent = 'ONLINE';
        quantumStatus.style.color = '#0f0';
        updateProgress(100);
        
        // System ready
        await addToTerminal('> ALL SYSTEMS OPERATIONAL', 20);
        statusBar.textContent = 'SYSTEM READY';
        statusBar.style.color = '#0f0';
        
        // Start particle effects
        setInterval(createParticle, 50);
        
        // Start hologram animation
        drawHologram();
        
        // Start diagnostics data stream
        startDiagnosticsStream();
        
        // Final system message
        await new Promise(resolve => setTimeout(resolve, 500));
        await addToTerminal('> WELCOME TO NEXUS-7 TERMINAL PROTOCOL', 20);
        await addToTerminal('> SYSTEM SECURITY LEVEL: OMEGA', 20);
        await addToTerminal('> ALL SYSTEMS OPERATING AT OPTIMAL EFFICIENCY', 20);
        
        // Random glitch effects
        setInterval(() => {
            if (Math.random() < 0.2) {
                activateGlitchOverlay();
                playErrorSound();
            }
        }, 3000);
    }

    // Start diagnostics data stream
    function startDiagnosticsStream() {
        const diagnostics = [
            { name: 'CORE TEMPERATURE', value: '42.7°C', status: 'warning' },
            { name: 'NEURAL SYNC RATE', value: '98.3%', status: 'normal' },
            { name: 'QUANTUM STABILITY', value: '87.5%', status: 'warning' },
            { name: 'MEMORY USAGE', value: '76.2%', status: 'normal' },
            { name: 'POWER OUTPUT', value: '94.8%', status: 'normal' },
            { name: 'DEFENSE SYSTEMS', value: 'ARMED', status: 'normal' },
            { name: 'FIREWALL STATUS', value: 'COMPROMISED', status: 'error' },
            { name: 'LIFE SUPPORT', value: 'CRITICAL', status: 'error' }
        ];

        setInterval(() => {
            diagnosticsPane.innerHTML = '';
            diagnostics.forEach(item => {
                const div = document.createElement('div');
                div.className = `diagnostic-item ${item.status}`;
                div.innerHTML = `
                    <span class="diagnostic-name">${item.name}</span>
                    <span class="diagnostic-value">${item.value}</span>
                `;
                diagnosticsPane.appendChild(div);
            });
        }, 1000);
    }

    // Draw hologram animation
    function drawHologram() {
        const ctx = hologramCanvas.getContext('2d');
        let rotation = 0;
        
        function animate() {
            ctx.clearRect(0, 0, hologramCanvas.width, hologramCanvas.height);
            
            // Draw hologram base
            ctx.strokeStyle = '#0f0';
            ctx.lineWidth = 2;
            
            // Draw rotating cube
            const size = Math.min(hologramCanvas.width, hologramCanvas.height) * 0.4;
            const centerX = hologramCanvas.width / 2;
            const centerY = hologramCanvas.height / 2;
            
            // Draw multiple rotating shapes
            for (let i = 0; i < 3; i++) {
                ctx.beginPath();
                for (let j = 0; j < 4; j++) {
                    const angle = rotation + (j * Math.PI / 2) + (i * Math.PI / 6);
                    const x = centerX + Math.cos(angle) * (size * (1 - i * 0.2));
                    const y = centerY + Math.sin(angle) * (size * (1 - i * 0.2));
                    
                    if (j === 0) {
                        ctx.moveTo(x, y);
                    } else {
                        ctx.lineTo(x, y);
                    }
                }
                ctx.closePath();
                ctx.stroke();
            }
            
            rotation += 0.05;
            requestAnimationFrame(animate);
            
            // Update stats with random fluctuations
            rotationValue.textContent = (rotation * 180 / Math.PI).toFixed(1);
            densityValue.textContent = (75 + Math.sin(rotation) * 10).toFixed(1);
            stabilityValue.textContent = (90 + Math.cos(rotation) * 10).toFixed(1);
            
            // Add error states randomly
            if (Math.random() < 0.1) {
                stabilityValue.classList.add('error');
                setTimeout(() => stabilityValue.classList.remove('error'), 1000);
            }
            if (Math.random() < 0.05) {
                densityValue.classList.add('warning');
                setTimeout(() => densityValue.classList.remove('warning'), 1000);
            }
        }
        
        animate();
    }
});
