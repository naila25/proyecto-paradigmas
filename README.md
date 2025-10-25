
# 🎓 Trivia Universitaria - Proyecto de Paradigmas de Programación

## 📋 Descripción

Juego de trivia interactivo que integra **programación lógica (Prolog)** con **desarrollo web moderno (Flask/Python)**, demostrando la aplicación práctica de múltiples paradigmas de programación.

## ✨ Características Principales

### 🎯 Gameplay
- **Más de 60 preguntas** distribuidas en 4 categorías: Historia, Ciencia, Arte y Deportes
- **3 niveles de dificultad** con sistema de puntuación variable:
  - ⭐ Fácil: 10 puntos
  - ⭐⭐ Media: 20 puntos
  - ⭐⭐⭐ Difícil: 30 puntos

### 🎮 Modos de Juego
1. **Modo Individual**: Juega solo y supera tu récord personal
2. **Modo Multijugador**: Desafía a un amigo en partidas cara a cara con sistema de vidas (3 vidas por jugador)

### 🔥 Sistema de Rachas
- Consigue **3 o más respuestas correctas seguidas** para activar el modo racha
- Gana **+5 puntos adicionales** por cada respuesta en racha
- Las rachas se resetean al fallar

### 🎁 Comodines
- **50/50**: Elimina 2 respuestas incorrectas (1 uso por partida)

### 📊 Estadísticas y Ranking
- Sistema de **persistencia con SQLite**
- Ranking histórico de mejores puntuaciones
- Estadísticas detalladas por categoría
- Gráficos visuales con Chart.js
- Tracking de mejor racha personal

### 🎵 Efectos de Sonido
- Sonidos interactivos usando Web Audio API
- Feedback auditivo para aciertos, errores y giros de ruleta

## 🛠️ Tecnologías Utilizadas

### Backend
- **Python 3.x** - Lenguaje principal
- **Flask 2.3** - Framework web
- **SWI-Prolog** - Motor de inferencia lógica
- **pyswip 0.2.10** - Puente Python-Prolog
- **SQLite3** - Base de datos embebida

### Frontend
- **HTML5 / CSS3** - Estructura y estilos
- **JavaScript (ES6+)** - Interactividad
- **TailwindCSS** - Framework de diseño
- **Chart.js** - Visualización de datos
- **Canvas API** - Animación de la ruleta

### Paradigmas Implementados
- ✅ **Programación Lógica**: Base de conocimiento en Prolog con reglas de inferencia
- ✅ **Programación Orientada a Objetos**: Estructura de clases en Python
- ✅ **Programación Funcional**: Uso de funciones de orden superior y lambdas
- ✅ **Programación Imperativa**: Lógica de control de flujo

## 📦 Instalación

### Prerrequisitos
1. **Python 3.8+** instalado
2. **SWI-Prolog** instalado en tu sistema

