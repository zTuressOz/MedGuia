const menuButton = document.querySelector('#checkbox-menu');
const menuButtonConsulta = document.querySelector('#checkbox-menu-consulta');
const menu = document.querySelector('.sidebar-menu');

menuButton.addEventListener('change', () => {
    menu.classList.toggle('active');
});


document.addEventListener('DOMContentLoaded', function() {
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    const quadrados = document.querySelectorAll('.quadrado');
    const retangulos = document.querySelectorAll('.retangulo');

    if (isMobile) {
        // Hide all rectangles on page load
        retangulos.forEach(retangulo => {
            retangulo.style.display = 'none';
        });

        quadrados.forEach(quadrado => {
            quadrado.addEventListener('click', function() {
                const retanguloId = this.getAttribute('data-retangulo');
                const retangulo = document.getElementById(retanguloId);

                // Hide the square
                this.style.opacity = '0'; // Change opacity to "hide"
                this.style.pointerEvents = 'none'; // Disable click events on the square

                // Show the rectangle and adjust its position and size
                retangulo.style.display = 'block';
                retangulo.style.opacity = '1'; // Ensure the rectangle is visible

                // Adjust the position of the rectangle to align with the clicked square
                const quadradoRect = this.getBoundingClientRect(); // Get square dimensions
                const corpoRect = document.querySelector('.corpo').getBoundingClientRect(); // Get body dimensions

                retangulo.style.top = (quadradoRect.top - corpoRect.top) + 'px'; // Vertical position adjustment
                retangulo.style.left = (quadradoRect.left - corpoRect.left) + 'px'; // Horizontal position adjustment

                // Add click event to restore the square
                retangulo.addEventListener('click', function() {
                    // Show the square again
                    quadrado.style.opacity = '1'; // Restore opacity
                    quadrado.style.pointerEvents = 'auto'; // Enable click events on the square

                    // Hide the rectangle
                    this.style.display = 'none';
                });
            });
        });
    }
});
