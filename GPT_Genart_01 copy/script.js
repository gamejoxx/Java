const canvas = document.getElementById('artCanvas');
const ctx = canvas.getContext('2d');
const generateBtn = document.getElementById('generateBtn');
const speedSlider = document.getElementById('speed');
const trailSlider = document.getElementById('trail');
const chaosSlider = document.getElementById('chaos');
const attractionDurationSlider = document.getElementById('attraction-duration');
const attractionStrengthSlider = document.getElementById('attraction-strength');
const repelDurationSlider = document.getElementById('repel-duration');
const repelStrengthSlider = document.getElementById('repel-strength');
const particleCountSlider = document.getElementById('particle-count');
const randomnessSlider = document.getElementById('randomness');

let animationId;
let particles = [];
let isAttracting = true;
let actionTimer = 0;
let randomChangeTimer = 0;

const MAX_SPEED = 5;

const colorTransitionDuration = 200; // Duration in frames
let colorTransitionTimer = colorTransitionDuration;

let startColor = { r: 255, g: 165, b: 0 }; // Amber
let endColor = { r: 0, g: 255, b: 255 }; // Cyan

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
        trail: []
    };
}

function generateArt() {
    cancelAnimationFrame(animationId);
    particles = [];
    const particleCount = parseInt(particleCountSlider.value);
    for (let i = 0; i < particleCount; i++) {
        particles.push(initParticle());
    }
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

function randomizeSliders() {
    const randomness = parseInt(randomnessSlider.value) / 100;
    if (randomness > 0) {
        speedSlider.value = Math.random() * 50 * randomness;
        trailSlider.value = Math.random() * 500 * randomness;
        chaosSlider.value = Math.random() * 200 * randomness;
        attractionDurationSlider.value = Math.random() * 200 * randomness;
        attractionStrengthSlider.value = Math.random() * 100 * randomness;
        repelDurationSlider.value = Math.random() * 200 * randomness;
        repelStrengthSlider.value = Math.random() * 100 * randomness;
        particleCountSlider.value = Math.random() * 1000 * randomness;
    }
}

function interpolateColor(start, end, factor) {
    const result = {
        r: Math.round(start.r + (end.r - start.r) * factor),
        g: Math.round(start.g + (end.g - start.g) * factor),
        b: Math.round(start.b + (end.b - start.b) * factor)
    };
    return result;
}

function rgbToString(color) {
    return `rgb(${color.r}, ${color.g}, ${color.b})`;
}

function animate() {
    const speed = parseInt(speedSlider.value);
    const trailLength = parseInt(trailSlider.value);
    const chaos = parseInt(chaosSlider.value) / 100;
    const attractionDuration = parseInt(attractionDurationSlider.value);
    const attractionStrength = parseInt(attractionStrengthSlider.value) / 100;
    const repelDuration = parseInt(repelDurationSlider.value);
    const repelStrength = parseInt(repelStrengthSlider.value) / 100;
    const randomness = parseInt(randomnessSlider.value);

    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (actionTimer <= 0) {
        isAttracting = Math.random() > 0.5;
        actionTimer = isAttracting ? attractionDuration : repelDuration;
    } else {
        actionTimer--;
    }

    if (randomChangeTimer <= 0) {
        randomizeSliders();
        randomChangeTimer = 120; // Change every 2 seconds (120 frames at 60fps)
    } else {
        randomChangeTimer--;
    }

    if (colorTransitionTimer <= 0) {
        const temp = startColor;
        startColor = endColor;
        endColor = temp;
        colorTransitionTimer = colorTransitionDuration;
    } else {
        colorTransitionTimer--;
    }

    const colorFactor = 1 - (colorTransitionTimer / colorTransitionDuration);
    const currentColor = interpolateColor(startColor, endColor, colorFactor);

    particles.forEach(particle => {
        const ax = (Math.random() - 0.7) * chaos;
        const ay = (Math.random() - 0.6) * chaos;
        particle.vx += ax;
        particle.vy += ay;

        particles.forEach(other => {
            if (other !== particle) {
                const dx = other.x - particle.x;
                const dy = other.y - particle.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 200) {
                    if (isAttracting) {
                        particle.vx += dx * attractionStrength;
                        particle.vy += dy * attractionStrength;
                    } else {
                        particle.vx -= dx * repelStrength;
                        particle.vy -= dy * repelStrength;
                    }
                }
            }
        });

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
        for (let i = 1; i < particle.trail.length - 1; i++) {
            const cp = {
                x: (particle.trail[i].x + particle.trail[i + 1].x) / 2,
                y: (particle.trail[i].y + particle.trail[i + 1].y) / 2
            };
            ctx.quadraticCurveTo(particle.trail[i].x, particle.trail[i].y, cp.x, cp.y);
        }
        ctx.strokeStyle = rgbToString(currentColor);
        ctx.lineWidth = 0.05;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, 0.01, 0, Math.PI * 2);
        ctx.fillStyle = rgbToString(currentColor);
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
repelDurationSlider.addEventListener('input', () => {
    cancelAnimationFrame(animationId);
    animate();
});
repelStrengthSlider.addEventListener('input', () => {
    cancelAnimationFrame(animationId);
    animate();
});
particleCountSlider.addEventListener('input', generateArt);
randomnessSlider.addEventListener('input', () => {
    cancelAnimationFrame(animationId);
    animate();
});

generateArt();
