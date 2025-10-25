# -*- coding: utf-8 -*-
import sys
import io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

from flask import Flask, render_template, request, jsonify, session
from pyswip import Prolog
import random
import logging
from database import guardar_partida, guardar_estadisticas, obtener_ranking, obtener_estadisticas_globales

app = Flask(__name__)
app.secret_key = 'tu_clave_secreta_aqui_12345_cambiar_en_produccion'
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

@app.route('/nombres')
def nombres():
    jugadores = request.args.get('jugadores', '1')
    return render_template('nombres.html', jugadores=jugadores)

@app.route('/juego')
def juego():
    num_jugadores = request.args.get('jugadores', '1')
    nombre1 = request.args.get('nombre1', 'Jugador 1')
    nombre2 = request.args.get('nombre2', 'Jugador 2')
    
    # Guardar nombres en la sesión
    session['nombre1'] = nombre1
    session['nombre2'] = nombre2
    # Inicializar juego
    session['num_jugadores'] = int(num_jugadores)
    session['turno_actual'] = 1
    session['jugador1_puntos'] = 0
    session['jugador2_puntos'] = 0
    session['jugador1_vidas'] = 3
    session['jugador2_vidas'] = 3
    session['juego_terminado'] = False
    
    # Inicializar comodines (3 comodines)
    session['jugador1_comodin_5050'] = True
    session['jugador2_comodin_5050'] = True
    session['jugador1_comodin_cambiar'] = True
    session['jugador2_comodin_cambiar'] = True
    session['jugador1_comodin_saltar'] = True
    session['jugador2_comodin_saltar'] = True
    
    # Inicializar rachas
    session['jugador1_racha'] = 0
    session['jugador2_racha'] = 0
    session['jugador1_mejor_racha'] = 0
    session['jugador2_mejor_racha'] = 0
    
    # Inicializar estadísticas por categoría
    session['stats_categorias'] = {
        'historia': {'correctas': 0, 'total': 0},
        'ciencia': {'correctas': 0, 'total': 0},
        'arte': {'correctas': 0, 'total': 0},
        'deportes': {'correctas': 0, 'total': 0}
    }
    
    # Tracking de preguntas usadas
    session['preguntas_usadas'] = []
    
    # Tiempo de inicio
    import time
    session['tiempo_inicio'] = int(time.time())

    return render_template("juego.html", num_jugadores=int(num_jugadores), nombre1=nombre1, nombre2=nombre2)

@app.route('/pregunta/<categoria>')
def obtener_pregunta(categoria):
    try:
        if prolog is None:
            return jsonify({"error": "Prolog no está disponible"}), 500
        
        categorias_validas = ['historia', 'ciencia', 'arte', 'deportes']
        if categoria not in categorias_validas:
            return jsonify({"error": "Categoría no válida"}), 400
        
        # Obtener pregunta completa con dificultad y puntos
        query = f"pregunta_completa({categoria}, Pregunta, Opciones, Respuesta, Dificultad, Puntos)"
        preguntas = list(prolog.query(query))
        
        if not preguntas:
            return jsonify({"error": "No hay preguntas para esta categoría"}), 404
        
        # Filtrar preguntas ya usadas
        preguntas_usadas = session.get('preguntas_usadas', [])
        preguntas_disponibles = [p for p in preguntas if limpiar_string(p["Pregunta"]) not in preguntas_usadas]
        
        # Si se acabaron las preguntas, reiniciar pool
        if not preguntas_disponibles:
            session['preguntas_usadas'] = []
            preguntas_disponibles = preguntas
        
        seleccion = random.choice(preguntas_disponibles)
        
        pregunta_str = limpiar_string(seleccion["Pregunta"])
        respuesta_str = limpiar_string(seleccion["Respuesta"])
        opciones_list = convertir_lista_prolog(seleccion["Opciones"])
        dificultad_str = limpiar_string(seleccion["Dificultad"])
        puntos = int(seleccion["Puntos"])
        
        # Agregar pregunta a las usadas
        if 'preguntas_usadas' not in session:
            session['preguntas_usadas'] = []
        session['preguntas_usadas'].append(pregunta_str)
        session.modified = True
        
        return jsonify({
            "pregunta": pregunta_str,
            "opciones": opciones_list,
            "respuesta": respuesta_str,
            "categoria": categoria,
            "dificultad": dificultad_str,
            "puntos": puntos
        })
        
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

