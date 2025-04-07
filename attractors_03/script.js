// Setup Three.js scene
let scene, camera, renderer, controls;
let particleSystem, particles, positions, colors;
let pointsCount, trailLength, pointSize;
let running = false;
let animationFrameId;

// Parameters for different attractors
const params = {
    dejong: { a: 0.97, b: -1.90, c: 1.38, d: -1.50 },
    lorenz: { a: 10, b: 28, c: 8/3, d: 0 },
    aizawa: { a: 0.95, b: 0.7, c: 0.6, d: 3.5 },
    rossler: { a: 0.2, b: 0.2, c: 5.7, d: 0 }
};

// Color schemes
const colorSchemes = {
    rainbow: (t) => new THREE.Color(Math.sin(t), Math.sin(t + 2.1), Math.sin(t + 4.2)),
    electric: (t) => new THREE.Color(0.5 + 0.5*Math.sin(t), 0.5 + 0.5*Math.sin(t*1.3), 1),
    sunset: (t) => new THREE.Color(0.8 + 0.2*Math.sin(t), 0.4 + 0.1*Math.sin(t + 2), 0.1 + 0.1*Math.sin(t + 4)),
    ocean: (t) => new THREE.Color(0, 0.4 + 0.2*Math.sin(t), 0.8 + 0.2*Math.sin(t + 3)),
    monochrome: (t) => new THREE.Color(0.5 + 0.5*Math.sin(t), 0.5 + 0.5*Math.sin(t), 0.5 + 0.5*Math.sin(t))
};

// Background color configurations
const bgColors = {
    black: 0x000000,
    dark: 0x121212,
    light: 0xcccccc,
    white: 0xffffff
};

// DOM Elements
const sliders = document.querySelectorAll('input[type="range"]');
const startButton = document.getElementById('start');
const stopButton = document.getElementById('stop');
const resetButton = document.getElementById('reset');
const randomizeButton = document.getElementById('randomize');
const attractorTypeSelect = document.getElementById('attractor-type');
const colorSchemeSelect = document.getElementById('colorScheme');
const bgColorSelect = document.getElementById('bgColor');

// Current values
let a, b, c, d, currentAttractor;
let currentColorScheme = 'rainbow';
let currentBgColor = 'black';
let speed = 20;

// Initialize Three.js
function init() {
    // Set initial values
    a = parseFloat(document.getElementById('a').value);
    b = parseFloat(document.getElementById('b').value);
    c = parseFloat(document.getElementById('c').value);
    d = parseFloat(document.getElementById('d').value);
    pointsCount = parseInt(document.getElementById('points').value);
    trailLength = parseInt(document.getElementById('trail').value);
    pointSize = parseFloat(document.getElementById('size').value);
    speed = parseInt(document.getElementById('speed').value);
    currentAttractor = attractorTypeSelect.value;
    
    // Update value displays
    updateValueDisplays();
    
    // Scene setup
    scene = new THREE.Scene();
    scene.background = new THREE.Color(bgColors[currentBgColor]);
    
    // Camera setup
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 30;
    
    // Renderer setup
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('container').appendChild(renderer.domElement);
    
    // Orbit controls for camera movement
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    
    // Particle system setup
    createParticleSystem();
    
    // Event listeners
    window.addEventListener('resize', onWindowResize);
    
    // Start animation
    animate();
}

function createParticleSystem() {
    // Create particle system geometry
    const geometry = new THREE.BufferGeometry();
    
    // Create positions array for the particles
    positions = new Float32Array(trailLength * 3);
    colors = new Float32Array(trailLength * 3);
    
    // Initialize first point
    const startX = Math.random() * 0.1;
    const startY = Math.random() * 0.1;
    const startZ = Math.random() * 0.1;
    
    for (let i = 0; i < trailLength; i++) {
        positions[i * 3] = startX;
        positions[i * 3 + 1] = startY;
        positions[i * 3 + 2] = startZ;
        
        const color = colorSchemes[currentColorScheme](i * 0.1);
        colors[i * 3] = color.r;
        colors[i * 3 + 1] = color.g;
        colors[i * 3 + 2] = color.b;
    }
    
    // Set positions and colors as buffer attributes
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    // Create particle material
    const material = new THREE.PointsMaterial({
        size: pointSize,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        sizeAttenuation: true
    });
    
    // Create particle system and add to scene
    if (particleSystem) scene.remove(particleSystem);
    particleSystem = new THREE.Points(geometry, material);
    scene.add(particleSystem);
}

