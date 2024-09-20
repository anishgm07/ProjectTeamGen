document.addEventListener('DOMContentLoaded', () => {
    const themeToggleButton = document.getElementById('themeToggle');
    const header = document.querySelector('.header');
    const footer = document.querySelector('.footer');
    const thead = document.querySelector('thead');
    const tbody = document.querySelector('tbody');
    const container = document.querySelector('.container');
    const lightMode = '../images/light-mode-icon.png';
    const darkMode = '../images/dark-mode-icon.png';

    // Check for saved theme preference in localStorage 
    if (localStorage.getItem('theme') === 'dark') {
        header.classList.remove('light-mode-header');
        container.classList.remove('light-mode');
        footer.classList.remove('light-mode-footer');
        thead.classList.remove('thead-light');
        tbody.classList.remove('tbody-light');
        themeToggleButton.src = lightMode;
    } else {
        header.classList.add('light-mode-header');
        container.classList.add('light-mode');
        footer.classList.add('light-mode-footer');
        tbody.classList.add('tbody-light');
        thead.classList.add('thead-light');
        themeToggleButton.src = darkMode;
    }

    themeToggleButton.addEventListener('click', () => {
        if (container.classList.contains('light-mode')) {
            header.classList.remove('light-mode-header');
            container.classList.remove('light-mode');
            footer.classList.remove('light-mode-footer');
            thead.classList.remove('thead-light');
            tbody.classList.remove('tbody-light');

            themeToggleButton.src = lightMode;
            localStorage.setItem('theme', 'dark');
        } else {
            header.classList.add('light-mode-header');
            container.classList.add('light-mode');
            footer.classList.add('light-mode-footer');
            tbody.classList.add('tbody-light');
            thead.classList.add('thead-light');
            themeToggleButton.src = darkMode;
            localStorage.setItem('theme', 'light');
        }
    });
});
