let interval; // Declare interval at the top of the script


document.getElementById('roll-hero').addEventListener('click', function() {
    const heroNames = ["Aldor", "Brin", "Caelum", "Dorin", "Elora"];
    const heroTypes = ["Fighter", "Barbarian", "Thief", "Ranger", "Paladin"];
    const hero = {
        name: heroNames[Math.floor(Math.random() * heroNames.length)],
        type: heroTypes[Math.floor(Math.random() * heroTypes.length)],
        stats: rollStats(),
        level: randomLevel(),
    };
    hero.hp = hero.level + Math.floor(Math.random() * 8) + 1; // Level + 1d8
    hero.ac = 10 + Math.floor(hero.stats.dexterity / 2); // Simplified AC calculation

    document.getElementById('hero-name').value = hero.name;
    document.getElementById('hero-type').value = hero.type;
    document.getElementById('hero-stats').textContent = `Stats: Str ${hero.stats.strength}, Dex ${hero.stats.dexterity}, Con ${hero.stats.constitution}, Int ${hero.stats.intelligence}, Wis ${hero.stats.wisdom}, Cha ${hero.stats.charisma}`;
    document.getElementById('hero-level').textContent = `Lvl: ${hero.level}`;
    document.getElementById('hero-hp').textContent = `HP: ${hero.hp}`;
    document.getElementById('hero-ac').textContent = `AC: ${hero.ac}`;
});

document.getElementById('roll-monster').addEventListener('click', function() {
    const monsterNames = ["Goblin", "Orc", "Troll", "Kobold", "Gnoll"];
    const monster = {
        name: monsterNames[Math.floor(Math.random() * monsterNames.length)],
        type: "Monster",
        stats: rollStats(),
        level: randomLevel(),
    };
    monster.hp = monster.level + Math.floor(Math.random() * 8) + 1; // Level + 1d8
    monster.ac = 10 + Math.floor(monster.stats.dexterity / 2); // Simplified AC calculation

    document.getElementById('monster-name').value = monster.name;
    document.getElementById('monster-type').value = monster.type;
    document.getElementById('monster-stats').textContent = `Stats: Str ${monster.stats.strength}, Dex ${monster.stats.dexterity}, Con ${monster.stats.constitution}, Int ${monster.stats.intelligence}, Wis ${monster.stats.wisdom}, Cha ${monster.stats.charisma}`;
    document.getElementById('monster-level').textContent = `Lvl: ${monster.level}`;
    document.getElementById('monster-hp').textContent = `HP: ${monster.hp}`;
    document.getElementById('monster-ac').textContent = `AC: ${monster.ac}`;
});

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

function randomLevel() {
    return Math.floor(Math.random() * 3) + 3; // Random level between 3 and 5
}

document.getElementById('fight-button').addEventListener('click', function() {
    const heroName = document.getElementById('hero-name').value;
    const monsterName = document.getElementById('monster-name').value;
    let heroHp = parseInt(document.getElementById('hero-hp').textContent.split(": ")[1]);
    let monsterHp = parseInt(document.getElementById('monster-hp').textContent.split(": ")[1]);
    const heroAc = parseInt(document.getElementById('hero-ac').textContent.split(": ")[1]);
    const monsterAc = parseInt(document.getElementById('monster-ac').textContent.split(": ")[1]);

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

    const fightInterval = setInterval(() => {
        const attackRoll = rollDice(20);
        const neededToHit = defenderAc - 2;  // Assuming a basic attack bonus of +2

        if (attackRoll + 2 >= defenderAc) {
            const damage = rollDice(6);
            defenderHp -= damage;
            appendToConsole(`${attackerName} swings at ${defenderName} and HITS (${attackRoll + 2}/${defenderAc}) for `, 'green');
            appendToConsole(`${damage} damage.\n`, 'red');
            if (defenderHp <= 0) {
                appendToConsole(`${attackerName} defeats ${defenderName}!\n`, 'white');
                clearInterval(fightInterval);
            } else {
                appendToConsole(`${defenderName} now has ${defenderHp} HP left.\n`, 'white');
            }
        } else {
            appendToConsole(`${attackerName} swings at ${defenderName} and MISSES (${attackRoll + 2}/${defenderAc}).\n`, 'green');
        }
        [attackerName, defenderName] = [defenderName, attackerName];
        [attackerAc, defenderAc] = [defenderAc, attackerAc];
        [defenderHp, heroHp, monsterHp] = [heroHp, defenderHp, heroHp];
    }, 500);
});

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
    autoFight();
});

