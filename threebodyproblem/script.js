document.addEventListener('DOMContentLoaded', function () {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const suns = [
        { x: 300, y: 450 },
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
    const trailLengthSlider = document.getElementById('trailLength');
    const trailFadeSlider = document.getElementById('trailFade');

    trailLengthSlider.addEventListener('input', function() {
        physicsConfig.trailLength = Number(this.value);
    });

    trailFadeSlider.addEventListener('input', function() {
        physicsConfig.trailFade = Number(this.value);
    });

    // Physics settings
    const physicsConfig = {
        gravitationalStrength: Number(gravitationalStrengthSlider.value),
        planetMass: 10,
        speedDamping: 0.99,
        maxSpeed: 20,
        safeRadius: 5,
        trailLength: 50,
        trailFade: 0.5
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
        suns.forEach(sun => sun.isDragging = false);
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
        planets.push({
            x: event.offsetX,
            y: event.offsetY,
            vx: 0,
            vy: 0,
            trail: [{x: event.offsetX, y: event.offsetY, time: Date.now()}],
            opacity: 1
        });
    });

    startBtn.addEventListener('click', startSimulation);
    stopBtn.addEventListener('click', stopSimulation);
    resetBtn.addEventListener('click', function() {
        planets.length = 0; // Clears all planets
        stopSimulation();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawSuns();
    });

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
            const currentTime = Date.now();
            planet.trail = planet.trail.filter(point => currentTime - point.time < physicsConfig.trailLength * 100);
            if (planet.trail.length > 1) {
                ctx.beginPath();
                ctx.moveTo(planet.trail[0].x, planet.trail[0].y);
                for (let i = 1; i < planet.trail.length - 1; i++) {
                    let cp1x = (planet.trail[i].x + planet.trail[i + 1].x) / 2;
                    let cp1y = (planet.trail[i].y + planet.trail[i + 1].y) / 2;
                    ctx.quadraticCurveTo(planet.trail[i].x, planet.trail[i].y, cp1x, cp1y);
                }
                ctx.strokeStyle = `rgba(255, 255, 255, ${physicsConfig.trailFade})`;
                ctx.stroke();
            }
            ctx.beginPath();
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
                    force = physicsConfig.gravitationalStrength / (distSquared * (physicsConfig.safeRadius / dist));
                } else {
                    force = physicsConfig.gravitationalStrength / distSquared;
                }
    
                ax += (dx / dist) * force;
                ay += (dy / dist) * force;
            });
    
            planet.vx += ax;
            planet.vy += ay;
    
            const speed = Math.sqrt(planet.vx * planet.vx + planet.vy * planet.vy);
            if (speed > physicsConfig.maxSpeed) {
                planet.vx = (planet.vx / speed) * physicsConfig.maxSpeed;
                planet.vy = (planet.vy / speed) * physicsConfig.maxSpeed;
            }
    
            planet.vx *= physicsConfig.speedDamping;
            planet.vy *= physicsConfig.speedDamping;
    
            planet.x += planet.vx;
            planet.y += planet.vy;
            planet.trail.push({x: planet.x, y: planet.y, time: Date.now()});
        });
    }

    function animate() {
        ctx.fillStyle = `rgba(0, 0, 0, ${1 - physicsConfig.trailFade})`; // Trail fade effect adjusted dynamically
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
});
