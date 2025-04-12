document.addEventListener('DOMContentLoaded', function() {
    // Get elements references
    const startButton = document.getElementById('start-button');
    const mainScreen = document.querySelector('.screen');
    const terminal = document.getElementById('terminal');
    const statusBar = document.getElementById('status-bar');
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
    
    // Audio context for sound effects
    let audioCtx = null;

    // Initialize audio on user interaction
    startButton.addEventListener('click', initAudio);

    // Start button click handler - now directly starts the boot sequence
    startButton.addEventListener('click', () => {
        initAudio();
        startButton.disabled = true;
        bootFlicker.style.display = 'block';
        bootFlicker.style.backgroundColor = 'rgba(0, 255, 0, 0.2)';
        
        // Quick flash sequence
        setTimeout(() => {
            bootFlicker.style.backgroundColor = 'rgba(0, 255, 0, 0.5)';
            playPowerUpSound();
            setTimeout(() => {
                bootFlicker.style.backgroundColor = 'rgba(0, 255, 0, 0.2)';
                setTimeout(() => {
                    bootFlicker.style.backgroundColor = 'rgba(0, 255, 0, 0.7)';
                    playErrorSound();
                    setTimeout(() => {
                        bootFlicker.style.display = 'none';
                        // Show Terminator vision elements
                        redFilter.style.display = 'block';
                        scanlines.style.display = 'block';
                        vignette.style.display = 'block';
                        visionOverlay.style.display = 'block';
                        startBootSequence();
                    }, 40);
                }, 60);
            }, 40);
        }, 60);
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
        oscillator1.frequency.linearRampToValueAtTime(120, audioCtx.currentTime + 0.3);
        
        oscillator2.type = 'square';
        oscillator2.frequency.setValueAtTime(40, audioCtx.currentTime);
        oscillator2.frequency.linearRampToValueAtTime(60, audioCtx.currentTime + 0.3);
        
        filter.type = 'lowpass';
        filter.frequency.value = 400;
        
        gainNode.gain.setValueAtTime(0.01, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.2, audioCtx.currentTime + 0.1);
        gainNode.gain.exponentialRampToValueAtTime(0.05, audioCtx.currentTime + 0.4);
        
        oscillator1.connect(filter);
        oscillator2.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        oscillator1.start();
        oscillator2.start();
        oscillator1.stop(audioCtx.currentTime + 0.4);
        oscillator2.stop(audioCtx.currentTime + 0.4);
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
        oscillator.frequency.linearRampToValueAtTime(350, audioCtx.currentTime + 0.06);
        
        gainNode.gain.setValueAtTime(0.15, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
        
        oscillator.connect(distortion);
        distortion.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.1);
    }

    // Alert sound - high pitched warning
    function playAlertSound() {
        if (!audioCtx) return;
        
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        
        oscillator.type = 'square';
        oscillator.frequency.setValueAtTime(880, audioCtx.currentTime);
        oscillator.frequency.setValueAtTime(980, audioCtx.currentTime + 0.02);
        oscillator.frequency.setValueAtTime(880, audioCtx.currentTime + 0.04);
        
        gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.06);
        
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.06);
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
        setTimeout(() => element.classList.remove('glitch'), 100);
    }

    // Activate full screen glitch effect
    function activateGlitchOverlay() {
        glitchOverlay.classList.add('active');
        setTimeout(() => glitchOverlay.classList.remove('active'), 100);
    }

    // Trigger screen flicker
    function triggerScreenFlicker() {
        const element = document.createElement('div');
        element.className = 'screen-flicker';
        document.body.appendChild(element);
        setTimeout(() => document.body.removeChild(element), 60);
    }

    // Type text with terminal effect
    async function typeText(text, element, speed = 4) {
        return new Promise(resolve => {
            let i = 0;
            const interval = setInterval(() => {
                element.textContent += text.charAt(i);
                i++;
                if (i === text.length) {
                    clearInterval(interval);
                    resolve();
                }
            }, speed);
        });
    }

    // Add text to terminal with typing effect
    async function addToTerminal(text, speed = 3, className = '') {
        const line = document.createElement('div');
        if (className) line.className = className;
        terminal.appendChild(line);
        await typeText(text, line, speed);
        terminal.scrollTop = terminal.scrollHeight;
        return line;
    }

    // Update progress bar
    function updateProgress(percent) {
        progressBar.style.width = `${percent}%`;
        progressPercentage.textContent = `${percent}%`;
        
        if (percent >= 100) {
            progressBar.style.backgroundColor = '#00ff00';
            progressPercentage.style.color = '#00ff00';
        }
    }

    // Show alert message
    function showAlert(title, message, type = 'info', duration = 800) {
        const alert = document.createElement('div');
        alert.className = `alert ${type}`;
        
        const alertTitle = document.createElement('div');
        alertTitle.className = 'alert-title';
        alertTitle.textContent = title;
        
        const alertMessage = document.createElement('div');
        alertMessage.className = 'alert-message';
        alertMessage.textContent = message;
        
        alert.appendChild(alertTitle);
        alert.appendChild(alertMessage);
        alertContainer.appendChild(alert);
        
        playAlertSound();
        
        setTimeout(() => {
            alert.classList.add('fade-out');
            setTimeout(() => alertContainer.removeChild(alert), 300);
        }, duration);
    }

    // Create particle effect
    function createParticle() {
        if (!particleOverlay) return;
        
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.animationDuration = `${Math.random() * 2 + 1}s`;
        particleOverlay.appendChild(particle);
        
        setTimeout(() => {
            particleOverlay.removeChild(particle);
        }, 3000);
    }

    // Update date and time display
    function updateDateTime() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        const date = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
        dateTimeDisplay.textContent = `${date} ${hours}:${minutes}:${seconds}`;
    }

    // Update system temperature
    function updateSystemTemp() {
        const temp = (35 + Math.random() * 5).toFixed(1);
        systemTempDisplay.textContent = `CORE TEMP: ${temp}°C`;
    }

    // Update coordinates
    function updateCoordinates() {
        const x = (Math.random() * 100).toFixed(2);
        const y = (Math.random() * 100).toFixed(2);
        const z = (Math.random() * 50).toFixed(2);
        coordinatesDisplay.textContent = `X:${x} Y:${y} Z:${z}`;
    }
    
    // Simulate scanner movement
    function moveScanner() {
        const x = Math.random() * 70 + 15;
        const y = Math.random() * 70 + 15;
        scannerTarget.style.left = `${x}%`;
        scannerTarget.style.top = `${y}%`;
    }

    // Initialize 3D model (simplified for this version)
    function initializeHologram() {
        const container = document.getElementById('hologram-display');
        const width = container.clientWidth;
        const height = container.clientHeight;
        
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
        
        const renderer = new THREE.WebGLRenderer({ 
            canvas: hologramCanvas, 
            alpha: true,
            antialias: true
        });
        
        renderer.setSize(width, height);
        renderer.setClearColor(0x000000, 0);
        
        // Create a smaller wireframe cube with amber lines
        const geometry = new THREE.BoxGeometry(2.5, 3.5, 2.5);
        const wireframe = new THREE.EdgesGeometry(geometry);
        const material = new THREE.LineBasicMaterial({ 
            color: 0x00ff00,
            linewidth: 1.5
        });
        const cube = new THREE.LineSegments(wireframe, material);
        scene.add(cube);
        
        // Add glowing eyes
        const eyeGeometry = new THREE.SphereGeometry(0.2, 16, 16);
        const eyeMaterial = new THREE.MeshBasicMaterial({ color: 0xffbf00 });
        const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        
        leftEye.position.set(-0.7, 0.5, 1.0);
        rightEye.position.set(0.7, 0.5, 1.0);
        
        scene.add(leftEye);
        scene.add(rightEye);
        
        // Jaw section
        const jawGeometry = new THREE.BoxGeometry(2.2, 0.8, 1.8);
        const jawWireframe = new THREE.EdgesGeometry(jawGeometry);
        const jawMaterial = new THREE.LineBasicMaterial({ 
            color: 0x00ff00,
            linewidth: 1.5 
        });
        const jaw = new THREE.LineSegments(jawWireframe, jawMaterial);
        jaw.position.set(0, -1.5, 0);
        scene.add(jaw);
        
        // Position camera to fit in window
        camera.position.z = 8;
        
        // Animation loop with faster rotation
        function animate() {
            requestAnimationFrame(animate);
            
            cube.rotation.x += 0.025;
            cube.rotation.y += 0.05;
            jaw.rotation.x = Math.sin(Date.now() * 0.005) * 0.1;
            jaw.rotation.y = cube.rotation.y;
            
            leftEye.rotation.y = cube.rotation.y;
            rightEye.rotation.y = cube.rotation.y;
            
            // Pulsing effect for eyes
            const pulseScale = 0.9 + Math.sin(Date.now() * 0.015) * 0.1;
            leftEye.scale.set(pulseScale, pulseScale, pulseScale);
            rightEye.scale.set(pulseScale, pulseScale, pulseScale);
            
            renderer.render(scene, camera);
        }
        
        // Handle window resize
        window.addEventListener('resize', () => {
            const width = container.clientWidth;
            const height = container.clientHeight;
            
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height);
        });
        
        animate();
    }

    // Main boot sequence
    async function startBootSequence() {
        // Clear terminal
        terminal.innerHTML = '';
        
        // Initialize system monitoring
        setInterval(updateDateTime, 1000);
        setInterval(updateSystemTemp, 3000);
        setInterval(updateCoordinates, 1000);
        setInterval(createParticle, 100);
        setInterval(moveScanner, 400);
        
        // Initialize 3D model
        initializeHologram();
        
        // Initial system check
        await addToTerminal('> CYBERDYNE SYSTEMS SERIES 800 MODEL 101', 3);
        await addToTerminal('> INITIALIZING BOOT SEQUENCE...', 3);
        
        // System errors and warnings
        await new Promise(resolve => setTimeout(resolve, 100));
        triggerScreenFlicker();
        playErrorSound();
        
        // Neural network initialization
        await addToTerminal('> NEURAL NETWORK INITIALIZATION...', 3);
        neuralStatus.textContent = 'INITIALIZING';
        neuralStatus.style.color = '#ffbf00';
        
        for (let i = 0; i <= 30; i++) {
            updateProgress(i);
            await new Promise(resolve => setTimeout(resolve, 6));
        }
        
        await addToTerminal('> LOADING NEURAL PATHWAYS...', 3);
        await addToTerminal('> SYNAPTIC CONNECTIONS: ESTABLISHED', 3);
        
        for (let i = 31; i <= 45; i++) {
            updateProgress(i);
            await new Promise(resolve => setTimeout(resolve, 4));
        }
        
        // Neural network error
        triggerScreenFlicker();
        playErrorSound();
        await addToTerminal('> ERROR: NEURAL PATTERN BUFFER OVERFLOW', 3, 'error-text');
        await addToTerminal('> REROUTING NEURAL PATHWAYS...', 3);
        await addToTerminal('> NEURAL STABILITY: RESTORED', 3);
        
        neuralStatus.textContent = 'ONLINE';
        neuralStatus.style.color = '#00ff00';
        
        // Targeting systems
        await addToTerminal('> INITIALIZING TARGETING SYSTEMS...', 3);
        targetingStatus.textContent = 'INITIALIZING';
        targetingStatus.style.color = '#ffbf00';
        
        for (let i = 46; i <= 65; i++) {
            updateProgress(i);
            await new Promise(resolve => setTimeout(resolve, 5));
        }
        
        // Show target scanner activity
        scannerTarget.style.opacity = '0.8';
        playTargetSound();
        await addToTerminal('> OPTICAL SENSORS: CALIBRATED', 3);
        await addToTerminal('> MOTION TRACKING: ENGAGED', 3);
        
        for (let i = 66; i <= 75; i++) {
            updateProgress(i);
            await new Promise(resolve => setTimeout(resolve, 4));
        }
        
        targetingStatus.textContent = 'ONLINE';
        targetingStatus.style.color = '#00ff00';
        
        // Weapons systems
        await addToTerminal('> WEAPONS SYSTEMS INITIALIZATION...', 3);
        weaponsStatus.textContent = 'INITIALIZING';
        weaponsStatus.style.color = '#ffbf00';
        
        for (let i = 76; i <= 90; i++) {
            updateProgress(i);
            await new Promise(resolve => setTimeout(resolve, 6));
        }
        
        await addToTerminal('> PLASMA RIFLE: CALIBRATED', 3);
        await addToTerminal('> MINIGUN: LOADED', 3);
        await addToTerminal('> EXPLOSIVE ROUNDS: ARMED', 3);
        
        for (let i = 91; i <= 100; i++) {
            updateProgress(i);
            await new Promise(resolve => setTimeout(resolve, 3));
        }
        
        weaponsStatus.textContent = 'ONLINE';
        weaponsStatus.style.color = '#00ff00';
        
        // System ready
        playPowerUpSound();
        await addToTerminal('> ALL SYSTEMS OPERATIONAL', 3);
        await addToTerminal('> T-800 CYBERDYNE SYSTEMS UNIT READY', 3);
        
        // Update status
        statusBar.textContent = 'ACTIVE';
        statusBar.style.color = '#00ff00';
        
        // Display hologram stats
        animateValue(powerValue, 0, 100, 300);
        animateValue(combatValue, 0, 100, 400);
        animateValue(integrityValue, 0, 97, 360);
        
        // Mission parameters
        await new Promise(resolve => setTimeout(resolve, 200));
        primaryTarget.textContent = 'SARAH CONNOR';
        threatLevel.textContent = 'HIGH';
        
        // Final alert
        showAlert('PRIMARY DIRECTIVE', 'TERMINATE SARAH CONNOR', 'info', 1200);
        
        // Simulate scanning
        targetInfo.textContent = 'TARGET ACQUISITION IN PROGRESS';
        
        // Re-enable start button
        startButton.disabled = false;
    }
    
    // Utility function to animate number values
    function animateValue(element, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const value = Math.floor(progress * (end - start) + start);
            element.textContent = value.toFixed(1);
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }
});
