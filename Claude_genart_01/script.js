const canvas = document.getElementById('artCanvas');
const ctx = canvas.getContext('2d');
const generateBtn = document.getElementById('generateBtn');
const speedSlider = document.getElementById('speed');
const complexitySlider = document.getElementById('complexity');
const sizeSlider = document.getElementById('size');

let animationId;
let angle = 0;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

function generateArt() {
    cancelAnimationFrame(animationId);
    angle = 0;
    animate();
}

function animate() {
    ctx.fillStyle = 'rgba(26, 26, 26, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    
    const complexity = parseInt(complexitySlider.value);
    const size = parseInt(sizeSlider.value);
    
    for (let i = 0; i < complexity; i++) {
        ctx.beginPath();
        ctx.strokeStyle = `hsl(${(i * 2 + angle * 10) % 360}, 50%, 50%)`;
        
        for (let j = 0; j < Math.PI * 2; j += 0.1) {
            const radius = size + Math.cos(j * 6 + angle) * 20;
            const x = Math.cos(j) * radius;
            const y = Math.sin(j) * radius;
            
            if (j === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        
        ctx.closePath();
        ctx.stroke();
        
        ctx.rotate(Math.PI * 2 / complexity);
    }
    
    ctx.restore();
    
    angle += 0.01 * parseInt(speedSlider.value);
    animationId = requestAnimationFrame(animate);
}

generateBtn.addEventListener('click', generateArt);
speedSlider.addEventListener('input', () => {
    cancelAnimationFrame(animationId);
    animate();
});
complexitySlider.addEventListener('input', generateArt);
sizeSlider.addEventListener('input', generateArt);

generateArt();