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

            // Função para limpar a camada de marcadores
            function clearMarkers() {
                markersLayer.clearLayers();
            }

            // Função para buscar um endereço e mostrar no mapa para o primeiro conjunto de entradas
window.searchDiseaseData = function() {
    clearMarkers(); // Limpa os marcadores anteriores

    var address = document.getElementById('address-input').value;
    var selectedDisease = document.getElementById('marker-text-select').value;


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
                        var lat = parseFloat(result.lat); // Ensure lat and lon are parsed as floats
                        var lon = parseFloat(result.lon);
        
                        var city = result.display_name.split(',')[0];
        
                        clearMarkers(); // Clear previous markers
        
                        for (var i = 0; i < 15; i++) {
                            var randomNumber = Math.floor(Math.random() * 50) + 1;
                            var popupContent = city  + ": Nesta área há " + randomNumber + " Pessoas com " + selectedDisease;
        
                            // Adjust lat and lon with random offsets
                            var newLat = lat + (Math.random() - 0.5) / 20;
                            var newLon = lon + (Math.random() - 0.5) / 20;
        
                            var newMarker = L.circleMarker([newLat, newLon], {
                                color: 'blue',
                                fillColor: '#3388ff',
                                fillOpacity: 0.7,
                                radius: randomNumber
                            }).addTo(markersLayer)
                            .bindPopup(popupContent).openPopup();
                        }
        
                        map.setView([lat, lon], 13); // Center map on the new location
                    } else {
                        throw new Error('Coordenadas não encontradas para o endereço.');
                    }
                } else {
                    throw new Error('Endereço não encontrado.');
                }
            } catch (error) {
                alert('Erro ao buscar endereço: ' + error.message);
            }
        });
};

            // Função para buscar um endereço e mostrar no mapa para o segundo conjunto de entradas
            window.searchHealthFacilities = function() {
                clearMarkers(); // Limpa os marcadores anteriores

                var address = document.getElementById('address-input1').value;

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

                                    // Cria um marcador azul para os hospitais/clinics
                                    var icon = L.icon({
                                        iconUrl: 'hospital-icon.png', // Caminho para a imagem local
                                        iconSize: [25, 25], // Tamanho do ícone
                                        iconAnchor: [12, 25], // Posição do ícone em relação à coordenada
                                        popupAnchor: [0, -25] // Posição do popup em relação ao ícone
                                    });

                                    // Centraliza o mapa na nova localização
                                    map.setView([lat, lon], 13);

                                    // Cria uma bolinha vermelha com a nova localização
                                    var newMarker = L.circleMarker([lat, lon], {
                                        color: 'red',
                                        fillColor: '#f03',
                                        fillOpacity: 1,
                                        radius: 8
                                    }).addTo(markersLayer)
                                    .bindPopup(city).openPopup();
                                    // Adiciona os hospitais e clínicas ao mapa
                                    fetchHospitalsAndClinics(lat, lon);
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

            // Função para buscar hospitais e clínicas da região usando a API Overpass
            function fetchHospitalsAndClinics(lat, lon) {
                var overpassUrl = 'https://overpass-api.de/api/interpreter';
                var query = `
                    [out:json];
                    (
                        node["amenity"="hospital"](around:5000,${lat},${lon});
                        node["amenity"="clinic"](around:5000,${lat},${lon});
                        node["amenity"="doctors"](around:5000,${lat},${lon});
                    );
                    out body;
                `;

                
                
                fetch(overpassUrl, {
                    method: 'POST',
                    body: query
                })
                .then(function(response) {
                    return response.json();
                })
                .then(function(data) {
                    data.elements.forEach(function(element) {
                        if (element.lat && element.lon) {
                            // Adiciona ícone personalizado para hospitais, clínicas e postos de saúde
                            var icon = L.icon({
                                iconUrl: 'enfermeira.png', // Caminho para a imagem local
                                iconSize: [25, 25], // Tamanho do ícone
                                iconAnchor: [12, 25], // Posição do ícone em relação à coordenada
                                popupAnchor: [0, -25] // Posição do popup em relação ao ícone
                            });

                                                        // Monta o conteúdo do popup com o endereço completo
                                                        var popupContent = '';
                                                        if (element.tags.name) {
                                                            popupContent += '<strong>' + element.tags.name + '</strong><br>';
                                                        }
                                                        if (element.tags['addr:street']) {
                                                            popupContent += element.tags['addr:street'] + '<br>';
                                                        }
                                                        if (element.tags['addr:city']) {
                                                            popupContent += element.tags['addr:city'] + '<br>';
                                                        }
                                                        if (element.tags['addr:postcode']) {
                                                            popupContent += element.tags['addr:postcode'];
                                                        }

                                                        L.marker([element.lat, element.lon], { icon: icon })
                                                        .addTo(markersLayer)
                                                        .bindPopup(popupContent).openPopup();
                        }
                    });
                })
                .catch(function(error) {
                    console.error('Erro ao buscar hospitais e clínicas:', error);
                });
            }
        }

            // Chama a função initMap quando o documento estiver pronto
            document.addEventListener('DOMContentLoaded', function() {
                initMap();
            });