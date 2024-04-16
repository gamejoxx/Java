// Global variables to track simulation state
let isSimulationRunning = false;

// Global variables to track number of rolls, wins, ties, and statistical data for each opponent
let totalRollsA = 0;
let totalRollsB = 0;
let totalWinsA = 0;
let totalWinsB = 0;
let totalTies = 0;
let averageRollA = 0;
let averageRollB = 0;
let highestRollA = 0;
let highestRollB = 0;
let lowestRollA = Number.MAX_SAFE_INTEGER;
let lowestRollB = Number.MAX_SAFE_INTEGER;

// Data structures to hold the roll results for graphing purposes
let rollHistoryA = [];
let rollHistoryB = [];

// Variables for the interval and speed of the simulation
let simulationInterval;
let simulationSpeed = 5; // Default speed, corresponds to the initial value of the speedControl range input

// Initialize global variables for graph data
let graphDataA = {
  labels: [], // For storing the x-axis labels, which will be the roll numbers
  data: [], // For storing the y-axis data, which will be the roll results
  wins: 0 // For storing the number of wins
};

let graphDataB = {
  labels: [],
  data: [],
  wins: 0
};

// Additional necessary variables
let lastRollA = 0;
let lastRollB = 0;

// Utility function to calculate averages
const calculateAverage = (rolls) => {
    return rolls.reduce((sum, roll) => sum + roll, 0) / rolls.length;
  };
  
// Function to reset all global variables and stats
const resetGlobals = () => {
  // Reset all the variables to their initial state
  totalRollsA = 0;
  totalRollsB = 0;
  totalWinsA = 0;
  totalWinsB = 0;
  totalTies = 0;
  averageRollA = 0;
  averageRollB = 0;
  highestRollA = 0;
  highestRollB = 0;
  lowestRollA = Number.MAX_SAFE_INTEGER;
  lowestRollB = Number.MAX_SAFE_INTEGER;
  rollHistoryA = [];
  rollHistoryB = [];
  graphDataA.labels = [];
  graphDataA.data = [];
  graphDataA.wins = 0;
  graphDataB.labels = [];
  graphDataB.data = [];
  graphDataB.wins = 0;
  lastRollA = 0;
  lastRollB = 0;
};


// Function to roll a single die
const rollSingleDie = (faces) => {
    return Math.floor(Math.random() * faces) + 1;
};

// Function to roll dice based on user input
const rollDice = (numberOfDice, facesOfDice, modifier) => {
    let total = 0;
    for (let i = 0; i < numberOfDice; i++) {
        total += rollSingleDie(facesOfDice);
    }
    return total + modifier; // Apply modifier after all dice have been rolled
};


// Function to update stats after each roll
const updateStats = (rollA, rollB) => {
    totalRollsA++;
    totalRollsB++;
    lastRollA = rollA;
    lastRollB = rollB;
    
    rollHistoryA.push(rollA);
    rollHistoryB.push(rollB);
    
    if (rollA > rollB) {
        totalWinsA++;
        graphDataA.wins++;
    } else if (rollB > rollA) {
        totalWinsB++;
        graphDataB.wins++;
    } else {
        totalTies++;
    }

    // Update average, highest and lowest rolls
    averageRollA = calculateAverage(rollHistoryA);
    averageRollB = calculateAverage(rollHistoryB);
    updateHighestLowestRolls(rollA, rollB);
};

// Function to update the highest and lowest rolls
const updateHighestLowestRolls = (rollA, rollB) => {
    highestRollA = Math.max(highestRollA, rollA);
    highestRollB = Math.max(highestRollB, rollB);
    lowestRollA = Math.min(lowestRollA, rollA);
    lowestRollB = Math.min(lowestRollB, rollB);
};

// Function to update the number of wins and ties
const updateWinTieStats = () => {
    document.getElementById('totalWinsA').textContent = totalWinsA;
    document.getElementById('totalWinsB').textContent = totalWinsB;
    document.getElementById('totalTies').textContent = totalTies;
    document.getElementById('averageRollA').textContent = averageRollA.toFixed(2);
    document.getElementById('averageRollB').textContent = averageRollB.toFixed(2);
    document.getElementById('highestRollA').textContent = highestRollA;
    document.getElementById('highestRollB').textContent = highestRollB;
    document.getElementById('lowestRollA').textContent = lowestRollA;
    document.getElementById('lowestRollB').textContent = lowestRollB;
};


// Event listeners for input validation
document.getElementById('diceCountA').addEventListener('input', validateInput);
document.getElementById('diceCountB').addEventListener('input', validateInput);
document.getElementById('diceFacesA').addEventListener('input', validateInput);
document.getElementById('diceFacesB').addEventListener('input', validateInput);
document.getElementById('modifierA').addEventListener('input', validateInput);
document.getElementById('modifierB').addEventListener('input', validateInput);

function validateInput(event) {
    const input = event.target;
    if (input.value < 1) input.value = 1; // Ensuring no zero or negative numbers
}

// Event listener and function for the Start button
document.getElementById('startBtn').addEventListener('click', startSimulation);

function startSimulation() {
    if (isSimulationRunning) return;
    isSimulationRunning = true;
    simulationInterval = setInterval(runSimulation, 1000 / simulationSpeed);
}

