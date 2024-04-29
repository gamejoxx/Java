// Function to create a layer with specified size, delay, duration, and index
function createLayer(size, delay, duration, index) {
    const layer = document.createElement('div'); // Create a new div element
    layer.classList.add('layer'); // Add the 'layer' class to the div
    layer.style.width = `${size}vmax`; // Set the width of the div
    layer.style.height = `${size}vmax`; // Set the height of the div
    layer.style.animation = `rotate ${duration}s linear ${delay}s infinite`; // Set the animation properties of the div
    layer.style.clipPath = `polygon(${50 - index * 5}% ${50 - index * 5}%, ${50 + index * 5}% ${50 - index * 5}%, ${50 + index * 5}% ${50 + index * 5}%, ${50 - index * 5}% ${50 + index * 5}%)`; // Set the clip path of the div

    document.getElementById('kaleidoscope').appendChild(layer); // Append the layer to the 'kaleidoscope' element
}

// Function to initialize the kaleidoscope
function initializeKaleidoscope() {
    for (let i = 0; i < 20; i++) {
        createLayer(9 + i * 5, i * 0.1, 30 + i * (i % 2 === 0 ? -1 : 1), i); // Create layers with increasing size, delay, duration, and index
    }
}

// Event listener for when the DOM content is loaded
document.addEventListener('DOMContentLoaded', initializeKaleidoscope);

// Event listener for mouse movement
document.addEventListener('mousemove', function(e) {
    const layers = document.querySelectorAll('.layer'); // Get all elements with the 'layer' class
    const speedFactor = 1.5; // Set the speed factor
    const x = (e.clientX / window.innerWidth - 0.5) * speedFactor; // Calculate the x position based on mouse movement
    const y = (e.clientY / window.innerHeight - 0.5) * speedFactor; // Calculate the y position based on mouse movement
    
    layers.forEach((layer, index) => {
        const baseSpeed = index % 2 === 0 ? 1 : -1; // Determine the base speed based on the index
        const adjustedDuration = 1 + baseSpeed * index * (x - y); // Calculate the adjusted duration based on the x and y positions
        layer.style.animationDuration = `${Math.abs(adjustedDuration)}s`; // Set the animation duration of the layer
    });
});
