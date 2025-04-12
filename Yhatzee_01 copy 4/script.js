document.addEventListener('DOMContentLoaded', function() {
    const game = new SimpleYahtzeeGame();
    game.init();
});

class SimpleYahtzeeGame {
    constructor() {
        this.rollButton = document.getElementById('rollButton');
        this.stopButton = document.getElementById('stopButton');
        this.resetButton = document.getElementById('resetButton');
        this.playerDice = document.getElementById('playerDice');
        this.aiDice = document.getElementById('aiDice');
        this.currentTurnDisplay = document.getElementById('currentTurn');
        this.turnCountDisplay = document.getElementById('turnCount');
        this.playerHands = document.getElementById('playerHands');
        this.aiHands = document.getElementById('aiHands');
        this.restartButton = document.getElementById('restartButton');
        this.speedSlider = document.getElementById('speedSlider');
        this.speedValue = document.getElementById('speedValue');
        this.player1WinsDisplay = document.getElementById('player1Wins');
        this.player2WinsDisplay = document.getElementById('player2Wins');
        this.tiesDisplay = document.getElementById('ties');
        this.gamesPlayedDisplay = document.getElementById('gamesPlayed');
        this.simulationProgress = 0; // Accumulate fractional games
        this.gameLog = document.getElementById('gameLog');
        
        // Game state
        this.currentTurn = 'player1'; // 'player1' or 'player2' (both AI controlled)
        this.turnCount = 1;
        this.maxTurns = 6; // Shortened game with 6 hands to complete
        this.gameStarted = false;
        this.continuousMode = false;
        this.animationFrameId = null;
        this.currentGameLog = [];
        
        // Stats tracking
        this.player1Wins = 0;
        this.player2Wins = 0;
        this.ties = 0;
        this.gamesPlayed = 0;
        
        // Enhanced stats tracking
        this.player1Scores = {
            ones: null, 
            threeOfAKind: null, 
            fullHouse: null, 
            smallStraight: null, 
            largeStraight: null, 
            yahtzee: null
        };
        
        this.player2Scores = {
            ones: null, 
            threeOfAKind: null, 
            fullHouse: null, 
            smallStraight: null, 
            largeStraight: null, 
            yahtzee: null
        };
        
        // Advanced statistics
        this.player1ScoreHistory = [];
        this.player2ScoreHistory = [];
        this.player1TotalScores = [];
        this.player2TotalScores = [];
        this.player1WinRate = [];
        this.player2WinRate = [];
        this.gamesPlayedHistory = [];
        this.player1HandFrequency = {
            ones: 0,
            threeOfAKind: 0,
            fullHouse: 0,
            smallStraight: 0,
            largeStraight: 0,
            yahtzee: 0
        };
        this.player2HandFrequency = {
            ones: 0,
            threeOfAKind: 0,
            fullHouse: 0,
            smallStraight: 0,
            largeStraight: 0,
            yahtzee: 0
        };

        // Advanced stats displays
        this.avgScoreP1Display = document.getElementById('avgScoreP1');
        this.avgScoreP2Display = document.getElementById('avgScoreP2');
        this.highScoreP1Display = document.getElementById('highScoreP1');
        this.highScoreP2Display = document.getElementById('highScoreP2');
        this.yahtzeeRateP1Display = document.getElementById('yahtzeeRateP1');
        this.yahtzeeRateP2Display = document.getElementById('yahtzeeRateP2');
        this.commonHandP1Display = document.getElementById('commonHandP1');
        this.commonHandP2Display = document.getElementById('commonHandP2');
        
        // Speed control
        this.batchSize = 10; // Number of games to process per frame
        this.maxBatchSize = 500; // Maximum batch size for speed scaling
        this.currentSpeed = 0; // Default speed value (0-100)
        
        // Performance tracking
        this.startTime = null;
        this.simulationRate = 0;
        this.lastUpdateTime = 0;
        this.updateInterval = 100; // Update UI stats every 100ms
        this.gamesPlayedAtStart = 0; 
        
        // Current dice values
        this.player1DiceValues = [0, 0, 0, 0, 0];
        this.player2DiceValues = [0, 0, 0, 0, 0];
        
        // Charts
        this.scoreProgressChart = null;
        this.winRateChart = null;
    }
    
    init() {
        this.setupEventListeners();
        this.updateTurnDisplay();
        this.setupHandsDisplay();
        this.updateWinStats();
        this.updateSpeed();
        this.initializeCharts();
    }
    