// Window resize handler
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Animation loop
function animate() {
    animationFrameId = requestAnimationFrame(animate);
    
    if (running) {
        updateParticles();
    }
    
    controls.update();
    renderer.render(scene, camera);
}

// Update particles based on selected attractor
function updateParticles() {
    // Get the last point position
    const lastX = positions[(trailLength - 1) * 3];
    const lastY = positions[(trailLength - 1) * 3 + 1];
    const lastZ = positions[(trailLength - 1) * 3 + 2];
    
    // Calculate new points
    let newPoints = [];
    for (let i = 0; i < speed; i++) {
        let x = lastX, y = lastY, z = lastZ;
        
        // Apply the selected attractor formula
        switch (currentAttractor) {
            case 'dejong':
                const newX = Math.sin(a * y) - Math.cos(b * x);
                const newY = Math.sin(c * x) - Math.cos(d * y);
                x = newX;
                y = newY;
                z = (x + y) * 0.2; // Create a z-dimension for De Jong attractor
                break;
                
            case 'lorenz':
                const dt = 0.005;
                const dx = a * (y - x) * dt;
                const dy = (x * (b - z) - y) * dt;
                const dz = (x * y - c * z) * dt;
                x += dx;
                y += dy;
                z += dz;
                break;
                
            case 'aizawa':
                const dt2 = 0.01;
                const dx2 = (z - b) * x - d * y;
                const dy2 = d * x + (z - b) * y;
                const dz2 = c + a * z - z*z*z/3 - (x*x + y*y) * (1 + a * z) + d * z * x*x*x;
                x += dx2 * dt2;
                y += dy2 * dt2;
                z += dz2 * dt2;
                break;
                
            case 'rossler':
                const dt3 = 0.05;
                const dx3 = (-y - z) * dt3;
                const dy3 = (x + a * y) * dt3;
                const dz3 = (b + z * (x - c)) * dt3;
                x += dx3;
                y += dy3;
                z += dz3;
                break;
        }
        
        newPoints.push(x, y, z);
    }
    
    // Shift the positions array to make room for new points
    for (let i = 0; i < trailLength - speed; i++) {
        positions[i * 3] = positions[(i + speed) * 3];
        positions[i * 3 + 1] = positions[(i + speed) * 3 + 1];
        positions[i * 3 + 2] = positions[(i + speed) * 3 + 2];
        
        colors[i * 3] = colors[(i + speed) * 3];
        colors[i * 3 + 1] = colors[(i + speed) * 3 + 1];
        colors[i * 3 + 2] = colors[(i + speed) * 3 + 2];
    }
    
    // Add new points at the end
    for (let i = 0; i < speed; i++) {
        if (i < newPoints.length / 3) {
            const idx = (trailLength - speed + i) * 3;
            positions[idx] = newPoints[i * 3];
            positions[idx + 1] = newPoints[i * 3 + 1];
            positions[idx + 2] = newPoints[i * 3 + 2];
            
            const t = (trailLength - speed + i) * 0.01;
            const color = colorSchemes[currentColorScheme](t);
            colors[idx] = color.r;
            colors[idx + 1] = color.g;
            colors[idx + 2] = color.b;
        }
    }
    
    // Update the geometry
    particleSystem.geometry.attributes.position.needsUpdate = true;
    particleSystem.geometry.attributes.color.needsUpdate = true;
}

