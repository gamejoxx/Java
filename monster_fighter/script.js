let interval; // Declare interval at the top of the script
let fightInterval; // For individual fight animation control
let autoFightActive = false; // Track if auto-fight is active

// Hero progression state
let heroXP = 0;
let heroGold = 0;
let heroLevel = 1;
let heroDeaths = 0;
let gameOver = false;

// Loot bonus system - Hero
let heroBonusAC = 0;
let heroBonusHP = 0;
let heroBonusDamage = 0;

// Loot bonus system - Monster
let monsterBonusAC = 0;
let monsterBonusHP = 0;
let monsterBonusDamage = 0;

// High scores array
let highScores = [];
const MAX_HIGH_SCORES = 5;

// Load high scores from localStorage when page loads
document.addEventListener('DOMContentLoaded', function() {
    loadHighScores();
    updateHighScoreTable();
    createBonusButtons();
});

// Function to create bonus buttons for hero and monster
function createBonusButtons() {
    // Create container for hero bonus buttons
    const heroBonusContainer = document.createElement('div');
    heroBonusContainer.className = 'bonus-buttons';
    
    // Create hero bonus buttons
    const heroACButton = document.createElement('button');
    heroACButton.id = 'hero-bonus-ac';
    heroACButton.className = 'bonus-button';
    heroACButton.disabled = true;
    heroACButton.textContent = 'AC +0';
    
    const heroHPButton = document.createElement('button');
    heroHPButton.id = 'hero-bonus-hp';
    heroHPButton.className = 'bonus-button';
    heroHPButton.disabled = true;
    heroHPButton.textContent = 'HP +0';
    
    const heroDamageButton = document.createElement('button');
    heroDamageButton.id = 'hero-bonus-damage';
    heroDamageButton.className = 'bonus-button';
    heroDamageButton.disabled = true;
    heroDamageButton.textContent = 'DAM +0';
    
    // Add hero buttons to container
    heroBonusContainer.appendChild(heroACButton);
    heroBonusContainer.appendChild(heroHPButton);
    heroBonusContainer.appendChild(heroDamageButton);
    
    // Add hero bonus container to hero panel
    document.querySelector('.hero').appendChild(heroBonusContainer);
    
    // Create container for monster bonus buttons
    const monsterBonusContainer = document.createElement('div');
    monsterBonusContainer.className = 'bonus-buttons';
    
    // Create monster bonus buttons
    const monsterACButton = document.createElement('button');
    monsterACButton.id = 'monster-bonus-ac';
    monsterACButton.className = 'bonus-button';
    monsterACButton.disabled = true;
    monsterACButton.textContent = 'AC +0';
    
    const monsterHPButton = document.createElement('button');
    monsterHPButton.id = 'monster-bonus-hp';
    monsterHPButton.className = 'bonus-button';
    monsterHPButton.disabled = true;
    monsterHPButton.textContent = 'HP +0';
    
    const monsterDamageButton = document.createElement('button');
    monsterDamageButton.id = 'monster-bonus-damage';
    monsterDamageButton.className = 'bonus-button';
    monsterDamageButton.disabled = true;
    monsterDamageButton.textContent = 'DAM +0';
    
    // Add monster buttons to container
    monsterBonusContainer.appendChild(monsterACButton);
    monsterBonusContainer.appendChild(monsterHPButton);
    monsterBonusContainer.appendChild(monsterDamageButton);
    
    // Add monster bonus container to monster panel
    document.querySelector('.monster').appendChild(monsterBonusContainer);
}

// Function to update bonus button displays
function updateBonusButtons() {
    // Update hero bonus buttons
    document.getElementById('hero-bonus-ac').textContent = `AC +${heroBonusAC}`;
    document.getElementById('hero-bonus-hp').textContent = `HP +${heroBonusHP}`;
    document.getElementById('hero-bonus-damage').textContent = `DAM +${heroBonusDamage}`;
    
    // Update monster bonus buttons
    document.getElementById('monster-bonus-ac').textContent = `AC +${monsterBonusAC}`;
    document.getElementById('monster-bonus-hp').textContent = `HP +${monsterBonusHP}`;
    document.getElementById('monster-bonus-damage').textContent = `DAM +${monsterBonusDamage}`;
}

