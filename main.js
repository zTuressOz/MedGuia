const menuButton = document.querySelector('#checkbox-menu');
const menu = document.querySelector('.sidebar-menu');

menuButton.addEventListener('change', () => {
    menu.classList.toggle('active');
});

document.addEventListener('DOMContentLoaded', function() {
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    const quadrados = document.querySelectorAll('.quadrado');
    const retangulos = document.querySelectorAll('.retangulo');

    if (isMobile) {
        quadrados.forEach(quadrado => {
            quadrado.addEventListener('click', function() {
                const retanguloId = this.getAttribute('data-retangulo');
                const retangulo = document.getElementById(retanguloId);

                // Esconde o quadrado
                this.style.opacity = '0'; // Altera a opacidade para "esconder"
                this.style.pointerEvents = 'none'; // Desativa eventos de clique no quadrado

                // Mostra o retângulo e ajusta sua posição e tamanho
                retangulo.style.display = 'block';
                retangulo.style.opacity = '1'; // Garante que o retângulo esteja visível

                // Ajusta a posição do retângulo para alinhar com o quadrado clicado
                const quadradoRect = this.getBoundingClientRect(); // Obtém as dimensões do quadrado
                const corpoRect = document.querySelector('.corpo').getBoundingClientRect(); // Obtém as dimensões do corpo

                retangulo.style.top = (quadradoRect.top - corpoRect.top) + 'px'; // Ajuste de posição vertical
                retangulo.style.left = (quadradoRect.left - corpoRect.left) + 'px'; // Ajuste de posição horizontal

                // Adiciona evento de clique para restaurar ao quadrado
                retangulo.addEventListener('click', function() {
                    // Mostra o quadrado novamente
                    quadrado.style.opacity = '1'; // Restaura a opacidade
                    quadrado.style.pointerEvents = 'auto'; // Ativa eventos de clique no quadrado

                    // Esconde o retângulo
                    this.style.display = 'none';
                });
            });
        });
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const retangulos = document.querySelectorAll('.retangulo');
    retangulos.forEach(retangulo => {
        retangulo.style.display = 'none'; // Esconde todos os retângulos inicialmente
    });
});
