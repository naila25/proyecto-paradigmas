# -*- coding: utf-8 -*-
import sys
import io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

from flask import Flask, render_template, request, jsonify, session
from pyswip import Prolog
import random
import logging

app = Flask(__name__)
app.secret_key = 'tu_clave_secreta_aqui_12345'
app.config['JSON_AS_ASCII'] = False

logging.basicConfig(level=logging.DEBUG, encoding='utf-8')

# Inicializar Prolog
try:
    prolog = Prolog()
    prolog.consult("preguntas.pl")
    print("✅ Prolog inicializado correctamente")
except Exception as e:
    print(f"❌ Error inicializando Prolog: {e}")
    prolog = None

def limpiar_string(valor):
    if valor is None:
        return ""
    texto = str(valor)
    if 'Ã' in texto or 'Â' in texto:
        try:
            texto = texto.encode('latin-1').decode('utf-8')
        except:
            pass
    return texto.strip()

def convertir_lista_prolog(lista_prolog):
    if isinstance(lista_prolog, list):
        return [limpiar_string(item) for item in lista_prolog]
    return []

@app.route('/')
def index():
    session.clear()
    return render_template("index.html")

@app.route('/juego')
def juego():
    num_jugadores = request.args.get('jugadores', '1')
    
    # Inicializar juego
    session['num_jugadores'] = int(num_jugadores)
    session['turno_actual'] = 1
    session['jugador1_puntos'] = 0
    session['jugador2_puntos'] = 0
    session['jugador1_vidas'] = 3
    session['jugador2_vidas'] = 3
    session['juego_terminado'] = False
    
    return render_template("juego.html", num_jugadores=int(num_jugadores))

@app.route('/pregunta/<categoria>')
def obtener_pregunta(categoria):
    try:
        if prolog is None:
            return jsonify({"error": "Prolog no está disponible"}), 500
        
        categorias_validas = ['historia', 'ciencia', 'arte', 'deportes']
        if categoria not in categorias_validas:
            return jsonify({"error": "Categoría no válida"}), 400
            
        query = f"pregunta({categoria}, Pregunta, Opciones, Respuesta)"
        preguntas = list(prolog.query(query))
        
        if not preguntas:
            return jsonify({"error": "No hay preguntas para esta categoría"}), 404
            
        seleccion = random.choice(preguntas)
        
        pregunta_str = limpiar_string(seleccion["Pregunta"])
        respuesta_str = limpiar_string(seleccion["Respuesta"])
        opciones_list = convertir_lista_prolog(seleccion["Opciones"])
        
        return jsonify({
            "pregunta": pregunta_str,
            "opciones": opciones_list,
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
        
        pregunta_escaped = pregunta.replace("'", "''")
        respuesta_escaped = respuesta.replace("'", "''")
        
        query = f"respuesta_correcta('{pregunta_escaped}', '{respuesta_escaped}')"
        resultado = list(prolog.query(query))
        
        num_jugadores = session.get('num_jugadores', 1)
        turno_actual = session.get('turno_actual', 1)
        
        es_correcta = len(resultado) > 0
        
        if num_jugadores == 1:
            # Modo 1 jugador
            if 'jugador1_puntos' not in session:
                session['jugador1_puntos'] = 0
            
            if es_correcta:
                session['jugador1_puntos'] += 10
            
            return jsonify({
                "correcta": es_correcta,
                "puntos": session['jugador1_puntos'],
                "modo": "individual"
            })
        
        else:
            # Modo 2 jugadores
            if es_correcta:
                if turno_actual == 1:
                    session['jugador1_puntos'] += 10
                else:
                    session['jugador2_puntos'] += 10
            else:
                # Quitar una vida si es incorrecta
                if turno_actual == 1:
                    session['jugador1_vidas'] -= 1
                else:
                    session['jugador2_vidas'] -= 1
            
            # Verificar si alguien perdió todas sus vidas
            jugador1_vidas = session.get('jugador1_vidas', 3)
            jugador2_vidas = session.get('jugador2_vidas', 3)
            
            ganador = None
            if jugador1_vidas <= 0:
                ganador = 2
                session['juego_terminado'] = True
            elif jugador2_vidas <= 0:
                ganador = 1
                session['juego_terminado'] = True
            
            # Cambiar turno si la respuesta fue incorrecta o si el juego no terminó
            if not es_correcta and not session.get('juego_terminado', False):
                session['turno_actual'] = 2 if turno_actual == 1 else 1
            
            return jsonify({
                "correcta": es_correcta,
                "modo": "multijugador",
                "turno_actual": session.get('turno_actual', 1),
                "jugador1_puntos": session.get('jugador1_puntos', 0),
                "jugador2_puntos": session.get('jugador2_puntos', 0),
                "jugador1_vidas": session.get('jugador1_vidas', 3),
                "jugador2_vidas": session.get('jugador2_vidas', 3),
                "juego_terminado": session.get('juego_terminado', False),
                "ganador": ganador
            })
            
    except Exception as e:
        print(f"💥 Error: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

@app.route('/estado-juego')
def estado_juego():
    """Retorna el estado actual del juego"""
    return jsonify({
        "num_jugadores": session.get('num_jugadores', 1),
        "turno_actual": session.get('turno_actual', 1),
        "jugador1_puntos": session.get('jugador1_puntos', 0),
        "jugador2_puntos": session.get('jugador2_puntos', 0),
        "jugador1_vidas": session.get('jugador1_vidas', 3),
        "jugador2_vidas": session.get('jugador2_vidas', 3),
        "juego_terminado": session.get('juego_terminado', False)
    })

@app.route('/resultado')
def resultado():
    num_jugadores = session.get('num_jugadores', 1)
    
    if num_jugadores == 1:
        puntos = session.get('jugador1_puntos', 0)
        return render_template("resultado.html", 
                             modo="individual",
                             puntos=puntos)
    else:
        jugador1_puntos = session.get('jugador1_puntos', 0)
        jugador2_puntos = session.get('jugador2_puntos', 0)
        jugador1_vidas = session.get('jugador1_vidas', 3)
        jugador2_vidas = session.get('jugador2_vidas', 3)
        
        # Determinar ganador
        if jugador1_vidas <= 0:
            ganador = 2
        elif jugador2_vidas <= 0:
            ganador = 1
        elif jugador1_puntos > jugador2_puntos:
            ganador = 1
        elif jugador2_puntos > jugador1_puntos:
            ganador = 2
        else:
            ganador = 0  # Empate
        
        return render_template("resultado.html",
                             modo="multijugador",
                             ganador=ganador,
                             jugador1_puntos=jugador1_puntos,
                             jugador2_puntos=jugador2_puntos,
                             jugador1_vidas=jugador1_vidas,
                             jugador2_vidas=jugador2_vidas)

if __name__ == "__main__":
    app.run(debug=True, host='127.0.0.1', port=5000)