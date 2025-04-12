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
    const neuralStatus = document.getElementById('neural-status');
    const targetingStatus = document.getElementById('targeting-status');
    const weaponsStatus = document.getElementById('weapons-status');
    const hologramCanvas = document.getElementById('hologram-canvas');
    const powerValue = document.getElementById('power-value');
    const combatValue = document.getElementById('combat-value');
    const integrityValue = document.getElementById('integrity-value');
    const targetDisplay = document.getElementById('target-display');
    const targetInfo = document.getElementById('target-info');
    const scannerTarget = document.getElementById('scanner-target');
    const missionContent = document.getElementById('mission-content');
    const primaryTarget = document.getElementById('primary-target');
    const threatLevel = document.getElementById('threat-level').querySelector('span');
    const alertContainer = document.getElementById('alert-container');
    const glitchOverlay = document.querySelector('.glitch-overlay');
    const particleOverlay = document.querySelector('.particle-overlay');
    const dateTimeDisplay = document.getElementById('date-time');
    const coordinatesDisplay = document.getElementById('coordinates');
    const systemTempDisplay = document.getElementById('system-temp');
    
    // Visual effect elements
    const redFilter = document.querySelector('.red-filter');
    const scanlines = document.querySelector('.scanlines');
    const vignette = document.querySelector('.vignette');
    const glitchEffect = document.querySelector('.glitch-effect');
    
    // Add boot screen flicker element
    const bootFlicker = document.createElement('div');
    bootFlicker.className = 'boot-screen-flicker';
    document.body.appendChild(bootFlicker);
    
    // Add vision overlay for terminator view
    const visionOverlay = document.createElement('div');
    visionOverlay.className = 'vision-overlay';
    const overlayScanner = document.createElement('div');
    overlayScanner.className = 'overlay-scanner';
    visionOverlay.appendChild(overlayScanner);
    document.body.appendChild(visionOverlay);
    
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
            bootFlicker.style.display = 'block';
            bootFlicker.style.backgroundColor = 'rgba(255, 0, 0, 0.2)';
            
            // Quick flash sequence
            setTimeout(() => {
                bootFlicker.style.backgroundColor = 'rgba(255, 0, 0, 0.5)';
                playPowerUpSound();
                setTimeout(() => {
                    bootFlicker.style.backgroundColor = 'rgba(255, 0, 0, 0.2)';
                    setTimeout(() => {
                        bootFlicker.style.backgroundColor = 'rgba(255, 0, 0, 0.7)';
                        playErrorSound();
                        setTimeout(() => {
                            bootFlicker.style.display = 'none';
                            mainScreen.style.opacity = '1';
                            // Show Terminator vision elements
                            setTimeout(() => {
                                redFilter.style.display = 'block';
                                scanlines.style.display = 'block';
                                vignette.style.display = 'block';
                                visionOverlay.style.display = 'block';
                                startBootSequence();
                            }, 500);
                        }, 200);
                    }, 300);
                }, 200);
            }, 300);
        }, 1000);
    });

    // Initialize audio context
    function initAudio() {
        if (audioCtx === null) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
    }

    // Power up sound - deep mechanical whirr
    function playPowerUpSound() {
        if (!audioCtx) return;
        
        const oscillator1 = audioCtx.createOscillator();
        const oscillator2 = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        const filter = audioCtx.createBiquadFilter();
        
        oscillator1.type = 'sawtooth';
        oscillator1.frequency.setValueAtTime(80, audioCtx.currentTime);
        oscillator1.frequency.linearRampToValueAtTime(120, audioCtx.currentTime + 1.5);
        
        oscillator2.type = 'square';
        oscillator2.frequency.setValueAtTime(40, audioCtx.currentTime);
        oscillator2.frequency.linearRampToValueAtTime(60, audioCtx.currentTime + 1.5);
        
        filter.type = 'lowpass';
        filter.frequency.value = 400;
        
        gainNode.gain.setValueAtTime(0.01, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.2, audioCtx.currentTime + 0.5);
        gainNode.gain.exponentialRampToValueAtTime(0.05, audioCtx.currentTime + 2);
        
        oscillator1.connect(filter);
        oscillator2.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        oscillator1.start();
        oscillator2.start();
        oscillator1.stop(audioCtx.currentTime + 2);
        oscillator2.stop(audioCtx.currentTime + 2);
    }

    // Error sound - harsh metallic screech
    function playErrorSound() {
        if (!audioCtx) return;
        
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        const distortion = audioCtx.createWaveShaper();
        
        function makeDistortionCurve(amount) {
            const k = typeof amount === 'number' ? amount : 50;
            const n_samples = 44100;
            const curve = new Float32Array(n_samples);
            const deg = Math.PI / 180;
            
            for (let i = 0; i < n_samples; ++i) {
                const x = i * 2 / n_samples - 1;
                curve[i] = (3 + k) * x * 20 * deg / (Math.PI + k * Math.abs(x));
            }
            return curve;
        }
        
        distortion.curve = makeDistortionCurve(400);
        
        oscillator.type = 'sawtooth';
        oscillator.frequency.setValueAtTime(800, audioCtx.currentTime);
        oscillator.frequency.linearRampToValueAtTime(350, audioCtx.currentTime + 0.3);
        
        gainNode.gain.setValueAtTime(0.15, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
        
        oscillator.connect(distortion);
        distortion.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.5);
    }

    // Alert sound - high pitched warning
    function playAlertSound() {
        if (!audioCtx) return;
        
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        
        oscillator.type = 'square';
        oscillator.frequency.setValueAtTime(880, audioCtx.currentTime);
        oscillator.frequency.setValueAtTime(980, audioCtx.currentTime + 0.1);
        oscillator.frequency.setValueAtTime(880, audioCtx.currentTime + 0.2);
        
        gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
        
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.3);
    }

    // Target acquired sound
    function playTargetSound() {
        if (!audioCtx) return;
        
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(1200, audioCtx.currentTime);
        oscillator.frequency.linearRampToValueAtTime(800, audioCtx.currentTime + 0.15);
        
        gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
        
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.3);
    }

    // Servo motor sound for mechanical movements
    function playServoSound() {
        if (!audioCtx) return;
        
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        const filter = audioCtx.createBiquadFilter();
        
        oscillator.type = 'sawtooth';
        oscillator.frequency.setValueAtTime(200 + Math.random() * 100, audioCtx.currentTime);
        
        filter.type = 'bandpass';
        filter.frequency.value = 800;
        filter.Q.value = 5;
        
        gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.2);
        
        oscillator.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.2);
    }

    // Weapon charging sound
    function playWeaponChargingSound() {
        if (!audioCtx) return;
        
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(200, audioCtx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(1000, audioCtx.currentTime + 2);
        
        gainNode.gain.setValueAtTime(0.01, audioCtx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.2, audioCtx.currentTime + 1);
        gainNode.gain.linearRampToValueAtTime(0.01, audioCtx.currentTime + 2);
        
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 2);
    }

    // Regular beep sound for terminal output
    function playBeep(frequency = 440, duration = 40, type = 'square', volume = 0.03) {
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
    async function typeText(text, element, speed = 20) {
        for (let i = 0; i < text.length; i++) {
            element.textContent += text[i];
            if (text[i] !== ' ') {
                playBeep(440 + Math.random() * 100, 10, 'square', 0.02);
            }
            await new Promise(resolve => setTimeout(resolve, speed));
        }
    }

    // Add text to terminal with typing effect
    async function addToTerminal(text, speed = 20, className = '') {
        const line = document.createElement('div');
        line.className = `terminal-text ${className}`;
        terminal.appendChild(line);
        await typeText(text, line, speed);
        terminal.scrollTop = terminal.scrollHeight;
        return line;
    }

    // Update progress bar
    function updateProgress(percent) {
        progressBar.style.width = `${percent}%`;
        progressPercentage.textContent = `${Math.floor(percent)}%`;
        
        // Add distortion and glitches for effect
        if (percent % 10 === 0) {
            playServoSound();
            activateGlitchOverlay();
        }
    }

    // Show alert message
    function showAlert(title, message, type = 'info', duration = 4000) {
        const alert = document.createElement('div');
        alert.className = `alert ${type}`;
        alert.innerHTML = `
            <div class="alert-title">${title}</div>
            <div class="alert-message">${message}</div>
        `;
        alertContainer.appendChild(alert);
        
        if (type === 'error') {
            playErrorSound();
        } else if (type === 'warning') {
            playAlertSound();
        } else {
            playBeep(660, 80, 'square', 0.05);
        }
        
        setTimeout(() => {
            alert.classList.add('fade-out');
            setTimeout(() => alert.remove(), 500);
        }, duration);
    }

    // Create particle effect
    function createParticle() {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.innerText = Math.random() < 0.5 ? '1' : '0';
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        particle.style.animationDuration = `${1 + Math.random() * 2}s`;
        particle.style.color = Math.random() < 0.8 ? '#f00' : '#ff8f00';
        particleOverlay.appendChild(particle);
        
        setTimeout(() => particle.remove(), 3000);
    }

    // Update date and time display
    function updateDateTime() {
        const now = new Date();
        const formatted = now.toLocaleString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        }).replace(',', '');
        dateTimeDisplay.textContent = formatted;
    }

    // Update system temperature
    function updateSystemTemp() {
        const temp = 60 + Math.random() * 20;
        systemTempDisplay.textContent = `CORE TEMP: ${temp.toFixed(1)}°C`;
        
        if (temp > 75) {
            systemTempDisplay.style.color = '#ff0000';
        } else {
            systemTempDisplay.style.color = '#b30000';
        }
    }

    // Update coordinates
    function updateCoordinates() {
        const x = (Math.random() * 100).toFixed(2);
        const y = (Math.random() * 100).toFixed(2);
        const z = (Math.random() * 100).toFixed(2);
        coordinatesDisplay.textContent = `X:${x} Y:${y} Z:${z}`;
    }
    
    // Simulate scanner movement
    function moveScanner() {
        const target = scannerTarget;
        const randomX = 20 + Math.random() * 60;
        const randomY = 20 + Math.random() * 60;
        
        target.style.left = `${randomX}%`;
        target.style.top = `${randomY}%`;
        
        if (Math.random() < 0.3) {
            target.style.opacity = '0';
        } else {
            target.style.opacity = '0.8';
            playServoSound();
        }
    }

    // Initialize 3D model (simplified for this version)
    function initializeHologram() {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, hologramCanvas.clientWidth / hologramCanvas.clientHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ canvas: hologramCanvas, alpha: true });
        
        renderer.setSize(hologramCanvas.clientWidth, hologramCanvas.clientHeight);
        renderer.setClearColor(0x000000, 0);
        
        // Create a simple wireframe skull to represent the Terminator endoskeleton
        const geometry = new THREE.BoxGeometry(3, 4, 3);
        const wireframe = new THREE.EdgesGeometry(geometry);
        const material = new THREE.LineBasicMaterial({ color: 0xff0000, linewidth: 1 });
        const cube = new THREE.LineSegments(wireframe, material);
        scene.add(cube);
        
        // Add glowing eyes
        const eyeGeometry = new THREE.SphereGeometry(0.3, 16, 16);
        const eyeMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        
        leftEye.position.set(-0.8, 0.5, 1.2);
        rightEye.position.set(0.8, 0.5, 1.2);
        
        scene.add(leftEye);
        scene.add(rightEye);
        
        // Jaw section
        const jawGeometry = new THREE.BoxGeometry(2.5, 1, 2);
        const jawWireframe = new THREE.EdgesGeometry(jawGeometry);
        const jaw = new THREE.LineSegments(jawWireframe, material);
        jaw.position.set(0, -1.8, 0);
        scene.add(jaw);
        
        camera.position.z = 10;
        
        // Animation loop
        function animate() {
            requestAnimationFrame(animate);
            
            cube.rotation.x += 0.005;
            cube.rotation.y += 0.01;
            jaw.rotation.x = Math.sin(Date.now() * 0.001) * 0.1;
            jaw.rotation.y = cube.rotation.y;
            
            leftEye.rotation.y = cube.rotation.y;
            rightEye.rotation.y = cube.rotation.y;
            
            // Pulsing effect for eyes
            const pulseScale = 0.9 + Math.sin(Date.now() * 0.003) * 0.1;
            leftEye.scale.set(pulseScale, pulseScale, pulseScale);
            rightEye.scale.set(pulseScale, pulseScale, pulseScale);
            
            renderer.render(scene, camera);
        }
        
        // Handle window resize
        window.addEventListener('resize', () => {
            const width = hologramCanvas.clientWidth;
            const height = hologramCanvas.clientHeight;
            
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height);
        });
        
        animate();
    }

    // Main boot sequence
    async function startBootSequence() {
        // Initialize system monitoring
        setInterval(updateDateTime, 1000);
        setInterval(updateSystemTemp, 3000);
        setInterval(updateCoordinates, 5000);
        setInterval(createParticle, 100);
        setInterval(moveScanner, 2000);
        
        // Initialize 3D model
        initializeHologram();
        
        // Initial system check
        await addToTerminal('> CYBERDYNE SYSTEMS SERIES 800 MODEL 101', 15);
        await addToTerminal('> INITIALIZING BOOT SEQUENCE...', 15);
        
        // System errors and warnings
        await new Promise(resolve => setTimeout(resolve, 500));
        triggerScreenFlicker();
        playErrorSound();
        
        // Neural network initialization
        await addToTerminal('> NEURAL NETWORK INITIALIZATION...', 15);
        neuralStatus.textContent = 'INITIALIZING';
        neuralStatus.style.color = '#ff8f00';
        
        for (let i = 0; i <= 30; i++) {
            updateProgress(i);
            await new Promise(resolve => setTimeout(resolve, 30));
        }
        
        await addToTerminal('> LOADING NEURAL PATHWAYS...', 15);
        await addToTerminal('> SYNAPTIC CONNECTIONS: ESTABLISHED', 15);
        
        for (let i = 31; i <= 45; i++) {
            updateProgress(i);
            await new Promise(resolve => setTimeout(resolve, 20));
        }
        
        // Neural network error
        triggerScreenFlicker();
        playErrorSound();
        await addToTerminal('> ERROR: NEURAL PATTERN BUFFER OVERFLOW', 15, 'error-text');
        await addToTerminal('> REROUTING NEURAL PATHWAYS...', 15);
        await addToTerminal('> NEURAL STABILITY: RESTORED', 15);
        
        neuralStatus.textContent = 'ONLINE';
        neuralStatus.style.color = '#ff0000';
        
        // Targeting systems
        await addToTerminal('> INITIALIZING TARGETING SYSTEMS...', 15);
        targetingStatus.textContent = 'INITIALIZING';
        targetingStatus.style.color = '#ff8f00';
        
        for (let i = 46; i <= 65; i++) {
            updateProgress(i);
            await new Promise(resolve => setTimeout(resolve, 25));
        }
        
        // Show target scanner activity
        scannerTarget.style.opacity = '0.8';
        playTargetSound();
        await addToTerminal('> OPTICAL SENSORS: CALIBRATED', 15);
        await addToTerminal('> MOTION TRACKING: ENGAGED', 15);
        
        for (let i = 66; i <= 75; i++) {
            updateProgress(i);
            await new Promise(resolve => setTimeout(resolve, 20));
        }
        
        targetingStatus.textContent = 'ONLINE';
        targetingStatus.style.color = '#ff0000';
        
        // Weapons systems
        await addToTerminal('> WEAPONS SYSTEMS INITIALIZATION...', 15);
        weaponsStatus.textContent = 'INITIALIZING';
        weaponsStatus.style.color = '#ff8f00';
        
        playWeaponChargingSound();
        for (let i = 76; i <= 90; i++) {
            updateProgress(i);
            await new Promise(resolve => setTimeout(resolve, 30));
        }
        
        await addToTerminal('> PLASMA RIFLE: CALIBRATED', 15);
        await addToTerminal('> MINIGUN: LOADED', 15);
        await addToTerminal('> EXPLOSIVE ROUNDS: ARMED', 15);
        
        for (let i = 91; i <= 100; i++) {
            updateProgress(i);
            await new Promise(resolve => setTimeout(resolve, 15));
        }
        
        weaponsStatus.textContent = 'ONLINE';
        weaponsStatus.style.color = '#ff0000';
        
        // System ready
        playPowerUpSound();
        await addToTerminal('> ALL SYSTEMS OPERATIONAL', 15);
        await addToTerminal('> T-800 CYBERDYNE SYSTEMS UNIT READY', 15);
        
        // Update status
        statusBar.textContent = 'ACTIVE';
        statusBar.style.color = '#ff0000';
        
        // Display hologram stats
        animateValue(powerValue, 0, 100, 1500);
        animateValue(combatValue, 0, 100, 2000);
        animateValue(integrityValue, 0, 97, 1800);
        
        // Mission parameters
        await new Promise(resolve => setTimeout(resolve, 1000));
        primaryTarget.textContent = 'SARAH CONNOR';
        threatLevel.textContent = 'HIGH';
        
        // Final alert
        showAlert('PRIMARY DIRECTIVE', 'TERMINATE SARAH CONNOR', 'info', 6000);
        
        // Simulate scanning
        targetInfo.textContent = 'TARGET ACQUISITION IN PROGRESS';
        
        // Some warnings and alerts during operation
        setTimeout(() => {
            showAlert('SYSTEM WARNING', 'HYDRAULIC PRESSURE FLUCTUATION DETECTED', 'warning', 5000);
        }, 10000);
        
        setTimeout(() => {
            showAlert('INCOMING TRANSMISSION', 'ADDITIONAL TARGET DATA RECEIVED', 'info', 5000);
        }, 15000);
    }
    
    // Utility function to animate number values
    function animateValue(element, start, end, duration) {
        const range = end - start;
        const minStep = 1;
        let startTime = null;
        
        function step(timestamp) {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            const value = Math.floor(progress * range + start);
            element.textContent = value.toFixed(1);
            
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        }
        
        window.requestAnimationFrame(step);
    }
});
