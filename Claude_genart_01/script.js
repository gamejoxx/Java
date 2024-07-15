const canvas = document.getElementById('artCanvas');
const ctx = canvas.getContext('2d');
const generateBtn = document.getElementById('generateBtn');

canvas.width = 400;
canvas.height = 400;

function generateArt() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.translate(canvas.width / 2, canvas.height / 2);
    
    for (let i = 0; i < 150; i++) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(0, 0, 0, ${Math.random() * 0.1 + 0.1})`;
        
        for (let angle = 0; angle < Math.PI * 2; angle += 0.1) {
            const radius = 150 + Math.random() * 50;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            
            if (angle === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        
        ctx.closePath();
        ctx.stroke();
    }

    ctx.setTransform(1, 0, 0, 1, 0, 0);
}

generateBtn.addEventListener('click', generateArt);

// Initial generation
generateArt();