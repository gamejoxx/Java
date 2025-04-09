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

        
        // Game state
        this.currentTurn = 'player1'; // 'player1' or 'player2' (both AI controlled)
        this.turnCount = 1;
        this.maxTurns = 6; // Shortened game with 6 hands to complete
        this.gameStarted = false;
        this.continuousMode = false;
        this.animationFrameId = null;
        
        // Stats tracking
        this.player1Wins = 0;
        this.player2Wins = 0;
        this.ties = 0;
        this.gamesPlayed = 0;
        
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
        
        // Player scores
        this.player1Scores = {
            ones: null, 
            threeOfAKind: null, 
            fullHouse: null, 
            smallStraight: null, 
            largeStraight: null, 
            yahtzee: null
        };
        
        // Player 2 scores
        this.player2Scores = {
            ones: null, 
            threeOfAKind: null, 
            fullHouse: null, 
            smallStraight: null, 
            largeStraight: null, 
            yahtzee: null
        };
        
        // Current dice values
        this.player1DiceValues = [0, 0, 0, 0, 0];
        this.player2DiceValues = [0, 0, 0, 0, 0];
    }
    
    init() {
        this.setupEventListeners();
        this.updateTurnDisplay();
        this.setupHandsDisplay();
        this.updateWinStats();
        this.updateSpeed();
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
        // New range: 0 (fast) = 1000 games/frame, 100 (slow) = 0.1 games/frame
        const speedPercent = this.currentSpeed / 100;
        const minBatch = 0.01;
        const maxBatch = 10000;
    
        const scaled = maxBatch - (speedPercent * (maxBatch - minBatch));
        this.batchSize = Math.max(minBatch, scaled);
    
        // Show decimal batch size in UI
        this.speedValue.textContent = `${this.batchSize.toFixed(1)} games/frame`;
    }
    
    
    resetStats() {
        this.player1Wins = 0;
        this.player2Wins = 0;
        this.ties = 0;
        this.gamesPlayed = 0;
        this.simulationRate = 0;
        this.gamesPlayedAtStart = 0;
        this.startTime = null;
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
        
            while (this.simulationProgress >= 1) {
                this.simulateOneCompleteGame();
                this.simulationProgress -= 1;
            }
        
            this.updateWinStats();
        
            this.animationFrameId = requestAnimationFrame(simulationStep);
        };
        this.animationFrameId = requestAnimationFrame(simulationStep)
    };        
    
    simulateOneCompleteGame() {
        // Reset for a new game
        this.resetGameState();
        
        // Simulate all turns until game is complete
        while (this.turnCount <= this.maxTurns) {
            this.simulateOneTurn();
        }
        
        // Calculate final scores
        const player1Total = Object.values(this.player1Scores).reduce((sum, score) => sum + (score || 0), 0);
        const player2Total = Object.values(this.player2Scores).reduce((sum, score) => sum + (score || 0), 0);
        
        // Update stats
        this.gamesPlayed++;
        if (player1Total > player2Total) {
            this.player1Wins++;
        } else if (player2Total > player1Total) {
            this.player2Wins++;
        } else {
            this.ties++;
        }
        
        // Update UI occasionally
        if (this.batchSize < 1 || this.gamesPlayed % 100 === 0) {
            const winner = player1Total > player2Total ? 'Player 1' : (player2Total > player1Total ? 'Player 2' : 'Tie');
            this.currentTurnDisplay.textContent = `Game ${this.gamesPlayed}: ${winner === 'Tie' ? "It's a tie!" : `${winner} wins!`}`;
            this.turnCountDisplay.textContent = `Player 1: ${player1Total} vs Player 2: ${player2Total}`;
            this.updateHandsDisplay();
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
    }
    
    simulateOneTurn() {
        // Get current player's data
        const scores = this.currentTurn === 'player1' ? this.player1Scores : this.player2Scores;
        const diceValues = this.currentTurn === 'player1' ? this.player1DiceValues : this.player2DiceValues;
        
        // Roll dice
        for (let i = 0; i < 5; i++) {
            diceValues[i] = this.getRandomDiceValue();
        }
        
        // Update display occasionally
        if (this.batchSize < 1 || this.gamesPlayed % 100 === 0) {
            this.updateDiceDisplay(
                this.currentTurn === 'player1' ? this.playerDice : this.aiDice,
                diceValues
            );
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
        }
        
        // Switch player and increment turn if needed
        this.currentTurn = this.currentTurn === 'player1' ? 'player2' : 'player1';
        if (this.currentTurn === 'player1') {
            this.turnCount++;
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
        
        this.restartButton.classList.add('hidden');
    }
}
