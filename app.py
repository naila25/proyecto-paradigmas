from flask import Flask, render_template, request, jsonify
from pyswip import Prolog
import random

app = Flask(__name__)
prolog = Prolog()
prolog.consult("preguntas.pl")

puntos = 0

@app.route('/')
def index():
    return render_template("index.html")

@app.route('/juego')
def juego():
    return render_template("juego.html")

@app.route('/pregunta/<categoria>')
def obtener_pregunta(categoria):
    query = f"pregunta({categoria}, Pregunta, Respuesta)"
    preguntas = list(prolog.query(query))
    seleccion = random.choice(preguntas)
    return jsonify({
        "pregunta": seleccion["Pregunta"],
        "respuesta": seleccion["Respuesta"]
    })

@app.route('/verificar', methods=['POST'])
def verificar():
    global puntos
    data = request.json
    pregunta = data["pregunta"]
    respuesta = data["respuesta"]

    q = list(prolog.query(f"respuesta_correcta('{pregunta}', '{respuesta}')"))
    if q:
        puntos += 10
        return jsonify({"correcta": True, "puntos": puntos})
    else:
        return jsonify({"correcta": False, "puntos": puntos})

@app.route('/resultado')
def resultado():
    global puntos
    return render_template("resultado.html", puntos=puntos)

if __name__ == "__main__":
    app.run(debug=True)
