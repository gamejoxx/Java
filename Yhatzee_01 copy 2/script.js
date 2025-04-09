document.addEventListener('DOMContentLoaded', function() {
    const game = new SimpleYahtzeeGame();
    game.init();
});

class SimpleYahtzeeGame {
    constructor() {
        this.rollButton = document.getElementById('rollButton');
        this.stopButton = document.getElementById('stopButton');
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
        
        // Game state
        this.currentTurn = 'player1'; // 'player1' or 'player2' (both AI controlled)
        this.turnCount = 1;
        this.maxTurns = 6; // Shortened game with 6 hands to complete
        this.gameStarted = false;
        this.continuousMode = false;
        
        // Stats tracking
        this.player1Wins = 0;
        this.player2Wins = 0;
        this.ties = 0;
        this.gamesPlayed = 0;
        
        // Speed control
        this.baseDelay = 1500; // Base delay in ms
        this.minDelay = 5; // Minimum delay for ultra-fast simulations
        this.currentSpeed = 50; // Default speed value (0-100)
        
        // Player scores
        this.player1Scores = {
            ones: null, 
            threeOfAKind: null, 
            fullHouse: null, 
            smallStraight: null, 
            largeStraight: null, 
            yahtzee: null
        };
        
        // AI scores
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
            this.startAutoPlay();
        });
        
        this.stopButton.addEventListener('click', () => {
            this.continuousMode = false;
            this.stopButton.classList.add('hidden');
            this.rollButton.disabled = false;
        });
        
        this.restartButton.addEventListener('click', () => {
            this.resetStats();
            this.restartGame();
        });
        
        this.speedSlider.addEventListener('input', () => {
            this.currentSpeed = parseInt(this.speedSlider.value);
            this.updateSpeed();
        });
    }
    
    updateSpeed() {
        // Calculate actual delay based on slider
        // 0 = minimum delay, 100 = maximum delay (half of base)
        const speedPercent = this.currentSpeed / 100;
        this.autoPlayDelay = this.minDelay + speedPercent * (this.baseDelay / 2 - this.minDelay);
        
        // Show ms value
        this.speedValue.textContent = `${Math.round(this.autoPlayDelay)}ms`;
        
        // Update animations based on speed
        document.documentElement.style.setProperty('--animation-speed', `${Math.max(0.1, speedPercent * 0.5)}s`);
    }
    
    resetStats() {
        this.player1Wins = 0;
        this.player2Wins = 0;
        this.ties = 0;
        this.gamesPlayed = 0;
        this.updateWinStats();
    }
    
    updateWinStats() {
        this.player1WinsDisplay.textContent = this.player1Wins;
        this.player2WinsDisplay.textContent = this.player2Wins;
        this.tiesDisplay.textContent = this.ties;
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
        // Skip visual updates in ultra-fast mode
        if (this.currentSpeed < 5 && this.gamesPlayed > 0) {
            return;
        }
        
        const diceBoxes = diceContainer.children;
        for (let i = 0; i < diceBoxes.length; i++) {
            diceBoxes[i].textContent = values[i];
            diceBoxes[i].classList.add('rolling');
        }
        
        // Remove rolling class after animation
        if (this.currentSpeed >= 5) {
            setTimeout(() => {
                for (let i = 0; i < diceBoxes.length; i++) {
                    diceBoxes[i].classList.remove('rolling');
                }
            }, Math.min(500, this.autoPlayDelay));
        }
    }
    
    startAutoPlay() {
        this.playTurn();
    }
    
    playTurn() {
        if (!this.continuousMode && this.gamesPlayed > 0) {
            return;
        }
        
        // Determine which player is rolling
        const diceContainer = this.currentTurn === 'player1' ? this.playerDice : this.aiDice;
        const diceValues = this.currentTurn === 'player1' ? this.player1DiceValues : this.player2DiceValues;
        
        // Roll dice
        for (let i = 0; i < 5; i++) {
            diceValues[i] = this.getRandomDiceValue();
        }
        
        this.updateDiceDisplay(diceContainer, diceValues);
        
        // Wait a moment, then select the best hand
        setTimeout(() => {
            this.chooseHand();
        }, this.autoPlayDelay);
    }
    
    chooseHand() {
        // Find the best hand for current player
        const scores = this.currentTurn === 'player1' ? this.player1Scores : this.player2Scores;
        const diceValues = this.currentTurn === 'player1' ? this.player1DiceValues : this.player2DiceValues;
        
        const availableHands = [];
        for (const hand in scores) {
            if (scores[hand] === null) {
                const score = this.calculateScore(hand, diceValues);
                availableHands.push({ hand, score });
            }
        }
        
        // Sort by score (highest first)
        availableHands.sort((a, b) => b.score - a.score);
        
        // Choose the hand with the highest score
        if (availableHands.length > 0) {
            this.scoreHand(availableHands[0].hand);
        }
    }
    
    scoreHand(hand) {
        const scores = this.currentTurn === 'player1' ? this.player1Scores : this.player2Scores;
        const handsList = this.currentTurn === 'player1' ? this.playerHands : this.aiHands;
        const diceValues = this.currentTurn === 'player1' ? this.player1DiceValues : this.player2DiceValues;
        
        // Calculate score
        const score = this.calculateScore(hand, diceValues);
        scores[hand] = score;
        
        // Update UI (only if not in ultra-fast mode)
        if (this.currentSpeed >= 5 || this.gamesPlayed === 0) {
            const handElement = handsList.querySelector(`[data-hand="${hand}"]`);
            handElement.classList.add('completed');
            handElement.textContent = `${this.formatHandName(hand)}: ${score}`;
        }
        
        // Move to next turn
        this.nextTurn();
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
    
    nextTurn() {
        // Switch player
        this.currentTurn = this.currentTurn === 'player1' ? 'player2' : 'player1';
        
        // Check if we completed a full round (both players took a turn)
        if (this.currentTurn === 'player1') {
            this.turnCount++;
        }
        
        // Check if game is over
        if (this.turnCount > this.maxTurns) {
            this.endGame();
            return;
        }
        
        this.updateTurnDisplay();
        
        // Continue auto-play after a delay
        setTimeout(() => {
            this.playTurn();
        }, this.autoPlayDelay);
    }
    
    updateTurnDisplay() {
        // Skip visual updates in ultra-fast mode after first game
        if (this.currentSpeed < 5 && this.gamesPlayed > 0) {
            return;
        }
        
        this.currentTurnDisplay.textContent = `Current Turn: ${this.currentTurn === 'player1' ? 'Player 1' : 'Player 2'}`;
        this.turnCountDisplay.textContent = `Turn: ${this.turnCount}/${this.maxTurns}`;
        
        // Highlight current player
        const playerSections = document.querySelectorAll('.player-section');
        playerSections.forEach((section, index) => {
            if ((index === 0 && this.currentTurn === 'player1') || 
                (index === 1 && this.currentTurn === 'player2')) {
                section.classList.add('current-player');
            } else {
                section.classList.remove('current-player');
            }
        });
    }
    
    endGame() {
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
        this.updateWinStats();
        
        // Display winner (only if not in ultra-fast mode or it's the first game)
        if (this.currentSpeed >= 5 || this.gamesPlayed === 1) {
            const winner = player1Total > player2Total ? 'Player 1' : (player2Total > player1Total ? 'Player 2' : 'Tie');
            this.currentTurnDisplay.textContent = `Game ${this.gamesPlayed}: ${winner === 'Tie' ? "It's a tie!" : `${winner} wins!`}`;
            this.turnCountDisplay.textContent = `Player 1: ${player1Total} vs Player 2: ${player2Total}`;
        }
        
        // In continuous mode, restart the game
        if (this.continuousMode) {
            setTimeout(() => {
                this.restartGame(true);
            }, this.autoPlayDelay);
        } else {
            // Show restart button
            this.restartButton.classList.remove('hidden');
        }
    }
    
    restartGame(keepStats = false) {
        // Reset scores
        for (const key in this.player1Scores) {
            this.player1Scores[key] = null;
        }
        for (const key in this.player2Scores) {
            this.player2Scores[key] = null;
        }
        
        // Reset hands display (only if not in ultra-fast mode or it's the first restart)
        if (this.currentSpeed >= 5 || this.gamesPlayed <= 1) {
            const allHandItems = document.querySelectorAll('.hand-item');
            allHandItems.forEach(item => {
                const hand = item.getAttribute('data-hand');
                if (this.player1Scores.hasOwnProperty(hand)) {
                    item.classList.remove('completed');
                    item.textContent = this.formatHandName(hand);
                }
            });
            
            // Reset dice
            const allDiceBoxes = document.querySelectorAll('.dice-box');
            allDiceBoxes.forEach(box => {
                box.textContent = '-';
                box.classList.remove('rolling');
            });
        }
        
        // Reset game state
        this.currentTurn = 'player1';
        this.turnCount = 1;
        
        // Update UI
        this.updateTurnDisplay();
        this.restartButton.classList.add('hidden');
        
        // If we're in continuous mode, continue playing
        if (this.continuousMode) {
            this.startAutoPlay();
        }
    }
}
