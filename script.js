let teams = [];
let matches = [];
let standings = {};

// Function to generate teams from players
function generateTeams() {
    if (!confirm('Are you sure you want to generate teams? This will reset the current teams.')) {
        return;
    }

    const playersInput = document.getElementById('players').value;
    const numTeams = parseInt(document.getElementById('numTeams').value);
    let players = playersInput.split(',').map(player => player.trim());

    if (players.length < numTeams) {
        alert('Number of players is less than number of teams');
        return;
    }

    teams = Array.from({ length: numTeams }, () => []);
    standings = {};

    while (players.length) {
        for (let i = 0; i < numTeams && players.length; i++) {
            const randomIndex = Math.floor(Math.random() * players.length);
            teams[i].push(players.splice(randomIndex, 1)[0]);
        }
    }

    teams.forEach((team, index) => {
        standings[`Team ${index + 1}`] = { won: 0, lost: 0, matches: 0 };
    });

    saveToLocalStorage();
    displayTeams();
    displayStandings(); // Display standings after generating teams
}

// Function to display the teams
function displayTeams() {
    const output = document.getElementById('output');
    output.innerHTML = '<h2>Teams:</h2>';
    teams.forEach((team, index) => {
        output.innerHTML += `
            <h3>Team ${index + 1}</h3>
            <ul>${team.map(player => `<li>${player}</li>`).join('')}</ul>
        `;
    });
}

// Function to schedule games
function scheduleGames() {
    if (!confirm('Are you sure you want to schedule games? This will reset the current schedule.')) {
        return;
    }

    if (teams.length < 2) {
        alert('Please generate teams first.');
        return;
    }

    matches = [];
    for (let i = 0; i < teams.length; i++) {
        for (let j = i + 1; j < teams.length; j++) {
            matches.push({ match: `Team ${i + 1} vs Team ${j + 1}`, winner: null });
        }
    }

    matches = shuffleArray(matches);
    saveToLocalStorage();
    displaySchedule();
}

// Function to display the schedule
function displaySchedule() {
    let schedule = '<h2>Game Schedule:</h2>';
    matches.forEach((match, index) => {
        const matchTeams = match.match.split(' vs ');
        const team1 = matchTeams[0];
        const team2 = matchTeams[1];
        schedule += `
            <div id="match-${index}">
                <p>${match.match}</p>
                ${match.winner === null ? `
                    <button onclick="setWinner(${index}, '${team1}', '${team2}')">Team ${team1.split(' ')[1]} Wins</button>
                    <button onclick="setWinner(${index}, '${team2}', '${team1}')">Team ${team2.split(' ')[1]} Wins</button>
                ` : `<p>Winner: ${match.winner}</p>`}
                ${match.winner !== null ? `<button onclick="resetMatch(${index})">Reset Match</button>` : ''}
            </div>
        `;
    });

    document.getElementById('output').innerHTML += schedule;
}

// Function to set match winner
function setWinner(matchIndex, winner, loser) {
    if (matches[matchIndex].winner) {
        alert('Winner already set for this match.');
        return;
    }

    matches[matchIndex].winner = winner;
    standings[winner].won++;
    standings[winner].matches++;
    standings[loser].lost++;
    standings[loser].matches++;
    saveToLocalStorage();

    const matchDiv = document.getElementById(`match-${matchIndex}`);
    matchDiv.innerHTML = `
        <p>${matches[matchIndex].match} - Winner: ${winner}</p>
        <button onclick="resetMatch(${matchIndex})">Reset Match</button>
    `;

    displayStandings(); // Update standings after setting winner
    if (matches.every(match => match.winner !== null)) {
        displayPlayoffs();
    }
}

// Function to reset a match
function resetMatch(matchIndex) {
    const match = matches[matchIndex];
    if (!match.winner) {
        alert('Match not yet set.');
        return;
    }

    standings[match.winner].won--;
    standings[match.winner].matches--;
    const loser = match.match.replace(match.winner, '').replace(' vs ', '').trim();
    standings[loser].lost--;
    standings[loser].matches--;
    match.winner = null;
    saveToLocalStorage();

    const matchDiv = document.getElementById(`match-${matchIndex}`);
    matchDiv.innerHTML = `
        <p>${match.match}</p>
        <button onclick="setWinner(${matchIndex}, '${match.match.split(' vs ')[0]}', '${match.match.split(' vs ')[1]}')">Team ${match.match.split(' vs ')[0].split(' ')[1]} Wins</button>
        <button onclick="setWinner(${matchIndex}, '${match.match.split(' vs ')[1]}', '${match.match.split(' vs ')[0]}')">Team ${match.match.split(' vs ')[1].split(' ')[1]} Wins</button>
        <button onclick="resetMatch(${matchIndex})">Reset Match</button>
    `;

    displayStandings(); // Update standings after resetting match
}

// Function to display standings
function displayStandings() {
    const sortedTeams = Object.keys(standings).sort((a, b) => standings[b].won - standings[a].won);
    let standingsTable = document.querySelector('#standings-table tbody');
    standingsTable.innerHTML = '';

    if (sortedTeams.length === 0) {
        document.getElementById('standings').classList.add('hidden');
    } else {
        document.getElementById('standings').classList.remove('hidden');
        sortedTeams.forEach(team => {
            standingsTable.innerHTML += `
                <tr>
                    <td data-label="Team">${team}</td>
                    <td data-label="Matches">${standings[team].matches}</td>
                    <td data-label="Won">${standings[team].won}</td>
                    <td data-label="Lost">${standings[team].lost}</td>
                </tr>
            `;
        });
    }
}

// Function to display playoffs
function displayPlayoffs() {
    const sortedTeams = Object.keys(standings).sort((a, b) => standings[b].won - standings[a].won);
    const output = document.getElementById('output');

    output.innerHTML += '<h2>Playoffs:</h2>';
    if (sortedTeams.length >= 4) {
        output.innerHTML += `<p>Eliminator: ${sortedTeams[2]} vs ${sortedTeams[3]}</p>`;
        output.innerHTML += `<p>Qualifier 1: ${sortedTeams[0]} vs ${sortedTeams[1]}</p>`;
        output.innerHTML += `<p>Qualifier 2: Winner of Eliminator vs Loser of Qualifier 1</p>`;
        output.innerHTML += `<p>Final: Winner of Qualifier 1 vs Winner of Qualifier 2</p>`;
    } else {
        output.innerHTML += '<p>Not enough teams for playoffs.</p>';
    }
}

// Function to shuffle an array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Function to save the current state to local storage
function saveToLocalStorage() {
    localStorage.setItem('teams', JSON.stringify(teams));
    localStorage.setItem('matches', JSON.stringify(matches));
    localStorage.setItem('standings', JSON.stringify(standings));
}

// Function to load the saved state from local storage
function loadFromLocalStorage() {
    const savedTeams = localStorage.getItem('teams');
    const savedMatches = localStorage.getItem('matches');
    const savedStandings = localStorage.getItem('standings');

    if (savedTeams && savedMatches && savedStandings) {
        teams = JSON.parse(savedTeams);
        matches = JSON.parse(savedMatches);
        standings = JSON.parse(savedStandings);

        displayTeams();
        displaySchedule();
        displayStandings();
    }
}

// Load the saved state when the page loads
window.onload = loadFromLocalStorage;
