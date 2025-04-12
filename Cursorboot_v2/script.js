document.addEventListener('DOMContentLoaded', function() {
    // Get elements references
    const terminal = document.getElementById('terminal');
    const statusBar = document.getElementById('status-bar');
    const securityLevel = document.getElementById('security-level');
    const progressBar = document.getElementById('progress-bar');
    const progressPercentage = document.getElementById('progress-percentage');
    const coreStatus = document.getElementById('core-status');
    const neuralStatus = document.getElementById('neural-status');
    const quantumStatus = document.getElementById('quantum-status');
    const dateTimeDisplay = document.getElementById('date-time');
    const coordsDisplay = document.getElementById('coordinates');
    const temperatureDisplay = document.getElementById('system-temp');
    const hologramCanvas = document.getElementById('hologram-canvas');
    const rotationValue = document.getElementById('rotation-value');
    const densityValue = document.getElementById('density-value');
    const stabilityValue = document.getElementById('stability-value');
    const diagnosticsPane = document.getElementById('diagnostics');
    const memoryDump = document.getElementById('memory-dump');
    const memoryContainer = document.getElementById('memory-container');
    const alertContainer = document.getElementById('alert-container');
    const glitchOverlay = document.querySelector('.glitch-overlay');
    
    // Canvas context for hologram
    const ctx = hologramCanvas.getContext('2d');
    
    // Set canvas size
    hologramCanvas.width = hologramCanvas.offsetWidth;
    hologramCanvas.height = hologramCanvas.offsetHeight;
    
    // Audio context for sound effects
    let audioCtx = null;
    
    // System settings
    let systemTemperature = 31.4;
    let stabilityPercentage = 91.2;
    let densityPercentage = 75.4;
    let rotationDegree = 0;
    let securityBreach = false;
    
    // Initialize audio on user interaction
    document.addEventListener('click', initAudio, { once: true });
    document.addEventListener('keydown', initAudio, { once: true });
    
    // Sci-fi movie references
    const scifiReferences = [
        "Initiating TRON identity disc synchronization...",
        "T-800 neural network activation in progress...",
        "HAL 9000 memory systems connecting...",
        "WOPR missile command protocols loading...",
        "Skynet defense matrix calculated...",
        "Wetware interface established with the Matrix...",
        "Back to the Future flux capacitor charged at 1.21 gigawatts...",
        "Tardis translation circuit active...",
        "Xenomorph containment field stabilized...",
        "Midichlorian count analysis completed...",
        "Deckard's Voight-Kampff test initialized...",
        "Weyland-Yutani corporate systems online...",
        "USS Enterprise warp core diagnostic running...",
        "Overlook Hotel A.I. surveillance activated...",
        "Soylent Green production metrics normal...",
        "Death Star superlaser calibration at 87%...",
        "Nostromo emergency protocols engaged...",
        "Wonkavision transmission test successful...",
        "LV-426 atmospheric processors optimized..."
    ];
    
    // Error messages for random failures
    const errorMessages = [
        "CRITICAL: Quantum fluctuation detected in sector 7G",
        "WARNING: Neural pathway 43-A experiencing synchronization drift",
        "ALERT: Dimensional stability compromised - recalibration required",
        "ERROR: Hyperspace calculations contain negative mass coefficient",
        "FAILURE: Anti-matter containment field at 92% - below safety threshold",
        "ANOMALY: Temporal echo detected in primary memory buffer",
        "BREACH: Unknown entity attempting to access secure partition",
        "VIOLATION: Protocol 476-B ignored by autonomous subsystem",
        "DANGER: Radiation levels exceeding Class 3 safety parameters",
        "MALFUNCTION: Primary power coupling experiencing harmonic resonance",
        "INTERFERENCE: Unknown signal detected on restricted channels",
        "CORRUPTION: Memory sector 0xF7A2D contains unexpected patterns"
    ];
    
    // System components for diagnostics
    const systemComponents = [
        {name: "PRIMARY CORE", value: "ONLINE", status: "normal"},
        {name: "SECONDARY CORE", value: "STANDBY", status: "normal"},
        {name: "MAIN REACTOR", value: "93.7%", status: "normal"},
        {name: "NEURAL INTERFACE", value: "SYNCED", status: "normal"},
        {name: "QUANTUM BUFFER", value: "64.2%", status: "normal"},
        {name: "SPATIAL CALIBRATOR", value: "ACTIVE", status: "normal"},
        {name: "DEFENSE SYSTEMS", value: "ARMED", status: "normal"},
        {name: "FIREWALL", value: "SECURE", status: "normal"},
        {name: "LIFE SUPPORT", value: "OPTIMAL", status: "normal"},
        {name: "COMMS ARRAY", value: "LISTENING", status: "normal"}
    ];
    
    // Initialize sound context
    function initAudio() {
        if (audioCtx === null) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            playBootSound();
        }
    }
    
    // Boot sequence sound effect
    function playBootSound() {
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
    
    // Update coordinates with random fluctuations
    function updateCoordinates() {
        const x = (Math.random() * 99.99).toFixed(2).padStart(5, '0');
        const y = (Math.random() * 99.99).toFixed(2).padStart(5, '0');
        const z = (Math.random() * 99.99).toFixed(2).padStart(5, '0');
        
        coordsDisplay.textContent = `X:${x} Y:${y} Z:${z}`;
        
        // Random glitch effect
        if (Math.random() < 0.1) {
            glitchElement(coordsDisplay);
            playBeep(780, 30, 'square', 0.05);
        }
        
        // Occasionally simulate error in coordinates
        if (Math.random() < 0.05) {
            coordsDisplay.innerHTML = `X:<span class="error-text">ERR</span> Y:${y} Z:${z}`;
            setTimeout(() => {
                coordsDisplay.textContent = `X:${x} Y:${y} Z:${z}`;
            }, 1000);
        }
    }
    
    // Update system temperature with fluctuations
    function updateTemperature() {
        const fluctuation = (Math.random() * 0.4) - 0.2;
        systemTemperature += fluctuation;
        systemTemperature = Math.max(30, Math.min(systemTemperature, 40));
        
        const displayTemp = systemTemperature.toFixed(1);
        temperatureDisplay.textContent = `CORE TEMP: ${displayTemp}°C`;
        
        // Add warning class if temperature too high
        if (systemTemperature > 38) {
            temperatureDisplay.classList.add('warning-text');
        } else if (systemTemperature > 36) {
            temperatureDisplay.classList.remove('warning-text');
            temperatureDisplay.classList.add('error-text');
        } else {
            temperatureDisplay.classList.remove('warning-text');
            temperatureDisplay.classList.remove('error-text');
        }
    }
    
    // Update date and time display
    function updateDateTime() {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        
        dateTimeDisplay.textContent = `${year}.${month}.${day} ${hours}:${minutes}:${seconds}`;
    }
    
    // Update hologram stats
    function updateHologramStats() {
        // Update rotation
        rotationDegree = (rotationDegree + 1) % 360;
        rotationValue.textContent = rotationDegree.toFixed(1);
        
        // Random fluctuations in density
        const densityFluctuation = (Math.random() * 1) - 0.5;
        densityPercentage += densityFluctuation;
        densityPercentage = Math.max(60, Math.min(densityPercentage, 90));
        densityValue.textContent = densityPercentage.toFixed(1);
        
        // Random fluctuations in stability
        const stabilityFluctuation = (Math.random() * 1) - 0.5;
        stabilityPercentage += stabilityFluctuation;
        stabilityPercentage = Math.max(80, Math.min(stabilityPercentage, 99.9));
        stabilityValue.textContent = stabilityPercentage.toFixed(1);
        
        // If stability is dropping, add warning class
        if (stabilityPercentage < 85) {
            stabilityValue.classList.add('error-text');
            if (Math.random() < 0.1) {
                activateGlitchOverlay();
            }
        } else {
            stabilityValue.classList.remove('error-text');
        }
    }
    
    // Simulate typewriter effect
    function typeText(text, element, speed = 25) {
        return new Promise(resolve => {
            let i = 0;
            element.textContent = '';
            
            const typing = setInterval(() => {
                if (i < text.length) {
                    element.textContent += text.charAt(i);
                    i++;
                    
                    // Random typing sound
                    if (Math.random() < 0.3) {
                        const freq = 1000 + Math.random() * 500;
                        playBeep(freq, 10, 'sine', 0.05);
                    }
                } else {
                    clearInterval(typing);
                    resolve();
                }
            }, speed);
        });
    }
    
    // Add text to terminal with typewriter effect
    async function addToTerminal(text, speed = 25, className = '') {
        const p = document.createElement('p');
        if (className) p.className = className;
        terminal.appendChild(p);
        await typeText(text, p, speed);
        terminal.scrollTop = terminal.scrollHeight;
        return p;
    }
    
    // Create a diagnostic item
    function createDiagnosticItem(name, value, status = 'normal') {
        const item = document.createElement('div');
        item.className = 'diagnostic-item';
        
        const nameSpan = document.createElement('span');
        nameSpan.className = 'diagnostic-name';
        nameSpan.textContent = name + ': ';
        
        const valueSpan = document.createElement('span');
        valueSpan.className = status === 'error' ? 'diagnostic-error' : 'diagnostic-value';
        valueSpan.textContent = value;
        
        item.appendChild(nameSpan);
        item.appendChild(valueSpan);
        
        return item;
    }
    
    // Update diagnostics with system information
    function updateDiagnostics() {
        // Clear current diagnostics
        diagnosticsPane.innerHTML = '';
        
        // Add each component
        systemComponents.forEach(component => {
            const item = createDiagnosticItem(component.name, component.value, component.status);
            diagnosticsPane.appendChild(item);
        });
    }
    
    // Update progress bar
    function updateProgress(percent) {
        progressBar.style.width = `${percent}%`;
        progressPercentage.textContent = `${percent}%`;
        
        // Play sound on progress update
        playBeep(300 + (percent * 3), 15, 'sine', 0.08);
        
        // Add glitch effect at certain thresholds
        if (percent % 25 === 0) {
            glitchElement(progressBar);
            glitchElement(progressPercentage);
        }
        
        // Randomly trigger screen glitch during boot
        if (Math.random() < 0.1) {
            activateGlitchOverlay();
        }
    }
    
    // Show alert popup
    function showAlert(title, message, type = 'info', duration = 5000) {
        const alert = document.createElement('div');
        alert.className = `alert-popup alert-${type}`;
        
        // Randomize position
        const top = 50 + (Math.random() * 20 - 10) + '%';
        const left = 50 + (Math.random() * 30 - 15) + '%';
        
        alert.style.top = top;
        alert.style.left = left;
        alert.style.transform = 'translate(-50%, -50%)';
        
        alert.innerHTML = `
            <div class="alert-header">
                <div class="alert-title">${title}</div>
                <div class="alert-close">×</div>
            </div>
            <div class="alert-content">${message}</div>
        `;
        
        // Add close functionality
        alert.querySelector('.alert-close').addEventListener('click', () => {
            alert.remove();
        });
        
        // Play appropriate sound
        if (type === 'critical') {
            playErrorSound();
        } else if (type === 'warning') {
            playAlertSound();
        } else {
            playBeep(660, 80, 'sine', 0.2);
        }
        
        alertContainer.appendChild(alert);
        
        // Auto-remove after duration
        if (duration) {
            setTimeout(() => {
                if (alert.parentNode) {
                    alert.remove();
                }
            }, duration);
        }
    }
    
    // Display memory dump
    function showMemoryDump() {
        memoryContainer.style.display = 'flex';
        memoryDump.innerHTML = '';
        
        // Generate random memory dump content
        let content = '';
        for (let i = 0; i < 100; i++) {
            const address = (i * 16).toString(16).toUpperCase().padStart(8, '0');
            let bytes = '';
            let ascii = '';
            
            for (let j = 0; j < 16; j++) {
                const byte = Math.floor(Math.random() * 256).toString(16).toUpperCase().padStart(2, '0');
                bytes += byte + ' ';
                
                // Generate ASCII representation
                const charCode = parseInt(byte, 16);
                ascii += (charCode >= 32 && charCode <= 126) ? String.fromCharCode(charCode) : '.';
            }
            
            content += `<div><span class="memory-address">0x${address}</span><span class="memory-bytes">${bytes}</span><span class="memory-ascii">${ascii}</span></div>`;
        }
        
        memoryDump.innerHTML = content;
        
        // Close button functionality
        const header = memoryContainer.querySelector('.panel-header');
        header.querySelector('.control-dot').addEventListener('click', () => {
            memoryContainer.style.display = 'none';
        });
        
        // Add screen flicker effect
        triggerScreenFlicker();
    }
    
    // Generate random hex code
    function randomHex(length = 8) {
        const chars = '0123456789ABCDEF';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }
    
    // Introduce a simulated error
    function simulateError() {
        if (Math.random() < 0.7) {
            // Choose random component to fail
            const componentIndex = Math.floor(Math.random() * systemComponents.length);
            systemComponents[componentIndex].status = 'error';
            systemComponents[componentIndex].value = 'ERROR';
            
            // Update diagnostics
            updateDiagnostics();
            
            // Show alert
            const errorIndex = Math.floor(Math.random() * errorMessages.length);
            showAlert('SYSTEM ALERT', errorMessages[errorIndex], 'critical');
            
            // Trigger glitch effects
            activateGlitchOverlay();
            triggerScreenFlicker();
            
            // Play error sound
            playErrorSound();
            
            // Restore after a few seconds
            setTimeout(() => {
                systemComponents[componentIndex].status = 'normal';
                systemComponents[componentIndex].value = 'RESTORED';
                updateDiagnostics();
                
                // Show recovery alert
                showAlert('RECOVERY COMPLETE', 'System has self-repaired the affected component.', 'info');
            }, 8000);
        }
    }
    
    // Draw 3D hologram without Three.js
    function drawHologram() {
        // Clear canvas
        ctx.clearRect(0, 0, hologramCanvas.width, hologramCanvas.height);
        
        // Set canvas size
        const width = hologramCanvas.width;
        const height = hologramCanvas.height;
        const centerX = width / 2;
        const centerY = height / 2;
        
        // Set rotation in radians
        const rotation = rotationDegree * Math.PI / 180;
        
        // Draw background with gradient
        const bgGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, width / 2);
        bgGradient.addColorStop(0, 'rgba(0, 50, 50, 0.2)');
        bgGradient.addColorStop(1, 'rgba(0, 10, 10, 0)');
        ctx.fillStyle = bgGradient;
        ctx.fillRect(0, 0, width, height);
        
        // Draw rotating shapes based on time
        const time = Date.now() / 1000;
        
        // Draw particles
        for (let i = 0; i < 200; i++) {
            const angle = (i / 100) * Math.PI * 2 + rotation;
            const distance = Math.sin(i / 20 + time) * (width / 4) + (width / 8);
            
            const x = centerX + Math.cos(angle) * distance;
            const y = centerY + Math.sin(angle) * distance * 0.5; // Flattened to create elliptical orbit
            
            const particleSize = Math.random() * 2 + 1;
            const alpha = Math.random() * 0.7 + 0.3;
            
            // Particle color based on stability
            let particleColor;
            if (stabilityPercentage < 85) {
                particleColor = `rgba(255, 123, 0, ${alpha})`;
            } else {
                particleColor = `rgba(0, 232, 198, ${alpha})`;
            }
            
            ctx.beginPath();
            ctx.arc(x, y, particleSize, 0, Math.PI * 2);
            ctx.fillStyle = particleColor;
            ctx.fill();
            
            // Add glow
            ctx.shadowBlur = 5;
            ctx.shadowColor = particleColor;
        }
        
        // Draw 3D cube with perspective
        const cubeSize = width / 6;
        const vertices = [
            [-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1],
            [-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1]
        ];
        
        const edges = [
            [0, 1], [1, 2], [2, 3], [3, 0],
            [4, 5], [5, 6], [6, 7], [7, 4],
            [0, 4], [1, 5], [2, 6], [3, 7]
        ];
        
        // Apply 3D rotation
        const rotX = time * 0.3;
        const rotY = rotation * 0.01;
        const rotZ = time * 0.2;
        
        const projectedVertices = vertices.map(vertex => {
            let [x, y, z] = vertex;
            
            // Rotate around X axis
            let y1 = y * Math.cos(rotX) - z * Math.sin(rotX);
            let z1 = y * Math.sin(rotX) + z * Math.cos(rotX);
            
            // Rotate around Y axis
            let x2 = x * Math.cos(rotY) + z1 * Math.sin(rotY);
            let z2 = -x * Math.sin(rotY) + z1 * Math.cos(rotY);
            
            // Rotate around Z axis
            let x3 = x2 * Math.cos(rotZ) - y1 * Math.sin(rotZ);
            let y3 = x2 * Math.sin(rotZ) + y1 * Math.cos(rotZ);
            
            // Apply perspective
            const scale = 1.5 / (3 + z2);
            
            return {
                x: centerX + x3 * cubeSize * scale,
                y: centerY + y3 * cubeSize * scale
            };
        });
        
        // Draw edges
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'rgba(0, 232, 198, 0.8)';
        ctx.shadowBlur = 10;
        ctx.shadowColor = 'rgba(0, 232, 198, 0.5)';
        
        edges.forEach(edge => {
            const [i, j] = edge;
            ctx.beginPath();
            ctx.moveTo(projectedVertices[i].x, projectedVertices[i].y);
            ctx.lineTo(projectedVertices[j].x, projectedVertices[j].y);
            ctx.stroke();
        });
        
        // Draw vertices (corners)
        ctx.fillStyle = 'rgba(255, 123, 0, 0.8)';
        ctx.shadowBlur = 8;
        ctx.shadowColor = 'rgba(255, 123, 0, 0.5)';
        
        projectedVertices.forEach(vertex => {
            ctx.beginPath();
            ctx.arc(vertex.x, vertex.y, 3, 0, Math.PI * 2);
            ctx.fill();
        });
        
        // Reset shadow
        ctx.shadowBlur = 0;
        
        // Draw scanning lines
        const scanLineY = (time * 50) % height;
        ctx.fillStyle = 'rgba(0, 232, 198, 0.15)';
        ctx.fillRect(0, scanLineY, width, 2);
        
        // Draw grid
        ctx.strokeStyle = 'rgba(0, 232, 198, 0.2)';
        ctx.lineWidth = 1;
        
        // Horizontal lines
        for (let i = 0; i < height; i += 20) {
            ctx.beginPath();
            ctx.moveTo(0, i);
            ctx.lineTo(width, i);
            ctx.stroke();
        }
        
        // Vertical lines
        for (let i = 0; i < width; i += 20) {
            ctx.beginPath();
            ctx.moveTo(i, 0);
            ctx.lineTo(i, height);
            ctx.stroke();
        }
    }
    
    // Create Matrix-like data stream effect
    function createDataStream() {
        const dataStream = document.createElement('div');
        dataStream.className = 'data-stream';
        document.querySelector('.screen').appendChild(dataStream);
        
        // Characters to use
        const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
        
        // Create symbols that fall down
        function createSymbol() {
            const symbol = document.createElement('div');
            symbol.className = 'data-symbol';
            symbol.textContent = chars.charAt(Math.floor(Math.random() * chars.length));
            
            // Random position
            const left = Math.random() * 100;
            symbol.style.left = `${left}%`;
            
            // Random speed
            const duration = 3 + Math.random() * 5;
            symbol.style.animation = `fall ${duration}s linear forwards`;
            
            dataStream.appendChild(symbol);
            
            // Remove after animation completes
            setTimeout(() => {
                if (symbol.parentNode) {
                    symbol.remove();
                }
            }, duration * 1000);
        }
        
        // Create symbols periodically
        return setInterval(() => {
            // Only add symbols during certain periods or events
            if (Math.random() < 0.3) {
                createSymbol();
            }
        }, 100);
    }
    
    // Boot sequence
    async function bootSequence() {
        // Flash screen effect
        document.body.style.backgroundColor = '#FFFFFF';
        setTimeout(() => document.body.style.backgroundColor = '#000000', 150);
        
        // Initial boot sound
        playBootSound();
        
        // Setup timers for system updates
        const coordsInterval = setInterval(updateCoordinates, 1000);
        const dateTimeInterval = setInterval(updateDateTime, 1000);
        const tempInterval = setInterval(updateTemperature, 3000);
        const hologramStatsInterval = setInterval(updateHologramStats, 500);
        
        // Start hologram animation
        const hologramInterval = setInterval(drawHologram, 1000 / 30); // 30 FPS
        
        // Setup data stream effect
        const dataStreamInterval = createDataStream();
        
        // Initialize first values
        updateDateTime();
        updateCoordinates();
        updateDiagnostics();
        
        // Start boot sequence messages
        statusBar.textContent = 'SYSTEM BOOT INITIATED';
        
        await addToTerminal('> NEXUS-7 ORBITAL COMMAND BOOT SEQUENCE INITIATED', 30);
        await addToTerminal('> INITIALIZING HARDWARE DIAGNOSTICS...', 25);
        
        // Progress to 10%
        for (let i = 1; i <= 10; i++) {
            updateProgress(i);
            await new Promise(r => setTimeout(r, 100));
        }
        
        // System checks with sci-fi references
        await addToTerminal('> ' + scifiReferences[Math.floor(Math.random() * scifiReferences.length)], 20);
        await addToTerminal('> QUANTUM PROCESSORS: FUNCTIONAL', 20);
        await addToTerminal('> NEURAL INTERFACE: CALIBRATING', 20);
        
        // Progress to 20%
        for (let i = 11; i <= 20; i++) {
            updateProgress(i);
            await new Promise(r => setTimeout(r, 80));
        }
        
        // Update status
        statusBar.textContent = 'LOADING CORE PROTOCOLS';
        coreStatus.textContent = 'INITIALIZING';
        coreStatus.className = 'warning-text';
        
        await addToTerminal('> ' + scifiReferences[Math.floor(Math.random() * scifiReferences.length)], 20);
        await addToTerminal('> INITIALIZING MEMORY SUBSYSTEMS...', 25);
        
        // First simulated error
        await addToTerminal('> WARNING: MEMORY BUFFER FRAGMENTATION DETECTED', 20, 'error-text');
        playErrorSound();
        triggerScreenFlicker();
        
        // Show memory dump
        await addToTerminal('> PERFORMING MEMORY DUMP FOR DIAGNOSTIC...', 20);
        showMemoryDump();
        
        await new Promise(r => setTimeout(r, 3000));
        
        // Close memory dump
        memoryContainer.style.display = 'none';
        
        await addToTerminal('> MEMORY DEFRAGMENTATION COMPLETE', 20, 'success-text');
        
        // Progress to 35%
        for (let i = 21; i <= 35; i++) {
            updateProgress(i);
            await new Promise(r => setTimeout(r, 70));
        }
        
        await addToTerminal('> ' + scifiReferences[Math.floor(Math.random() * scifiReferences.length)], 20);
        coreStatus.textContent = 'ONLINE';
        coreStatus.className = '';
        
        statusBar.textContent = 'ACTIVATING NEURAL NETWORK';
        
        // Progress to 50%
        for (let i = 36; i <= 50; i++) {
            updateProgress(i);
            await new Promise(r => setTimeout(r, 60));
        }
        
        // Second sci-fi reference
        await addToTerminal('> ' + scifiReferences[Math.floor(Math.random() * scifiReferences.length)], 20);
        
        // Trigger alert about neural sync
        showAlert('NEURAL SYNC WARNING', 'Brain-machine interface experiencing fluctuations. Recalibration in progress.', 'warning');
        
        await addToTerminal('> NEURAL NETWORK HARMONIZING...', 20);
        neuralStatus.textContent = 'SYNCING';
        neuralStatus.className = 'warning-text';
        
        // Progress to 65%
        for (let i = 51; i <= 65; i++) {
            updateProgress(i);
            await new Promise(r => setTimeout(r, 70));
        }
        
        await addToTerminal('> NEURAL CALIBRATION COMPLETE', 20);
        neuralStatus.textContent = 'ONLINE';
        neuralStatus.className = '';
        
        statusBar.textContent = 'INITIALIZING QUANTUM FIELD';
        
        // Progress to 80%
        for (let i = 66; i <= 80; i++) {
            updateProgress(i);
            await new Promise(r => setTimeout(r, 50));
        }
        
        await addToTerminal('> ESTABLISHING QUANTUM ENTANGLEMENT...', 20);
        await addToTerminal('> ' + scifiReferences[Math.floor(Math.random() * scifiReferences.length)], 20);
        quantumStatus.textContent = 'STABILIZING';
        quantumStatus.className = 'warning-text';
        
        // Trigger random error
        simulateError();
        
        // Progress to 95%
        for (let i = 81; i <= 95; i++) {
            updateProgress(i);
            await new Promise(r => setTimeout(r, 80));
        }
        
        await addToTerminal('> QUANTUM FIELD STABILIZED', 20);
        quantumStatus.textContent = 'ONLINE';
        quantumStatus.className = '';
        
        // Final stage
        statusBar.textContent = 'FINALIZING SYSTEM STARTUP';
        await addToTerminal('> ENCRYPTION PROTOCOLS ACTIVE', 20);
        await addToTerminal('> DEFENSE SYSTEMS ARMED', 20);
        
        // Progress to 100%
        for (let i = 96; i <= 100; i++) {
            updateProgress(i);
            await new Promise(r => setTimeout(r, 100));
        }
        
        // Complete the boot sequence
        playBootSound();
        document.body.style.backgroundColor = '#FFFFFF';
        setTimeout(() => document.body.style.backgroundColor = '#000000', 200);
        
        statusBar.textContent = 'SYSTEM READY';
        securityLevel.innerHTML = 'SEC LEVEL: <span class="success-text">ALPHA</span>';
        
        await addToTerminal('', 10);
        const welcomeMessage = await addToTerminal('> WELCOME TO NEXUS-7 ORBITAL COMMAND', 40);
        welcomeMessage.style.color = 'var(--primary-orange)';
        welcomeMessage.style.textShadow = 'var(--glow-orange)';
        welcomeMessage.style.fontSize = '18px';
        
        await addToTerminal('> ALL SYSTEMS NOMINAL', 30);
        
        // Add a final sci-fi reference
        await addToTerminal('> ' + scifiReferences[Math.floor(Math.random() * scifiReferences.length)], 25);
        await addToTerminal('> TYPE "HELP" FOR COMMAND LIST', 30);
        
        // Add simulated cursor at the end
        const prompt = document.createElement('p');
        prompt.innerHTML = '> <span class="cursor-prompt">█</span>';
        terminal.appendChild(prompt);
        
        // Set up error simulation interval
        setInterval(() => {
            if (Math.random() < 0.1) { // 10% chance of error every 30 seconds
                simulateError();
            }
        }, 30000);
    }
    
    // Start the boot sequence after a short delay
    setTimeout(bootSequence, 500);
});
