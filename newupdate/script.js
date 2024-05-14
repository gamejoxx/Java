let colors;
let t = 0;

function setup() {
    const container = document.getElementById('art-container');
    const canvas = createCanvas(container.clientWidth, container.clientHeight);
    canvas.parent('art-container');
    noFill();
    colors = [color(255, 204, 0, 150), color(0, 204, 255, 150), color(255, 0, 204, 150)];
    frameRate(30);
}

function draw() {
    background(0);
    strokeWeight(2);

    const centerX = width / 2;
    const centerY = height / 2;
    const numPoints = 20;
    const radius = min(width, height) / 8;

    for (let i = 0; i < numPoints; i++) {
        const angle = map(i, 0, numPoints, 0, TWO_PI) + t;
        const x = centerX + radius * cos(angle);
        const y = centerY + radius * sin(angle);
        drawPattern(x, y);
    }

    t += 1 / 60;
}

function drawPattern(x, y) {
    const numShapes = 7;
    const baseSize = map(sin(t), -1, 3, 20, 900);

    for (let i = 0; i < numShapes; i++) {
        stroke(colors[i % colors.length]);
        const offset = map(i, 0, numShapes, 0, baseSize / 2);
        ellipse(x, y, baseSize - offset, baseSize - offset);
    }
}

function mousePressed() {
    t += PI / 2;  // This changes the phase of the sine wave, creating a different pattern
}
