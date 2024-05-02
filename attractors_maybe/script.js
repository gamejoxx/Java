let isGenerating = false;
let points = [];
const numPoints = 100;

function setup() {
  canvas = createCanvas(windowWidth * 0.9, windowHeight * 0.8);
  canvas.parent('canvas-container');
  background('#c4c4c4');
  noLoop();
  initPoints();
}

function draw() {
  if (isGenerating) {
    background('#c4c4c4');
    drawNetwork();
  }
}

function initPoints() {
  points = [];
  for (let i = 0; i < numPoints; i++) {
    points.push(createVector(random(width), random(height)));
  }
}

function drawNetwork() {
  for (let i = 0; i < points.length; i++) {
    let point = points[i];
    fill(0, 100, 255, 150); // Blue color with transparency
    noStroke();
    ellipse(point.x, point.y, 5, 5); // Draw points
    stroke(0, 100, 255, 50); // Light blue lines with low opacity
    for (let j = i + 1; j < points.length; j++) {
      let other = points[j];
      if (dist(point.x, point.y, other.x, other.y) < 100) {
        line(point.x, point.y, other.x, other.y);
      }
    }
  }
}

function startArt() {
  isGenerating = true;
  loop();
}

function stopArt() {
  isGenerating = false;
  noLoop();
}

function resetArt() {
  clear();
  background('#c4c4c4');
  initPoints(); // Re-initialize points to reset the art
}

document.getElementById('startBtn').addEventListener('click', startArt);
document.getElementById('stopBtn').addEventListener('click', stopArt);
document.getElementById('resetBtn').addEventListener('click', resetArt);

function windowResized() {
  resizeCanvas(windowWidth * 0.9, windowHeight * 0.8);
  background('#c4c4c4');
}
