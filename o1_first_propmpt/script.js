let particles = [];
let particleCount = 10;
let trailLength = 50;
let attractorSpeed = 1;
let paused = false;

let sigma = 10;
let rho = 28;
let beta = 8 / 3; // Approximately 2.6667
let dt = 0.01;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSL, 360, 100, 100, 100);
  background(0);
  initParticles();

  // Get control elements
  const particleCountSlider = document.getElementById('particleCount');
  const trailLengthSlider = document.getElementById('trailLength');
  const attractorSpeedSlider = document.getElementById('attractorSpeed');
  const sigmaSlider = document.getElementById('sigma');
  const rhoSlider = document.getElementById('rho');
  const betaSlider = document.getElementById('beta');
  const pauseButton = document.getElementById('pauseButton');

  // Attach event listeners
  particleCountSlider.oninput = () => {
    particleCount = parseInt(particleCountSlider.value);
    initParticles();
  };
  trailLengthSlider.oninput = () => {
    trailLength = parseInt(trailLengthSlider.value);
  };
  attractorSpeedSlider.oninput = () => {
    attractorSpeed = parseFloat(attractorSpeedSlider.value);
  };
  sigmaSlider.oninput = () => {
    sigma = parseFloat(sigmaSlider.value);
  };
  rhoSlider.oninput = () => {
    rho = parseFloat(rhoSlider.value);
  };
  betaSlider.oninput = () => {
    beta = parseFloat(betaSlider.value);
  };
  pauseButton.onclick = () => {
    paused = !paused;
    pauseButton.textContent = paused ? 'Resume' : 'Pause';
  };
}

function initParticles() {
  particles = [];
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }
}

function draw() {
  if (!paused) {
    // Fade background for motion trails
    fill(0, 0, 0, 10);
    rect(0, 0, width, height);

    // Update and display particles
    for (let particle of particles) {
      particle.update();
      particle.display();
    }
  }
}

class Particle {
  constructor() {
    this.pos = createVector(random(-10, 10), random(-10, 10), random(10, 20));
    this.prevPos = this.pos.copy();
    this.trail = [];
    this.hue = map(this.pos.z, 10, 20, 200, 260); // Shades of blue
  }

  update() {
    let dx = sigma * (this.pos.y - this.pos.x);
    let dy = this.pos.x * (rho - this.pos.z) - this.pos.y;
    let dz = this.pos.x * this.pos.y - beta * this.pos.z;

    this.pos.x += dx * dt;
    this.pos.y += dy * dt;
    this.pos.z += dz * dt;

    // Add Perlin noise modulation
    let noiseScale = 0.1;
    this.pos.x += (noise(this.pos.x * noiseScale, frameCount * attractorSpeed) - 0.5) * 0.1;
    this.pos.y += (noise(this.pos.y * noiseScale, frameCount * attractorSpeed) - 0.5) * 0.1;
    this.pos.z += (noise(this.pos.z * noiseScale, frameCount * attractorSpeed) - 0.5) * 0.1;

    this.trail.push(createVector(this.pos.x, this.pos.y, this.pos.z));
    if (this.trail.length > trailLength) {
      this.trail.shift();
    }
  }

  display() {
    noFill();
    beginShape();
    for (let i = 0; i < this.trail.length; i++) {
      let pos = this.trail[i];
      let screenPos = this.project(pos);
      let alpha = map(i, 0, this.trail.length, 0, 100);
      stroke(this.hue, 80, 60, alpha);
      vertex(screenPos.x, screenPos.y);
    }
    endShape();
  }

  project(pos) {
    return createVector(
      map(pos.x, -30, 30, 0, width),
      map(pos.y, -30, 30, height, 0)
    );
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
