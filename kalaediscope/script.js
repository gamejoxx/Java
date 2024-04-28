let angles = [90, 60, 45];  // Basic symmetry angles
let symmetry = 6;           // Initial symmetry level
let color1, color2;
let alphaValue = 150;       // Transparency for trace effects

function setup() {
    createCanvas(windowWidth, windowHeight);
    angleMode(DEGREES);
    color1 = color(255, 204, 0);  // Bright yellow
    color2 = color(65, 105, 225); // Royal blue
    background(18);  // Dark background
}

function draw() {
    // Adding a semi-transparent background for a trace effect
    fill(18, 18, 18, alphaValue);
    noStroke();
    rect(0, 0, width, height);

    translate(width / 2, height / 2);

    // Draw multiple rotated versions of the pattern
    for (let i = 0; i < symmetry; i++) {
        rotate(360 / symmetry);
        drawPattern();
    }
}

// Function to draw the repeating pattern
function drawPattern() {
    let numShapes = random(5, 15); // More randomness in the number of shapes
    let angle = random(angles);    // Pick a random angle for variety
    stroke(lerpColor(color1, color2, random()));
    fill(lerpColor(color2, color1, random()));
    strokeWeight(random(1, 4));    // Random stroke weight for more variability

    for (let i = 0; i < numShapes; i++) {
        push();
        rotate(i * angle);
        let size = random(50, 150);
        ellipse(size, 0, random(10, 60), random(20, 80)); // More random sizes
        pop();
    }
}

function mouseMoved() {
    // Adjust symmetry more smoothly and add a dampening effect
    let newSymmetry = int(map(mouseX, 0, width, 3, 12));
    symmetry += (newSymmetry - symmetry) * 0.05; // Smooth transition
    loop();
}

function mouseReleased() {
    noLoop(); // Stop the animation when the mouse is released
}
