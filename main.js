const menuButton = document.querySelector('#checkbox-menu');
const menu = document.querySelector('.sidebar-menu');

menuButton.addEventListener('change', () => {
    menu.classList.toggle('active');
});