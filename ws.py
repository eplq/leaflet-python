from flask_socketio import SocketIO # Importamos SocketIO de la libreria Flask-SocketIO

io = SocketIO() # Hacemos una instancia de SocketIO. La hacemos separada para poder usar la misma instancia en diferentes módulos.

@io.on("position") # Evento position, cuando alguien ha hecho click en el mapa
def send_position_event(data): # Callback
    # Enviamos la posición a todos los clientes conectados menos al que ha enviado el evento para evitar duplicar el marcador
    io.emit("newPosition", data, include_self=False, broadcast=True)

@io.on("location") # Evento location, cuando alguien emite su ubicación
def send_location_event(data): # Callback
    # Enviamos la posición a todos los clientes conectados menos al que ha enviado el evento para evitar duplicar el marcador. Igual que antes.
    io.emit("newLocation", data, include_self=False, broadcast=True)