// Function to roll a random bonus for hero and monster
function rollBonuses() {
    const bonusTypes = ['ac', 'hp', 'damage'];
    
    // Roll for hero
    const heroBonusType = bonusTypes[Math.floor(Math.random() * bonusTypes.length)];
    switch(heroBonusType) {
        case 'ac':
            heroBonusAC += 1;
            appendToConsole(`Hero gains +1 AC bonus!\n`, 'yellow');
            break;
        case 'hp':
            heroBonusHP += 1;
            appendToConsole(`Hero gains +1 HP per level bonus!\n`, 'yellow');
            break;
        case 'damage':
            heroBonusDamage += 1;
            appendToConsole(`Hero gains +1 damage bonus!\n`, 'yellow');
            break;
    }
    
    // Roll for monster
    const monsterBonusType = bonusTypes[Math.floor(Math.random() * bonusTypes.length)];
    switch(monsterBonusType) {
        case 'ac':
            monsterBonusAC += 1;
            appendToConsole(`Monster gains +1 AC bonus!\n`, 'red');
            break;
        case 'hp':
            monsterBonusHP += 1;
            appendToConsole(`Monster gains +1 HP per level bonus!\n`, 'red');
            break;
        case 'damage':
            monsterBonusDamage += 1;
            appendToConsole(`Monster gains +1 damage bonus!\n`, 'red');
            break;
    }
    
    // Update bonus button displays
    updateBonusButtons();
}

// Function to load high scores from localStorage
function loadHighScores() {
    const storedScores = localStorage.getItem('monsterFighterHighScores');
    if (storedScores) {
        highScores = JSON.parse(storedScores);
    } else {
        highScores = [];
    }
}

// Function to save high scores to localStorage
function saveHighScores() {
    localStorage.setItem('monsterFighterHighScores', JSON.stringify(highScores));
}

// Function to update the high score table in the DOM
function updateHighScoreTable() {
    const tableBody = document.getElementById('high-score-body');
    tableBody.innerHTML = '';

    highScores.forEach((score, index) => {
        const row = document.createElement('tr');
        
        const rankCell = document.createElement('td');
        rankCell.textContent = index + 1;
        row.appendChild(rankCell);
        
        const nameCell = document.createElement('td');
        nameCell.textContent = score.name;
        row.appendChild(nameCell);
        
        const levelCell = document.createElement('td');
        levelCell.textContent = score.level;
        row.appendChild(levelCell);
        
        const goldCell = document.createElement('td');
        goldCell.textContent = score.gold;
        row.appendChild(goldCell);
        
        tableBody.appendChild(row);
    });

    // Fill empty rows if less than 10 scores
    for (let i = highScores.length; i < MAX_HIGH_SCORES; i++) {
        const emptyRow = document.createElement('tr');
        for (let j = 0; j < 4; j++) {
            const emptyCell = document.createElement('td');
            emptyCell.textContent = j === 0 ? i + 1 : '---';
            emptyRow.appendChild(emptyCell);
        }
        tableBody.appendChild(emptyRow);
    }
}

// Function to check if the current hero's score qualifies for the high score list
function checkHighScore() {
    const heroName = document.getElementById('hero-name').value;
    
    // Create a new score object
    const newScore = {
        name: heroName,
        level: heroLevel,
        gold: heroGold
    };
    
    // Check if this score should be added to high scores
    let shouldAdd = false;
    
    // If we have less than MAX_HIGH_SCORES, add it
    if (highScores.length < MAX_HIGH_SCORES) {
        shouldAdd = true;
    } else {
        // Check if this score is higher than the lowest score
        // Sort by level first, then by gold
        const lowestScore = [...highScores].sort((a, b) => {
            if (a.level !== b.level) {
                return a.level - b.level;
            }
            return a.gold - b.gold;
        })[0];
        
        if (newScore.level > lowestScore.level || 
            (newScore.level === lowestScore.level && newScore.gold > lowestScore.gold)) {
            shouldAdd = true;
            // Remove lowest score
            highScores = highScores.filter(score => 
                score !== lowestScore
            );
        }
    }
    
    if (shouldAdd) {
        highScores.push(newScore);
        // Sort high scores by level (descending), then by gold (descending)
        highScores.sort((a, b) => {
            if (b.level !== a.level) {
                return b.level - a.level;
            }
            return b.gold - a.gold;
        });
        
        // Keep only the top MAX_HIGH_SCORES
        highScores = highScores.slice(0, MAX_HIGH_SCORES);
        
        saveHighScores();
        updateHighScoreTable();
        
        appendToConsole(`NEW HIGH SCORE! Level ${heroLevel} with ${heroGold} gold!\n`, 'yellow');
    }
}

