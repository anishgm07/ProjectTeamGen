let teams = [];

// Function to generate teams from players
function generateTeams() {

    const playersInput = document.getElementById('players');
    const teamUp = document.getElementById('teamup');
    const generateButton = document.getElementById('generateButton');
    const playersValue = playersInput.value;
    const numTeams = parseInt(document.getElementById('numTeams').value);
    let players = playersValue.split('\n').map(player => player.trim());

    playersInput.classList.remove('error-border');
    teamUp.classList.add('hidden');

    if (playersValue === '') {
        playersInput.classList.add('error-border');
        alert('Please enter players.');
        return;
    }

    if (players.length < numTeams) {
        alert('Number of players is less than the number of teams.');
        return;
    }

    if (players.length === numTeams) {
        alert('Number of players is equal to the number of teams.');
        return;
    }

    const remainder = players.length % numTeams;

    if (remainder !== 0) {
        const userConfirmed = confirm('It’s not possible to distribute players equally. Proceed with uneven distribution?');
        if (!userConfirmed) {
            return; 
        }
    }

    teamUp.classList.remove('hidden');

    teams = Array.from({ length: numTeams }, () => []);

    while (players.length) {
        for (let i = 0; i < numTeams && players.length; i++) {
            const randomIndex = Math.floor(Math.random() * players.length);
            teams[i].push(players.splice(randomIndex, 1)[0]);
        }
    }

    saveToLocalStorage();
    displayTeams();
    generateButton.textContent = 'Re-generate Teams';

}

// Function to display the teams
function displayTeams() {
    let teamups = document.querySelector('#teamup-players tbody');
    teamups.innerHTML = '';

    teams.forEach((team, index) => {
        teamups.innerHTML += `
            <tr>
                <td>Team ${index + 1}</td>
                <td>${team.join(', ')}</td>
            </tr>
        `;
    });
}

//  Function to change Button name
function generateLabel() {
    const generateButton = document.getElementById('generateButton');
    const teamUp = document.getElementById('teamup');

    generateButton.textContent = 'Generate Teams';
    teamUp.classList.add('hidden');
}

// Function to save the current state to local storage
function saveToLocalStorage() {
    localStorage.setItem('teams', JSON.stringify(teams));
}

// Function to load the saved state from local storage
function loadFromLocalStorage() {
    const savedTeams = localStorage.getItem('teams');

    if (savedTeams) {
        teams = JSON.parse(savedTeams);
        displayTeams();
    }
}

// Load the saved state when the page loads
window.onload = loadFromLocalStorage;