#### Instalar SWI-Prolog:
- **Windows**: Descargar de [https://www.swi-prolog.org/download/stable](https://www.swi-prolog.org/download/stable)
- **macOS**: `brew install swi-prolog`
- **Linux**: `sudo apt-get install swi-prolog`

### Pasos de Instalación
```bash
# 1. Clonar o descargar el proyecto
cd trivia-universitaria

# 2. Instalar dependencias de Python
pip install -r requirements.txt

# 3. Verificar que Prolog esté accesible
swipl --version

# 4. Ejecutar la aplicación
python app.py

# 5. Abrir en el navegador
# http://127.0.0.1:5000
```

## 📁 Estructura del Proyecto
```
trivia-universitaria/
│
├── app.py                      # Aplicación Flask principal
├── database.py                 # Manejo de base de datos SQLite
├── preguntas.pl                # Base de conocimiento Prolog
├── requirements.txt            # Dependencias Python
├── README.md                   # Este archivo
├── trivia.db                   # Base de datos (se crea automáticamente)
│
├── static/
│   └── js/
│       └── ruleta.js          # Lógica del frontend
│
└── templates/
    ├── index.html             # Página principal
    ├── juego.html             # Interfaz de juego
    ├── resultado.html         # Pantalla de resultados
    └── ranking.html           # Tabla de clasificación
```

## 🧠 Reglas Prolog Implementadas

El sistema utiliza **10+ reglas lógicas** en Prolog:

1. **`puntos_por_dificultad/2`**: Asigna puntos según nivel de dificultad
2. **`pregunta_de_categoria/2`**: Verifica si una pregunta pertenece a una categoría
3. **`contar_preguntas/2`**: Cuenta preguntas disponibles por categoría
4. **`preguntas_por_dificultad/2`**: Filtra preguntas por nivel
5. **`respuesta_correcta/2`**: Valida respuestas del usuario
6. **`obtener_dificultad/2`**: Extrae la dificultad de una pregunta
7. **`categoria_completa/1`**: Verifica si hay suficientes preguntas
8. **`pregunta_completa/6`**: Obtiene pregunta con todos sus metadatos
9. **`nivel_dificultad/2`**: Convierte dificultad a valor numérico
10. **`mas_dificil/2`**: Compara dificultad entre dos preguntas

## 🎮 Cómo Jugar

### Modo Individual
1. Selecciona "1 Jugador" en el menú principal
2. Gira la ruleta para seleccionar una categoría
3. Responde la pregunta mostrada
4. Usa el comodín 50/50 estratégicamente
5. Intenta mantener rachas de respuestas correctas
6. Al terminar, revisa tus estadísticas y compara con el ranking

### Modo Multijugador
1. Selecciona "2 Jugadores" en el menú principal
2. Los jugadores se turnan para responder preguntas
3. Cada jugador tiene **3 vidas** ❤️❤️❤️
4. Se pierde una vida por cada respuesta incorrecta
5. El turno cambia al fallar una pregunta
6. Gana quien mantenga vidas o tenga más puntos al final

## 📊 Sistema de Puntuación
```
Puntos Base:
- Pregunta Fácil: 10 puntos
- Pregunta Media: 20 puntos
- Pregunta Difícil: 30 puntos

Bonus por Racha (≥3 respuestas correctas seguidas):
- Racha de 3: +15 puntos (3 × 5)
- Racha de 4: +20 puntos (4 × 5)
- Racha de 5: +25 puntos (5 × 5)
- ... y así sucesivamente
```

## 🗄️ Base de Datos

La aplicación crea automáticamente una base de datos SQLite (`trivia.db`) con dos tablas:

### Tabla `partidas`
- Almacena información de cada partida jugada
- Campos: id, fecha, modo, puntos jugadores, ganador, duración

### Tabla `estadisticas`
- Registra desempeño por categoría
- Campos: id, partida_id, categoría, correctas, total

## 🔧 Configuración Avanzada

### Cambiar Puerto
En `app.py`, línea final:
```python
app.run(debug=True, host='127.0.0.1', port=5000)  # Cambiar 5000 por el puerto deseado
```

### Agregar Más Preguntas
Edita `preguntas.pl` siguiendo este formato:
```prolog
pregunta(categoria, 'Texto de la pregunta?',
         ['Opción 1', 'Opción 2', 'Opción 3', 'Opción 4'],
         'Respuesta Correcta', dificultad).
```

### Modificar Secret Key
En `app.py`, cambia:
```python
app.secret_key = 'tu_clave_super_secreta_aqui'
```

## 🐛 Solución de Problemas

### Error: "Prolog no está disponible"
- Verifica que SWI-Prolog esté instalado: `swipl --version`
- Asegúrate de que esté en el PATH del sistema
- Reinstala pyswip: `pip install --upgrade pyswip`

### Error: "No module named 'flask'"
```bash
pip install flask
```

### Error: "Unable to consult preguntas.pl"
- Verifica que `preguntas.pl` esté en la misma carpeta que `app.py`
- Comprueba que no haya errores de sintaxis en el archivo Prolog

### La ruleta no gira
- Verifica que JavaScript esté habilitado en tu navegador
- Revisa la consola del navegador (F12) para errores
- Asegúrate de que `static/js/ruleta.js` exista

## 📝 Licencia

Este proyecto es de código abierto para fines educativos.

## 👨‍💻 Autor

Proyecto desarrollado como trabajo final del curso de **Paradigmas de Programación**.

## 🙏 Agradecimientos

- SWI-Prolog por el motor de inferencia lógica
- Flask por el framework web minimalista
- TailwindCSS por el sistema de diseño
- Chart.js por las visualizaciones de datos

---

**¿Preguntas o problemas?** Abre un issue o contacta al desarrollador.

**¡Disfruta jugando y aprendiendo! 🎓🎮**