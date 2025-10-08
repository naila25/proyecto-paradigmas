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
    
    # Test de consulta
    test = list(prolog.query("pregunta(ciencia, P, O, R)"))
    print(f"✅ Test: {len(test)} preguntas de ciencia encontradas")
    
except Exception as e:
    print(f"❌ Error inicializando Prolog: {e}")
    import traceback
    traceback.print_exc()
    prolog = None

def limpiar_string(valor):
    """Limpia y normaliza strings de Prolog"""
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
    """Convierte lista de Prolog a lista de Python"""
    if isinstance(lista_prolog, list):
        return [limpiar_string(item) for item in lista_prolog]
    return []

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
        print(f"\n{'='*60}")
        print(f"🔍 Solicitando pregunta para categoría: {categoria}")
        
        if prolog is None:
            return jsonify({"error": "Prolog no está disponible"}), 500
        
        categorias_validas = ['historia', 'ciencia', 'arte', 'deportes']
        if categoria not in categorias_validas:
            return jsonify({"error": "Categoría no válida"}), 400
            
        query = f"pregunta({categoria}, Pregunta, Opciones, Respuesta)"
        print(f"🔎 Query: {query}")
        
        preguntas = list(prolog.query(query))
        print(f"📝 Preguntas encontradas: {len(preguntas)}")
        
        if not preguntas:
            return jsonify({"error": "No hay preguntas para esta categoría"}), 404
            
        seleccion = random.choice(preguntas)
        
        pregunta_str = limpiar_string(seleccion["Pregunta"])
        respuesta_str = limpiar_string(seleccion["Respuesta"])
        opciones_list = convertir_lista_prolog(seleccion["Opciones"])
        
        print(f"✅ Pregunta: '{pregunta_str}'")
        print(f"✅ Opciones: {opciones_list}")
        print(f"✅ Respuesta correcta: '{respuesta_str}'")
        print(f"   Tipo respuesta: {type(respuesta_str)}")
        print(f"   Bytes respuesta: {respuesta_str.encode('utf-8')}")
        print(f"{'='*60}\n")
        
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
        
        print(f"\n{'='*60}")
        print(f"🔍 VERIFICANDO RESPUESTA")
        print(f"{'='*60}")
        print(f"📝 Pregunta recibida:")
        print(f"   Texto: '{pregunta}'")
        print(f"   Tipo: {type(pregunta)}")
        print(f"   Bytes: {pregunta.encode('utf-8')}")
        print(f"\n👤 Respuesta del usuario:")
        print(f"   Texto: '{respuesta}'")
        print(f"   Tipo: {type(respuesta)}")
        print(f"   Longitud: {len(respuesta)}")
        print(f"   Bytes: {respuesta.encode('utf-8')}")
        print(f"   Repr: {repr(respuesta)}")
        
        if prolog is None:
            return jsonify({"error": "Prolog no está disponible"}), 500
        
        # Obtener la respuesta correcta desde Prolog
        pregunta_escaped_buscar = pregunta.replace("'", "''")
        query_buscar = f"pregunta(_, '{pregunta_escaped_buscar}', _, RC)"
        print(f"\n🔎 Buscando respuesta correcta en Prolog:")
        print(f"   Query: {query_buscar}")
        
        resultados_busqueda = list(prolog.query(query_buscar))
        if resultados_busqueda:
            respuesta_correcta_prolog = limpiar_string(resultados_busqueda[0]["RC"])
            print(f"   Respuesta correcta en Prolog: '{respuesta_correcta_prolog}'")
            print(f"   Bytes: {respuesta_correcta_prolog.encode('utf-8')}")
        else:
            print(f"   ⚠️ No se encontró la pregunta en Prolog")
        
        # Limpiar espacios
        respuesta_limpia = respuesta.strip()
        
        pregunta_escaped = pregunta.replace("'", "''")
        respuesta_escaped = respuesta_limpia.replace("'", "''")
        
        query = f"respuesta_correcta('{pregunta_escaped}', '{respuesta_escaped}')"
        print(f"\n🔎 Verificando con Prolog:")
        print(f"   Query: {query}")
        
        resultado = list(prolog.query(query))
        print(f"\n📋 Resultado de Prolog:")
        print(f"   Raw: {resultado}")
        print(f"   Cantidad: {len(resultado)}")
        print(f"   ✅ Es correcta: {len(resultado) > 0}")
        print(f"{'='*60}\n")
        
        if 'puntos' not in session:
            session['puntos'] = 0
            
        if resultado:
            session['puntos'] += 10
            return jsonify({"correcta": True, "puntos": session['puntos']})
        else:
            return jsonify({"correcta": False, "puntos": session['puntos']})
            
    except Exception as e:
        print(f"💥 Error: {str(e)}")
        import traceback
        traceback.print_exc()
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