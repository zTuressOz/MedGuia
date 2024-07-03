// Seleciona o elemento corpo
const corpo = document.querySelector('.corpo');
// Seleciona o elemento consulta-menu
const menuConsulta = document.querySelector('.consulta-menu');
const menuButtonConsulta = document.querySelector('#checkbox-menu-consulta');
const menu = document.querySelector('.sidebar-menu');
const menuButton = document.querySelector('#checkbox-menu');

menuButton.addEventListener('change', () => {
    menu.classList.toggle('active');
});

document.getElementById('consultas-link2').addEventListener('click', function(event) {
    event.preventDefault(); // Previne o comportamento padrão de redirecionamento

    // Ativa o menu de consultas
    var menu =document.querySelector('.sidebar-menu');
    var consultasMenu = document.querySelector('.consulta-menu');
    menu.classList.toggle('active');
    consultasMenu.classList.toggle('active');
});


menuButtonConsulta.addEventListener('change', () => {
    menuConsulta.classList.toggle('active');
});

function initMap() {
    var map = L.map('map').setView([-22.9068, -43.1729], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19
    }).addTo(map);

    var markersLayer = L.layerGroup().addTo(map);

    function onLocationError(e) {
        alert("Erro ao obter sua localização: " + e.message);
    }

    function onLocationFound(e) {
        var radius = e.accuracy / 2;

        L.marker(e.latlng).addTo(markersLayer)
            .bindPopup("Você está aqui").openPopup();

        L.circle(e.latlng, radius).addTo(map);
    }

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(onLocationFound, onLocationError);
    } else {
        alert("Geolocalização não é suportada neste navegador.");
    }

    function clearMarkers() {
        markersLayer.clearLayers();
    }

    window.searchDiseaseData = function() {
        clearMarkers();

        var address = document.getElementById('address-input').value;
        var selectedDisease = document.getElementById('marker-text-select').value;

        var url = 'https://nominatim.openstreetmap.org/search?format=json&limit=1&q=' + encodeURIComponent(address);

        fetch(url)
            .then(function(response) {
                return response.json();
            })
            .then(function(data) {
                try {
                    if (data && data.length > 0) {
                        var result = data[0];
                        if (result.lat && result.lon) {
                            var lat = parseFloat(result.lat);
                            var lon = parseFloat(result.lon);

                            var city = result.display_name.split(',')[0];

                            clearMarkers();

                            for (var i = 0; i < 15; i++) {
                                var randomNumber = Math.floor(Math.random() * 50) + 1;
                                var popupContent = city + ": Nesta área há " + randomNumber + " Pessoas com " + selectedDisease;

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

                            map.setView([lat, lon], 13);
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

    window.searchHealthFacilities = function() {
        clearMarkers();

        var address = document.getElementById('address-input1').value;
        var selectedDisease = document.getElementById('marker-text-select1').value;

        var url = 'https://nominatim.openstreetmap.org/search?format=json&limit=1&q=' + encodeURIComponent(address);

        fetch(url)
            .then(function(response) {
                return response.json();
            })
            .then(function(data) {
                try {
                    if (data && data.length > 0) {
                        var result = data[0];
                        if (result.lat && result.lon) {
                            var lat = parseFloat(result.lat);
                            var lon = parseFloat(result.lon);

                            var city = result.display_name.split(',')[0];

                            map.setView([lat, lon], 13);

                            var newMarker = L.circleMarker([lat, lon], {
                                color: 'red',
                                fillColor: '#f03',
                                fillOpacity: 1,
                                radius: 8
                            }).addTo(markersLayer)
                            .bindPopup(city).openPopup();

                            if(selectedDisease == "Clinicas"){
                            fetchClinics(lat, lon);
                            }
                            else if(selectedDisease == "Hospitais"){
                            fetchHospitals(lat, lon);
                            } else if(selectedDisease == "Dentistas"){
                                fetchDentists(lat, lon);
                            } else if(selectedDisease == "Farmacias"){
                                fetchPharmacies(lat, lon);
                            } else if(selectedDisease == "Veterinarias"){
                                fetchVeterinry(lat, lon);
                            } else if(selectedDisease == "Assistencia_Social"){
                                fetchSocial_Facilities(lat, lon);
                            }
                        } else {
                            throw new Error('Coordenadas não encontradas para o endereço.');
                        }
                    } else {
                        throw new Error('Endereço não encontrado.');
                    }
                } catch (error) {
                    alert('Erro ao buscar endereço: ' + error.message);
                }
            })
            .catch(function(error) {
                alert('Erro ao buscar endereço: ' + error.message);
            });
    };

    function fetchHospitals(lat, lon) {
        var overpassUrl = 'https://overpass-api.de/api/interpreter';
        var query = `
            [out:json];
            (
                way["amenity"="hospital"](around:12000,${lat},${lon});
                relation["amenity"="hospital"](around:12000,${lat},${lon});
            );
            out geom;
        `;
    
        fetch(overpassUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                data: query
            })
        })
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            data.elements.forEach(function(element) {
                var coordinates = [];
                if (element.type === 'way') {
                    coordinates = element.geometry.map(function(node) {
                        return [node.lat, node.lon];
                    });
                } else if (element.type === 'relation') {
                    coordinates = element.members
                        .filter(member => member.type === 'way')
                        .map(member => {
                            return member.geometry.map(function(node) {
                                return [node.lat, node.lon];
                            });
                        })
                        .reduce((acc, val) => acc.concat(val), []);
                }

                var area = L.polygon(coordinates, {
                    color: 'green',
                    fillColor: '#7cff81',
                    fillOpacity: 0.5
                }).addTo(markersLayer);

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
                    popupContent += element.tags['addr:postcode'] + '<br>';
                }
                if (element.tags['contact:email']) {
                    popupContent += 'E-mail: ' + element.tags['contact:email'] + '<br>';
                }
                if (element.tags['contact:phone']) {
                    popupContent += 'Telefone: ' + element.tags['contact:phone'];
                }

                area.bindPopup(popupContent).on('popupopen', function() {
                    document.getElementById('local-de-atendimento').value = element.tags.name;
                }).openPopup();
            });
        })
        .catch(function(error) {
            console.error('Erro ao buscar áreas de hospitais:', error);
        });
    }

    function fetchDentists(lat, lon) {
        var overpassUrl = 'https://overpass-api.de/api/interpreter';
        var query = `
            [out:json];
            (
                node["amenity"="dentist"](around:12000,${lat},${lon});
            );
            out body;
        `;

        fetch(overpassUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                data: query
            })
        })
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            data.elements.forEach(function(element) {
                if (element.lat && element.lon) {
                    var icon = L.icon({
                        iconUrl: 'dente.png', // Caminho para a imagem local
                        iconSize: [25, 25], // Tamanho do ícone
                        iconAnchor: [12, 25], // Posição do ícone em relação à coordenada
                        popupAnchor: [0, -25] // Posição do popup em relação ao ícone
                    });

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
                        popupContent += element.tags['addr:postcode'] + '<br>';
                    }
                    if (element.tags['contact:email']) {
                        popupContent += 'E-mail: ' + element.tags['contact:email'] + '<br>';
                    }
                    if (element.tags['contact:phone']) {
                        popupContent += 'Telefone: ' + element.tags['contact:phone'];
                    }

                    L.marker([element.lat, element.lon], { icon: icon })
                    .addTo(markersLayer)
                    .bindPopup(popupContent).on('popupopen', function() {
                        document.getElementById('local-de-atendimento').value = element.tags.name;
                    }).openPopup();
                }
            });
        })
        .catch(function(error) {
            console.error('Erro ao buscar hospitais e clínicas:', error);
        });
    }

    function fetchVeterinry(lat, lon) {
        var overpassUrl = 'https://overpass-api.de/api/interpreter';
        var query = `
            [out:json];
            (
                node["amenity"="veterinary"](around:12000,${lat},${lon});
            );
            out body;
        `;

        fetch(overpassUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                data: query
            })
        })
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            data.elements.forEach(function(element) {
                if (element.lat && element.lon) {
                    var icon = L.icon({
                        iconUrl: 'animal.png', // Caminho para a imagem local
                        iconSize: [25, 25], // Tamanho do ícone
                        iconAnchor: [12, 25], // Posição do ícone em relação à coordenada
                        popupAnchor: [0, -25] // Posição do popup em relação ao ícone
                    });

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
                        popupContent += element.tags['addr:postcode'] + '<br>';
                    }
                    if (element.tags['contact:email']) {
                        popupContent += 'E-mail: ' + element.tags['contact:email'] + '<br>';
                    }
                    if (element.tags['contact:phone']) {
                        popupContent += 'Telefone: ' + element.tags['contact:phone'];
                    }

                    L.marker([element.lat, element.lon], { icon: icon })
                    .addTo(markersLayer)
                    .bindPopup(popupContent).on('popupopen', function() {
                        document.getElementById('local-de-atendimento').value = element.tags.name;
                    }).openPopup();
                }
            });
        })
        .catch(function(error) {
            console.error('Erro ao buscar hospitais e clínicas:', error);
        });
    }

    function fetchSocial_Facilities(lat, lon) {
        var overpassUrl = 'https://overpass-api.de/api/interpreter';
        var query = `
            [out:json];
            (
                node["amenity"="social_facility"](around:12000,${lat},${lon});
            );
            out body;
        `;

        fetch(overpassUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                data: query
            })
        })
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            data.elements.forEach(function(element) {
                if (element.lat && element.lon) {
                    var icon = L.icon({
                        iconUrl: 'assistencia.png', // Caminho para a imagem local
                        iconSize: [25, 25], // Tamanho do ícone
                        iconAnchor: [12, 25], // Posição do ícone em relação à coordenada
                        popupAnchor: [0, -25] // Posição do popup em relação ao ícone
                    });

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
                        popupContent += element.tags['addr:postcode'] + '<br>';
                    }
                    if (element.tags['contact:email']) {
                        popupContent += 'E-mail: ' + element.tags['contact:email'] + '<br>';
                    }
                    if (element.tags['contact:phone']) {
                        popupContent += 'Telefone: ' + element.tags['contact:phone'];
                    }

                    L.marker([element.lat, element.lon], { icon: icon })
                    .addTo(markersLayer)
                    .bindPopup(popupContent).on('popupopen', function() {
                        document.getElementById('local-de-atendimento').value = element.tags.name;
                    }).openPopup();
                }
            });
        })
        .catch(function(error) {
            console.error('Erro ao buscar hospitais e clínicas:', error);
        });
    }

    function fetchClinics(lat, lon) {
        var overpassUrl = 'https://overpass-api.de/api/interpreter';
        var query = `
            [out:json];
            (
                node["amenity"~"clinic|doctors"](around:12000,${lat},${lon});
            );
            out body;
        `;

        fetch(overpassUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                data: query
            })
        })
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            data.elements.forEach(function(element) {
                if (element.lat && element.lon) {
                    var icon = L.icon({
                        iconUrl: 'enfermeira.png', // Caminho para a imagem local
                        iconSize: [25, 25], // Tamanho do ícone
                        iconAnchor: [12, 25], // Posição do ícone em relação à coordenada
                        popupAnchor: [0, -25] // Posição do popup em relação ao ícone
                    });

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
                        popupContent += element.tags['addr:postcode'] + '<br>';
                    }
                    if (element.tags['contact:email']) {
                        popupContent += 'E-mail: ' + element.tags['contact:email'] + '<br>';
                    }
                    if (element.tags['contact:phone']) {
                        popupContent += 'Telefone: ' + element.tags['contact:phone'];
                    }

                    L.marker([element.lat, element.lon], { icon: icon })
                    .addTo(markersLayer)
                    .bindPopup(popupContent).on('popupopen', function() {
                        document.getElementById('local-de-atendimento').value = element.tags.name;
                    }).openPopup();
                }
            });
        })
        .catch(function(error) {
            console.error('Erro ao buscar hospitais e clínicas:', error);
        });
    }

    function fetchPharmacies(lat, lon) {
        var overpassUrl = 'https://overpass-api.de/api/interpreter';
        var query = `
            [out:json];
            (
                node["amenity"="pharmacy"](around:12000,${lat},${lon});
            );
            out body;
        `;

        fetch(overpassUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                data: query
            })
        })
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            data.elements.forEach(function(element) {
                if (element.lat && element.lon) {
                    var icon = L.icon({
                        iconUrl: 'farmacia.png', // Caminho para a imagem local
                        iconSize: [25, 25], // Tamanho do ícone
                        iconAnchor: [12, 25], // Posição do ícone em relação à coordenada
                        popupAnchor: [0, -25] // Posição do popup em relação ao ícone
                    });

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
                        popupContent += element.tags['addr:postcode'] + '<br>';
                    }
                    if (element.tags['contact:email']) {
                        popupContent += 'E-mail: ' + element.tags['contact:email'] + '<br>';
                    }
                    if (element.tags['contact:phone']) {
                        popupContent += 'Telefone: ' + element.tags['contact:phone'];
                    }

                    L.marker([element.lat, element.lon], { icon: icon })
                    .addTo(markersLayer)
                    .bindPopup(popupContent).on('popupopen', function() {
                        document.getElementById('local-de-atendimento').value = element.tags.name;
                    }).openPopup();
                }
            });
        })
        .catch(function(error) {
            console.error('Erro ao buscar hospitais e clínicas:', error);
        });
    }

    document.addEventListener('DOMContentLoaded', function() {
        initMap();
    });
}

initMap();