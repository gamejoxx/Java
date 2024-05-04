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
    let consoleOutput = "Rolling for initiative...\n";
    consoleOutput += `${heroName} rolls ${heroInit}, ${monsterName} rolls ${monsterInit}\n`;

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

    // Start attack
    consoleOutput += `${attackerName} attacks first!\n`;
    while (heroHp > 0 && monsterHp > 0) {
        const attackRoll = rollDice(20);
        if (attackRoll + 2 >= defenderAc) {  // Assuming a basic attack bonus of +2
            const damage = rollDice(6);
            defenderHp -= damage;
            consoleOutput += `${attackerName} swings and HITS ${defenderName} for ${damage} damage.\n`;
            if (defenderHp <= 0) {
                consoleOutput += `${attackerName} defeats ${defenderName}!\n`;
                break;
            } else {
                consoleOutput += `${defenderName} now has ${defenderHp} HP left.\n`;
            }
        } else {
            consoleOutput += `${attackerName} swings at ${defenderName} — MISS.\n`;
        }
        // Swap attacker and defender
        [attackerName, defenderName] = [defenderName, attackerName];
        [attackerAc, defenderAc] = [defenderAc, attackerAc];
        [defenderHp, heroHp, monsterHp] = [heroHp, defenderHp, heroHp];
    }

    document.getElementById('fight-console').innerHTML = consoleOutput.replace(/\n/g, '<br>');
});

function rollDice(sides) {
    return Math.floor(Math.random() * sides) + 1;
}

