// Quantum Simulation Variables
let isSimulationRunning = false;
let simulationInterval;
let totalIterations = 0;
let anomalyCount = 0;
let lastPatternDeviation = 0;

// Quantum State Variables
let quantumState = {
    entropy: 0,
    chaos: 0,
    stability: 0,
    fluctuation: 0
};

// Data History for Graphs
const MAX_HISTORY = 50;
let history = {
    fluctuations: [],
    entropy: [],
    chaos: []
};

// Chart Instances
let fluctuationChart, entropyChart, chaosChart;

// Initialize the simulation
function initializeSimulation() {
    // Initialize charts
    initializeCharts();
    
    // Set up event listeners
    document.getElementById('startBtn').addEventListener('click', startSimulation);
    document.getElementById('stopBtn').addEventListener('click', stopSimulation);
    document.getElementById('resetBtn').addEventListener('click', resetSimulation);
    document.getElementById('randomizeBtn').addEventListener('click', randomizeParameters);
    
    // Add parameter change listeners
    ['entropyFactor', 'chaosModulator', 'stabilityThreshold'].forEach(id => {
        document.getElementById(id).addEventListener('input', updateParameters);
    });
    
    // Initial parameter update
    updateParameters();
}

function initializeCharts() {
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
            duration: 0
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(0, 255, 0, 0.1)'
                },
                ticks: {
                    color: '#00ff00'
                }
            },
            x: {
                grid: {
                    color: 'rgba(0, 255, 0, 0.1)'
                },
                ticks: {
                    color: '#00ff00'
                }
            }
        },
        plugins: {
            legend: {
                labels: {
                    color: '#00ff00'
                }
            }
        }
    };

    // Fluctuation Chart
    const ctxFluctuation = document.getElementById('fluctuationGraph').getContext('2d');
    fluctuationChart = new Chart(ctxFluctuation, {
        type: 'line',
        data: {
            labels: Array(MAX_HISTORY).fill(''),
            datasets: [{
                label: 'Quantum Fluctuation',
                data: [],
                borderColor: '#00ff00',
                tension: 0.4,
                fill: false
            }]
        },
        options: chartOptions
    });

    // Entropy Chart
    const ctxEntropy = document.getElementById('entropyGraph').getContext('2d');
    entropyChart = new Chart(ctxEntropy, {
        type: 'bar',
        data: {
            labels: Array(MAX_HISTORY).fill(''),
            datasets: [{
                label: 'Entropy Level',
                data: [],
                backgroundColor: 'rgba(0, 255, 0, 0.2)',
                borderColor: '#00ff00'
            }]
        },
        options: chartOptions
    });

    // Chaos Chart
    const ctxChaos = document.getElementById('chaosGraph').getContext('2d');
    chaosChart = new Chart(ctxChaos, {
        type: 'line',
        data: {
            labels: Array(MAX_HISTORY).fill(''),
            datasets: [{
                label: 'Chaos Pattern',
                data: [],
                borderColor: '#00ff00',
                tension: 0.1,
                fill: false
            }]
        },
        options: chartOptions
    });
}

function updateParameters() {
    const entropyFactor = parseInt(document.getElementById('entropyFactor').value) / 100;
    const chaosModulator = parseInt(document.getElementById('chaosModulator').value) / 100;
    const stabilityThreshold = parseInt(document.getElementById('stabilityThreshold').value) / 100;
    
    quantumState.entropy = entropyFactor;
    quantumState.chaos = chaosModulator;
    quantumState.stability = stabilityThreshold;
}

function randomizeParameters() {
    document.getElementById('entropyFactor').value = Math.floor(Math.random() * 100);
    document.getElementById('chaosModulator').value = Math.floor(Math.random() * 100);
    document.getElementById('stabilityThreshold').value = Math.floor(Math.random() * 100);
    updateParameters();
    addLogEntry('PARAMETERS RANDOMIZED - QUANTUM STATE UNSTABLE');
}

