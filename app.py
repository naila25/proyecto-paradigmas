# -*- coding: utf-8 -*-
import sys
import io

# Forzar UTF-8 en toda la aplicación
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

from flask import Flask, render_template, request, jsonify, session
from pyswip import Prolog
import random
import logging

app = Flask(__name__)
app.secret_key = 'tu_clave_secreta_aqui_12345'
app.config['JSON_AS_ASCII'] = False  # Importante para UTF-8 en JSON

# Configurar logging
logging.basicConfig(level=logging.DEBUG, encoding='utf-8')

# Inicializar el Prolog
try:
    prolog = Prolog()
    prolog.consult("preguntas.pl")
    print("✅ Prolog inicializado correctamente")
except Exception as e:
    print(f"Error inicializando Prolog: {e}")
    prolog = None

def limpiar_string(valor):
    """Limpia y normaliza strings de Prolog"""
    if valor is None:
        return ""
    
    # Convertir a string
    texto = str(valor)
    
    # Si parece tener problemas de codificación, intentar arreglar
    if 'Ã' in texto or 'Â' in texto:
        try:
            # Convertir de latin-1 a utf-8
            texto = texto.encode('latin-1').decode('utf-8')
        except:
            pass
    
    return texto

@app.route('/')
def index():
    session['puntos'] = 0
    return render_template("index.html")

@app.route('/juego')
def juego():
    if 'puntos' not in session:
        session['puntos'] = 0
    return render_template("juego.html")

@app.route('/pregunta/<categoria>')
def obtener_pregunta(categoria):
    try:
        print(f" Solicitando pregunta para categoría: {categoria}")
        
        if prolog is None:
            return jsonify({"error": "Prolog no está disponible"}), 500
        
        categorias_validas = ['historia', 'ciencia', 'arte', 'deportes']
        if categoria not in categorias_validas:
            return jsonify({"error": "Categoría no válida"}), 400
            
        # Consultar preguntas en Prolog
        query = f"pregunta({categoria}, Pregunta, Respuesta)"
        print(f" Query: {query}")
        
        preguntas = list(prolog.query(query))
        
        if not preguntas:
            return jsonify({"error": "No hay preguntas para esta categoría"}), 404
            
        # Seleccionar pregunta aleatoria
        seleccion = random.choice(preguntas)
        
        # Limpiar strings
        pregunta_str = limpiar_string(seleccion["Pregunta"])
        respuesta_str = limpiar_string(seleccion["Respuesta"])
        
        print(f"✅ Pregunta: {pregunta_str}")
        print(f"✅ Respuesta: {respuesta_str}")
        
        return jsonify({
            "pregunta": pregunta_str,
            "respuesta": respuesta_str,
            "categoria": categoria
        })
        
    except Exception as e:
        print(f"💥 Error: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

@app.route('/verificar', methods=['POST'])
def verificar():
    try:
        data = request.json
        pregunta = data["pregunta"]
        respuesta = data["respuesta"]
        
        if prolog is None:
            return jsonify({"error": "Prolog no está disponible"}), 500
        
        # Escapar comillas
        pregunta_escaped = pregunta.replace("'", "''")
        respuesta_escaped = respuesta.replace("'", "''")
        
        query = f"respuesta_correcta('{pregunta_escaped}', '{respuesta_escaped}')"
        
        resultado = list(prolog.query(query))
        
        if 'puntos' not in session:
            session['puntos'] = 0
            
        if resultado:
            session['puntos'] += 10
            return jsonify({"correcta": True, "puntos": session['puntos']})
        else:
            return jsonify({"correcta": False, "puntos": session['puntos']})
            
    except Exception as e:
        print(f"💥 Error: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/puntos')
def obtener_puntos():
    return jsonify({"puntos": session.get('puntos', 0)})

@app.route('/resultado')
def resultado():
    puntos_finales = session.get('puntos', 0)
    return render_template("resultado.html", puntos=puntos_finales)

if __name__ == "__main__":
    app.run(debug=True, host='127.0.0.1', port=5000)