function runSimulation() {
    const rollA = rollDice(parseInt(document.getElementById('diceCountA').value), 
                           parseInt(document.getElementById('diceFacesA').value),
                           parseInt(document.getElementById('modifierA').value));
    const rollB = rollDice(parseInt(document.getElementById('diceCountB').value), 
                           parseInt(document.getElementById('diceFacesB').value),
                           parseInt(document.getElementById('modifierB').value));
    updateStats(rollA, rollB);
    updateWinTieStats();
}

// Event listener and function for the Stop button
document.getElementById('stopBtn').addEventListener('click', stopSimulation);

function stopSimulation() {
    if (!isSimulationRunning) return;
    clearInterval(simulationInterval);
    isSimulationRunning = false;
}

// Event listener and function for the Reset button
document.getElementById('resetBtn').addEventListener('click', resetSimulation);

function resetSimulation() {
    stopSimulation();
    resetGlobals();
    clearTableAndGraphs(); // This function will need to be defined to clear the output on the UI
}

// Function to update the table with the latest roll and stats
function updateTable() {
    // Update rolls and stats in the table
    document.getElementById('totalRollsA').textContent = totalRollsA;
    document.getElementById('totalRollsB').textContent = totalRollsB;
    
    document.getElementById('lastRollA').textContent = lastRollA;
    document.getElementById('lastRollB').textContent = lastRollB;

    document.getElementById('totalWinsA').textContent = totalWinsA;
    document.getElementById('totalWinsB').textContent = totalWinsB;
    document.getElementById('totalTies').textContent = totalTies;

    document.getElementById('averageRollA').textContent = averageRollA.toFixed(2);
    document.getElementById('averageRollB').textContent = averageRollB.toFixed(2);

    document.getElementById('highestRollA').textContent = highestRollA;
    document.getElementById('highestRollB').textContent = highestRollB;

    document.getElementById('lowestRollA').textContent = lowestRollA;
    document.getElementById('lowestRollB').textContent = lowestRollB;
}

// Ensure this function is called after each roll in the simulation loop
function runSimulation() {
    const rollA = rollDice(parseInt(document.getElementById('diceCountA').value), 
                           parseInt(document.getElementById('diceFacesA').value),
                           parseInt(document.getElementById('modifierA').value));
    const rollB = rollDice(parseInt(document.getElementById('diceCountB').value), 
                           parseInt(document.getElementById('diceFacesB').value),
                           parseInt(document.getElementById('modifierB').value));
    updateStats(rollA, rollB);
    updateWinTieStats();
    updateTable(); // This call ensures the table is updated each time the simulation runs
}

// Function to update the graphs with the roll results

// Function to set the simulation speed based on the speed control slider
function setSimulationSpeed() {
    const speedControl = document.getElementById('speedControl');
    simulationSpeed = parseInt(speedControl.value, 10);
    if (isSimulationRunning) {
        clearInterval(simulationInterval);
        simulationInterval = setInterval(runSimulation, 1000 / simulationSpeed);
    }
}

// Add event listener to speed control slider
document.getElementById('speedControl').addEventListener('change', setSimulationSpeed);

// Adjust the startSimulation function to use the set speed
function startSimulation() {
    if (isSimulationRunning) return;
    isSimulationRunning = true;
    setSimulationSpeed(); // Set speed based on slider before starting
}

// Function to stop the simulation
function stopSimulation() {
    if (!isSimulationRunning) return;
    clearInterval(simulationInterval);
    isSimulationRunning = false;
}

// Function to reset the simulation and clear all data and visuals
function resetSimulation() {
    stopSimulation();
    resetGlobals();
    clearTableAndGraphs();
}

// Function to clear all table data and graphs from the UI
function clearTableAndGraphs() {
    document.querySelectorAll('#resultsTable td').forEach(td => td.textContent = '');
    // Placeholder for clearing graphs, to be implemented when graphs are added
}


// Utility functions as needed (e.g., formatting numbers, handling UI updates)

// Initialization function to set up the simulation defaults and event listeners
function initializeSimulation() {
    // Set initial values or states if needed
    resetGlobals(); // Resets all counters and stats
    clearTableAndGraphs(); // Clears any data displayed on the UI

    // Add event listeners to control buttons
    document.getElementById('startBtn').addEventListener('click', startSimulation);
    document.getElementById('stopBtn').addEventListener('click', stopSimulation);
    document.getElementById('resetBtn').addEventListener('click', resetSimulation);

    // Add event listeners for input validation
    document.getElementById('diceCountA').addEventListener('input', validateInput);
    document.getElementById('diceCountB').addEventListener('input', validateInput);
    document.getElementById('diceFacesA').addEventListener('input', validateInput);
    document.getElementById('diceFacesB').addEventListener('input', validateInput);
    document.getElementById('modifierA').addEventListener('input', validateInput);
    document.getElementById('modifierB').addEventListener('input', validateInput);

    // Set the default simulation speed from the speed control slider
    setSimulationSpeed();
    document.getElementById('speedControl').addEventListener('change', setSimulationSpeed);
}

// Ensure the initialization function runs when the document is fully loaded
document.addEventListener('DOMContentLoaded', initializeSimulation);

// Document ready function to bind event listeners when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', initializeSimulation);
