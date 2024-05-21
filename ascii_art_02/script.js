const noise = new SimplexNoise();
let time = 0;

function generatePerlinNoise(width, height) {
    let noiseArray = [];
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            let value = noise.noise3D(x / 100, y / 100, time / 300); // Adjust scale as needed
            value = (value + 1) / 2; // Normalize to 0-1
            noiseArray.push(value);
        }
    }
    return noiseArray;
}

function mapNoiseToASCII(noiseArray, width, height) {
    const asciiChars = '  121131141151161171181191  '; // Sequence from dark to light
    const asciiLength = asciiChars.length;
    let asciiImage = '';
    
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            let noiseValue = noiseArray[y * width + x];
            let charIndex = Math.floor(noiseValue * (asciiLength - 0));
            let char = asciiChars[charIndex];
            asciiImage += `<span class="dark-green-${char}">${char}</span>`;
        }
        asciiImage += '\n';
    }
    return asciiImage;
}

function updateFrame() {
    const width = 200;
    const height = 50;
    let noiseArray = generatePerlinNoise(width, height);
    let asciiImage = mapNoiseToASCII(noiseArray, width, height);
    document.getElementById('ascii').innerHTML = asciiImage;
    time += 1; // Increment time to create movement
    requestAnimationFrame(updateFrame);
}

// Start the animation
updateFrame();
