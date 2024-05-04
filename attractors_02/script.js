const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let animationFrameId;

// Elements
const sliders = document.querySelectorAll('input[type="range"]');
const startButton = document.getElementById('start');
const stopButton = document.getElementById('stop');
const resetButton = document.getElementById('reset');

// Values
let a = parseFloat(document.getElementById('a').value);
let b = parseFloat(document.getElementById('b').value);
let c = parseFloat(document.getElementById('c').value);
let d = parseFloat(document.getElementById('d').value);
let points = parseInt(document.getElementById('points').value);
let opacity = parseFloat(document.getElementById('opacity').value);

// Set canvas size
canvas.width = window.innerWidth;
canvas.height = window.innerHeight - document.querySelector('.control-panel').offsetHeight;

// Initialize drawing variables
let x = 0, y = 0; // Starting values for x and y
const scale = 150; // Scale to fit points nicely on canvas

// Event Listeners
sliders.forEach(slider => {
    slider.addEventListener('input', (e) => {
        switch (e.target.id) {
            case 'a': a = parseFloat(e.target.value); break;
            case 'b': b = parseFloat(e.target.value); break;
            case 'c': c = parseFloat(e.target.value); break;
            case 'd': d = parseFloat(e.target.value); break;
            case 'points': points = parseInt(e.target.value); break;
            case 'opacity': opacity = parseFloat(e.target.value); break;
        }
        draw();
    });
});

startButton.addEventListener('click', () => {
    if (!animationFrameId) {
        draw(true);
    }
});

stopButton.addEventListener('click', () => {
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
    }
});

resetButton.addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});

// Drawing function
function draw(loop = false) {
    if (loop) {
        animationFrameId = requestAnimationFrame(() => draw(true));
    }

    let localX = x, localY = y; // Use local variables to avoid using global x, y before they are updated
    for (let i = 0; i < points; i++) {
        localX = Math.sin(a * localY) - Math.cos(b * localX);
        localY = Math.sin(c * localX) - Math.cos(d * localY);
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`; // Ensure opacity is low to see the evolution effect
        ctx.beginPath();
        ctx.arc(localX * scale + canvas.width / 2, localY * scale + canvas.height / 2, 1, 0, 2 * Math.PI);
        ctx.fill();
    }
    x = localX; // Update global x, y after the loop
    y = localY;
}

// Initial draw with a clear background
ctx.fillStyle = "rgba(0, 0, 0, 0.1)"; // Adjust opacity to control fade rate of old points
ctx.fillRect(0, 0, canvas.width, canvas.height);
draw();

