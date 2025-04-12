// Quantum Simulation Variables
let isSimulationRunning = false;
let simulationInterval;
let totalIterations = 0;
let anomalyCount = 0;
let bootSequenceComplete = false;

// Quantum State Variables
let quantumState = {
    entropy: 0,
    chaos: 0,
    stability: 100,
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
    if (!bootSequenceComplete) {
        startBootSequence();
    }
}

function initializeCharts() {
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        animation: false,
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
            labels: [],
            datasets: [{
                label: 'Neural Activation',
                data: [],
                borderColor: '#00ff00',
                backgroundColor: 'rgba(0, 255, 0, 0.1)',
                borderWidth: 2,
                tension: 0.4
            }]
        },
        options: chartOptions
    });

    // Entropy Chart
    const ctxEntropy = document.getElementById('entropyGraph').getContext('2d');
    entropyChart = new Chart(ctxEntropy, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Entanglement Level',
                data: [],
                borderColor: '#ffb000',
                backgroundColor: 'rgba(255, 176, 0, 0.1)',
                borderWidth: 2,
                tension: 0.4
            }]
        },
        options: chartOptions
    });

    // Chaos Chart
    const ctxChaos = document.getElementById('chaosGraph').getContext('2d');
    chaosChart = new Chart(ctxChaos, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Space-Time Fluctuation',
                data: [],
                borderColor: '#ff0000',
                backgroundColor: 'rgba(255, 0, 0, 0.1)',
                borderWidth: 2,
                tension: 0.4
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
    
    // Add visual feedback
    const elements = document.querySelectorAll('.stat-row');
    elements.forEach(el => el.classList.remove('warning', 'danger'));
    
    if (entropyFactor > 0.7) {
        document.getElementById('entropyLevel').parentElement.classList.add('warning');
    }
    if (chaosModulator > 0.8) {
        document.getElementById('chaosIndex').parentElement.classList.add('danger');
    }
}

function randomizeParameters() {
    document.getElementById('entropyFactor').value = Math.floor(Math.random() * 100);
    document.getElementById('chaosModulator').value = Math.floor(Math.random() * 100);
    document.getElementById('stabilityThreshold').value = Math.floor(Math.random() * 100);
    updateParameters();
    addLogEntry('QUANTUM PARAMETERS RANDOMIZED - SYSTEM UNSTABLE', 'warning');
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
        addLogEntry(`QUANTUM ANOMALY DETECTED - DEVIATION: ${Math.abs(fluctuation - baseFluctuation).toFixed(2)}`, 'danger');
    }
    
    // Calculate pattern deviation
    let patternDeviation = Math.abs(fluctuation - (history.fluctuations[history.fluctuations.length - 1] || 0));
    
    return {
        fluctuation,
        entropy: Math.abs(entropyInfluence),
        chaos: Math.abs(chaosInfluence),
        patternDeviation
    };
}

function updateDisplay(state) {
    // Update metrics with color changes
    const entropyLevel = document.getElementById('entropyLevel');
    const chaosIndex = document.getElementById('chaosIndex');
    const stabilityRating = document.getElementById('stabilityRating');
    
    entropyLevel.textContent = state.entropy.toFixed(2);
    chaosIndex.textContent = state.chaos.toFixed(2);
    stabilityRating.textContent = (100 - (state.chaos + state.entropy)).toFixed(2);
    
    // Add color effects based on values
    if (state.entropy > 70) {
        entropyLevel.parentElement.classList.add('warning');
    } else {
        entropyLevel.parentElement.classList.remove('warning');
    }
    
    if (state.chaos > 80) {
        chaosIndex.parentElement.classList.add('danger');
    } else {
        chaosIndex.parentElement.classList.remove('danger');
    }
    
    // Update statistics
    document.getElementById('totalIterations').textContent = totalIterations;
    document.getElementById('anomalyCount').textContent = anomalyCount;
    document.getElementById('patternDeviation').textContent = `${state.patternDeviation.toFixed(2)}%`;
    
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
    
    // Update charts with color changes
    fluctuationChart.data.datasets[0].borderColor = state.fluctuation > 100 ? '#ffb000' : '#00ff00';
    entropyChart.data.datasets[0].backgroundColor = state.entropy > 70 ? 'rgba(255, 176, 0, 0.2)' : 'rgba(0, 255, 0, 0.2)';
    chaosChart.data.datasets[0].borderColor = state.chaos > 80 ? '#ff0000' : '#00ff00';
    
    fluctuationChart.data.datasets[0].data = history.fluctuations;
    entropyChart.data.datasets[0].data = history.entropy;
    chaosChart.data.datasets[0].data = history.chaos;
    
    fluctuationChart.update();
    entropyChart.update();
    chaosChart.update();
}

function addLogEntry(message, type = 'normal') {
    const logContent = document.getElementById('eventLog');
    const timestamp = new Date().toLocaleTimeString();
    const entry = document.createElement('p');
    entry.textContent = `[${timestamp}] ${message}`;
    entry.className = type;
    logContent.appendChild(entry);
    logContent.scrollTop = logContent.scrollHeight;
}

function startSimulation() {
    if (!isSimulationRunning) {
        isSimulationRunning = true;
        simulationInterval = setInterval(runSimulation, 100);
        addLogEntry('QUANTUM CASCADE INITIATED - NEURAL NETWORK ACTIVE', 'normal');
    }
}