    initializeCharts() {
        // Score Progress Chart
        const scoreCtx = document.getElementById('scoreProgressChart').getContext('2d');
        this.scoreProgressChart = new Chart(scoreCtx, {
            type: 'line',
            data: {
                labels: [], // Will be filled with game numbers
                datasets: [
                    {
                        label: 'Player 1',
                        data: [],
                        borderColor: '#42a5f5',
                        backgroundColor: 'rgba(66, 165, 245, 0.2)',
                        tension: 0.1
                    },
                    {
                        label: 'Player 2',
                        data: [],
                        borderColor: '#f44336',
                        backgroundColor: 'rgba(244, 67, 54, 0.2)',
                        tension: 0.1
                    }
                ]
            },
            options: {
                responsive: true,
                animation: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Total Score'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Game Number'
                        }
                    }
                }
            }
        });
        
        // Win Rate Chart
        const winRateCtx = document.getElementById('winRateChart').getContext('2d');
        this.winRateChart = new Chart(winRateCtx, {
            type: 'line',
            data: {
                labels: [], // Will be filled with game numbers
                datasets: [
                    {
                        label: 'Player 1 Win Rate',
                        data: [],
                        borderColor: '#42a5f5',
                        backgroundColor: 'rgba(66, 165, 245, 0.2)',
                        tension: 0.1
                    },
                    {
                        label: 'Player 2 Win Rate',
                        data: [],
                        borderColor: '#f44336',
                        backgroundColor: 'rgba(244, 67, 54, 0.2)',
                        tension: 0.1
                    },
                    {
                        label: 'Tie Rate',
                        data: [],
                        borderColor: '#ffca28',
                        backgroundColor: 'rgba(255, 202, 40, 0.2)',
                        tension: 0.1,
                        borderDash: [5, 5]
                    }
                ]
            },
            options: {
                responsive: true,
                animation: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        title: {
                            display: true,
                            text: 'Win Rate (%)'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Game Number'
                        }
                    }
                }
            }
        });
    }
    
    setupEventListeners() {
        this.rollButton.addEventListener('click', () => {
            this.continuousMode = true;
            this.rollButton.disabled = true;
            this.stopButton.classList.remove('hidden');
            this.gameStarted = true;
            
            // Only reset the start time if this is a fresh start, not a resume
            if (this.startTime === null) {
                this.startTime = Date.now();
                this.gamesPlayedAtStart = this.gamesPlayed;
            } else {
                // If resuming, adjust start time and games count
                this.gamesPlayedAtStart = this.gamesPlayed;
                this.startTime = Date.now();
            }
            
            // Start the simulation loop using requestAnimationFrame
            this.startSimulationLoop();
        });
        
        this.stopButton.addEventListener('click', () => {
            this.continuousMode = false;
            this.stopButton.classList.add('hidden');
            this.rollButton.disabled = false;
            
            // Cancel the animation frame to stop the loop
            if (this.animationFrameId) {
                cancelAnimationFrame(this.animationFrameId);
                this.animationFrameId = null;
            }
        });
        
        this.resetButton.addEventListener('click', () => {
            // Stop any running simulation
            if (this.continuousMode) {
                this.continuousMode = false;
                if (this.animationFrameId) {
                    cancelAnimationFrame(this.animationFrameId);
                    this.animationFrameId = null;
                }
            }
            
            // Reset everything
            this.resetStats();
            this.restartGame(false);
            
            // Reset UI
            this.stopButton.classList.add('hidden');
            this.rollButton.disabled = false;
            document.getElementById('simulationRate').textContent = '0 games/sec';
        });
        
        this.restartButton.addEventListener('click', () => {
            this.resetStats();
            this.restartGame(false);
        });
        
        this.speedSlider.addEventListener('input', () => {
            this.currentSpeed = parseInt(this.speedSlider.value);
            this.updateSpeed();
            
            // Reset simulation rate calculation when slider changes during simulation
            if (this.continuousMode) {
                this.startTime = Date.now();
                this.gamesPlayedAtStart = this.gamesPlayed;
                document.getElementById('simulationRate').textContent = '0 games/sec';
            }
        });
    }
    
    updateSpeed() {
        // New range: 0 (fast) = 1000 games/frame, 100 (slow) = 0.01 games/frame
        const speedPercent = this.currentSpeed / 100;
        const minBatch = 0.01; // Allow very slow simulation (0.01 games per frame)
        const maxBatch = 1000;
    
        // Use an exponential scale to provide better control at the slow end
        if (speedPercent <= 0.5) {
            // Fast half: Linear from maxBatch to 1
            const normalizedSpeed = speedPercent * 2; // 0-0.5 -> 0-1
            this.batchSize = maxBatch - normalizedSpeed * (maxBatch - 1);
        } else {
            // Slow half: Exponential from 1 to minBatch
            const normalizedSpeed = (speedPercent - 0.5) * 2; // 0.5-1 -> 0-1
            this.batchSize = 1 - (normalizedSpeed * (1 - minBatch));
        }
    
        // Show decimal batch size in UI
        this.speedValue.textContent = `${this.batchSize.toFixed(2)} games/frame`;
    }
    
    
    resetStats() {
        this.player1Wins = 0;
        this.player2Wins = 0;
        this.ties = 0;
        this.gamesPlayed = 0;
        this.simulationRate = 0;
        this.gamesPlayedAtStart = 0;
        this.startTime = null;
        
        // Reset advanced statistics
        this.player1ScoreHistory = [];
        this.player2ScoreHistory = [];
        this.player1TotalScores = [];
        this.player2TotalScores = [];
        this.player1WinRate = [];
        this.player2WinRate = [];
        this.gamesPlayedHistory = [];
        
        // Reset hand frequency counters
        for (const key in this.player1HandFrequency) {
            this.player1HandFrequency[key] = 0;
            this.player2HandFrequency[key] = 0;
        }
        
        // Clear the game log
        this.gameLog.innerHTML = '';
        this.currentGameLog = [];
        
        // Reset charts
        if (this.scoreProgressChart) {
            this.scoreProgressChart.data.labels = [];
            this.scoreProgressChart.data.datasets.forEach(dataset => {
                dataset.data = [];
            });
            this.scoreProgressChart.update();
        }
        
        if (this.winRateChart) {
            this.winRateChart.data.labels = [];
            this.winRateChart.data.datasets.forEach(dataset => {
                dataset.data = [];
            });
            this.winRateChart.update();
        }
        
        // Reset advanced stat displays
        this.avgScoreP1Display.textContent = '0';
        this.avgScoreP2Display.textContent = '0';
        this.highScoreP1Display.textContent = '0';
        this.highScoreP2Display.textContent = '0';
        this.yahtzeeRateP1Display.textContent = '0%';
        this.yahtzeeRateP2Display.textContent = '0%';
        this.commonHandP1Display.textContent = '-';
        this.commonHandP2Display.textContent = '-';
        
        this.updateWinStats();
    }
    
    updateWinStats() {
        // Only update UI periodically to avoid performance issues
        const now = Date.now();
        if (now - this.lastUpdateTime > this.updateInterval || !this.continuousMode) {
            this.player1WinsDisplay.textContent = this.player1Wins;
            this.player2WinsDisplay.textContent = this.player2Wins;
            this.tiesDisplay.textContent = this.ties;
            this.gamesPlayedDisplay.textContent = this.gamesPlayed;
            
            // Calculate simulation rate (games per second)
            if (this.startTime && this.gamesPlayed > this.gamesPlayedAtStart) {
                const elapsedSeconds = (now - this.startTime) / 1000;
                if (elapsedSeconds > 0) {
                    this.simulationRate = (this.gamesPlayed - this.gamesPlayedAtStart) / elapsedSeconds;
                    document.getElementById('simulationRate').textContent = 
                        Math.round(this.simulationRate) + ' games/sec';
                }
            }
            
            this.lastUpdateTime = now;
        }
    }
    
    setupHandsDisplay() {
        // Remove any hand categories we're not using
        const allHandItems = document.querySelectorAll('.hand-item');
        allHandItems.forEach(item => {
            const hand = item.getAttribute('data-hand');
            if (!this.player1Scores.hasOwnProperty(hand)) {
                item.style.display = 'none';
            }
        });
    }
    
    getRandomDiceValue() {
        return Math.floor(Math.random() * 6) + 1;
    }
    
    updateDiceDisplay(diceContainer, values) {
        // Only update visuals occasionally to save performance
        if (this.gamesPlayed % 100 === 0 || !this.continuousMode) {
            const diceBoxes = diceContainer.children;
            for (let i = 0; i < diceBoxes.length; i++) {
                diceBoxes[i].textContent = values[i];
            }
        }
    }
    
    startSimulationLoop() {
        // Use requestAnimationFrame for better performance
        const simulationStep = () => {
            if (!this.continuousMode) {
                return;
            }
        
            this.simulationProgress += this.batchSize;
        
            if (this.simulationProgress >= 1) {
                // Complete a full game when accumulated enough progress
                this.simulateOneCompleteGame();
                this.simulationProgress -= 1;
                
                // Update charts occasionally to avoid performance issues
                if (this.gamesPlayed % 10 === 0) {
                    this.updateCharts();
                }
            } else if (this.batchSize < 1) {
                // For slow-motion games, advance the simulation step by step
                this.simulatePartialGame();
            }
        
            this.updateWinStats();
        
            this.animationFrameId = requestAnimationFrame(simulationStep);
        };
        
        this.animationFrameId = requestAnimationFrame(simulationStep);
    }
    
    simulatePartialGame() {
        // If we're in a new game, reset the game state
        if (this.turnCount > this.maxTurns) {
            this.calculateGameResult();
            this.resetGameState();
            this.currentGameLog = [];
            this.addToGameLog("Starting new game...");
        }
        
        // Simulate just one turn
        this.simulateOneTurn();
        
        // If game is complete after this turn, calculate the result
        if (this.turnCount > this.maxTurns) {
            this.calculateGameResult();
        }
    }
    
    calculateGameResult() {
        // Calculate final scores
        const player1Total = Object.values(this.player1Scores).reduce((sum, score) => sum + (score || 0), 0);
        const player2Total = Object.values(this.player2Scores).reduce((sum, score) => sum + (score || 0), 0);
        
        // Update stats
        this.gamesPlayed++;
        this.gamesPlayedHistory.push(this.gamesPlayed);
        
        // Track scores
        this.player1TotalScores.push(player1Total);
        this.player2TotalScores.push(player2Total);
        
        // Determine winner
        let winner;
        if (player1Total > player2Total) {
            this.player1Wins++;
            winner = 'Player 1';
        } else if (player2Total > player1Total) {
            this.player2Wins++;
            winner = 'Player 2';
        } else {
            this.ties++;
            winner = 'Tie';
        }
        
        // Calculate win rates
        const p1WinRate = (this.player1Wins / this.gamesPlayed) * 100;
        const p2WinRate = (this.player2Wins / this.gamesPlayed) * 100;
        const tieRate = (this.ties / this.gamesPlayed) * 100;
        
        this.player1WinRate.push(p1WinRate);
        this.player2WinRate.push(p2WinRate);
        
        // Log the result
        this.addToGameLog(`Game ${this.gamesPlayed} result: ${winner} wins! (${player1Total}-${player2Total})`, 'log-result');
        
        // Update UI
        this.currentTurnDisplay.textContent = `Game ${this.gamesPlayed}: ${winner === 'Tie' ? "It's a tie!" : `${winner} wins!`}`;
        this.turnCountDisplay.textContent = `Player 1: ${player1Total} vs Player 2: ${player2Total}`;
        this.updateHandsDisplay();
        this.updateAdvancedStats();
    }
    
    addToGameLog(message, className = '') {
        // Add message to the current game log
        this.currentGameLog.push(message);
        
        // Keep game log reasonably sized
        if (this.currentGameLog.length > 100) {
            this.currentGameLog.shift();
        }
        
        // Update the display when in slow mode or first few games
        if (this.batchSize < 1 || this.gamesPlayed < 10) {
            const entry = document.createElement('div');
            entry.classList.add('log-entry');
            if (className) {
                entry.classList.add(className);
            }
            entry.textContent = message;
            
            this.gameLog.appendChild(entry);
            
            // Trim log if it gets too long
            while (this.gameLog.children.length > 30) {
                this.gameLog.removeChild(this.gameLog.firstChild);
            }
            
            // Auto-scroll to bottom
            this.gameLog.scrollTop = this.gameLog.scrollHeight;
        }
    }
    
    simulateOneCompleteGame() {
        // Reset for a new game
        this.resetGameState();
        this.currentGameLog = [];
        
        // Simulate all turns until game is complete
        while (this.turnCount <= this.maxTurns) {
            this.simulateOneTurn();
        }
        
        // Calculate game result at the end
        this.calculateGameResult();
    }
    
    simulateOneTurn() {
        // Get current player's data
        const scores = this.currentTurn === 'player1' ? this.player1Scores : this.player2Scores;
        const diceValues = this.currentTurn === 'player1' ? this.player1DiceValues : this.player2DiceValues;
        const playerName = this.currentTurn === 'player1' ? 'Player 1' : 'Player 2';
        const logClass = this.currentTurn === 'player1' ? 'log-player1' : 'log-player2';
        
        // Roll dice
        for (let i = 0; i < 5; i++) {
            diceValues[i] = this.getRandomDiceValue();
        }
        
        // Update dice display when in slow mode or occasionally
        if (this.batchSize < 1 || this.gamesPlayed % 100 === 0) {
            this.updateDiceDisplay(
                this.currentTurn === 'player1' ? this.playerDice : this.aiDice,
                diceValues
            );
        }
        
        // Log the dice roll
        if (this.batchSize < 1) {
            this.addToGameLog(`${playerName} rolled: [${diceValues.join(', ')}]`, logClass);
        }
        
        // Choose best hand
        const availableHands = [];
        for (const hand in scores) {
            if (scores[hand] === null) {
                const score = this.calculateScore(hand, diceValues);
                availableHands.push({ hand, score });
            }
        }
        
        // Sort by score and select best option
        availableHands.sort((a, b) => b.score - a.score);
        
        if (availableHands.length > 0) {
            const chosenHand = availableHands[0].hand;
            const score = this.calculateScore(chosenHand, diceValues);
            scores[chosenHand] = score;
            
            // Add to hand frequency counter
            if (this.currentTurn === 'player1') {
                this.player1HandFrequency[chosenHand]++;
            } else {
                this.player2HandFrequency[chosenHand]++;
            }
            
            // Log the hand choice
            if (this.batchSize < 1) {
                this.addToGameLog(`${playerName} chose ${this.formatHandName(chosenHand)} for ${score} points`, logClass);
                
                // Highlight the selected hand in the UI
                this.highlightSelectedHand(chosenHand);
            }
        }
        
        // Switch player and increment turn if needed
        this.currentTurn = this.currentTurn === 'player1' ? 'player2' : 'player1';
        if (this.currentTurn === 'player1') {
            this.turnCount++;
            
            // Update turn display when in slow mode
            if (this.batchSize < 1) {
                this.updateTurnDisplay();
            }
        }
    }
    
    highlightSelectedHand(handName) {
        // Only highlight in slow mode
        if (this.batchSize >= 1) return;
        
        const container = this.currentTurn === 'player1' ? this.playerHands : this.aiHands;
        const handElement = container.querySelector(`[data-hand="${handName}"]`);
        
        if (handElement) {
            // Add highlight class
            handElement.classList.add('highlight');
            
            // Remove highlight after animation completes
            setTimeout(() => {
                handElement.classList.remove('highlight');
            }, 1000);
        }
    }
    
    updateHandsDisplay() {
        // Update hands display for both players
        const updateHands = (scores, container) => {
            for (const hand in scores) {
                const score = scores[hand];
                if (score !== null) {
                    const handElement = container.querySelector(`[data-hand="${hand}"]`);
                    if (handElement) {
                        handElement.classList.add('completed');
                        handElement.textContent = `${this.formatHandName(hand)}: ${score}`;
                    }
                }
            }
        };
        
        // Clear previous state
        const allHandElements = document.querySelectorAll('.hand-item');
        allHandElements.forEach(el => {
            const hand = el.getAttribute('data-hand');
            if (this.player1Scores.hasOwnProperty(hand)) {
                el.classList.remove('completed');
                el.textContent = this.formatHandName(hand);
            }
        });
        
        // Update with current state
        updateHands(this.player1Scores, this.playerHands);
        updateHands(this.player2Scores, this.aiHands);
    }
    
    calculateScore(hand, diceValues) {
        // Count occurrences of each value
        const counts = [0, 0, 0, 0, 0, 0];
        for (const value of diceValues) {
            counts[value - 1]++;
        }
        
        // Calculate score based on hand type
        switch (hand) {
            case 'ones':
                return counts[0] * 1;
            case 'threeOfAKind':
                // Check if there are 3 or more of any value
                for (let i = 0; i < 6; i++) {
                    if (counts[i] >= 3) {
                        return diceValues.reduce((sum, val) => sum + val, 0);
                    }
                }
                return 0;
            case 'fullHouse':
                // Check for a full house (3 of one value, 2 of another)
                let hasThree = false;
                let hasTwo = false;
                for (let i = 0; i < 6; i++) {
                    if (counts[i] === 3) hasThree = true;
                    else if (counts[i] === 2) hasTwo = true;
                }
                return (hasThree && hasTwo) ? 25 : 0;
            case 'smallStraight':
                // Check for a small straight (1-2-3-4 or 2-3-4-5 or 3-4-5-6)
                const sortedValues = [...diceValues].sort((a, b) => a - b);
                const uniqueValues = [...new Set(sortedValues)];
                
                if (uniqueValues.length >= 4) {
                    // Check for 1-2-3-4
                    if (uniqueValues.includes(1) && uniqueValues.includes(2) && 
                        uniqueValues.includes(3) && uniqueValues.includes(4)) {
                        return 30;
                    }
                    // Check for 2-3-4-5
                    if (uniqueValues.includes(2) && uniqueValues.includes(3) && 
                        uniqueValues.includes(4) && uniqueValues.includes(5)) {
                        return 30;
                    }
                    // Check for 3-4-5-6
                    if (uniqueValues.includes(3) && uniqueValues.includes(4) && 
                        uniqueValues.includes(5) && uniqueValues.includes(6)) {
                        return 30;
                    }
                }
                return 0;
            case 'largeStraight':
                // Check for a large straight (1-2-3-4-5 or 2-3-4-5-6)
                const sorted = [...diceValues].sort((a, b) => a - b);
                const uniqueSorted = [...new Set(sorted)];
                if (uniqueSorted.length === 5) {
                    if (uniqueSorted[0] === 1 && uniqueSorted[4] === 5) return 40;
                    if (uniqueSorted[0] === 2 && uniqueSorted[4] === 6) return 40;
                }
                return 0;
            case 'yahtzee':
                // Check if all dice are the same
                for (let i = 0; i < 6; i++) {
                    if (counts[i] === 5) {
                        return 50;
                    }
                }
                return 0;
            default:
                return 0;
        }
    }
    
    formatHandName(hand) {
        const handNames = {
            ones: 'Ones',
            threeOfAKind: 'Three of a Kind',
            fullHouse: 'Full House',
            smallStraight: 'Small Straight',
            largeStraight: 'Large Straight',
            yahtzee: 'Yahtzee'
        };
        return handNames[hand] || hand;
    }
    
    updateTurnDisplay() {
        this.currentTurnDisplay.textContent = `Current Turn: ${this.currentTurn === 'player1' ? 'Player 1' : 'Player 2'}`;
        this.turnCountDisplay.textContent = `Turn: ${this.turnCount}/${this.maxTurns}`;
    }
    
    restartGame(keepStats = false) {
        // Stop any running simulation
        if (this.continuousMode) {
            this.continuousMode = false;
            if (this.animationFrameId) {
                cancelAnimationFrame(this.animationFrameId);
                this.animationFrameId = null;
            }
        }
        
        // Reset game state
        this.resetGameState();
        
        // If not keeping stats, clear them
        if (!keepStats) {
            this.resetStats();
        }
        
        // Reset UI
        this.updateTurnDisplay();
        this.updateHandsDisplay();
        
        // Reset dice display
        const allDiceBoxes = document.querySelectorAll('.dice-box');
        allDiceBoxes.forEach(box => {
            box.textContent = '-';
        });
        
        // Update buttons
        this.restartButton.classList.add('hidden');
        this.rollButton.disabled = false;
        this.stopButton.classList.add('hidden');
        
        // Clear simulation rate display
        document.getElementById('simulationRate').textContent = '0 games/sec';
        
        // Reset the game log
        this.gameLog.innerHTML = '';
        this.addToGameLog("Game ready to start. Press 'Start Simulation' to begin.");
    }
    
    updateAdvancedStats() {
        // Only update occasionally to avoid performance issues
        if (this.gamesPlayed % 10 !== 0 && this.gamesPlayed > 10) return;
        
        // Calculate average scores
        const avgScoreP1 = this.player1TotalScores.length > 0
            ? this.player1TotalScores.reduce((sum, score) => sum + score, 0) / this.player1TotalScores.length
            : 0;
            
        const avgScoreP2 = this.player2TotalScores.length > 0
            ? this.player2TotalScores.reduce((sum, score) => sum + score, 0) / this.player2TotalScores.length
            : 0;
            
        // Find highest scores
        const highScoreP1 = this.player1TotalScores.length > 0
            ? Math.max(...this.player1TotalScores)
            : 0;
            
        const highScoreP2 = this.player2TotalScores.length > 0
            ? Math.max(...this.player2TotalScores)
            : 0;
            
        // Calculate Yahtzee rates
        const yahtzeeRateP1 = this.gamesPlayed > 0
            ? (this.player1HandFrequency.yahtzee / this.gamesPlayed) * 100
            : 0;
            
        const yahtzeeRateP2 = this.gamesPlayed > 0
            ? (this.player2HandFrequency.yahtzee / this.gamesPlayed) * 100
            : 0;
            
        // Find most common hands
        const mostCommonHandP1 = Object.entries(this.player1HandFrequency)
            .sort((a, b) => b[1] - a[1])[0];
            
        const mostCommonHandP2 = Object.entries(this.player2HandFrequency)
            .sort((a, b) => b[1] - a[1])[0];
            
        // Update display
        this.avgScoreP1Display.textContent = avgScoreP1.toFixed(1);
        this.avgScoreP2Display.textContent = avgScoreP2.toFixed(1);
        this.highScoreP1Display.textContent = highScoreP1;
        this.highScoreP2Display.textContent = highScoreP2;
        this.yahtzeeRateP1Display.textContent = `${yahtzeeRateP1.toFixed(1)}%`;
        this.yahtzeeRateP2Display.textContent = `${yahtzeeRateP2.toFixed(1)}%`;
        
        // Only update common hand if we have data
        if (mostCommonHandP1 && mostCommonHandP1[1] > 0) {
            this.commonHandP1Display.textContent = `${this.formatHandName(mostCommonHandP1[0])}`;
        }
        
        if (mostCommonHandP2 && mostCommonHandP2[1] > 0) {
            this.commonHandP2Display.textContent = `${this.formatHandName(mostCommonHandP2[0])}`;
        }
    }
    
    updateCharts() {
        // Update score progress chart
        if (this.scoreProgressChart) {
            // Keep chart data manageable - limit to last 100 games
            const maxDataPoints = 100;
            const startIdx = Math.max(0, this.gamesPlayedHistory.length - maxDataPoints);
            
            this.scoreProgressChart.data.labels = this.gamesPlayedHistory.slice(startIdx);
            this.scoreProgressChart.data.datasets[0].data = this.player1TotalScores.slice(startIdx);
            this.scoreProgressChart.data.datasets[1].data = this.player2TotalScores.slice(startIdx);
            this.scoreProgressChart.update();
        }
        
        // Update win rate chart
        if (this.winRateChart) {
            // Keep chart data manageable - limit to last 100 games
            const maxDataPoints = 100;
            const startIdx = Math.max(0, this.gamesPlayedHistory.length - maxDataPoints);
            
            this.winRateChart.data.labels = this.gamesPlayedHistory.slice(startIdx);
            this.winRateChart.data.datasets[0].data = this.player1WinRate.slice(startIdx);
            this.winRateChart.data.datasets[1].data = this.player2WinRate.slice(startIdx);
            
            // Add tie rate data
            const tieRateData = this.gamesPlayedHistory.slice(startIdx).map((_, idx) => {
                const actualIdx = startIdx + idx;
                const totalGames = actualIdx + 1; // Game count starts at 1
                return (this.ties / totalGames) * 100;
            });
            
            this.winRateChart.data.datasets[2].data = tieRateData;
            this.winRateChart.update();
        }
    }
    
    resetGameState() {
        // Reset scores for a new game
        for (const key in this.player1Scores) {
            this.player1Scores[key] = null;
        }
        for (const key in this.player2Scores) {
            this.player2Scores[key] = null;
        }
        
        // Reset turn counter and player
        this.currentTurn = 'player1';
        this.turnCount = 1;
        
        // Clear the UI display
        if (this.batchSize < 1) {
            this.updateHandsDisplay();
            this.updateTurnDisplay();
            
            // Reset dice display
            const allDiceBoxes = document.querySelectorAll('.dice-box');
            allDiceBoxes.forEach(box => {
                box.textContent = '-';
            });
        }
    }
}
