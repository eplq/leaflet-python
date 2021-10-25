from flask import Flask, render_template # importamos lo necesario de Flask

from ws import io # Importamos la instancia ya creada de SocketIO. La idea es poder usar la misma instancia en varios archivos, aunque no se usa en este ejemplo.
from config import * # Constantes

app = Flask("leaflet-python") # Instanciamos una aplicación de Flask
io.init_app(app) # Iniciamos la instancia de SocketIO con la aplicación de Flask

# Configuramos la ruta / para que envíe el archivo templates/index.html
@app.route("/")
def index():
    return render_template("index.html")

io.run(app, host=HOST, port=PORT, debug=DEBUG) # Iniciamos la app de Flask con el método de SocketIO para poder usar eventlet y mejorar los WebSockets.