@app.route('/usar-comodin', methods=['POST'])
def usar_comodin():
    try:
        data = request.json
        comodin = data.get('comodin')
        opciones = data.get('opciones', [])
        respuesta_correcta = data.get('respuesta_correcta')
        categoria = data.get('categoria', '')
        
        num_jugadores = session.get('num_jugadores', 1)
        turno_actual = session.get('turno_actual', 1)
        
        # Determinar qué jugador está usando el comodín
        if num_jugadores == 1:
            jugador_key = 'jugador1'
        else:
            jugador_key = f'jugador{turno_actual}'
        
        # COMODÍN 50/50
        if comodin == '5050':
            comodin_key = f'{jugador_key}_comodin_5050'
            if not session.get(comodin_key, False):
                return jsonify({"error": "Comodín ya usado"}), 400
            session[comodin_key] = False
            
            # Eliminar 2 opciones incorrectas
            opciones_incorrectas = [op for op in opciones if op != respuesta_correcta]
            opciones_a_eliminar = random.sample(opciones_incorrectas, min(2, len(opciones_incorrectas)))
            opciones_restantes = [op for op in opciones if op not in opciones_a_eliminar]
            
            session.modified = True
            
            return jsonify({
                "success": True,
                "tipo": "5050",
                "opciones_restantes": opciones_restantes,
                "opciones_eliminadas": opciones_a_eliminar
            })
        
        # COMODÍN CAMBIAR PREGUNTA
        elif comodin == 'cambiar':
            comodin_key = f'{jugador_key}_comodin_cambiar'
            if not session.get(comodin_key, False):
                return jsonify({"error": "Comodín ya usado"}), 400
            session[comodin_key] = False
            session.modified = True
            
            # Obtener nueva pregunta de la misma categoría
            if prolog is None:
                return jsonify({"error": "Prolog no disponible"}), 500
            
            query = f"pregunta_completa({categoria}, Pregunta, Opciones, Respuesta, Dificultad, Puntos)"
            preguntas = list(prolog.query(query))
            
            if not preguntas:
                return jsonify({"error": "No hay más preguntas"}), 404
            
            # Filtrar pregunta actual y preguntas usadas
            preguntas_usadas = session.get('preguntas_usadas', [])
            preguntas_disponibles = [p for p in preguntas 
                                    if limpiar_string(p["Pregunta"]) not in preguntas_usadas]
            
            if not preguntas_disponibles:
                return jsonify({"error": "No hay más preguntas disponibles"}), 404
            
            seleccion = random.choice(preguntas_disponibles)
            
            pregunta_str = limpiar_string(seleccion["Pregunta"])
            respuesta_str = limpiar_string(seleccion["Respuesta"])
            opciones_list = convertir_lista_prolog(seleccion["Opciones"])
            dificultad_str = limpiar_string(seleccion["Dificultad"])
            puntos = int(seleccion["Puntos"])
            
            # Agregar a preguntas usadas
            session['preguntas_usadas'].append(pregunta_str)
            session.modified = True
            
            return jsonify({
                "success": True,
                "tipo": "cambiar",
                "pregunta": pregunta_str,
                "opciones": opciones_list,
                "respuesta": respuesta_str,
                "dificultad": dificultad_str,
                "puntos": puntos,
                "categoria": categoria
            })
        
        # COMODÍN SALTAR PREGUNTA
        elif comodin == 'saltar':
            comodin_key = f'{jugador_key}_comodin_saltar'
            if not session.get(comodin_key, False):
                return jsonify({"error": "Comodín ya usado"}), 400
            session[comodin_key] = False
            session.modified = True
            
            return jsonify({
                "success": True,
                "tipo": "saltar"
            })
        
        return jsonify({"error": "Comodín no válido"}), 400
        
    except Exception as e:
        print(f"❌ Error usando comodín: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

@app.route('/verificar', methods=['POST'])
def verificar():
    try:
        data = request.json
        pregunta = data["pregunta"]
        respuesta = data["respuesta"]
        categoria = data.get("categoria", "")
        puntos_pregunta = data.get("puntos", 10)
        
        if prolog is None:
            return jsonify({"error": "Prolog no está disponible"}), 500
        
        pregunta_escaped = pregunta.replace("'", "''")
        respuesta_escaped = respuesta.replace("'", "''")
        
        query = f"respuesta_correcta('{pregunta_escaped}', '{respuesta_escaped}')"
        resultado = list(prolog.query(query))
        
        num_jugadores = session.get('num_jugadores', 1)
        turno_actual = session.get('turno_actual', 1)
        
        es_correcta = len(resultado) > 0
        
        # Actualizar estadísticas por categoría
        if 'stats_categorias' not in session:
            session['stats_categorias'] = {
                'historia': {'correctas': 0, 'total': 0},
                'ciencia': {'correctas': 0, 'total': 0},
                'arte': {'correctas': 0, 'total': 0},
                'deportes': {'correctas': 0, 'total': 0}
            }
        
        if categoria in session['stats_categorias']:
            session['stats_categorias'][categoria]['total'] += 1
            if es_correcta:
                session['stats_categorias'][categoria]['correctas'] += 1
        
        if num_jugadores == 1:
            # Modo 1 jugador
            if 'jugador1_puntos' not in session:
                session['jugador1_puntos'] = 0
            if 'jugador1_racha' not in session:
                session['jugador1_racha'] = 0
            if 'jugador1_mejor_racha' not in session:
                session['jugador1_mejor_racha'] = 0
            
            bonus_racha = 0
            
            if es_correcta:
                session['jugador1_puntos'] += puntos_pregunta
                session['jugador1_racha'] += 1
                
                # Actualizar mejor racha
                if session['jugador1_racha'] > session['jugador1_mejor_racha']:
                    session['jugador1_mejor_racha'] = session['jugador1_racha']
                
                # Bonus por racha
                if session['jugador1_racha'] >= 3:
                    bonus_racha = session['jugador1_racha'] * 5
                    session['jugador1_puntos'] += bonus_racha
            else:
                session['jugador1_racha'] = 0
            
            session.modified = True
            
            return jsonify({
                "correcta": es_correcta,
                "puntos": session['jugador1_puntos'],
                "racha": session['jugador1_racha'],
                "mejor_racha": session['jugador1_mejor_racha'],
                "bonus_racha": bonus_racha,
                "modo": "individual"
            })
        
        else:
            # Modo 2 jugadores
            racha_key = f'jugador{turno_actual}_racha'
            mejor_racha_key = f'jugador{turno_actual}_mejor_racha'
            
            if racha_key not in session:
                session[racha_key] = 0
            if mejor_racha_key not in session:
                session[mejor_racha_key] = 0
            
            bonus_racha = 0
            
            if es_correcta:
                if turno_actual == 1:
                    session['jugador1_puntos'] += puntos_pregunta
                    session['jugador1_racha'] += 1
                    
                    if session['jugador1_racha'] > session['jugador1_mejor_racha']:
                        session['jugador1_mejor_racha'] = session['jugador1_racha']
                    
                    if session['jugador1_racha'] >= 3:
                        bonus_racha = session['jugador1_racha'] * 5
                        session['jugador1_puntos'] += bonus_racha
                else:
                    session['jugador2_puntos'] += puntos_pregunta
                    session['jugador2_racha'] += 1
                    
                    if session['jugador2_racha'] > session['jugador2_mejor_racha']:
                        session['jugador2_mejor_racha'] = session['jugador2_racha']
                    
                    if session['jugador2_racha'] >= 3:
                        bonus_racha = session['jugador2_racha'] * 5
                        session['jugador2_puntos'] += bonus_racha
            else:
                # Quitar una vida si es incorrecta
                if turno_actual == 1:
                    session['jugador1_vidas'] -= 1
                    session['jugador1_racha'] = 0
                else:
                    session['jugador2_vidas'] -= 1
                    session['jugador2_racha'] = 0
            
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
            
            session.modified = True
            
            return jsonify({
                "correcta": es_correcta,
                "modo": "multijugador",
                "turno_actual": session.get('turno_actual', 1),
                "jugador1_puntos": session.get('jugador1_puntos', 0),
                "jugador2_puntos": session.get('jugador2_puntos', 0),
                "jugador1_vidas": session.get('jugador1_vidas', 3),
                "jugador2_vidas": session.get('jugador2_vidas', 3),
                "jugador1_racha": session.get('jugador1_racha', 0),
                "jugador2_racha": session.get('jugador2_racha', 0),
                "bonus_racha": bonus_racha,
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
    num_jugadores = session.get('num_jugadores', 1)
    
    response = {
        "num_jugadores": num_jugadores,
        "turno_actual": session.get('turno_actual', 1),
        "jugador1_puntos": session.get('jugador1_puntos', 0),
        "jugador2_puntos": session.get('jugador2_puntos', 0) if num_jugadores == 2 else 0,
        "jugador1_vidas": session.get('jugador1_vidas', 3),
        "jugador2_vidas": session.get('jugador2_vidas', 3) if num_jugadores == 2 else 3,
        "juego_terminado": session.get('juego_terminado', False),
        "jugador1_comodin_5050": session.get('jugador1_comodin_5050', True),
        "jugador2_comodin_5050": session.get('jugador2_comodin_5050', True) if num_jugadores == 2 else True,
        "jugador1_comodin_cambiar": session.get('jugador1_comodin_cambiar', True),
        "jugador2_comodin_cambiar": session.get('jugador2_comodin_cambiar', True) if num_jugadores == 2 else True,
        "jugador1_comodin_saltar": session.get('jugador1_comodin_saltar', True),
        "jugador2_comodin_saltar": session.get('jugador2_comodin_saltar', True) if num_jugadores == 2 else True,
        "jugador1_racha": session.get('jugador1_racha', 0),
        "jugador2_racha": session.get('jugador2_racha', 0) if num_jugadores == 2 else 0
    }
    
    return jsonify(response)

@app.route('/resultado')
def resultado():
    num_jugadores = session.get('num_jugadores', 1)
    stats = session.get('stats_categorias', {})
    
    # Calcular duración
    import time
    tiempo_inicio = session.get('tiempo_inicio', int(time.time()))
    duracion = int(time.time()) - tiempo_inicio
    
    if num_jugadores == 1:
        puntos = session.get('jugador1_puntos', 0)
        mejor_racha = session.get('jugador1_mejor_racha', 0)
        
        # Guardar en base de datos
        partida_id = guardar_partida("individual", puntos, 0, 1, duracion,session.get('nombre1','Jugador 1'),"")
        if partida_id:
            guardar_estadisticas(partida_id, stats)
        
        return render_template("resultado.html", 
                             modo="individual",
                             puntos=puntos,
                             mejor_racha=mejor_racha,
                             stats=stats,
                             duracion=duracion)
    else:
        jugador1_puntos = session.get('jugador1_puntos', 0)
        jugador2_puntos = session.get('jugador2_puntos', 0)
        jugador1_vidas = session.get('jugador1_vidas', 3)
        jugador2_vidas = session.get('jugador2_vidas', 3)
        jugador1_mejor_racha = session.get('jugador1_mejor_racha', 0)
        jugador2_mejor_racha = session.get('jugador2_mejor_racha', 0)
        nombre1 = session.get('nombre1', 'Jugador 1')
        nombre2 = session.get('nombre2', 'Jugador 2')
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
        
        # Guardar en base de datos
        partida_id = guardar_partida("multijugador", jugador1_puntos, jugador2_puntos, ganador, duracion,session.get('nombre1','Jugador 1'),session.get('nombre2','Jugador 2'))
        if partida_id:
            guardar_estadisticas(partida_id, stats)
        
        return render_template("resultado.html",
                             modo="multijugador",
                             ganador=ganador,
                             jugador1_puntos=jugador1_puntos,
                             jugador2_puntos=jugador2_puntos,
                             jugador1_vidas=jugador1_vidas,
                             jugador2_vidas=jugador2_vidas,
                             jugador1_mejor_racha=jugador1_mejor_racha,
                             jugador2_mejor_racha=jugador2_mejor_racha,
                            nombre1=nombre1,    
                            nombre2=nombre2,
                             stats=stats,
                             duracion=duracion)

@app.route('/ranking')
def ranking():
    """Muestra el ranking de mejores puntuaciones"""
    ranking_individual = obtener_ranking('individual', 10)
    ranking_multi = obtener_ranking('multijugador', 10)
    stats_globales = obtener_estadisticas_globales()
    
    return render_template("ranking.html", 
                         ranking_individual=ranking_individual,
                         ranking_multi=ranking_multi,
                         stats=stats_globales)

if __name__ == "__main__":
    app.run(debug=True, host='127.0.0.1', port=5000)