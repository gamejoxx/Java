const canvas = document.getElementById('artCanvas');
const ctx = canvas.getContext('2d');
const generateBtn = document.getElementById('generateBtn');
const speedSlider = document.getElementById('speed');
const trailSlider = document.getElementById('trail');
const chaosSlider = document.getElementById('chaos');

let animationId;
let particles = [];

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
    particles.push(initParticle());
    animate();
}

function animate() {
    const speed = parseInt(speedSlider.value);
    const trailLength = parseInt(trailSlider.value);
    const chaos = parseInt(chaosSlider.value) / 50; // Increase chaos factor

    ctx.fillStyle = 'rgba(224, 224, 224, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    particles.forEach(particle => {
        const ax = (Math.random() - 0.5) * chaos;
        const ay = (Math.random() - 0.5) * chaos;
        particle.vx += ax;
        particle.vy += ay;
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
        ctx.strokeStyle = 'rgba(50, 50, 50, 0.5)';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, 5, 0, Math.PI * 2);
        ctx.fillStyle = '#333';
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

generateArt();