function calculateQuantumState() {
    // Base quantum fluctuation
    let baseFluctuation = Math.sin(totalIterations * 0.1) * 50;
    
    // Add entropy influence
    let entropyInfluence = Math.random() * quantumState.entropy * 100;
    
    // Add chaos influence
    let chaosInfluence = (Math.random() - 0.5) * quantumState.chaos * 200;
    
    // Calculate stability factor
    let stabilityFactor = 1 - (Math.random() * quantumState.stability);
    
    // Combine influences
    let fluctuation = (baseFluctuation + entropyInfluence + chaosInfluence) * stabilityFactor;
    
    // Detect anomalies
    if (Math.abs(fluctuation - baseFluctuation) > 100) {
        anomalyCount++;
        addLogEntry(`ANOMALY DETECTED - FLUCTUATION DEVIATION: ${Math.abs(fluctuation - baseFluctuation).toFixed(2)}`);
    }
    
    // Calculate pattern deviation
    lastPatternDeviation = Math.abs(fluctuation - (history.fluctuations[history.fluctuations.length - 1] || 0));
    
    return {
        fluctuation,
        entropy: Math.abs(entropyInfluence),
        chaos: Math.abs(chaosInfluence)
    };
}

function updateDisplay(state) {
    // Update metrics
    document.getElementById('entropyLevel').textContent = state.entropy.toFixed(2);
    document.getElementById('chaosIndex').textContent = state.chaos.toFixed(2);
    document.getElementById('stabilityRating').textContent = (100 - (state.chaos + state.entropy)).toFixed(2);
    
    // Update statistics
    document.getElementById('totalIterations').textContent = totalIterations;
    document.getElementById('anomalyCount').textContent = anomalyCount;
    document.getElementById('patternDeviation').textContent = `${lastPatternDeviation.toFixed(2)}%`;
    
    // Update charts
    updateCharts(state);
}

function updateCharts(state) {
    // Add new data points
    history.fluctuations.push(state.fluctuation);
    history.entropy.push(state.entropy);
    history.chaos.push(state.chaos);
    
    // Trim history if needed
    if (history.fluctuations.length > MAX_HISTORY) {
        history.fluctuations.shift();
        history.entropy.shift();
        history.chaos.shift();
    }
    
    // Update charts
    fluctuationChart.data.datasets[0].data = history.fluctuations;
    entropyChart.data.datasets[0].data = history.entropy;
    chaosChart.data.datasets[0].data = history.chaos;
    
    fluctuationChart.update();
    entropyChart.update();
    chaosChart.update();
}

function addLogEntry(message) {
    const logContent = document.getElementById('eventLog');
    const timestamp = new Date().toLocaleTimeString();
    const entry = document.createElement('p');
    entry.textContent = `[${timestamp}] ${message}`;
    logContent.appendChild(entry);
    logContent.scrollTop = logContent.scrollHeight;
}

function startSimulation() {
    if (!isSimulationRunning) {
        isSimulationRunning = true;
        simulationInterval = setInterval(runSimulation, 100);
        addLogEntry('SIMULATION INITIATED - QUANTUM STATE STABILIZING');
    }
}

function runSimulation() {
    totalIterations++;
    const state = calculateQuantumState();
    updateDisplay(state);
    
    // Random log entries
    if (Math.random() < 0.05) {
        const messages = [
            'QUANTUM FLUCTUATION DETECTED',
            'ENTROPY LEVELS FLUCTUATING',
            'CHAOS PATTERNS EMERGING',
            'STABILITY THRESHOLD APPROACHING',
            'ANOMALY PROBABILITY INCREASING'
        ];
        addLogEntry(messages[Math.floor(Math.random() * messages.length)]);
    }
}

function stopSimulation() {
    if (isSimulationRunning) {
        isSimulationRunning = false;
        clearInterval(simulationInterval);
        addLogEntry('SIMULATION TERMINATED - QUANTUM STATE FROZEN');
    }
}

function resetSimulation() {
    stopSimulation();
    totalIterations = 0;
    anomalyCount = 0;
    lastPatternDeviation = 0;
    history = {
        fluctuations: [],
        entropy: [],
        chaos: []
    };
    updateDisplay({ fluctuation: 0, entropy: 0, chaos: 0 });
    addLogEntry('MATRIX RESET - ALL QUANTUM STATES CLEARED');
}

// Initialize when the page loads
window.addEventListener('load', initializeSimulation);
