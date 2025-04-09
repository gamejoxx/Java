document.addEventListener('DOMContentLoaded', function() {
    console.log('JavaScript loaded!');
});

class YahtzeeGame {
    constructor() {
        this.rollButton = document.getElementById('rollButton');
        this.rollSpeed = document.getElementById('rollSpeed');
        this.speedValue = document.getElementById('speedValue');
        this.rollDuration = document.getElementById('rollDuration');
        this.durationValue = document.getElementById('durationValue');
        this.playerDice = document.getElementById('playerDice');
        this.aiDice = document.getElementById('aiDice');
        this.currentTurnDisplay = document.getElementById('currentTurn');
        this.turnCountDisplay = document.getElementById('turnCount');
        this.playerHands = document.getElementById('playerHands');
        this.aiHands = document.getElementById('aiHands');
        this.restartButton = document.getElementById('restartButton');
        
        this.isRolling = false;
        this.rollInterval = null;
        
        // Game state
        this.currentTurn = 'player'; // 'player' or 'ai'
        this.turnCount = 1;
        this.maxTurns = 13; // 13 hands to complete
        
        // Player scores
        this.playerScores = {
            ones: null, twos: null, threes: null, fours: null, fives: null, sixes: null,
            threeOfAKind: null, fourOfAKind: null, fullHouse: null, 
            smallStraight: null, largeStraight: null, yahtzee: null, chance: null
        };
        
        // AI scores
        this.aiScores = {
            ones: null, twos: null, threes: null, fours: null, fives: null, sixes: null,
            threeOfAKind: null, fourOfAKind: null, fullHouse: null, 
            smallStraight: null, largeStraight: null, yahtzee: null, chance: null
        };
        
        // Current dice values
        this.playerDiceValues = [0, 0, 0, 0, 0];
        this.aiDiceValues = [0, 0, 0, 0, 0];
        
        this.setupEventListeners();
        this.updateTurnDisplay();
    }
    
    setupEventListeners() {
        this.rollButton.addEventListener('click', () => this.startRolling());
        this.rollSpeed.addEventListener('input', () => {
            this.speedValue.textContent = `${this.rollSpeed.value}ms`;
            if (this.isRolling) {
                this.stopRolling();
                this.startRolling();
            }
        });
        this.rollDuration.addEventListener('input', () => {
            this.durationValue.textContent = `${this.rollDuration.value}ms`;
        });
        this.restartButton.addEventListener('click', () => this.restartGame());
    }
    
    getRandomDiceValue() {
        return Math.floor(Math.random() * 6) + 1;
    }
    
    updateDiceDisplay(diceContainer, values) {
        const diceBoxes = diceContainer.children;
        for (let i = 0; i < diceBoxes.length; i++) {
            diceBoxes[i].textContent = values[i];
            diceBoxes[i].classList.add('rolling');
        }
    }
    
    startRolling() {
        if (this.isRolling) return;
        
        this.isRolling = true;
        this.rollButton.disabled = true;
        
        // Determine which player is rolling
        const diceContainer = this.currentTurn === 'player' ? this.playerDice : this.aiDice;
        const diceValues = this.currentTurn === 'player' ? this.playerDiceValues : this.aiDiceValues;
        
        // Roll dice
        this.rollInterval = setInterval(() => {
            for (let i = 0; i < 5; i++) {
                diceValues[i] = this.getRandomDiceValue();
            }
            this.updateDiceDisplay(diceContainer, diceValues);
        }, parseInt(this.rollSpeed.value));
        
        // Stop rolling after the specified duration
        setTimeout(() => {
            this.stopRolling();
            this.evaluateHand();
        }, parseInt(this.rollDuration.value));
    }
    
    stopRolling() {
        if (!this.isRolling) return;
        
        clearInterval(this.rollInterval);
        this.isRolling = false;
        this.rollButton.disabled = false;
        
        // Remove rolling animation
        const allDiceBoxes = document.querySelectorAll('.dice-box');
        allDiceBoxes.forEach(box => box.classList.remove('rolling'));
    }
    
