document.addEventListener('DOMContentLoaded', () => {
    const themeToggleButton = document.getElementById('themeToggle');
    const header = document.querySelector('.header');
    const footer = document.querySelector('.footer');
    const container = document.querySelector('.container');

    // Check for saved theme preference in localStorage
    if (localStorage.getItem('theme') === 'dark') {
        header.classList.remove('light-mode-header');
        container.classList.remove('light-mode');
        footer.classList.remove('light-mode-footer');
        themeToggleButton.src = 'https://img.icons8.com/external-glyph-silhouettes-icons-papa-vector/78/FFFFFF/external-Light-Mode-interface-glyph-silhouettes-icons-papa-vector.png';
    } else {
        header.classList.add('light-mode-header');
        container.classList.add('light-mode');
        footer.classList.add('light-mode-footer');
        themeToggleButton.src = 'https://img.icons8.com/ios/FFFFFF/do-not-disturb-2.png';
    }

    themeToggleButton.addEventListener('click', () => {
        if (container.classList.contains('light-mode')) {
            header.classList.remove('light-mode-header');
            container.classList.remove('light-mode');
            footer.classList.remove('light-mode-footer');
            themeToggleButton.src = 'https://img.icons8.com/ios/FFFFFF/do-not-disturb-2.png';
            localStorage.setItem('theme', 'dark');
        } else {
            header.classList.add('light-mode-header');
            container.classList.add('light-mode');
            footer.classList.add('light-mode-footer');
            themeToggleButton.src = 'https://img.icons8.com/external-glyph-silhouettes-icons-papa-vector/78/FFFFFF/external-Light-Mode-interface-glyph-silhouettes-icons-papa-vector.png';
            localStorage.setItem('theme', 'light');
        }
    });
});
