
# database.py
# -*- coding: utf-8 -*-
import sqlite3
from datetime import datetime

DB_NAME = 'trivia.db'

def init_db():
    """Inicializa la base de datos con las tablas necesarias"""
    conn = sqlite3.connect(DB_NAME)
    c = conn.cursor()
    
    # Tabla de partidas
    c.execute('''CREATE TABLE IF NOT EXISTS partidas
                 (id INTEGER PRIMARY KEY AUTOINCREMENT,
                  fecha TEXT,
                  modo TEXT,
                  jugador1_puntos INTEGER,
                  jugador2_puntos INTEGER,
                  ganador INTEGER,
                  duracion INTEGER)''')
    
    # Tabla de estadísticas por categoría
    c.execute('''CREATE TABLE IF NOT EXISTS estadisticas
                 (id INTEGER PRIMARY KEY AUTOINCREMENT,
                  partida_id INTEGER,
                  categoria TEXT,
                  correctas INTEGER,
                  total INTEGER,
                  FOREIGN KEY (partida_id) REFERENCES partidas(id))''')
    
    conn.commit()
    conn.close()
    print("✅ Base de datos inicializada")

def guardar_partida(modo, j1_puntos, j2_puntos, ganador, duracion=0):
    """Guarda una partida en la base de datos"""
    try:
        conn = sqlite3.connect(DB_NAME)
        c = conn.cursor()
        fecha = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        c.execute("INSERT INTO partidas (fecha, modo, jugador1_puntos, jugador2_puntos, ganador, duracion) VALUES (?, ?, ?, ?, ?, ?)",
                  (fecha, modo, j1_puntos, j2_puntos, ganador, duracion))
        partida_id = c.lastrowid
        conn.commit()
        conn.close()
        return partida_id
    except Exception as e:
        print(f"Error guardando partida: {e}")
        return None

def guardar_estadisticas(partida_id, stats):
    """Guarda estadísticas por categoría de una partida"""
    try:
        conn = sqlite3.connect(DB_NAME)
        c = conn.cursor()
        for categoria, datos in stats.items():
            c.execute("INSERT INTO estadisticas (partida_id, categoria, correctas, total) VALUES (?, ?, ?, ?)",
                      (partida_id, categoria, datos['correctas'], datos['total']))
        conn.commit()
        conn.close()
    except Exception as e:
        print(f"Error guardando estadísticas: {e}")

def obtener_ranking(modo='individual', limit=10):
    """Obtiene el ranking de mejores puntuaciones"""
    try:
        conn = sqlite3.connect(DB_NAME)
        c = conn.cursor()
        if modo == 'individual':
            c.execute("""SELECT jugador1_puntos as puntos, fecha 
                         FROM partidas 
                         WHERE modo='individual' 
                         ORDER BY puntos DESC 
                         LIMIT ?""", (limit,))
        else:
            c.execute("""SELECT jugador1_puntos, jugador2_puntos, ganador, fecha 
                         FROM partidas 
                         WHERE modo='multijugador' 
                         ORDER BY fecha DESC 
                         LIMIT ?""", (limit,))
        resultados = c.fetchall()
        conn.close()
        return resultados
    except Exception as e:
        print(f"Error obteniendo ranking: {e}")
        return []

def obtener_estadisticas_globales():
    """Obtiene estadísticas globales del juego"""
    try:
        conn = sqlite3.connect(DB_NAME)
        c = conn.cursor()
        
        # Total de partidas
        c.execute("SELECT COUNT(*) FROM partidas")
        total_partidas = c.fetchone()[0]
        
        # Promedio de puntos
        c.execute("SELECT AVG(jugador1_puntos) FROM partidas WHERE modo='individual'")
        avg_puntos = c.fetchone()[0] or 0
        
        # Mejor puntuación
        c.execute("SELECT MAX(jugador1_puntos) FROM partidas")
        mejor_puntuacion = c.fetchone()[0] or 0
        
        conn.close()
        return {
            'total_partidas': total_partidas,
            'promedio_puntos': round(avg_puntos, 2),
            'mejor_puntuacion': mejor_puntuacion
        }
    except Exception as e:
        print(f"Error obteniendo estadísticas globales: {e}")
        return {'total_partidas': 0, 'promedio_puntos': 0, 'mejor_puntuacion': 0}

# Inicializar DB al importar
init_db()