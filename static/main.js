var map, socket;
var numMarkers = 0;

function init() {
    map = L.map('map'); // instanciamos el objeto que creará y gestionará el mapa
    socket = io(); // socket.io
    var shareLocationBtn = document.getElementById("shareLocation"); // botón para compartir la ubicación

    map.setView([40.4178258, -3.7090912], 5); // madrid, visión del país

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { // Cargamos las imágenes de los mapas de OpenStreetMap
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' // Copyright de OpenStreetMap
    }).addTo(map); // Lo configuramos en el mapa

    map.on('click', evt => { // Callback click para el mapa
        if (evt.originalEvent.target.id !== "map") return; // Esto es para evitar que al hacer click en un marcador, haga otro marcador justo detrás. La idea es abrir el popup sin problemas.
        setMarker(evt.latlng.lat, evt.latlng.lng); // Llamamos al procedimiento setMarker
        socket.emit('position', { // Enviamos la posición del marcador al servidor
            lat: evt.latlng.lat,
            lng: evt.latlng.lng
        });
    });

    shareLocationBtn.addEventListener('click', evt => { // Callback click del botón
        if ('geolocation' in navigator) { // Si está disponible la geolocalización, la usamos.
            navigator.geolocation.getCurrentPosition(function(position) { // Función que provee la geolocalización. Gestiona los permisos implícitamente.
                setMarker(position.coords.latitude, position.coords.longitude, "Localización actual"); // Marcamos la posición
                socket.emit('location', { // Enviamos al servidor la localización
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                });
            },
            function(err) { // Callback por si falla
                console.error(err);
            });
        } else {
            console.error("no geolocation");
        }
    });

    socket.on('newPosition', data => { // Recibimos el evento newPosition desde el servidor
        setMarker(data.lat, data.lng); // Marcamos en el mapa
    });

    socket.on('newLocation', data => { // Recibimos el evento newLocation desde el servidor. Este representa la geolocalización de una persona.
        setMarker(data.lat, data.lng, "Un usuario salvaje ha aparecido por esta zona."); // Marcamos en el mapa
    });
}

window.addEventListener('load', init); // Cuando estén todos los recursos cargados, hacemos funcionar nuestro JS

function setMarker(lat, lng, desc = "") { // Función para crear marcadores en el mapa
    let newMarker = L.marker([lat, lng]); // Creamos un marcador con las coordenadas de los argumentos
    desc ? newMarker.bindPopup(desc) : newMarker.bindPopup(`Marcador ${numMarkers + 1}`); // Si se nos ha provisto de descripción, la usamos. Si no, le damos nombre Marcador n.
    newMarker.addTo(map); // Lo añadimos al mapa
    numMarkers++; // Y sumamos que hay un nuevo marcador.
}