    evaluateHand() {
        // Find the next available hand for the current player
        const scores = this.currentTurn === 'player' ? this.playerScores : this.aiScores;
        const handsList = this.currentTurn === 'player' ? this.playerHands : this.aiHands;
        const diceValues = this.currentTurn === 'player' ? this.playerDiceValues : this.aiDiceValues;
        
        // Find the first hand that hasn't been scored yet
        let handToScore = null;
        for (const hand in scores) {
            if (scores[hand] === null) {
                handToScore = hand;
                break;
            }
        }
        
        if (handToScore) {
            // Calculate score for the hand
            const score = this.calculateScore(handToScore, diceValues);
            scores[handToScore] = score;
            
            // Update UI
            const handElement = handsList.querySelector(`[data-hand="${handToScore}"]`);
            handElement.classList.add('completed');
            handElement.textContent = `${this.formatHandName(handToScore)}: ${score}`;
            
            // Move to next turn
            this.nextTurn();
        }
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
            case 'twos':
                return counts[1] * 2;
            case 'threes':
                return counts[2] * 3;
            case 'fours':
                return counts[3] * 4;
            case 'fives':
                return counts[4] * 5;
            case 'sixes':
                return counts[5] * 6;
            case 'threeOfAKind':
                // Check if there are 3 or more of any value
                for (let i = 0; i < 6; i++) {
                    if (counts[i] >= 3) {
                        return diceValues.reduce((sum, val) => sum + val, 0);
                    }
                }
                return 0;
            case 'fourOfAKind':
                // Check if there are 4 or more of any value
                for (let i = 0; i < 6; i++) {
                    if (counts[i] >= 4) {
                        return diceValues.reduce((sum, val) => sum + val, 0);
                    }
                }
                return 0;
            case 'fullHouse':
                // Check for a full house (3 of one value, 2 of another)
                let hasThree = false;
                let hasTwo = false;
                for (let i = 0; i < 6; i++) {
                    if (counts[i] >= 3) hasThree = true;
                    if (counts[i] >= 2) hasTwo = true;
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
                if (sorted.join(',') === '1,2,3,4,5' || sorted.join(',') === '2,3,4,5,6') {
                    return 40;
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
            case 'chance':
                // Sum of all dice
                return diceValues.reduce((sum, val) => sum + val, 0);
            default:
                return 0;
        }
    }
    
    formatHandName(hand) {
        const handNames = {
            ones: 'Ones',
            twos: 'Twos',
            threes: 'Threes',
            fours: 'Fours',
            fives: 'Fives',
            sixes: 'Sixes',
            threeOfAKind: 'Three of a Kind',
            fourOfAKind: 'Four of a Kind',
            fullHouse: 'Full House',
            smallStraight: 'Small Straight',
            largeStraight: 'Large Straight',
            yahtzee: 'Yahtzee',
            chance: 'Chance'
        };
        return handNames[hand] || hand;
    }
    
    nextTurn() {
        // Switch turns
        this.currentTurn = this.currentTurn === 'player' ? 'ai' : 'player';
        
        // Increment turn count if both players have gone
        if (this.currentTurn === 'player') {
            this.turnCount++;
        }
        
        // Update UI
        this.updateTurnDisplay();
        
        // Check if game is over
        if (this.turnCount > this.maxTurns) {
            this.endGame();
        } else if (this.currentTurn === 'ai') {
            // Auto-roll for AI after a short delay
            setTimeout(() => this.startRolling(), 500);
        }
    }
    
    updateTurnDisplay() {
        this.currentTurnDisplay.textContent = `Current Turn: ${this.currentTurn === 'player' ? 'Player' : 'AI'}`;
        this.turnCountDisplay.textContent = `Turn: ${this.turnCount}/${this.maxTurns}`;
        
        // Highlight current hand
        const scores = this.currentTurn === 'player' ? this.playerScores : this.aiScores;
        const handsList = this.currentTurn === 'player' ? this.playerHands : this.aiHands;
        
        // Remove current class from all hands
        const allHands = handsList.querySelectorAll('.hand-item');
        allHands.forEach(hand => hand.classList.remove('current'));
        
        // Add current class to the next hand to be scored
        for (const hand in scores) {
            if (scores[hand] === null) {
                const handElement = handsList.querySelector(`[data-hand="${hand}"]`);
                handElement.classList.add('current');
                break;
            }
        }
    }
    
    endGame() {
        // Calculate final scores
        const playerTotal = Object.values(this.playerScores).reduce((sum, score) => sum + (score || 0), 0);
        const aiTotal = Object.values(this.aiScores).reduce((sum, score) => sum + (score || 0), 0);
        
        // Display game over message
        alert(`Game Over!\nPlayer: ${playerTotal}\nAI: ${aiTotal}\n${playerTotal > aiTotal ? 'Player Wins!' : playerTotal < aiTotal ? 'AI Wins!' : 'It\'s a Tie!'}`);
        
        // Show restart button
        this.restartButton.classList.remove('hidden');
    }
    
    restartGame() {
        // Reset game state
        this.currentTurn = 'player';
        this.turnCount = 1;
        
        // Reset scores
        for (const hand in this.playerScores) {
            this.playerScores[hand] = null;
        }
        for (const hand in this.aiScores) {
            this.aiScores[hand] = null;
        }
        
        // Reset dice values
        this.playerDiceValues = [0, 0, 0, 0, 0];
        this.aiDiceValues = [0, 0, 0, 0, 0];
        
        // Reset UI
        this.updateDiceDisplay(this.playerDice, this.playerDiceValues);
        this.updateDiceDisplay(this.aiDice, this.aiDiceValues);
        
        // Reset hands
        const playerHands = this.playerHands.querySelectorAll('.hand-item');
        const aiHands = this.aiHands.querySelectorAll('.hand-item');
        
        playerHands.forEach(hand => {
            hand.classList.remove('completed', 'current');
            hand.textContent = this.formatHandName(hand.dataset.hand);
        });
        
        aiHands.forEach(hand => {
            hand.classList.remove('completed', 'current');
            hand.textContent = this.formatHandName(hand.dataset.hand);
        });
        
        // Hide restart button
        this.restartButton.classList.add('hidden');
        
        // Update turn display
        this.updateTurnDisplay();
    }
}

// Initialize the game when the page loads
window.addEventListener('load', () => {
    new YahtzeeGame();
});
