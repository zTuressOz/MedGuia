const menuButton = document.querySelector('#checkbox-menu');
const menuButtonConsulta = document.querySelector('#checkbox-menu-consulta');
const menu = document.querySelector('.sidebar-menu');
const menuConsulta = document.querySelector('.consulta-menu');

document.getElementById('consultas-link').addEventListener('click', function(event) {
    event.preventDefault(); // Previne o comportamento padrão de redirecionamento

    // Ativa o menu de consultas
    var consultasMenu = document.querySelector('.consulta-menu');
    consultasMenu.classList.toggle('active');
});

document.getElementById('consultas-link2').addEventListener('click', function(event) {
    event.preventDefault(); // Previne o comportamento padrão de redirecionamento

    // Ativa o menu de consultas
    var menu = document.querySelector('.sidebar-menu');
    var consultasMenu = document.querySelector('.consulta-menu');
    menu.classList.toggle('active');
    consultasMenu.classList.toggle('active');
});

menuButton.addEventListener('change', () => {
    menu.classList.toggle('active');
});

menuButtonConsulta.addEventListener('change', () => {
    menuConsulta.classList.toggle('active');
});

document.addEventListener('DOMContentLoaded', function() {
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    const quadrados = document.querySelectorAll('.quadrado');
    const retangulos = document.querySelectorAll('.retangulo');



    if (isMobile) {

            // Oculta todos os retângulos no carregamento da página
    retangulos.forEach(retangulo => {
        retangulo.style.display = 'none';
    });
    

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



