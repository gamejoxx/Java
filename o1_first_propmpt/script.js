let particles = [];
let particleCount = 500;
let gravityStrength = 1;
let pendulumLength = 100;
let crtEffect = true;
let paused = false;

let pendulum;

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0);
  initParticles();

  pendulum = new TriplePendulum();

  // Get control elements
  const particleCountSlider = document.getElementById('particleCount');
  const gravityStrengthSlider = document.getElementById('gravityStrength');
  const pendulumLengthSlider = document.getElementById('pendulumLength');
  const crtEffectCheckbox = document.getElementById('crtEffect');
  const pauseButton = document.getElementById('pauseButton');

  // Attach event listeners
  particleCountSlider.oninput = () => {
    particleCount = parseInt(particleCountSlider.value);
    initParticles();
  };
  gravityStrengthSlider.oninput = () => {
    gravityStrength = parseFloat(gravityStrengthSlider.value);
  };
  pendulumLengthSlider.oninput = () => {
    pendulumLength = parseInt(pendulumLengthSlider.value);
    pendulum.resetLengths(pendulumLength);
  };
  crtEffectCheckbox.onchange = () => {
    crtEffect = crtEffectCheckbox.checked;
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
    // Semi-transparent background for motion trails
    fill(0, 20);
    rect(0, 0, width, height);

    // Update and display pendulum
    pendulum.update();
    pendulum.display();

    // Update and display particles
    for (let particle of particles) {
      particle.update(pendulum.endX, pendulum.endY);
      particle.display();
    }

    // Apply CRT effect
    if (crtEffect) {
      applyCRTEffect();
    }
  }
}

class TriplePendulum {
  constructor() {
    this.originX = width / 2;
    this.originY = height / 4;

    this.len1 = pendulumLength;
    this.len2 = pendulumLength;
    this.len3 = pendulumLength;

    this.ang1 = PI / 2;
    this.ang2 = PI / 2;
    this.ang3 = PI / 2;

    this.aVel1 = 0;
    this.aVel2 = 0;
    this.aVel3 = 0;

    this.aAcc1 = 0;
    this.aAcc2 = 0;
    this.aAcc3 = 0;

    this.g = 1; // Gravitational constant

    this.path = [];
  }

  resetLengths(len) {
    this.len1 = len;
    this.len2 = len;
    this.len3 = len;
  }

  update() {
    // Simplified physics for demonstration purposes
    // In a real simulation, the equations are much more complex
    this.aAcc1 = (-this.g * sin(this.ang1)) / this.len1;
    this.aVel1 += this.aAcc1;
    this.ang1 += this.aVel1;

    this.aAcc2 = (-this.g * sin(this.ang2)) / this.len2;
    this.aVel2 += this.aAcc2;
    this.ang2 += this.aVel2;

    this.aAcc3 = (-this.g * sin(this.ang3)) / this.len3;
    this.aVel3 += this.aAcc3;
    this.ang3 += this.aVel3;

    // Calculate positions
    this.x1 = this.originX + this.len1 * sin(this.ang1);
    this.y1 = this.originY + this.len1 * cos(this.ang1);

    this.x2 = this.x1 + this.len2 * sin(this.ang2);
    this.y2 = this.y1 + this.len2 * cos(this.ang2);

    this.x3 = this.x2 + this.len3 * sin(this.ang3);
    this.y3 = this.y2 + this.len3 * cos(this.ang3);

    this.endX = this.x3;
    this.endY = this.y3;

    // Store the path
    this.path.push({ x: this.endX, y: this.endY });
    if (this.path.length > 200) {
      this.path.shift();
    }
  }

  display() {
    stroke(0, 255, 0);
    strokeWeight(2);

    // Draw arms
    line(this.originX, this.originY, this.x1, this.y1);
    line(this.x1, this.y1, this.x2, this.y2);
    line(this.x2, this.y2, this.x3, this.y3);

    // Draw bobs
    fill(0, 255, 0);
    ellipse(this.x1, this.y1, 10);
    ellipse(this.x2, this.y2, 10);
    ellipse(this.x3, this.y3, 10);

    // Draw path
    noFill();
    beginShape();
    for (let pos of this.path) {
      vertex(pos.x, pos.y);
    }
    endShape();
  }
}

class Particle {
  constructor() {
    this.pos = createVector(random(width), random(height));
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.maxSpeed = 5;
  }

  update(targetX, targetY) {
    let target = createVector(targetX, targetY);
    let force = p5.Vector.sub(target, this.pos);
    let distance = force.mag();
    distance = constrain(distance, 5, 25);
    force.normalize();
    let strength = (gravityStrength * 1) / (distance * distance);
    force.mult(strength);
    this.acc = force;

    this.vel.add(this.acc);
    this.vel.limit(this.maxSpeed);
    this.pos.add(this.vel);

    // Wrap around edges
    if (this.pos.x > width) this.pos.x = 0;
    if (this.pos.x < 0) this.pos.x = width;
    if (this.pos.y > height) this.pos.y = 0;
    if (this.pos.y < 0) this.pos.y = height;
  }

  display() {
    stroke(0, 255, 0, 150);
    point(this.pos.x, this.pos.y);
  }
}

function applyCRTEffect() {
  loadPixels();
  for (let y = 0; y < height; y += 2) {
    for (let x = 0; x < width; x++) {
      let index = (x + y * width) * 4;
      pixels[index] = pixels[index] * 0.9;
      pixels[index + 1] = pixels[index + 1] * 0.9;
      pixels[index + 2] = pixels[index + 2] * 0.9;
    }
  }
  updatePixels();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  pendulum.originX = width / 2;
  pendulum.originY = height / 4;
}