// Add event listener for "Clear Scores" button
document.getElementById('clear-scores').addEventListener('click', function() {
    highScores = [];
    saveHighScores();
    updateHighScoreTable();
    appendToConsole('High scores cleared!\n', 'yellow');
});

// RESET functionality
document.getElementById('reset-button').addEventListener('click', function() {
    // Clear all intervals
    clearInterval(interval);
    clearInterval(fightInterval);
    
    // Reset all game state
    heroXP = 0;
    heroGold = 0;
    heroLevel = 1;
    heroDeaths = 0;
    gameOver = false;
    totalFights = 0;
    heroWins = 0;
    monsterWins = 0;
    autoFightActive = false;
    
    // Reset bonus values
    heroBonusAC = 0;
    heroBonusHP = 0;
    heroBonusDamage = 0;
    monsterBonusAC = 0;
    monsterBonusHP = 0;
    monsterBonusDamage = 0;
    updateBonusButtons();
    
    // Clear game over message if present
    const gameOverMsg = document.querySelector('.game-over');
    if (gameOverMsg) {
        gameOverMsg.remove();
    }
    
    // Clear console
    clearConsole();
    appendToConsole("Game reset! Roll a new hero to begin.\n", 'yellow');
    
    // Update UI
    updateScoreboard();
    updateHeroProgressionDisplay();
    
    // Roll new hero and monster
    document.getElementById('roll-hero').click();
    document.getElementById('roll-monster').click();
});

document.getElementById('roll-hero').addEventListener('click', function() {
    // Clear any game over messages
    const gameOverMsg = document.querySelector('.game-over');
    if (gameOverMsg) {
        gameOverMsg.remove();
    }
    
    // Reset progression for both manual rerolls and game overs
    if (!gameOver) {
        // For manual rerolls, reset XP, gold and deaths but keep level
        heroXP = 0;
        heroGold = 0;
        heroDeaths = 0;
    } else {
        // For game over, also reset level and bonuses
        heroXP = 0;
        heroGold = 0;
        heroLevel = 1;
        heroDeaths = 0;
        heroBonusAC = 0;
        heroBonusHP = 0;
        heroBonusDamage = 0;
        monsterBonusAC = 0;
        monsterBonusHP = 0;
        monsterBonusDamage = 0;
        updateBonusButtons();
        gameOver = false;
    }
    
    const heroNames = ["Aldor", "Brin", "Caelum", "Dorin", "Elora"];
    const heroTypes = ["Fighter", "Barbarian", "Thief", "Ranger", "Paladin"];
    const hero = {
        name: `${heroNames[Math.floor(Math.random() * heroNames.length)]} ${Math.floor(100 + Math.random() * 900)}`,    
        type: heroTypes[Math.floor(Math.random() * heroTypes.length)],
        stats: rollStats(),
        level: heroLevel,
    };
    
    // Use the configurable HP per level value plus bonus HP
    const heroHpPerLevel = parseFloat(document.getElementById('hero-hp-per-level').value);
    hero.hp = hero.level * heroHpPerLevel + Math.floor(Math.random() * 8) + 1 + (heroBonusHP * hero.level);
    
    // Use hero-specific AC per level from settings plus bonus AC
    const heroAcPerLevel = parseFloat(document.getElementById('hero-ac-per-level').value);
    hero.ac = 10 + Math.floor(hero.level * heroAcPerLevel) + heroBonusAC;

    document.getElementById('hero-name').value = hero.name;
    document.getElementById('hero-type').value = hero.type;
    document.getElementById('hero-stats').textContent = `Stats: Str ${hero.stats.strength}, Dex ${hero.stats.dexterity}, Con ${hero.stats.constitution}, Int ${hero.stats.intelligence}, Wis ${hero.stats.wisdom}, Cha ${hero.stats.charisma}`;
    document.getElementById('hero-level-value').textContent = hero.level;
    document.getElementById('hero-hp').textContent = `HP: ${hero.hp}`;
    document.getElementById('hero-ac').textContent = `AC: ${hero.ac}`;
    
    updateHeroProgressionDisplay();
});

document.getElementById('roll-monster').addEventListener('click', function() {
    rollMonster();
});

