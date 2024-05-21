const noise = new SimplexNoise();
let time = 0;

function generatePerlinNoise(width, height) {
    let noiseArray = [];
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            let value = noise.noise3D(x / 10, y / 10, time / 100); // Adjust scale as needed
            value = (value + 1) / 2; // Normalize to 0-1
            noiseArray.push(value);
        }
    }
    return noiseArray;
}

function mapNoiseToASCII(noiseArray, width, height) {
    const asciiChars = ' ░▒▓█    ░▒▓█.........░▒▓█';
    const asciiLength = asciiChars.length;
    let asciiImage = '';
    
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            let noiseValue = noiseArray[y * width + x];
            let charIndex = Math.floor(noiseValue * (asciiLength - 1));
            asciiImage += asciiChars[charIndex];
        }
        asciiImage += '\n';
    }
    return asciiImage;
}


function updateFrame() {
    const width = 100;
    const height = 100;
    let noiseArray = generatePerlinNoise(width, height);
    let asciiImage = mapNoiseToASCII(noiseArray, width, height);
    document.getElementById('ascii').textContent = asciiImage;
    time += 1; // Increment time to create movement
    requestAnimationFrame(updateFrame);
}

// Start the animation
updateFrame();
