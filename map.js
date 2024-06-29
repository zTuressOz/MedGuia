// Função para inicializar o mapa
function initMap() {
    // Cria um mapa Leaflet dentro da div com o ID 'map'
    var map = L.map('map').setView([-22.9068, -43.1729], 13); // Define a posição inicial e o zoom

    // Adiciona uma camada de tile do OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19 // Define o zoom máximo
    }).addTo(map);

    // Camada de grupo para todos os marcadores
    var markersLayer = L.layerGroup().addTo(map);

    // Armazena a contagem de marcadores por cidade e texto
    var markerCounts = {};
    var randomNumbers = {}; // Para armazenar números aleatórios para cada cidade e texto

    // Função para lidar com erros de geolocalização
    function onLocationError(e) {
        alert("Erro ao obter sua localização: " + e.message);
    }

    // Função para mostrar a localização do usuário no mapa
    function onLocationFound(e) {
        var radius = e.accuracy / 2;

        L.marker(e.latlng).addTo(markersLayer)
            .bindPopup("Você está aqui").openPopup();

        L.circle(e.latlng, radius).addTo(map);
    }

    // Se o navegador suporta geolocalização, tenta obter a localização do usuário
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(onLocationFound, onLocationError);
    } else {
        alert("Geolocalização não é suportada neste navegador.");
    }

    // Função para buscar um endereço e mostrar no mapa
    window.searchAddress = function() {
        var address = document.getElementById('address-input').value;
        var markerText = document.getElementById('marker-text-select').value;

        // Utiliza o serviço de geocodificação do OpenStreetMap Nominatim
        var url = 'https://nominatim.openstreetmap.org/search?format=json&limit=1&q=' + encodeURIComponent(address);

        // Requisição AJAX para obter as coordenadas do endereço digitado
        fetch(url)
            .then(function(response) {
                return response.json();
            })
            .then(function(data) {
                try {
                    if (data && data.length > 0) {
                        var result = data[0];
                        if (result.lat && result.lon) {
                            var lat = result.lat;
                            var lon = result.lon;

                            // Pega o nome da cidade do resultado
                            var city = result.display_name.split(',')[0];
                            var markerKey = city + ": " + markerText;

                            // Atualiza a contagem de marcadores
                            if (markerCounts[markerKey]) {
                                markerCounts[markerKey]++;
                            } else {
                                markerCounts[markerKey] = 1;
                            }

                            // Gera um número aleatório apenas na primeira vez
                            if (!randomNumbers[markerKey]) {
                                randomNumbers[markerKey] = Math.floor(Math.random() * 1000);
                            } 

                            var markerLabel = markerKey + " " + randomNumbers[markerKey] + " pessoas";

                            // Cria uma bolinha vermelha com a nova localização
                            var newMarker = L.circleMarker([lat, lon], {
                                color: 'red',
                                fillColor: '#f03',
                                fillOpacity: 1,
                                radius: 8
                            }).addTo(markersLayer)
                            .bindPopup(markerLabel).openPopup();

                            // Centraliza o mapa na nova localização
                            map.setView([lat, lon], 13);
                        } else {
                            throw new Error('Coordenadas não encontradas para o endereço.');
                        }
                    } else {
                        throw new Error('Endereço não encontrado.');
                    }
                } catch (error) {
                    // Captura o erro e exibe uma mensagem genérica ao usuário
                    alert('Erro ao buscar endereço: ' + error.message);
                }
            })
            .catch(function(error) {
                // Captura erros de rede ou outros erros de fetch
                alert('Erro ao buscar endereço: ' + error.message);
            });
    };
}

// Chama a função initMap quando o documento estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    initMap();
});
