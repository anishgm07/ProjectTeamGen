// Function to populate the select options
function populateTeamOptions() {
    const numTeamsSelect = document.getElementById('numTeams');
    const minTeams = 2;
    const maxTeams = 10;

    // Clear existing options if any
    numTeamsSelect.innerHTML = '';

    // Generate and add options
    for (let i = minTeams; i <= maxTeams; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = i + " Teams";
        numTeamsSelect.appendChild(option);
    }
}

// Call the function to populate the options on page load
document.addEventListener('DOMContentLoaded', populateTeamOptions);