function rollMonster() {
    const monsterNames = ["Goblin", "Orc", "Troll", "Kobold", "Gnoll"];
    const monsterScaling = parseFloat(document.getElementById('monster-level-scaling').value);
    const scaledLevel = Math.max(1, Math.floor(heroLevel * monsterScaling));
    
    const monster = {
        name: monsterNames[Math.floor(Math.random() * monsterNames.length)],
        type: "Monster",
        stats: rollStats(),
        level: scaledLevel,
    };
    
    // Use the configurable HP per level value plus bonus HP
    const monsterHpPerLevel = parseFloat(document.getElementById('monster-hp-per-level').value);
    monster.hp = monster.level * monsterHpPerLevel + Math.floor(Math.random() * 8) + 1 + (monsterBonusHP * monster.level);
    
    // Use monster-specific AC per level from settings plus bonus AC
    const monsterAcPerLevel = parseFloat(document.getElementById('monster-ac-per-level').value);
    monster.ac = 10 + Math.floor(monster.level * monsterAcPerLevel) + monsterBonusAC;

    document.getElementById('monster-name').value = monster.name;
    document.getElementById('monster-type').value = monster.type;
    document.getElementById('monster-stats').textContent = `Stats: Str ${monster.stats.strength}, Dex ${monster.stats.dexterity}, Con ${monster.stats.constitution}, Int ${monster.stats.intelligence}, Wis ${monster.stats.wisdom}, Cha ${monster.stats.charisma}`;
    document.getElementById('monster-level-input').value = monster.level;
    document.getElementById('monster-hp').textContent = `HP: ${monster.hp}`;
    document.getElementById('monster-ac').textContent = `AC: ${monster.ac}`;
}

function rollStats() {
    return {
        strength: Math.floor(Math.random() * 16) + 3,
        dexterity: Math.floor(Math.random() * 16) + 3,
        constitution: Math.floor(Math.random() * 16) + 3,
        intelligence: Math.floor(Math.random() * 16) + 3,
        wisdom: Math.floor(Math.random() * 16) + 3,
        charisma: Math.floor(Math.random() * 16) + 3
    };
}

document.getElementById('fight-button').addEventListener('click', function() {
    if (gameOver) {
        appendToConsole("Game over! Please roll a new hero to start again.\n", 'red');
        return;
    }
    
    // Stop auto-fight if it's running
    clearInterval(interval);
    autoFightActive = false;
    
    // Start single fight
    startSingleFight();
});

