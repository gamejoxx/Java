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

    // Startup sound effect
    function playStartupSound() {
        if (!audioCtx) return;
        
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        
        oscillator.type = 'sawtooth';
        oscillator.frequency.setValueAtTime(80, audioCtx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(400, audioCtx.currentTime + 0.5);
        oscillator.frequency.exponentialRampToValueAtTime(80, audioCtx.currentTime + 1.0);
        
        gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 1.0);
        
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 1.0);
    }

    // Error sound effect
    function playErrorSound() {
        if (!audioCtx) return;
        
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        
        oscillator.type = 'square';
        oscillator.frequency.setValueAtTime(440, audioCtx.currentTime);
        oscillator.frequency.linearRampToValueAtTime(220, audioCtx.currentTime + 0.1);
        oscillator.frequency.linearRampToValueAtTime(880, audioCtx.currentTime + 0.2);
        oscillator.frequency.linearRampToValueAtTime(220, audioCtx.currentTime + 0.3);
        
        gainNode.gain.setValueAtTime(0.5, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.4);
        
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.4);
    }

    // Alert sound effect
    function playAlertSound() {
        if (!audioCtx) return;
        
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        
        oscillator.type = 'triangle';
        oscillator.frequency.setValueAtTime(800, audioCtx.currentTime);
        oscillator.frequency.linearRampToValueAtTime(600, audioCtx.currentTime + 0.2);
        
        gainNode.gain.setValueAtTime(0.4, audioCtx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.3);
        
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.3);
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
        particle.style.animationDuration = `${2 + Math.random() * 3}s`;
        particleOverlay.appendChild(particle);
        
        setTimeout(() => particle.remove(), 5000);
    }

    // Main boot sequence
    async function startBootSequence() {
        // Initial system check
        await addToTerminal('> INITIALIZING NEXUS-7 TERMINAL PROTOCOL...', 30);
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Core initialization
        await addToTerminal('> CORE SYSTEMS CHECK...', 30);
        coreStatus.textContent = 'INITIALIZING';
        await new Promise(resolve => setTimeout(resolve, 1500));
        coreStatus.textContent = 'ONLINE';
        coreStatus.style.color = '#0f0';
        updateProgress(33);
        
        // Neural network sync
        await addToTerminal('> NEURAL NETWORK SYNCHRONIZATION...', 30);
        neuralStatus.textContent = 'INITIALIZING';
        await new Promise(resolve => setTimeout(resolve, 1500));
        neuralStatus.textContent = 'ONLINE';
        neuralStatus.style.color = '#0f0';
        updateProgress(66);
        
        // Quantum systems
        await addToTerminal('> QUANTUM SYSTEMS INITIALIZATION...', 30);
        quantumStatus.textContent = 'INITIALIZING';
        await new Promise(resolve => setTimeout(resolve, 1500));
        quantumStatus.textContent = 'ONLINE';
        quantumStatus.style.color = '#0f0';
        updateProgress(100);
        
        // System ready
        await addToTerminal('> ALL SYSTEMS OPERATIONAL', 30);
        statusBar.textContent = 'SYSTEM READY';
        statusBar.style.color = '#0f0';
        
        // Start particle effects
        setInterval(createParticle, 100);
        
        // Start hologram animation
        drawHologram();
        
        // Final system message
        await new Promise(resolve => setTimeout(resolve, 1000));
        await addToTerminal('> WELCOME TO NEXUS-7 TERMINAL PROTOCOL', 30);
        await addToTerminal('> SYSTEM SECURITY LEVEL: OMEGA', 30);
        await addToTerminal('> ALL SYSTEMS OPERATING AT OPTIMAL EFFICIENCY', 30);
        
        // Random glitch effects
        setInterval(() => {
            if (Math.random() < 0.1) {
                activateGlitchOverlay();
                playErrorSound();
            }
        }, 5000);
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
            
            ctx.beginPath();
            for (let i = 0; i < 4; i++) {
                const angle = rotation + (i * Math.PI / 2);
                const x = centerX + Math.cos(angle) * size;
                const y = centerY + Math.sin(angle) * size;
                
                if (i === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }
            ctx.closePath();
            ctx.stroke();
            
            rotation += 0.02;
            requestAnimationFrame(animate);
            
            // Update stats
            rotationValue.textContent = (rotation * 180 / Math.PI).toFixed(1);
            densityValue.textContent = (75 + Math.sin(rotation) * 5).toFixed(1);
            stabilityValue.textContent = (90 + Math.cos(rotation) * 5).toFixed(1);
        }
        
        animate();
    }
});