// Update the display values for all sliders
function updateValueDisplays() {
    document.getElementById('a-value').textContent = a.toFixed(2);
    document.getElementById('b-value').textContent = b.toFixed(2);
    document.getElementById('c-value').textContent = c.toFixed(2);
    document.getElementById('d-value').textContent = d.toFixed(2);
    document.getElementById('points-value').textContent = pointsCount;
    document.getElementById('speed-value').textContent = speed;
    document.getElementById('size-value').textContent = pointSize.toFixed(1);
    document.getElementById('trail-value').textContent = trailLength;
}

// Randomize parameters based on attractor type
function randomizeParams() {
    const type = attractorTypeSelect.value;
    switch (type) {
        case 'dejong':
            a = Math.random() * 6 - 3;
            b = Math.random() * 6 - 3;
            c = Math.random() * 6 - 3;
            d = Math.random() * 6 - 3;
            break;
        case 'lorenz':
            a = 5 + Math.random() * 15;
            b = 20 + Math.random() * 15;
            c = 2 + Math.random() * 1.5;
            d = 0;
            break;
        case 'aizawa':
            a = 0.7 + Math.random() * 0.5;
            b = 0.5 + Math.random() * 0.5;
            c = 0.3 + Math.random() * 0.6;
            d = 2.5 + Math.random() * 2;
            break;
        case 'rossler':
            a = 0.1 + Math.random() * 0.3;
            b = 0.1 + Math.random() * 0.3;
            c = 4 + Math.random() * 10;
            d = 0;
            break;
    }
    
    // Update sliders
    document.getElementById('a').value = a;
    document.getElementById('b').value = b;
    document.getElementById('c').value = c;
    document.getElementById('d').value = d;
    
    updateValueDisplays();
    reset();
}

// Reset the particle system
function reset() {
    createParticleSystem();
}

// Update attractor parameters when sliders change
sliders.forEach(slider => {
    slider.addEventListener('input', (e) => {
        switch (e.target.id) {
            case 'a': a = parseFloat(e.target.value); break;
            case 'b': b = parseFloat(e.target.value); break;
            case 'c': c = parseFloat(e.target.value); break;
            case 'd': d = parseFloat(e.target.value); break;
            case 'points': pointsCount = parseInt(e.target.value); break;
            case 'speed': speed = parseInt(e.target.value); break;
            case 'size': 
                pointSize = parseFloat(e.target.value);
                if (particleSystem) {
                    particleSystem.material.size = pointSize;
                }
                break;
            case 'trail': 
                trailLength = parseInt(e.target.value);
                createParticleSystem();
                break;
        }
        updateValueDisplays();
    });
});

// Update attractor type
attractorTypeSelect.addEventListener('change', (e) => {
    currentAttractor = e.target.value;
    
    // Load default parameters for the selected attractor
    const defaultParams = params[currentAttractor];
    a = defaultParams.a;
    b = defaultParams.b;
    c = defaultParams.c;
    d = defaultParams.d;
    
    // Update sliders
    document.getElementById('a').value = a;
    document.getElementById('b').value = b;
    document.getElementById('c').value = c;
    document.getElementById('d').value = d;
    
    updateValueDisplays();
    reset();
});

// Update color scheme
colorSchemeSelect.addEventListener('change', (e) => {
    currentColorScheme = e.target.value;
    updateParticleColors();
});

// Update background color
bgColorSelect.addEventListener('change', (e) => {
    currentBgColor = e.target.value;
    scene.background = new THREE.Color(bgColors[currentBgColor]);
});

// Update all particle colors
function updateParticleColors() {
    for (let i = 0; i < trailLength; i++) {
        const t = i * 0.01;
        const color = colorSchemes[currentColorScheme](t);
        colors[i * 3] = color.r;
        colors[i * 3 + 1] = color.g;
        colors[i * 3 + 2] = color.b;
    }
    particleSystem.geometry.attributes.color.needsUpdate = true;
}

// Start button
startButton.addEventListener('click', () => {
    running = true;
});

// Stop button
stopButton.addEventListener('click', () => {
    running = false;
});

// Reset button
resetButton.addEventListener('click', reset);

// Randomize button
randomizeButton.addEventListener('click', randomizeParams);

// Initialize the application
init();

