let teams = [];

// Function to generate teams from players
function generateTeams() {

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

    teams = Array.from({ length: numTeams }, () => []);

    while (players.length) {
        for (let i = 0; i < numTeams && players.length; i++) {
            const randomIndex = Math.floor(Math.random() * players.length);
            teams[i].push(players.splice(randomIndex, 1)[0]);
        }
    }

    saveToLocalStorage();
    displayTeams();
    closeBtnAction.classList.add('alert-store')
    generateButton.textContent = 'Re-generate Teams';

}

// alerat the displayed alert
function clearAlert() {
    const closeBtnAction = document.getElementById('alert');
    closeBtnAction.classList.add('alert-store')
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


// Event listener to handle keyup events
document.getElementById('players').addEventListener('keyup', function (event) {
    // When Enter is pressed, set the flag to true
    if (event.key === 'Backspace') {
        generateLabel();
    }
});

// Event listener to handle input changes
document.getElementById('players').addEventListener('input', function (event) {
    // Check if Enter was pressed before and input field has some value
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

    // Get the value from the textarea
    const textArea = document.getElementById('players');
    const text = textArea.value.trim();

    const names = text.split(/[\n,]+/).filter(name => name.trim() !== '');
    const count = names.length;

    // Update the display
    const countDisplay = document.getElementById('countDisplay');
    countDisplay.textContent = `Number of players: ${count}`;
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