let totalFights = 0;
let heroWins = 0;
let monsterWins = 0;

function updateScoreboard() {
    document.getElementById('total-fights').textContent = totalFights;
    document.getElementById('hero-wins').textContent = heroWins;
    document.getElementById('monster-wins').textContent = monsterWins;
}

function fight() {
    const heroName = document.getElementById('hero-name').value;
    const monsterName = document.getElementById('monster-name').value;
    let heroHp = parseInt(document.getElementById('hero-hp').textContent.split(": ")[1]);
    let monsterHp = parseInt(document.getElementById('monster-hp').textContent.split(": ")[1]);
    const heroAc = parseInt(document.getElementById('hero-ac').textContent.split(": ")[1]);
    const monsterAc = parseInt(document.getElementById('monster-ac').textContent.split(": ")[1]);

    // Roll for initiative
    const heroInit = rollDice(20);
    const monsterInit = rollDice(20);
    clearConsole();
    appendToConsole(`Rolling for initiative...\n`, 'white');
    appendToConsole(`${heroName} rolls ${heroInit}, ${monsterName} rolls ${monsterInit}\n`, 'white');

    let attackerName = heroInit >= monsterInit ? heroName : monsterName;
    let defenderName = heroInit >= monsterInit ? monsterName : heroName;
    let attackerAc = heroInit >= monsterInit ? heroAc : monsterAc;
    let defenderAc = heroInit >= monsterInit ? monsterAc : heroAc;
    let defenderHp = heroInit >= monsterInit ? monsterHp : heroHp;

    while (heroHp > 0 && monsterHp > 0) {
        const attackRoll = rollDice(20);
        const neededToHit = defenderAc - 2;  // Assuming a basic attack bonus of +2

        if (attackRoll + 2 >= defenderAc) {
            const damage = rollDice(6);
            defenderHp -= damage;
            appendToConsole(`${attackerName} swings at ${defenderName} and HITS (${attackRoll + 2}/${defenderAc}) for `, 'green');
            appendToConsole(`${damage} damage.\n`, 'red');
            if (defenderHp <= 0) {
                appendToConsole(`${attackerName} defeats ${defenderName}!\n`, 'white');
                totalFights++;
                if (attackerName === heroName) {
                    heroWins++;
                } else {
                    monsterWins++;
                }
                updateScoreboard();
                return true; // Fight ends
            }
        } else {
            appendToConsole(`${attackerName} swings at ${defenderName} and MISSES (${attackRoll + 2}/${defenderAc}).\n`, 'green');
        }
        [attackerName, defenderName] = [defenderName, attackerName];
        [attackerAc, defenderAc] = [defenderAc, attackerAc];
        [defenderHp, heroHp, monsterHp] = [heroHp, defenderHp, heroHp];
    }
    return false; // Continue fighting
}

function autoFight() {
    interval = setInterval(() => { // Assign setInterval to interval
        if (!fight()) { // Continues if fight is still ongoing
            clearInterval(interval); // Stops the interval if fight ends
        }
    }, 1000);
}

// Get the "STOP" button element by its ID
const stopButton = document.getElementById('stop-button');

// Add an event listener to the "STOP" button
stopButton.addEventListener('click', () => {
    clearInterval(interval); // Stop the interval when the button is clicked
});



function rollDice(sides) {
    return Math.floor(Math.random() * sides) + 1;
}

function appendToConsole(message, color) {
    const consoleDiv = document.getElementById('fight-console');
    const span = document.createElement('span');
    span.style.color = color;
    span.innerHTML = message.replace(/\n/g, '<br>');
    consoleDiv.appendChild(span);
    consoleDiv.scrollTop = consoleDiv.scrollHeight; // Auto-scroll to the bottom
}

function clearConsole() {
    const consoleDiv = document.getElementById('fight-console');
    consoleDiv.innerHTML = '';
}