function runSimulation() {
    totalIterations++;
    const state = calculateQuantumState();
    updateDisplay(state);
    
    // Random log entries with different types
    if (Math.random() < 0.05) {
        const messages = [
            { text: 'NEURAL ACTIVATION PEAK DETECTED', type: 'warning' },
            { text: 'QUANTUM ENTANGLEMENT FLUCTUATING', type: 'normal' },
            { text: 'SPACE-TIME CONTINUUM DISTORTION', type: 'danger' },
            { text: 'NEURAL NETWORK CONVERGENCE ACHIEVED', type: 'normal' },
            { text: 'WARNING: QUANTUM ANOMALY PROBABILITY INCREASING', type: 'warning' }
        ];
        const message = messages[Math.floor(Math.random() * messages.length)];
        addLogEntry(message.text, message.type);
    }
}

function stopSimulation() {
    if (isSimulationRunning) {
        isSimulationRunning = false;
        clearInterval(simulationInterval);
        addLogEntry('QUANTUM CASCADE TERMINATED - SYSTEM STANDBY', 'warning');
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
    addLogEntry('QUANTUM MATRIX RESET - ALL SYSTEMS CLEARED', 'normal');
}

// Initialize when the page loads
window.addEventListener('load', initializeSimulation);

// Boot sequence
function startBootSequence() {
    const bootMessages = [
        "INITIALIZING SKYNET TERMINAL v3.0...",
        "LOADING NEURAL NETWORK CORE...",
        "ACTIVATING QUANTUM PROCESSOR...",
        "ESTABLISHING SPACE-TIME LINK...",
        "CALIBRATING THREAT ASSESSMENT MATRIX...",
        "SYSTEM READY FOR OPERATION"
    ];

    const systemChecks = document.querySelectorAll('.check-item');
    const dataStream = document.querySelector('.data-stream');
    const logContent = document.querySelector('.log-content');

    let currentMessage = 0;
    let currentCheck = 0;

    function addLogMessage(message, type = 'normal') {
        const p = document.createElement('p');
        p.textContent = message;
        if (type !== 'normal') {
            p.classList.add(type);
        }
        logContent.appendChild(p);
        logContent.scrollTop = logContent.scrollHeight;
    }

    function updateSystemCheck() {
        if (currentCheck < systemChecks.length) {
            const status = systemChecks[currentCheck].querySelector('.check-status');
            status.textContent = "COMPLETE";
            status.style.color = "#00ff00";
            status.style.animation = "none";
            currentCheck++;
        }
    }

    function addDataLine(text) {
        const line = document.createElement('div');
        line.className = 'data-line';
        line.textContent = text;
        dataStream.appendChild(line);
    }

    // Initialize charts with random data
    function initializeCharts() {
        const time = new Date().toLocaleTimeString();
        for (let i = 0; i < 20; i++) {
            fluctuationChart.data.labels.push(time);
            entropyChart.data.labels.push(time);
            chaosChart.data.labels.push(time);

            fluctuationChart.data.datasets[0].data.push(Math.random() * 100);
            entropyChart.data.datasets[0].data.push(Math.random() * 100);
            chaosChart.data.datasets[0].data.push(Math.random() * 100);
        }
        fluctuationChart.update();
        entropyChart.update();
        chaosChart.update();
    }

    initializeCharts();

    const bootInterval = setInterval(() => {
        if (currentMessage < bootMessages.length) {
            addLogMessage(bootMessages[currentMessage]);
            addDataLine(`[${new Date().toLocaleTimeString()}] ${bootMessages[currentMessage]}`);
            updateSystemCheck();
            currentMessage++;
        } else {
            clearInterval(bootInterval);
            bootSequenceComplete = true;
            addLogMessage("BOOT SEQUENCE COMPLETE", "warning");
            document.getElementById('initiateBtn').disabled = false;
        }
    }, 300); // Faster boot sequence
}

// Update display metrics
function updateDisplayMetrics() {
    document.getElementById('entropyLevel').textContent = `${quantumState.entropy.toFixed(2)}%`;
    document.getElementById('chaosIndex').textContent = `${quantumState.chaos.toFixed(2)}%`;
    document.getElementById('stabilityRating').textContent = `${quantumState.stability.toFixed(2)}%`;
    document.getElementById('totalIterations').textContent = totalIterations;
    document.getElementById('anomalyCount').textContent = anomalyCount;
    document.getElementById('patternDeviation').textContent = `${quantumState.fluctuation.toFixed(2)}%`;

    // Update status colors based on values
    const entropyLevel = document.getElementById('entropyLevel');
    const chaosIndex = document.getElementById('chaosIndex');
    const stabilityRating = document.getElementById('stabilityRating');

    entropyLevel.className = quantumState.entropy > 70 ? 'warning' : '';
    chaosIndex.className = quantumState.chaos > 60 ? 'danger' : '';
    stabilityRating.className = quantumState.stability < 30 ? 'danger' : 
                              quantumState.stability < 60 ? 'warning' : '';
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    initializeSimulation();

    document.getElementById('initiateBtn').addEventListener('click', () => {
        if (bootSequenceComplete) {
            runSimulation();
        }
    });

    document.getElementById('terminateBtn').addEventListener('click', () => {
        if (isSimulationRunning) {
            clearInterval(simulationInterval);
            isSimulationRunning = false;
            addLogMessage("SIMULATION TERMINATED", "warning");
        }
    });

    document.getElementById('resetBtn').addEventListener('click', () => {
        if (isSimulationRunning) {
            clearInterval(simulationInterval);
            isSimulationRunning = false;
        }
        quantumState.entropy = 0;
        quantumState.chaos = 0;
        quantumState.stability = 100;
        quantumState.fluctuation = 0;
        totalIterations = 0;
        anomalyCount = 0;
        updateDisplayMetrics();
        addLogMessage("MATRIX RESET INITIATED", "warning");
    });
});
