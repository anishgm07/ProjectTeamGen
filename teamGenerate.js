// global variable to hold the generated teams and timeouts
let teams = [];
let timeoutIds = [];  // To store the setTimeout IDs
let isGenerating = false;  // To prevent multiple regenerations

// Function to generate teams
function generateTeams() {
    // Reset timeout IDs and stop any ongoing team display
    clearAllTimeouts();
    
    const playersInput = document.getElementById('players');
    const alertInput = document.getElementById('alertMsg');
    const closeBtnAction = document.getElementById('alert');
    const teamUp = document.getElementById('teamup');
    const generateButton = document.getElementById('generateButton');
    const playersValue = playersInput.value;
    const numTeams = parseInt(document.getElementById('numTeams').value);
    const players = playersValue.split(/[\n,]+/).filter(name => name.trim() !== '');

    playersInput.classList.remove('error-border');
    teamUp.classList.add('hidden');

    teams = [];  // Reset the teams array

    if (playersValue === '') {
        playersInput.classList.add('error-border');
        closeBtnAction.classList.add('alert-restore');
        closeBtnAction.classList.remove('alert-store');
        alertInput.innerHTML = 'Please enter players.';
        return;
    } else if (players.length < numTeams) {
        closeBtnAction.classList.add('alert-restore');
        closeBtnAction.classList.remove('alert-store');
        alertInput.innerHTML = 'Number of players is less than the number of teams.';
        return;
    } else if (players.length === numTeams) {
        closeBtnAction.classList.add('alert-restore');
        closeBtnAction.classList.remove('alert-store');
        alertInput.innerHTML = 'Number of players is equal to the number of teams.';
        return;
    } else if (players.length % numTeams !== 0 && !confirm('Continue with uneven distribution?')) {
        return;
    }

    teamUp.classList.remove('hidden');

    teams = Array.from({ length: numTeams }, () => []);  // Create empty teams array

    // Shuffle and distribute players
    while (players.length) {
        for (let i = 0; i < numTeams && players.length; i++) {
            const randomIndex = Math.floor(Math.random() * players.length);
            teams[i].push(players.splice(randomIndex, 1)[0]);
        }
    }

    displayTeamsWithDelay();  // Display teams with delay
    closeBtnAction.classList.add('alert-store');
    generateButton.textContent = 'Re-generate Teams';
}

// Function to display teams with a delay
function displayTeamsWithDelay() {
    const teamups = document.querySelector('#teamup-players tbody');
    if (!teamups) {
        console.error('Table body not found.');
        return;
    }

    teamups.innerHTML = '';  // Clear previous teams

    // Initialize rows for teams
    teams.forEach((_, index) => {
        teamups.innerHTML += `
            <tr data-team="${index}">
                <td>Team ${index + 1}</td>
                <td></td>
            </tr>
        `;
    });

    let displayQueue = [];  // Reset the display queue

    let playerIndex = 0;
    while (playerIndex < teams[0].length) {
        teams.forEach((team, teamIndex) => {
            if (playerIndex < team.length) {
                displayQueue.push({
                    team: teamIndex,
                    player: team[playerIndex],
                    delay: playerIndex * 500  // Delay based on player index
                });
            }
        });
        playerIndex++;
    }

    displayQueue.sort((a, b) => a.delay - b.delay);

    let currentIndex = 0;

    function showNextPlayer() {
        if (currentIndex < displayQueue.length) {
            const { team, player } = displayQueue[currentIndex];
            const teamRow = teamups.querySelector(`tr[data-team="${team}"] td:last-child`);
            if (teamRow) {
                teamRow.textContent += (teamRow.textContent ? ', ' : '') + player;
            } else {
                console.error(`Team row for Team ${team + 1} not found.`);
            }

            // Set a new timeout to show the next player
            const timeoutId = setTimeout(showNextPlayer, 1000);
            timeoutIds.push(timeoutId);  // Store the timeout ID
            currentIndex++;
        }
    }

    isGenerating = true;
    showNextPlayer();
}

// Function to clear all timeouts when regenerating teams
function clearAllTimeouts() {
    timeoutIds.forEach(timeoutId => clearTimeout(timeoutId));  // Clear all active timeouts
    timeoutIds = [];  // Reset the timeout array
    isGenerating = false;
}

// Function to clear the alert
function clearAlert() {
    const closeBtnAction = document.getElementById('alert');
    closeBtnAction.classList.add('alert-store');
}

// Event listener to handle keyup events
document.getElementById('players').addEventListener('keyup', function (event) {
    if (event.key === 'Backspace') {
        generateLabel();
    }
});

// Event listener to handle input changes
document.getElementById('players').addEventListener('input', function (event) {
    if (event.target.value.length > 0) {
        generateLabel();
    }
});

//  Function to change Button name
function generateLabel() {
    const generateButton = document.getElementById('generateButton');
    const teamUp = document.getElementById('teamup');

    generateButton.textContent = 'Generate Teams';
    teamUp.classList.add('hidden');

    const textArea = document.getElementById('players');
    const text = textArea.value.trim();

    const names = text.split(/[\n,]+/).filter(name => name.trim() !== '');
    const count = names.length;

    const countDisplay = document.getElementById('countDisplay');
    countDisplay.textContent = `Number of players: ${count}`;
}