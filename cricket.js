let team1TotalRuns = 0;
let team1Wickets = 0;
let team2TotalRuns = 0;
let team2Wickets = 0;
let totalOvers;
let isTeam1BattingFirst = true;  // Default: Team 1 bats first

// Function to generate match tables for teams and overs
function scheduleMatch() {
    totalOvers = parseInt(document.getElementById('overs').value);
    if (!totalOvers || totalOvers <= 0) {
        alert("Please enter a valid number of overs.");
        return;
    }

    const teamsDiv = document.getElementById('teams');
    const oversTablesDiv = document.getElementById('oversTables');

    // Clear previous tables
    teamsDiv.innerHTML = '';
    document.getElementById('team1OversTables').innerHTML = '';
    document.getElementById('team2OversTables').innerHTML = '';
    document.getElementById('scoreboard').innerHTML = '';

    // Generate tables for both teams
    generateOversTable('team1', 'Team 1 Overs', 'team1OversTables');
    generateOversTable('team2', 'Team 2 Overs', 'team2OversTables', true);

    // Generate teams table
    const teamTable = `
        <h3>Teams</h3>
        <table>
            <thead>
                <tr>
                    <th>Team 1</th>
                    <th>Team 2</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td id="team1Players"></td>
                    <td id="team2Players"></td>
                </tr>
            </tbody>
        </table>
    `;
    teamsDiv.innerHTML = teamTable;
    populateTeamPlayers();
}

// Function to populate the team players
function populateTeamPlayers() {
    const team1Players = teams[0].join(', ');
    const team2Players = teams[1].join(', ');

    document.getElementById('team1Players').innerText = team1Players;
    document.getElementById('team2Players').innerText = team2Players;
}

// Function to generate overs table for each team
function generateOversTable(team, label, containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = `<h3>${label}</h3>`;

    for (let over = 1; over <= totalOvers; over++) {
        const overTable = document.createElement('table');
        
        // Create the header with the correct format (e.g., 1.1, 1.2, ..., 6.6)
        let headerRow = '<thead><tr>';
        for (let ball = 1; ball <= 6; ball++) {
            headerRow += `<th>${over}.${ball}</th>`;
        }
        headerRow += '</tr></thead>';

        overTable.innerHTML = `
            ${headerRow}
            <tbody>
                <tr>
                    <td>${createBallSelect(team, over, 1)}</td>
                    <td>${createBallSelect(team, over, 2)}</td>
                    <td>${createBallSelect(team, over, 3)}</td>
                    <td>${createBallSelect(team, over, 4)}</td>
                    <td>${createBallSelect(team, over, 5)}</td>
                    <td>${createBallSelect(team, over, 6)}</td>
                </tr>
            </tbody>
        `;
        container.appendChild(overTable);
    }
}

// Function to create a select box for each ball
function createBallSelect(team, over, ball) {
    return `
        <select id="${team}-over-${over}-ball-${ball}" onchange="calculateScore('${team}', ${over}, ${ball})">
            <option value="dot">0</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="6">6</option>
            <option value="W">W</option>
        </select>
    `;
}

// Function to calculate score per ball for each team
function calculateScore(team, over, ball) {
    const ballSelect = document.getElementById(`${team}-over-${over}-ball-${ball}`);
    const value = ballSelect.value;

    if (team === 'team1') {
        if (value === "W") {
            team1Wickets++;
        } else {
            team1TotalRuns += parseInt(value) || 0;
        }
    } else if (team === 'team2') {
        if (value === "W") {
            team2Wickets++;
        } else {
            team2TotalRuns += parseInt(value) || 0;
        }
    }

    updateScoreboard(over, team);
}

// Function to update the scoreboard and show remaining runs in the second innings
function updateScoreboard(currentOver, team) {
    const scoreboard = document.getElementById('scoreboard');
    let runsToWin;
    let remainingRuns = '';

    // Determine which team is chasing
    if (isTeam1BattingFirst) {
        runsToWin = team1TotalRuns - team2TotalRuns + 1;  // Team 2 chasing
    } else {
        runsToWin = team2TotalRuns - team1TotalRuns + 1;  // Team 1 chasing
    }

    // Show remaining runs only in the last two overs of the second innings
    if ((isTeam1BattingFirst && team === 'team2' && currentOver >= totalOvers - 1) || 
        (!isTeam1BattingFirst && team === 'team1' && currentOver >= totalOvers - 1)) {
        if (runsToWin > 0) {
            remainingRuns = `<p>Remaining Runs to Win: ${runsToWin}</p>`;
        } else {
            remainingRuns = `<p>${team === 'team1' ? 'Team 1' : 'Team 2'} has won the match!</p>`;
        }
    }

    // Update the scoreboard
    scoreboard.innerHTML = `
        <p>Team 1: Runs = ${team1TotalRuns}, Wickets = ${team1Wickets}</p>
        <p>Team 2: Runs = ${team2TotalRuns}, Wickets = ${team2Wickets}</p>
        ${remainingRuns}
    `;
}