function startSingleFight() {
    const heroName = document.getElementById('hero-name').value;
    const monsterName = document.getElementById('monster-name').value;
    let heroHp = parseInt(document.getElementById('hero-hp').textContent.split(": ")[1]);
    let monsterHp = parseInt(document.getElementById('monster-hp').textContent.split(": ")[1]);
    const heroAc = parseInt(document.getElementById('hero-ac').textContent.split(": ")[1]);
    const monsterAc = parseInt(document.getElementById('monster-ac').textContent.split(": ")[1]);
    
    // Get fight speed from settings
    const fightSpeed = parseInt(document.getElementById('fight-speed').value);

    // Roll for initiative
    const heroInit = rollDice(20);
    const monsterInit = rollDice(20);
    clearConsole();
    appendToConsole(`Rolling for initiative...\n`, 'white');
    appendToConsole(`${heroName} rolls ${heroInit}, ${monsterName} rolls ${monsterInit}\n`, 'white');

    let attackerName, defenderName, attackerAc, defenderHp, defenderAc;
    if (heroInit >= monsterInit) {
        attackerName = heroName;
        defenderName = monsterName;
        attackerAc = heroAc;
        defenderHp = monsterHp;
        defenderAc = monsterAc;
    } else {
        attackerName = monsterName;
        defenderName = heroName;
        attackerAc = monsterAc;
        defenderHp = heroHp;
        defenderAc = heroAc;
    }
    appendToConsole(`${attackerName} attacks first!\n`, 'white');

    fightInterval = setInterval(() => {
        // Get entity-specific hit bonus per level from settings
        const isAttackerHero = attackerName === heroName;
        const hitBonusPerLevel = isAttackerHero ? 
            parseFloat(document.getElementById('hero-hit-bonus-per-level').value) : 
            parseFloat(document.getElementById('monster-hit-bonus-per-level').value);
        
        // Calculate attack bonus based on level
        const attackerLevel = isAttackerHero ? 
            heroLevel : 
            parseInt(document.getElementById('monster-level-input').value);
        const hitBonus = Math.floor(attackerLevel * hitBonusPerLevel);
        
        // Roll attack with bonus
        const diceRoll = rollDice(20);
        const attackRoll = diceRoll + hitBonus;

        if (attackRoll >= defenderAc) {
            // Get configurable damage scaling values
            const heroDamagePerLevel = parseFloat(document.getElementById('hero-damage-per-level').value);
            const monsterDamagePerLevel = parseFloat(document.getElementById('monster-damage-per-level').value);
            
            // Damage calculation with configurable level scaling and bonus damage
            const damage = isAttackerHero ? 
                rollDice(6) + Math.floor(heroLevel * heroDamagePerLevel) + heroBonusDamage : // Hero damage scales with level + bonus
                rollDice(6) + Math.floor(parseInt(document.getElementById('monster-level-input').value) * monsterDamagePerLevel) + monsterBonusDamage; // Monster damage + bonus
            
            defenderHp -= damage;
            appendToConsole(`${attackerName} swings at ${defenderName} and HITS (Roll: ${diceRoll} +${hitBonus} vs AC ${defenderAc}) for `, 'green');
            appendToConsole(`${damage} damage.\n`, 'red');
            if (defenderHp <= 0) {
                appendToConsole(`${attackerName} defeats ${defenderName}!\n`, 'white');
                clearInterval(fightInterval);
                
                // Handle hero victory or death
                if (isAttackerHero) {
                    // Hero wins
                    handleHeroVictory();
                    
                    // If auto-fight is active and not game over, continue fighting
                    if (autoFightActive && !gameOver) {
                        const autoFightDelay = parseInt(document.getElementById('auto-fight-delay').value);
                        setTimeout(() => {
                            if (autoFightActive && !gameOver) {
                                startSingleFight();
                            }
                        }, autoFightDelay);
                    }
                } else {
                    // Monster wins
                    handleHeroDefeat();
                    
                    // If auto-fight is active and not game over, continue fighting
                    if (autoFightActive && !gameOver) {
                        const autoFightDelay = parseInt(document.getElementById('auto-fight-delay').value);
                        setTimeout(() => {
                            if (autoFightActive && !gameOver) {
                                startSingleFight();
                            }
                        }, autoFightDelay);
                    }
                }
            } else {
                appendToConsole(`${defenderName} now has ${defenderHp} HP left.\n`, 'white');
            }
        } else {
            appendToConsole(`${attackerName} swings at ${defenderName} and MISSES (Roll: ${diceRoll} +${hitBonus} vs AC ${defenderAc}).\n`, 'green');
        }
        [attackerName, defenderName] = [defenderName, attackerName];
        [attackerAc, defenderAc] = [defenderAc, attackerAc];
        [defenderHp, heroHp, monsterHp] = [heroHp, defenderHp, heroHp];
    }, fightSpeed);
}

function rollDice(sides) {
    return Math.floor(Math.random() * sides) + 1;
}

function appendToConsole(message, color) {
    const consoleDiv = document.getElementById('fight-console');
    const span = document.createElement('span');
    span.style.color = color;
    span.innerHTML = message.replace(/\n/g, '<br>');
    consoleDiv.appendChild(span);
    consoleDiv.scrollTop = consoleDiv.scrollHeight;  // Auto-scroll to the bottom of the console
}

function clearConsole() {
    const consoleDiv = document.getElementById('fight-console');
    consoleDiv.innerHTML = '';
}

document.getElementById('auto-fight-button').addEventListener('click', function() {
    if (gameOver) {
        appendToConsole("Game over! Please roll a new hero to start again.\n", 'red');
        return;
    }
    
    // Set auto-fight flag
    autoFightActive = true;
    
    // Start the first fight
    startSingleFight();
});

let totalFights = 0;
let heroWins = 0;
let monsterWins = 0;

function updateScoreboard() {
    document.getElementById('total-fights').textContent = totalFights;
    document.getElementById('hero-wins').textContent = heroWins;
    document.getElementById('monster-wins').textContent = monsterWins;
}

function updateHeroProgressionDisplay() {
    document.getElementById('hero-xp').textContent = `XP: ${heroXP}`;
    document.getElementById('hero-gold').textContent = `Gold: ${heroGold}`;
    document.getElementById('hero-deaths').textContent = `Deaths: ${heroDeaths}`;
    document.getElementById('hero-level-value').textContent = heroLevel;
}

