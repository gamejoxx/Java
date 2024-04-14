document.addEventListener('DOMContentLoaded', function () {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const suns = [
        { x: 300, y: 450 }, // Initial positions of suns
        { x: 600, y: 450 },
        { x: 450, y: 300 }
    ];
    const planets = [];
    let animationFrameId = null;

    // UI Controls
    const startBtn = document.getElementById('startBtn');
    const stopBtn = document.getElementById('stopBtn');
    const resetBtn = document.getElementById('resetBtn');
    const gravitationalStrengthSlider = document.getElementById('gravitationalStrength');
    gravitationalStrengthSlider.addEventListener('input', function() {
        physicsConfig.gravitationalStrength = Number(this.value);
    });

    // Physics settings (modifiable for fine-tuning)
    const physicsConfig = {
        gravitationalStrength: Number(gravitationalStrengthSlider.value),
        planetMass: 10,              // Mass of each planet (affects interaction, not currently used)
        speedDamping: 0.99,         // Damping factor to slow down planets slightly each frame
        maxSpeed: 20,               // Maximum speed planets can reach
        safeRadius: 20,             // Initial safe radius around suns, tweak as needed
    };

    canvas.addEventListener('mousedown', function (event) {
        if (event.button === 0) { // Left mouse button
            suns.forEach(sun => {
                if (Math.hypot(sun.x - event.offsetX, sun.y - event.offsetY) <= 15) {
                    sun.isDragging = true;
                }
            });
        }
    });

    canvas.addEventListener('mouseup', function (event) {
        suns.forEach(sun => {
            sun.isDragging = false;
        });
    });

    canvas.addEventListener('mousemove', function (event) {
        suns.forEach(sun => {
            if (sun.isDragging) {
                sun.x = event.offsetX;
                sun.y = event.offsetY;
            }
        });
    });

    canvas.addEventListener('contextmenu', function (event) {
        event.preventDefault(); // Prevent the context menu from appearing
        planets.push({ x: event.offsetX, y: event.offsetY, vx: 0, vy: 0, path: new Path2D(), opacity: 1 });
    });

    startBtn.addEventListener('click', startSimulation);
    stopBtn.addEventListener('click', stopSimulation);
    resetBtn.addEventListener('click', resetSimulation);

    function drawSuns() {
        suns.forEach(sun => {
            ctx.beginPath();
            ctx.arc(sun.x, sun.y, 15, 0, 2 * Math.PI);
            ctx.fillStyle = 'yellow';
            ctx.fill();
        });
    }

    function drawPlanets() {
        planets.forEach(planet => {
            ctx.beginPath();
            planet.path.moveTo(planet.x, planet.y);
            planet.path.lineTo(planet.x + planet.vx, planet.y + planet.vy);
            ctx.strokeStyle = `rgba(255, 255, 255, ${planet.opacity})`;
            ctx.stroke(planet.path);
            ctx.arc(planet.x, planet.y, 2, 0, 2 * Math.PI);
            ctx.fillStyle = 'white';
            ctx.fill();
        });
    }

    function updatePlanets() {
        planets.forEach(planet => {
            let ax = 0;
            let ay = 0;
            suns.forEach(sun => {
                const dx = sun.x - planet.x;
                const dy = sun.y - planet.y;
                const distSquared = dx * dx + dy * dy;
                const dist = Math.sqrt(distSquared);
    
                let force;
                if (dist < physicsConfig.safeRadius) {
                    // Reduce the gravitational force as the planet approaches the sun's safe radius
                    force = physicsConfig.gravitationalStrength / (distSquared * (physicsConfig.safeRadius / dist));
                } else {
                    force = physicsConfig.gravitationalStrength / distSquared;
                }
    
                ax += (dx / dist) * force;
                ay += (dy / dist) * force;
            });
    
            planet.vx += ax;
            planet.vy += ay;
    
            // Apply damping and speed limit
            const speed = Math.sqrt(planet.vx * planet.vx + planet.vy * planet.vy);
            if (speed > physicsConfig.maxSpeed) {
                planet.vx = (planet.vx / speed) * physicsConfig.maxSpeed;
                planet.vy = (planet.vy / speed) * physicsConfig.maxSpeed;
            }
    
            planet.vx *= physicsConfig.speedDamping;
            planet.vy *= physicsConfig.speedDamping;
    
            planet.x += planet.vx;
            planet.y += planet.vy;
    
            // Wrap around logic
            planet.x = (planet.x + canvas.width) % canvas.width;
            planet.y = (planet.y + canvas.height) % canvas.height;
    
            planet.opacity *= 0.99; // Decay the opacity for the trail effect
        });
    }
    

    function animate() {
        ctx.fillStyle = `rgba(0, 0, 0, 0.8)`; // Trail fade effect
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        drawSuns();
        drawPlanets();
        updatePlanets();
        animationFrameId = requestAnimationFrame(animate);
    }

    function startSimulation() {
        if (!animationFrameId) {
            animate();
        }
    }

    function stopSimulation() {
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
        }
    }

    function resetSimulation() {
        planets.forEach(planet => {
            planet.path = new Path2D(); // Reset the path
        });
        stopSimulation();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawSuns();
    }
});
