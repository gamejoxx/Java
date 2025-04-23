document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('networkCanvas');
    const ctx = canvas.getContext('2d');
    const cursorData = document.getElementById('cursorData');
    const menuBtn = document.getElementById('menuBtn');
    const portfolioBtn = document.getElementById('portfolioBtn');
    const contactBtn = document.getElementById('contactBtn');
    const systemDateTime = document.getElementById('systemDateTime');
    
    // Audio elements
    const clickSound = document.getElementById('clickSound');
    const beepSound = document.getElementById('beepSound');
    const computerSound = document.getElementById('computerSound');
    const errorSound = document.getElementById('errorSound');
    
    // Set canvas dimensions
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Mouse position tracking
    let mouseX = 0;
    let mouseY = 0;
    let prevMouseX = 0;
    let prevMouseY = 0;
    
    // Network nodes and connections
    const nodes = [];
    const dataWindows = [];
    const ripples = [];
    const dataBrackets = [];
    const navPaths = [];
    const errorPopups = [];
    let frame = 0;
    let menuClicked = false;
    
    // Symbols and characters for data display
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?/\\\'"`~'.split('');
    const hexChars = '0123456789ABCDEF'.split('');
    const binaryChars = '01'.split('');
    const brackets = ['[', ']', '{', '}', '<', '>', '(', ')', '/', '\\'];
    
    // Initialize date/time display
    updateDateTime();
    setInterval(updateDateTime, 1000);
    
    // Function to update date/time in the header
    function updateDateTime() {
        const now = new Date();
        const date = now.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: '2-digit', 
            day: '2-digit' 
        }).replace(/\//g, '.');
        
        const time = now.toLocaleTimeString('en-US', { 
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        
        systemDateTime.textContent = `${date} ${time}`;
    }
    
    // Queue random system sounds
    function queueRandomSounds() {
        const minDelay = 5000; // 5 seconds minimum between sounds
        const maxDelay = 15000; // 15 seconds maximum
        
        const nextSoundDelay = minDelay + Math.random() * (maxDelay - minDelay);
        
        setTimeout(() => {
            if (Math.random() < 0.7) {
                playSound(computerSound, 0.2);
            } else {
                playSound(beepSound, 0.1);
            }
            queueRandomSounds();
        }, nextSoundDelay);
    }
    
    // Queue random error messages
    function queueRandomErrors() {
        const minDelay = 15000; // 15 seconds minimum between errors
        const maxDelay = 45000; // 45 seconds maximum
        
        const nextErrorDelay = minDelay + Math.random() * (maxDelay - minDelay);
        
        setTimeout(() => {
            createRandomErrorMessage();
            queueRandomErrors();
        }, nextErrorDelay);
    }
    
    // Start random sound and error queues
    queueRandomSounds();
    queueRandomErrors();
    
    // Play sound with volume adjustment
    function playSound(audioElement, volume = 0.5) {
        if (audioElement) {
            audioElement.volume = volume;
            audioElement.currentTime = 0;
            audioElement.play().catch(e => {
                console.log("Audio play prevented:", e);
            });
        }
    }
    
    // Mouse move event handler
    document.addEventListener('mousemove', function(e) {
        prevMouseX = mouseX;
        prevMouseY = mouseY;
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Update main cursor data window position
        updateCursorDataWindow();
        
        // Occasionally spawn new node at cursor position
        if (Math.random() < 0.05) {
            createNode(mouseX, mouseY);
        }
    });
    
    // Click event handler
    document.addEventListener('click', function(e) {
        // Play click sound
        playSound(clickSound, 0.3);
        
        // Create ripple effect
        createRipple(e.clientX, e.clientY);
        
        // Spawn multiple nodes in a burst pattern
        const burstCount = 5 + Math.floor(Math.random() * 8);
        for (let i = 0; i < burstCount; i++) {
            setTimeout(() => {
                const angle = (i / burstCount) * Math.PI * 2 + Math.random() * 0.5;
                const distance = 20 + Math.random() * 60;
                const x = e.clientX + Math.cos(angle) * distance;
                const y = e.clientY + Math.sin(angle) * distance;
                
                const node = createNode(x, y);
                // Make some of these special nodes with longer life
                node.isClickSpawned = true;
                node.lifetime += 100;
                
                // 40% chance to have data window on click-spawned nodes
                node.hasDataWindow = Math.random() < 0.4;
                if (node.hasDataWindow) {
                    createDataWindow(node);
                }
            }, i * 40); // Stagger the spawning for visual effect
        }
    });
    
    // Menu button click handler
    menuBtn.addEventListener('click', function(e) {
        e.stopPropagation(); // Prevent the document click handler from running
        
        // Play a different sound for menu
        playSound(beepSound, 0.3);
        
        if (!menuClicked) {
            menuClicked = true;
            showNavButtons();
        }
    });
    
    // Create random error message popup
    function createRandomErrorMessage() {
        // Play error sound
        playSound(errorSound, 0.3);
        
        // Create random error codes and messages
        const errorCodes = [
            "ERR_MEMORY_ALLOC_" + getRandomHex(4),
            "ERR_BUFFER_OVFL_" + getRandomHex(4),
            "SYS_FAULT_" + getRandomHex(6),
            "ERR_UXH_" + getRandomHex(8),
            "DATA_CORRUPTION_" + getRandomBinary(8)
        ];
        
        const errorMessages = [
            "Memory buffer overflow detected at location 0x" + getRandomHex(8),
            "System unable to allocate memory segment at 0x" + getRandomHex(8),
            "Data corruption detected in memory region 0x" + getRandomHex(6) + " to 0x" + getRandomHex(6),
            "UXH subsystem error: buffer at 0x" + getRandomHex(8) + " corrupted",
            "Incorrect memory allocation in register " + getRandomHex(2) + ", attempting to recover",
            "Unexpected data format in memory segment 0x" + getRandomHex(6) + ", initiating repair sequence",
            "System module fault detected, redirecting process to alternative pathway",
            "Network buffer inconsistency detected, applying recovery protocol"
        ];
        
        const recoveryMessages = [
            "Recalibrating memory allocation tables...",
            "Rebuilding system address pointers...",
            "Remapping virtual memory space...",
            "Reconfiguring protocol handlers...",
            "Restoring integrity checksums...",
            "Reconstructing data allocation vectors...",
            "Rerouting system interrupt handlers..."
        ];
        
        // Pick random messages
        const errorCode = errorCodes[Math.floor(Math.random() * errorCodes.length)];
        const errorMessage = errorMessages[Math.floor(Math.random() * errorMessages.length)];
        const recoveryMessage = recoveryMessages[Math.floor(Math.random() * recoveryMessages.length)];
        
        // Create and position the error popup
        const errorPopup = document.createElement('div');
        errorPopup.className = 'error-popup';
        
        // Position randomly, but ensure it's fully visible
        const maxLeft = window.innerWidth - 400;
        const maxTop = window.innerHeight - 200;
        const popupLeft = 100 + Math.random() * (maxLeft - 100);
        const popupTop = 100 + Math.random() * (maxTop - 100);
        
        errorPopup.style.left = popupLeft + 'px';
        errorPopup.style.top = popupTop + 'px';
        
        // Create error content
        errorPopup.innerHTML = `
            <div class="error-header">
                <span>SYSTEM ERROR</span>
                <span class="error-code">${errorCode}</span>
            </div>
            <div class="error-content typing-effect">
                ${errorMessage}
            </div>
            <div class="error-content">
                <span id="recovery-message"></span>
            </div>
            <div class="progress-bar">
                <div class="progress-fill"></div>
            </div>
        `;
        
        document.body.appendChild(errorPopup);
        errorPopups.push(errorPopup);
        
        // Show the popup with animation
        setTimeout(() => {
            errorPopup.classList.add('visible');
        }, 100);
        
        // Add recovery message with typing effect after delay
        const recovery = errorPopup.querySelector('#recovery-message');
        setTimeout(() => {
            let i = 0;
            const typingSpeed = 30; // ms per character
            
            const typeWriter = () => {
                if (i < recoveryMessage.length) {
                    recovery.textContent += recoveryMessage.charAt(i);
                    i++;
                    setTimeout(typeWriter, typingSpeed);
                }
            };
            
            typeWriter();
        }, 1500);
        
        // Animate progress bar
        const progressFill = errorPopup.querySelector('.progress-fill');
        let progress = 0;
        const progressInterval = setInterval(() => {
            progress += 2 + Math.random() * 3; // Random progress speed
            if (progress >= 100) {
                progress = 100;
                clearInterval(progressInterval);
                
                // Remove error popup after completion
                setTimeout(() => {
                    errorPopup.classList.remove('visible');
                    
                    // Remove from DOM after fade out
                    setTimeout(() => {
                        if (errorPopup.parentNode) {
                            errorPopup.parentNode.removeChild(errorPopup);
                            const index = errorPopups.indexOf(errorPopup);
                            if (index > -1) {
                                errorPopups.splice(index, 1);
                            }
                        }
                    }, 500);
                }, 1000);
            }
            progressFill.style.width = progress + '%';
        }, 100);
    }
    
    // Function to show navigation buttons with organic data paths
    function showNavButtons() {
        // Get menu button position
        const menuRect = menuBtn.getBoundingClientRect();
        const menuCenterX = menuRect.left + menuRect.width / 2;
        const menuCenterY = menuRect.top + menuRect.height / 2;
        
        // Define locations for the portfolio and contact buttons - use various angles around the circle
        const randomAngle1 = Math.PI * (0.3 + Math.random() * 0.4); // Upper right
        const randomAngle2 = Math.PI * (1.3 + Math.random() * 0.4); // Lower left
        
        const portfolioDistance = 180 + Math.random() * 80;
        const contactDistance = 180 + Math.random() * 80;
        
        const portfolioX = menuCenterX + Math.cos(randomAngle1) * portfolioDistance;
        const portfolioY = menuCenterY + Math.sin(randomAngle1) * portfolioDistance;
        
        const contactX = menuCenterX + Math.cos(randomAngle2) * contactDistance;
        const contactY = menuCenterY + Math.sin(randomAngle2) * contactDistance;
        
        // Position the buttons
        portfolioBtn.style.left = (portfolioX - 60) + 'px';
        portfolioBtn.style.top = (portfolioY - 20) + 'px';
        
        contactBtn.style.left = (contactX - 50) + 'px';
        contactBtn.style.top = (contactY - 20) + 'px';
        
        // Create ripple at menu center
        createRipple(menuCenterX, menuCenterY);
        
        // Play computer processing sound
        playSound(computerSound, 0.3);
        
        // Create organic path from menu to portfolio button
        createOrganicPath(
            menuCenterX, menuCenterY,
            portfolioX, portfolioY,
            '#00ccff',
            portfolioBtn
        );
        
        // Create organic path from menu to contact button
        createOrganicPath(
            menuCenterX, menuCenterY,
            contactX, contactY,
            '#00ffaa',
            contactBtn
        );
        
        // Hide menu button after paths are created
        setTimeout(() => {
            menuBtn.style.opacity = '0';
            menuBtn.style.pointerEvents = 'none';
        }, 500);
        
        // Create pulsing connections between Portfolio and Contact buttons
        setTimeout(() => {
            createPulsingConnection(portfolioX, portfolioY, contactX, contactY);
        }, 1500); // Wait for buttons to be fully visible
    }
    
    // Add click listeners to the navigation buttons
    portfolioBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        playSound(beepSound, 0.3);
    });
    
    contactBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        playSound(beepSound, 0.3);
    });
    
    // Function to create an organic path with nodes and SVG
    function createOrganicPath(startX, startY, endX, endY, color, targetBtn) {
        // Create a wavvy path between the two points
        const pathPoints = generateWavyPathPoints(startX, startY, endX, endY);
        
        // Create SVG path element
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.classList.add('path-line');
        svg.setAttribute('width', window.innerWidth);
        svg.setAttribute('height', window.innerHeight);
        svg.style.position = 'absolute';
        svg.style.top = '0';
        svg.style.left = '0';
        svg.style.pointerEvents = 'none';
        svg.style.zIndex = '5';
        
        // Create path element
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        
        // Generate the path data
        let pathData = `M ${startX} ${startY}`;
        for (let i = 1; i < pathPoints.length; i++) {
            pathData += ` L ${pathPoints[i].x} ${pathPoints[i].y}`;
        }
        
        path.setAttribute('d', pathData);
        path.setAttribute('stroke', color);
        path.setAttribute('stroke-width', '2');
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke-dasharray', '5,3');
        
        // Create animation of the path drawing
        const pathLength = path.getTotalLength();
        path.style.strokeDasharray = pathLength;
        path.style.strokeDashoffset = pathLength;
        
        // Animate the path
        svg.appendChild(path);
        document.body.appendChild(svg);
        
        // Store nav path for potential cleanup
        navPaths.push(svg);
        
        // Animate the path drawing
        let progress = 0;
        const animationDuration = 1000; // milliseconds
        const animationInterval = 16; // approximately 60fps
        const animationSteps = animationDuration / animationInterval;
        
        // Create connection dots along the path
        for (let i = 0; i < pathPoints.length; i += 4) {
            if (i > 0 && i < pathPoints.length - 1) {
                const point = pathPoints[i];
                
                // Create data nodes at some of the points
                if (i % 8 === 0) {
                    const node = createNode(point.x, point.y);
                    node.lifetime += 200;
                    node.size = 3 + Math.random() * 3;
                    node.isPathNode = true;
                    
                    // Add data windows to some nodes
                    if (Math.random() < 0.6) {
                        node.hasDataWindow = true;
                        createDataWindow(node);
                    }
                }
                
                // Create a dot
                setTimeout(() => {
                    createConnectionDot(point.x, point.y, i / pathPoints.length);
                }, i * 30);
            }
        }
        
        // Animate path drawing
        const pathInterval = setInterval(() => {
            progress += 1 / animationSteps;
            if (progress >= 1) {
                clearInterval(pathInterval);
                progress = 1;
                
                // Once path is complete, show the button
                setTimeout(() => {
                    targetBtn.classList.add('visible');
                    
                    // Add brackets around the button
                    const btnRect = targetBtn.getBoundingClientRect();
                    const btnCenterX = btnRect.left + btnRect.width / 2;
                    const btnCenterY = btnRect.top + btnRect.height / 2;
                    createDataBrackets(btnCenterX, btnCenterY);
                }, 200);
            }
            path.style.strokeDashoffset = pathLength * (1 - progress);
        }, animationInterval);
    }
    
    // Function to create pulsing, sine wave connections between buttons
    function createPulsingConnection(startX, startY, endX, endY) {
        // Create sine wave path points between the two buttons
        const connectionNodes = [];
        const pathPoints = createSineWavePath(startX, startY, endX, endY);
        
        // Create nodes along the path
        for (let i = 0; i < pathPoints.length; i += 4) {
            if (i > 0 && i < pathPoints.length - 1) {
                const point = pathPoints[i];
                
                // Create a node at this point
                const node = createNode(point.x, point.y);
                node.isPathNode = true;
                node.isPulseNode = true;
                node.lifetime += 5000; // Make these last much longer
                node.size = 2 + Math.random() * 3;
                
                // Store reference to create connections
                connectionNodes.push(node);
                
                // Add data window to some nodes
                if (i % 12 === 0 && Math.random() < 0.5) {
                    node.hasDataWindow = true;
                    const dataWindow = createDataWindow(node);
                    
                    // Special styling for connection data windows
                    setTimeout(() => {
                        if (dataWindow && dataWindow.element) {
                            dataWindow.element.style.color = "#00ffdd";
                            dataWindow.element.style.borderColor = "#00ffaa";
                        }
                    }, 50);
                }
            }
        }
        
        // Connect the nodes in sequence to form a path
        for (let i = 1; i < connectionNodes.length; i++) {
            const node = connectionNodes[i];
            const prevNode = connectionNodes[i-1];
            
            // Create connection to previous node
            node.connections.push({
                target: prevNode,
                strength: 0.9,
                pulses: [],
                isPulseConnection: true
            });
        }
        
        // Start periodic pulses along the connection
        startHeartbeatPulses(connectionNodes);
    }
    
    // Function to create a sine wave path between two points
    function createSineWavePath(startX, startY, endX, endY) {
        const points = [];
        const segments = 40 + Math.floor(Math.random() * 10);
        
        // Calculate direction vector
        const dx = endX - startX;
        const dy = endY - startY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        // Normalize direction vector
        const dirX = dx / dist;
        const dirY = dy / dist;
        
        // Perpendicular vector for the sine wave
        const perpX = -dirY;
        const perpY = dirX;
        
        // Create sine wave with varying amplitude
        const baseAmplitude = 20 + Math.random() * 20;
        
        for (let i = 0; i <= segments; i++) {
            const t = i / segments;
            
            // Base position along the line
            let x = startX + dx * t;
            let y = startY + dy * t;
            
            // Add sine wave oscillation perpendicular to the path
            const wavePos = Math.sin(t * Math.PI * (3 + Math.random()));
            const amplitude = baseAmplitude * Math.sin(t * Math.PI); // Amplitude varies along path
            
            x += perpX * wavePos * amplitude;
            y += perpY * wavePos * amplitude;
            
            points.push({ x, y });
        }
        
        return points;
    }
    
    // Function to start heartbeat-like pulses along the connection
    function startHeartbeatPulses(nodes) {
        if (nodes.length < 2) return;
        
        // Create heartbeat pattern - two pulses in quick succession, then pause
        const heartbeatPattern = () => {
            // First pulse
            sendPulseAlongPath(nodes, 0);
            
            // Second pulse after a short delay
            setTimeout(() => {
                sendPulseAlongPath(nodes, 0);
            }, 300);
            
            // Schedule next heartbeat
            setTimeout(heartbeatPattern, 2000 + Math.random() * 1000);
        };
        
        // Start the heartbeat pattern
        heartbeatPattern();
    }
    
    // Function to send a pulse along a connected path
    function sendPulseAlongPath(nodes, startIndex) {
        if (startIndex >= nodes.length - 1) return;
        
        const node = nodes[startIndex];
        const nextNode = nodes[startIndex + 1];
        
        // Find the connection to the next node
        const connection = node.connections.find(conn => conn.target === nextNode);
        if (!connection) return;
        
        // Create a pulse that travels along this connection
        connection.pulses.push({
            position: 0,
            speed: 0.05 + Math.random() * 0.02,
            isHeartbeatPulse: true
        });
        
        // Briefly highlight the node as the pulse passes
        highlightNode(node);
        
        // Propagate to the next node after a delay
        setTimeout(() => {
            sendPulseAlongPath(nodes, startIndex + 1);
        }, 70); // Time for pulse to travel to next node
    }
    
    // Function to briefly highlight a node to simulate pulse passing
    function highlightNode(node) {
        // Store original size
        const originalSize = node.size;
        
        // Temporarily increase size
        node.size = originalSize * 2.5;
        node.isHighlighted = true;
        
        // Return to normal after a short time
        setTimeout(() => {
            node.size = originalSize;
            node.isHighlighted = false;
        }, 150);
    }
    
    // Function to generate wavy path points for menu to button paths
    function generateWavyPathPoints(startX, startY, endX, endY) {
        const points = [];
        const segments = 20 + Math.floor(Math.random() * 10);
        
        // Calculate control points for interesting curvature
        const dx = endX - startX;
        const dy = endY - startY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        // Add some randomness to the control points
        const controlPointOffset = dist * 0.3;
        const midX = (startX + endX) / 2;
        const midY = (startY + endY) / 2;
        
        // Add perpendicular offset to create a curve
        const perpX = -dy / dist;
        const perpY = dx / dist;
        
        // Create a wavy path with random offsets
        for (let i = 0; i <= segments; i++) {
            const t = i / segments;
            const inverseT = 1 - t;
            
            // Calculate base point on straight line
            let x = startX * inverseT + endX * t;
            let y = startY * inverseT + endY * t;
            
            // Add perpendicular offset for curve and randomness
            const offset = Math.sin(t * Math.PI) * controlPointOffset;
            const randomOffset = (Math.random() * 2 - 1) * 15 * Math.sin(t * Math.PI);
            
            x += perpX * offset + perpX * randomOffset;
            y += perpY * offset + perpY * randomOffset;
            
            points.push({ x, y });
        }
        
        return points;
    }
    
    // Create a connection dot on the path
    function createConnectionDot(x, y, progress) {
        const dot = document.createElement('div');
        dot.className = 'connector-dot';
        
        // Vary size but keep small
        const size = 2 + Math.random() * 4;
        
        dot.style.width = size + 'px';
        dot.style.height = size + 'px';
        dot.style.left = (x - size / 2) + 'px';
        dot.style.top = (y - size / 2) + 'px';
        
        // Add pulse animation
        dot.style.animation = 'pulse-glow 2s infinite';
        
        document.body.appendChild(dot);
        
        // Fade in
        setTimeout(() => {
            dot.classList.add('visible');
        }, 50);
    }
    
    // Create animated data brackets
    function createDataBrackets(x, y) {
        const bracketPositions = [
            { x: -80, y: -30, bracket: '[', direction: 'up' },
            { x: -80, y: 30, bracket: '[', direction: 'down' },
            { x: 80, y: -30, bracket: ']', direction: 'up' },
            { x: 80, y: 30, bracket: ']', direction: 'down' },
            { x: -50, y: -50, bracket: '{', direction: 'up-right' },
            { x: 50, y: -50, bracket: '}', direction: 'up-left' },
            { x: -50, y: 50, bracket: '{', direction: 'down-right' },
            { x: 50, y: 50, bracket: '}', direction: 'down-left' }
        ];
        
        bracketPositions.forEach(pos => {
            setTimeout(() => {
                const bracket = document.createElement('div');
                bracket.className = 'data-bracket';
                bracket.textContent = pos.bracket;
                bracket.style.left = (x + pos.x) + 'px';
                bracket.style.top = (y + pos.y) + 'px';
                
                // Set random direction for float away animation
                const xOffset = -20 + Math.random() * 40;
                const yOffset = -20 + Math.random() * 40;
                bracket.style.setProperty('--x-offset', xOffset + 'px');
                bracket.style.setProperty('--y-offset', yOffset + 'px');
                
                document.body.appendChild(bracket);
                
                // Fade in first
                setTimeout(() => {
                    bracket.style.opacity = '0.8';
                }, 10);
                
                // Then animate away
                setTimeout(() => {
                    bracket.style.animation = 'float-away 1.5s forwards';
                    
                    // Remove from DOM after animation
                    setTimeout(() => {
                        if (bracket.parentNode) {
                            bracket.parentNode.removeChild(bracket);
                        }
                    }, 1500);
                }, 800 + Math.random() * 1000);
            }, Math.random() * 500);
        });
    }
    
    // Create a ripple effect at the given position
    function createRipple(x, y) {
        const ripple = {
            x: x,
            y: y,
            radius: 5,
            maxRadius: 100 + Math.random() * 50,
            alpha: 1,
            lineWidth: 2,
            speed: 1.5 + Math.random()
        };
        
        ripples.push(ripple);
    }
    
    // Main cursor data window
    function updateCursorDataWindow() {
        cursorData.style.left = (mouseX + 15) + 'px';
        cursorData.style.top = (mouseY + 15) + 'px';
        
        if (!cursorData.classList.contains('visible')) {
            cursorData.classList.add('visible');
        }
        
        // Update data content
        let content = '';
        
        // Create rows of data
        content += createDataRow('X', Math.floor(mouseX));
        content += createDataRow('Y', Math.floor(mouseY));
        content += createDataRow('NODE', nodes.length.toString(16).padStart(4, '0'));
        
        // Random hex values
        content += createDataRow('SYS', getRandomHex(4));
        content += createDataRow('MEM', getRandomHex(4) + ':' + getRandomHex(4));
        
        // Random binary with occasional glitch effect
        const glitchClass = Math.random() < 0.2 ? 'glitch' : '';
        content += `<div class="data-row ${glitchClass}">`;
        content += '<span class="data-label">SEQ</span>';
        content += `<span class="data-value">${getRandomBinary(8)}</span>`;
        content += '</div>';
        
        cursorData.innerHTML = content;
    }
    
    // Helper functions for data display
    function createDataRow(label, value) {
        return `<div class="data-row">
            <span class="data-label">${label}</span>
            <span class="data-value">${value}</span>
        </div>`;
    }
    
    function getRandomHex(length) {
        return Array.from({length}, () => hexChars[Math.floor(Math.random() * hexChars.length)]).join('');
    }
    
    function getRandomBinary(length) {
        return Array.from({length}, () => binaryChars[Math.floor(Math.random() * binaryChars.length)]).join('');
    }
    
    function getRandomSymbol() {
        return symbols[Math.floor(Math.random() * symbols.length)];
    }
    
    function getRandomBracket() {
        return brackets[Math.floor(Math.random() * brackets.length)];
    }
    
    // Calculate node color based on age and lifecycle
    function getNodeColor(node) {
        // If node is highlighted (pulse passing through), use bright color
        if (node.isHighlighted) {
            return `rgba(50, 255, 255, 0.9)`;
        }
        
        // If this is a pulse connection node, use special pulsating color
        if (node.isPulseNode) {
            const pulseIntensity = 0.7 + 0.3 * Math.sin(frame * 0.05 + node.x * 0.01);
            return `rgba(0, ${180 + Math.floor(pulseIntensity * 75)}, ${200 + Math.floor(pulseIntensity * 55)}, ${Math.min(0.9, node.opacity)})`;
        }
        
        // If this is a path node, use different coloring
        if (node.isPathNode) {
            return `rgba(0, 220, 220, ${Math.min(0.9, node.opacity)})`;
        }
        
        // Life cycle percentage from 0 to 1
        const lifePercentage = node.age / node.lifetime;
        
        if (lifePercentage < 0.3) {
            // Start with green (younger)
            return `rgba(0, 255, 128, ${Math.min(0.8, node.opacity)})`;
        } else if (lifePercentage > 0.7) {
            // End with red (older)
            // Intensify red as it ages
            const redIntensity = 128 + Math.floor((lifePercentage - 0.7) / 0.3 * 127);
            return `rgba(${redIntensity}, 50, 50, ${Math.min(0.8, node.opacity)})`;
        } else {
            // Middle with blue (normal)
            return `rgba(0, 162, 255, ${Math.min(0.8, node.opacity)})`;
        }
    }
    
    // Calculate line color based on connecting nodes
    function getLineColor(node, target, opacity) {
        // If connection is part of the pulsing heartbeat line
        if (node.isPulseNode && target.isPulseNode) {
            const pulseIntensity = 0.7 + 0.3 * Math.sin(frame * 0.05 + node.x * 0.01);
            return `rgba(50, ${180 + Math.floor(pulseIntensity * 75)}, ${220 + Math.floor(pulseIntensity * 35)}, ${opacity * 1.2})`;
        }
        
        // If either node is a path node, use cyan color
        if (node.isPathNode || target.isPathNode) {
            return `rgba(0, 220, 220, ${opacity})`;
        }
        
        // Get the lifecycle stages of both connecting nodes
        const nodeLife = node.age / node.lifetime;
        const targetLife = target.age / target.lifetime;
        
        // Use the more aged node to determine color
        const life = Math.max(nodeLife, targetLife);
        
        if (life < 0.3) {
            // Green connections for younger
            return `rgba(0, 200, 100, ${opacity})`;
        } else if (life > 0.7) {
            // Red connections for older
            return `rgba(200, 50, 50, ${opacity})`;
        } else {
            // Blue connections for middle age
            return `rgba(0, 162, 255, ${opacity})`;
        }
    }
    
    // Create a new node
    function createNode(x, y) {
        const angle = Math.random() * Math.PI * 2;
        const distance = 50 + Math.random() * 100;
        
        const node = {
            x: x + Math.cos(angle) * distance,
            y: y + Math.sin(angle) * distance,
            size: 2 + Math.random() * 4,
            connections: [],
            lifetime: 150 + Math.floor(Math.random() * 150),
            age: 0,
            hasDataWindow: Math.random() < 0.4,
            isClickSpawned: false,
            isPathNode: false,
            opacity: 0 // Start with 0 opacity for fade-in effect
        };
        
        // Create connections to nearby nodes
        nodes.forEach(existingNode => {
            const dx = existingNode.x - node.x;
            const dy = existingNode.y - node.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 200 && Math.random() < 0.7) {
                node.connections.push({
                    target: existingNode,
                    strength: Math.random(),
                    pulses: []
                });
            }
        });
        
        // Add to nodes array
        nodes.push(node);
        
        // Create data window if needed
        if (node.hasDataWindow) {
            createDataWindow(node);
        }
        
        return node;
    }
    
    // Create data window attached to a node
    function createDataWindow(node) {
        const dataWindow = document.createElement('div');
        dataWindow.className = 'data-window';
        dataWindow.style.left = (node.x + 10) + 'px';
        dataWindow.style.top = (node.y + 10) + 'px';
        
        // Generate random data content
        let content = '';
        const rows = 2 + Math.floor(Math.random() * 2); // Reduced max rows
        
        for (let i = 0; i < rows; i++) {
            content += createDataRow(
                getRandomHex(2), 
                Math.random() < 0.7 ? getRandomHex(4) : getRandomBinary(6)
            );
        }
        
        dataWindow.innerHTML = content;
        document.body.appendChild(dataWindow);
        
        // Fade in
        setTimeout(() => {
            dataWindow.classList.add('visible');
        }, 20); // Faster fade in
        
        // Store reference with shorter lifetime
        dataWindows.push({
            element: dataWindow,
            node: node,
            lifetime: Math.floor(node.lifetime * 0.7) // Shorter lifetime than the node
        });
    }
    
    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        frame++;
        
        // Draw connection to cursor
        ctx.strokeStyle = 'rgba(0, 162, 255, 0.6)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(prevMouseX, prevMouseY);
        ctx.lineTo(mouseX, mouseY);
        ctx.stroke();
        
        // Draw ripples
        for (let i = ripples.length - 1; i >= 0; i--) {
            const ripple = ripples[i];
            ripple.radius += ripple.speed;
            ripple.alpha -= 0.01;
            ripple.lineWidth -= 0.01;
            
            if (ripple.radius >= ripple.maxRadius || ripple.alpha <= 0) {
                ripples.splice(i, 1);
                continue;
            }
            
            ctx.strokeStyle = `rgba(0, 200, 255, ${ripple.alpha})`;
            ctx.lineWidth = Math.max(0.1, ripple.lineWidth);
            ctx.beginPath();
            ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2);
            ctx.stroke();
        }
        
        // Update and draw nodes
        for (let i = nodes.length - 1; i >= 0; i--) {
            const node = nodes[i];
            node.age++;
            
            // Fade in effect
            if (node.opacity < 1) {
                node.opacity += 0.05;
            }
            
            // Remove old nodes
            if (node.age >= node.lifetime) {
                nodes.splice(i, 1);
                continue;
            }
            
            // Calculate opacity based on age
            const opacity = node.age < 20 
                ? node.age / 20 
                : (node.lifetime - node.age) / 50;
            
            node.opacity = opacity;
            
            // Draw node with lifecycle color
            ctx.fillStyle = getNodeColor(node);
            ctx.beginPath();
            ctx.arc(node.x, node.y, node.size, 0, Math.PI * 2);
            ctx.fill();
            
            // Draw connections
            node.connections.forEach(connection => {
                const target = connection.target;
                
                // Check if target still exists
                if (nodes.includes(target)) {
                    const dx = target.x - node.x;
                    const dy = target.y - node.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    // Calculate line opacity
                    const lineOpacity = Math.min(0.4, opacity * connection.strength);
                    
                    // Draw connection line with color based on lifecycle
                    ctx.strokeStyle = getLineColor(node, target, lineOpacity);
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(node.x, node.y);
                    ctx.lineTo(target.x, target.y);
                    ctx.stroke();
                    
                    // Occasionally add pulse on the line
                    if (Math.random() < 0.002) {
                        connection.pulses.push({
                            position: 0,
                            speed: 0.02 + Math.random() * 0.03
                        });
                    }
                    
                    // Update and draw pulses
                    for (let j = connection.pulses.length - 1; j >= 0; j--) {
                        const pulse = connection.pulses[j];
                        pulse.position += pulse.speed;
                        
                        if (pulse.position >= 1) {
                            connection.pulses.splice(j, 1);
                            continue;
                        }
                        
                        // Draw pulse on the line with color matching the line
                        const pulseX = node.x + dx * pulse.position;
                        const pulseY = node.y + dy * pulse.position;
                        
                        // Pulse color based on node lifecycle
                        const pulseColor = pulse.isHeartbeatPulse 
                            ? 'rgba(50, 255, 255, 0.9)' 
                            : getLineColor(node, target, 0.8);
                            
                        // Heartbeat pulses are larger
                        const pulseSize = pulse.isHeartbeatPulse ? 4 : 2;
                        
                        ctx.fillStyle = pulseColor;
                        ctx.beginPath();
                        ctx.arc(pulseX, pulseY, pulseSize, 0, Math.PI * 2);
                        ctx.fill();
                    }
                }
            });
        }
        
        // Update data windows
        for (let i = dataWindows.length - 1; i >= 0; i--) {
            const dataWindow = dataWindows[i];
            dataWindow.lifetime -= 1.5; // Decrease lifetime faster
            
            // Remove expired data windows
            if (dataWindow.lifetime <= 0 || !nodes.includes(dataWindow.node)) {
                dataWindow.element.classList.remove('visible');
                
                // Remove from DOM after fade out
                setTimeout(() => {
                    if (dataWindow.element.parentNode) {
                        dataWindow.element.parentNode.removeChild(dataWindow.element);
                    }
                }, 150); // Faster removal
                
                dataWindows.splice(i, 1);
                continue;
            }
            
            // Update position and occasionally update content
            if (frame % 20 === 0) { // More frequent updates
                // Update random values
                const rows = dataWindow.element.querySelectorAll('.data-row');
                rows.forEach(row => {
                    const valueElement = row.querySelector('.data-value');
                    if (valueElement && Math.random() < 0.4) { // More frequent value changes
                        valueElement.textContent = Math.random() < 0.7 
                            ? getRandomHex(4) 
                            : getRandomBinary(6);
                            
                        // Occasionally add glitch effect
                        if (Math.random() < 0.15) {
                            row.classList.add('glitch');
                            setTimeout(() => row.classList.remove('glitch'), 300);
                        }
                    }
                });
                
                // Update position
                dataWindow.element.style.left = (dataWindow.node.x + 10) + 'px';
                dataWindow.element.style.top = (dataWindow.node.y + 10) + 'px';
            }
        }
        
        // Randomly spawn nodes
        if (Math.random() < 0.01) {
            createNode(
                Math.random() * canvas.width,
                Math.random() * canvas.height
            );
        }
        
        requestAnimationFrame(animate);
    }
    
    // Initialize several nodes
    for (let i = 0; i < 15; i++) {
        createNode(
            Math.random() * canvas.width,
            Math.random() * canvas.height
        );
    }
    
    // Start animation
    animate();
});
