let interval; // Declare interval at the top of the script
let fightInterval; // For individual fight animation control
let autoFightActive = false; // Track if auto-fight is active

// Hero progression state
let heroXP = 0;
let heroGold = 0;
let heroLevel = 1;
let heroDeaths = 0;
let gameOver = false;

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
        // For game over, also reset level
        heroXP = 0;
        heroGold = 0;
        heroLevel = 1;
        heroDeaths = 0;
        gameOver = false;
    }
    
    const heroNames = ["Aldor", "Brin", "Caelum", "Dorin", "Elora"];
    const heroTypes = ["Fighter", "Barbarian", "Thief", "Ranger", "Paladin"];
    const hero = {
        name: heroNames[Math.floor(Math.random() * heroNames.length)],
        type: heroTypes[Math.floor(Math.random() * heroTypes.length)],
        stats: rollStats(),
        level: heroLevel,
    };
    
    // Use the configurable HP per level value
    const heroHpPerLevel = parseFloat(document.getElementById('hero-hp-per-level').value);
    hero.hp = hero.level * heroHpPerLevel + Math.floor(Math.random() * 8) + 1;
    hero.ac = 10 + Math.floor(hero.stats.dexterity / 2); // Simplified AC calculation

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
    
    // Use the configurable HP per level value
    const monsterHpPerLevel = parseFloat(document.getElementById('monster-hp-per-level').value);
    monster.hp = monster.level * monsterHpPerLevel + Math.floor(Math.random() * 8) + 1;
    monster.ac = 10 + Math.floor(monster.stats.dexterity / 2); // Simplified AC calculation

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
        const attackRoll = rollDice(20) + (attackerName === heroName ? Math.floor(heroLevel / 3) : 0);
        const neededToHit = defenderAc;

        if (attackRoll >= defenderAc) {
            // Get configurable damage scaling values
            const heroDamagePerLevel = parseFloat(document.getElementById('hero-damage-per-level').value);
            const monsterDamagePerLevel = parseFloat(document.getElementById('monster-damage-per-level').value);
            
            // Damage calculation with configurable level scaling
            const damage = attackerName === heroName ? 
                rollDice(6) + Math.floor(heroLevel * heroDamagePerLevel) : // Hero damage scales with level
                rollDice(6) + Math.floor(parseInt(document.getElementById('monster-level-input').value) * monsterDamagePerLevel); // Monster damage
            
            defenderHp -= damage;
            appendToConsole(`${attackerName} swings at ${defenderName} and HITS (${attackRoll}/${defenderAc}) for `, 'green');
            appendToConsole(`${damage} damage.\n`, 'red');
            if (defenderHp <= 0) {
                appendToConsole(`${attackerName} defeats ${defenderName}!\n`, 'white');
                clearInterval(fightInterval);
                
                // Handle hero victory or death
                if (attackerName === heroName) {
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
            appendToConsole(`${attackerName} swings at ${defenderName} and MISSES (${attackRoll}/${defenderAc}).\n`, 'green');
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
        
        // Update hero HP and level with configurable HP per level value
        const heroHpPerLevel = parseFloat(document.getElementById('hero-hp-per-level').value);
        const heroHp = heroLevel * heroHpPerLevel + Math.floor(Math.random() * 8) + 1;
        document.getElementById('hero-hp').textContent = `HP: ${heroHp}`;
        document.getElementById('hero-level-value').textContent = heroLevel;
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
        const heroHp = heroLevel * heroHpPerLevel + Math.floor(Math.random() * 8) + 1;
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