function handleHeroVictory() {
    totalFights++;
    heroWins++;
    
    // Get XP and gold values from settings
    const xpGain = parseInt(document.getElementById('xp-per-kill').value);
    const goldGain = parseInt(document.getElementById('gold-per-kill').value);
    
    // Award XP and gold
    heroXP += xpGain;
    heroGold += goldGain;
    
    // Check for level up
    const xpThreshold = parseInt(document.getElementById('xp-to-level').value);
    if (heroXP >= xpThreshold * heroLevel) {
        heroLevel++;
        appendToConsole(`LEVEL UP! Hero is now level ${heroLevel}!\n`, 'yellow');
        
        // Roll bonuses on level up
        rollBonuses();
        
        // Update hero HP and level with configurable HP per level value
        const heroHpPerLevel = parseFloat(document.getElementById('hero-hp-per-level').value);
        const heroHp = heroLevel * heroHpPerLevel + Math.floor(Math.random() * 8) + 1 + (heroBonusHP * heroLevel);
        
        // Update AC with hero-specific AC per level from settings
        const heroAcPerLevel = parseFloat(document.getElementById('hero-ac-per-level').value);
        const heroAc = 10 + Math.floor(heroLevel * heroAcPerLevel) + heroBonusAC;
        
        document.getElementById('hero-hp').textContent = `HP: ${heroHp}`;
        document.getElementById('hero-level-value').textContent = heroLevel;
        document.getElementById('hero-ac').textContent = `AC: ${heroAc}`;
    }
    
    appendToConsole(`Hero gained ${xpGain} XP and ${goldGain} gold!\n`, 'yellow');
    updateScoreboard();
    updateHeroProgressionDisplay();
    
    // Auto-roll a new monster with appropriate scaling
    rollMonster();
}

function handleHeroDefeat() {
    totalFights++;
    monsterWins++;
    heroDeaths++;
    
    // Get penalty values from settings
    const xpLossPercent = parseInt(document.getElementById('xp-loss-percent').value);
    const goldLossPercent = parseInt(document.getElementById('gold-loss-percent').value);
    
    // Calculate losses
    const xpLoss = Math.floor(heroXP * (xpLossPercent / 100));
    const goldLoss = Math.floor(heroGold * (goldLossPercent / 100));
    
    // Apply losses
    heroXP = Math.max(0, heroXP - xpLoss);
    heroGold = Math.max(0, heroGold - goldLoss);
    
    appendToConsole(`Hero lost ${xpLoss} XP and ${goldLoss} gold in defeat!\n`, 'red');
    
    // Check for game over
    const maxDeaths = parseInt(document.getElementById('max-deaths').value);
    if (heroDeaths >= maxDeaths) {
        gameOver = true;
        autoFightActive = false; // Stop auto-fighting
        appendToConsole(`GAME OVER! Hero has died ${heroDeaths} times. Roll a new hero to start again.\n`, 'red');
        
        // Check if this run qualifies for the high score table
        checkHighScore();
        
        // Create a game over message in the UI
        const gameOverMsg = document.createElement('div');
        gameOverMsg.className = 'game-over';
        gameOverMsg.textContent = 'GAME OVER';
        document.querySelector('.fight-controls').appendChild(gameOverMsg);
        
        // Stop any ongoing fight
        clearInterval(fightInterval);
    } else {
        // Instead of rolling a new hero, just regenerate HP for the same hero
        const heroHpPerLevel = parseFloat(document.getElementById('hero-hp-per-level').value);
        const heroHp = heroLevel * heroHpPerLevel + Math.floor(Math.random() * 8) + 1 + (heroBonusHP * heroLevel);
        document.getElementById('hero-hp').textContent = `HP: ${heroHp}`;
        appendToConsole(`Hero has recovered with ${heroHp} HP!\n`, 'green');
        
        // Auto-roll a new monster
        rollMonster();
    }
    
    updateScoreboard();
    updateHeroProgressionDisplay();
}

// Get the "STOP" button element by its ID
const stopButton = document.getElementById('stop-button');

// Add an event listener to the "STOP" button
stopButton.addEventListener('click', () => {
    // Stop all intervals and reset auto-fight flag
    clearInterval(interval);
    clearInterval(fightInterval);
    autoFightActive = false;
    appendToConsole("Auto-fight stopped.\n", 'yellow');
});

// Initialize progression display on page load
updateHeroProgressionDisplay();