const canvas = document.getElementById('artCanvas');
const ctx = canvas.getContext('2d');
const generateBtn = document.getElementById('generateBtn');
const speedSlider = document.getElementById('speed');
const trailSlider = document.getElementById('trail');
const chaosSlider = document.getElementById('chaos');
const attractionDurationSlider = document.getElementById('attraction-duration');
const attractionStrengthSlider = document.getElementById('attraction-strength');

let animationId;
let particles = [];

const MAX_SPEED = 5;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

function initParticle() {
    return {
        x: canvas.width / 2,
        y: canvas.height / 2,
        vx: 0,
        vy: 0,
        trail: [],
        attraction: false,
        attractionTimer: 0
    };
}

function generateArt() {
    cancelAnimationFrame(animationId);
    particles.push(initParticle());
    animate();
}

function limitSpeed(vx, vy) {
    const speed = Math.sqrt(vx * vx + vy * vy);
    if (speed > MAX_SPEED) {
        const scale = MAX_SPEED / speed;
        vx *= scale;
        vy *= scale;
    }
    return { vx, vy };
}

function animate() {
    const speed = parseInt(speedSlider.value);
    const trailLength = parseInt(trailSlider.value);
    const chaos = parseInt(chaosSlider.value) / 50; 
    const attractionDuration = parseInt(attractionDurationSlider.value);
    const attractionStrength = parseInt(attractionStrengthSlider.value) / 100;

    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    particles.forEach(particle => {
        const ax = (Math.random() - 0.5) * chaos;
        const ay = (Math.random() - 0.5) * chaos;
        particle.vx += ax;
        particle.vy += ay;

        if (particle.attractionTimer <= 0) {
            particle.attraction = Math.random() > 0.5;
            particle.attractionTimer = attractionDuration;
        } else {
            particle.attractionTimer--;
        }

        if (particle.attraction) {
            particles.forEach(other => {
                if (other !== particle) {
                    const dx = other.x - particle.x;
                    const dy = other.y - particle.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 200) {
                        particle.vx += dx * attractionStrength;
                        particle.vy += dy * attractionStrength;
                    }
                }
            });
        }

        const limitedSpeed = limitSpeed(particle.vx, particle.vy);
        particle.vx = limitedSpeed.vx;
        particle.vy = limitedSpeed.vy;

        particle.x += particle.vx * speed / 10;
        particle.y += particle.vy * speed / 10;

        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

        particle.trail.push({ x: particle.x, y: particle.y });
        if (particle.trail.length > trailLength) {
            particle.trail.shift();
        }

        ctx.beginPath();
        ctx.moveTo(particle.trail[0].x, particle.trail[0].y);
        for (let i = 1; i < particle.trail.length; i++) {
            ctx.lineTo(particle.trail[i].x, particle.trail[i].y);
        }
        ctx.strokeStyle = 'rgba(255, 165, 0, 0.5)'; // retro amber color
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, 5, 0, Math.PI * 2);
        ctx.fillStyle = '#FFA500'; // retro amber color
        ctx.fill();
    });

    animationId = requestAnimationFrame(animate);
}

generateBtn.addEventListener('click', generateArt);
speedSlider.addEventListener('input', () => {
    cancelAnimationFrame(animationId);
    animate();
});
trailSlider.addEventListener('input', () => {
    particles.forEach(particle => {
        particle.trail = particle.trail.slice(-parseInt(trailSlider.value));
    });
});
chaosSlider.addEventListener('input', () => {
    cancelAnimationFrame(animationId);
    animate();
});
attractionDurationSlider.addEventListener('input', () => {
    cancelAnimationFrame(animationId);
    animate();
});
attractionStrengthSlider.addEventListener('input', () => {
    cancelAnimationFrame(animationId);
    animate();
});

generateArt();
