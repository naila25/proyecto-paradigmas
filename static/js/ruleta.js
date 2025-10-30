const canvas = document.getElementById("ruleta");
const ctx = canvas.getContext("2d");
const boton = document.getElementById("botonGirar");

const categorias = ["arte", "deportes", "historia", "ciencia", "musica", "geografia", "cine"];
const colores = ["#3B82F6", "#EAB308", "#EF4444", "#22C55E", "#a855f7", "#06b6d4", "#f97316"];

const tam = canvas.width / 2;

let anguloInicio = 0;
let girando = false;

// ✨ NUEVO: Temporizador
let temporizadorIntervalo = null;
let tiempoRestante = 20;

// Estado del juego
let estadoJuego = {
  numJugadores: NUM_JUGADORES,
  turnoActual: 1,
  jugador1Puntos: 0,
  jugador2Puntos: 0,
  jugador1Vidas: 3,
  jugador2Vidas: 3,
  jugador1Comodin5050: true,
  jugador2Comodin5050: true,
  jugador1ComodinCambiar: true,
  jugador2ComodinCambiar: true,
  jugador1ComodinSaltar: true,
  jugador2ComodinSaltar: true,
  jugador1Racha: 0,
  jugador2Racha: 0,
  juegoTerminado: false,
  categoriaBloqueada: null  // ✨ NUEVO
};

// Variables para la pregunta actual
let preguntaActual = null;
let opcionesOriginales = [];
let opcionesEliminadas = [];

function dibujarRuleta() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  anguloInicio = 0;

  for (let i = 0; i < categorias.length; i++) {
    const angulo = (2 * Math.PI) / categorias.length;

    ctx.beginPath();
    ctx.moveTo(tam, tam);
    ctx.arc(tam, tam, tam - 10, anguloInicio, anguloInicio + angulo);
    ctx.fillStyle = colores[i];
    ctx.fill();
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.save();
    ctx.translate(tam, tam);
    ctx.rotate(anguloInicio + angulo / 2);
    ctx.textAlign = "right";
    ctx.fillStyle = "white";
    ctx.font = "bold 18px Arial";
    ctx.shadowColor = "black";
    ctx.shadowBlur = 2;
    ctx.fillText(categorias[i].toUpperCase(), tam - 30, 5);
    ctx.restore();

    anguloInicio += angulo;
  }
}

function actualizarInfoJugadores() {
  const infoDiv = document.getElementById("info-jugadores");
  if (estadoJuego.numJugadores === 1) {
    const vidas = '❤️'.repeat(estadoJuego.jugador1Vidas) + '🖤'.repeat(3 - estadoJuego.jugador1Vidas);
    const rachaHTML = estadoJuego.jugador1Racha >= 3
      ? `<p class="text-lg">🔥 Racha: <span class="text-yellow-300 font-bold">${estadoJuego.jugador1Racha}</span></p>`
      : '';

    infoDiv.innerHTML = `
      <div class="bg-blue-500/30 backdrop-blur-md rounded-lg p-4 inline-block text-center">
        <p class="text-xl font-bold">👤 ${estadoJuego.nombre1}</p>
        <p class="text-2xl">${estadoJuego.jugador1Puntos} puntos</p>
        <p class="text-lg">${vidas}</p>
        ${rachaHTML}
      </div>
    `;
  } else {

    const turno1 = estadoJuego.turnoActual === 1 ? 'ring-4 ring-yellow-400 animate-pulse' : '';
    const turno2 = estadoJuego.turnoActual === 2 ? 'ring-4 ring-yellow-400 animate-pulse' : '';

    const vidas1 = '❤️'.repeat(estadoJuego.jugador1Vidas) + '🖤'.repeat(3 - estadoJuego.jugador1Vidas);
    const vidas2 = '❤️'.repeat(estadoJuego.jugador2Vidas) + '🖤'.repeat(3 - estadoJuego.jugador2Vidas);

    const racha1HTML = estadoJuego.jugador1Racha >= 3
      ? `<p class="text-sm">🔥 Racha: ${estadoJuego.jugador1Racha}</p>`
      : '';
    const racha2HTML = estadoJuego.jugador2Racha >= 3
      ? `<p class="text-sm">🔥 Racha: ${estadoJuego.jugador2Racha}</p>`
      : '';

    infoDiv.innerHTML = `
      <div class="flex gap-4 justify-center flex-wrap">
        <div class="bg-blue-500/30 backdrop-blur-md rounded-lg p-4 ${turno1} transition-all">
          <p class="text-xl font-bold">👤 ${estadoJuego.nombre1}</p>
          <p class="text-2xl">${estadoJuego.jugador1Puntos} puntos</p>
          <p class="text-lg">${vidas1}</p>
          ${racha1HTML}
        </div>
        <div class="bg-red-500/30 backdrop-blur-md rounded-lg p-4 ${turno2} transition-all">
          <p class="text-xl font-bold">👤 ${estadoJuego.nombre2}</p>
          <p class="text-2xl">${estadoJuego.jugador2Puntos} puntos</p>
          <p class="text-lg">${vidas2}</p>
          ${racha2HTML}
        </div>
      </div>
      <p class="mt-2 text-yellow-300 text-lg font-bold">
        🎮 Turno de ${estadoJuego.turnoActual === 1 ? estadoJuego.nombre1 : estadoJuego.nombre2}
      </p>
    `;
  }
 
}

async function cargarEstadoJuego() {
  try {
    const res = await fetch('/estado-juego');
    const data = await res.json();

    estadoJuego.numJugadores = data.num_jugadores;
    estadoJuego.turnoActual = data.turno_actual;
    estadoJuego.jugador1Puntos = data.jugador1_puntos;
    estadoJuego.jugador2Puntos = data.jugador2_puntos;
    estadoJuego.jugador1Vidas = data.jugador1_vidas;
    estadoJuego.jugador2Vidas = data.jugador2_vidas;
    estadoJuego.jugador1Comodin5050 = data.jugador1_comodin_5050;
    estadoJuego.jugador2Comodin5050 = data.jugador2_comodin_5050;
    estadoJuego.jugador1ComodinCambiar = data.jugador1_comodin_cambiar;
    estadoJuego.jugador2ComodinCambiar = data.jugador2_comodin_cambiar;
    estadoJuego.jugador1ComodinSaltar = data.jugador1_comodin_saltar;
    estadoJuego.jugador2ComodinSaltar = data.jugador2_comodin_saltar;
    estadoJuego.jugador1Racha = data.jugador1_racha;
    estadoJuego.jugador2Racha = data.jugador2_racha;
    estadoJuego.juegoTerminado = data.juego_terminado;
    estadoJuego.categoriaBloqueada = data.categoria_bloqueada;  // ✨ NUEVO
    estadoJuego.nombre1 = NOMBRE1;
    estadoJuego.nombre2 = NOMBRE2;

    actualizarInfoJugadores();
  } catch (error) {
    console.error('Error cargando estado:', error);
  }
}

// ✨ NUEVO: Función para iniciar temporizador
function iniciarTemporizador() {
  tiempoRestante = 20;
  detenerTemporizador();

  const temporizadorDiv = document.getElementById('temporizador');
  if (temporizadorDiv) {
    temporizadorDiv.classList.remove('hidden');
  }

  actualizarTemporizador();

  temporizadorIntervalo = setInterval(() => {
    tiempoRestante--;
    actualizarTemporizador();

    if (tiempoRestante <= 0) {
      detenerTemporizador();
      // Respuesta automática incorrecta por tiempo agotado
      verificar(preguntaActual.pregunta, '', preguntaActual.respuesta, preguntaActual.categoria, preguntaActual.puntos);
    }
  }, 1000);
}

// ✨ NUEVO: Función para actualizar display del temporizador
function actualizarTemporizador() {
  const temporizadorDiv = document.getElementById('temporizador');
  if (temporizadorDiv) {
    const colorClase = tiempoRestante <= 5 ? 'text-red-400 animate-pulse' : 'text-yellow-300';
    temporizadorDiv.innerHTML = `
      <div class="text-center mb-4">
        <p class="${colorClase} text-3xl font-bold">⏱️ ${tiempoRestante}s</p>
      </div>
    `;
  }
}

// ✨ NUEVO: Función para detener temporizador
function detenerTemporizador() {
  if (temporizadorIntervalo) {
    clearInterval(temporizadorIntervalo);
    temporizadorIntervalo = null;
  }
  const temporizadorDiv = document.getElementById('temporizador');
  if (temporizadorDiv) {
    temporizadorDiv.classList.add('hidden');
  }
}

// Sonidos simples usando Web Audio API
function reproducirSonido(tipo) {
  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    switch (tipo) {
      case 'correcto':
        oscillator.frequency.value = 800;
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
        break;
      case 'incorrecto':
        oscillator.frequency.value = 200;
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.4);
        break;
      case 'girar':
        oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(600, audioContext.currentTime + 0.2);
        gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.2);
        break;
    }
  } catch (error) {
    console.log('Audio no disponible');
  }
}

dibujarRuleta();
cargarEstadoJuego();




boton.addEventListener("click", () => {
  if (girando || estadoJuego.juegoTerminado) return;
  girando = true;

  boton.disabled = true;
  boton.textContent = "GIRANDO...";
  boton.style.backgroundColor = "#94a3b8";

  reproducirSonido('girar');

  // ✨ MODIFICADO: Si hay categoría bloqueada, usar esa (SIN MOSTRAR MENSAJES)
  let categoriaSeleccionada;
  let indiceCategoria;

  if (estadoJuego.categoriaBloqueada) {
    categoriaSeleccionada = estadoJuego.categoriaBloqueada;
    indiceCategoria = categorias.indexOf(categoriaSeleccionada);

    // Calcular ángulo para que caiga en esa categoría
    const segmentoPorCategoria = 360 / categorias.length;
    const anguloObjetivo = indiceCategoria * segmentoPorCategoria + segmentoPorCategoria / 2;
    const vueltasCompletas = Math.floor(Math.random() * 3) + 3;
    const giroTotal = vueltasCompletas * 360 + anguloObjetivo;

    canvas.style.transition = "transform 4s cubic-bezier(0.23, 1, 0.32, 1)";
    canvas.style.transform = `rotate(${giroTotal}deg)`;
  } else {
    // Giro normal aleatorio
    const vueltasCompletas = Math.floor(Math.random() * 4) + 5;
    const anguloFinal = Math.random() * 360;
    const giroTotal = vueltasCompletas * 360 + anguloFinal;

    const anguloNormalizado = (360 - (anguloFinal % 360)) % 360;
    const segmentoPorCategoria = 360 / categorias.length;
    indiceCategoria = Math.floor(anguloNormalizado / segmentoPorCategoria);
    categoriaSeleccionada = categorias[indiceCategoria];

    canvas.style.transition = "transform 4s cubic-bezier(0.23, 1, 0.32, 1)";
    canvas.style.transform = `rotate(${giroTotal}deg)`;
  }

  setTimeout(() => {
    girando = false;
    boton.disabled = false;
    boton.textContent = "GIRAR";
    boton.style.backgroundColor = colores[indiceCategoria];
    boton.style.color = "white";

    cargarPregunta(categoriaSeleccionada);
  }, 4000);
});







async function cargarPregunta(categoria) {
  try {
    const res = await fetch(`/pregunta/${categoria}`);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

    const data = await res.json();

    const categoriaEmojis = {
      'historia': '🏛️',
      'ciencia': '🔬',
      'arte': '🎨',
      'deportes': '⚽',
      'cine': '🎬',
      'musica': '🎵',
      'geografia': '🌍',
    };

    const dificultadEmojis = {
      'facil': '⭐',
      'media': '⭐⭐',
      'dificil': '⭐⭐⭐'
    };

    const dificultadColores = {
      'facil': 'text-green-300',
      'media': 'text-yellow-300',
      'dificil': 'text-red-300'
    };

    if (!data.pregunta || !data.opciones || !data.respuesta) {
      throw new Error('Datos de pregunta incompletos');
    }

    // Guardar datos de la pregunta actual
    preguntaActual = data;
    opcionesOriginales = [...data.opciones];
    opcionesEliminadas = [];

    const opcionesHTML = data.opciones.map(opcion =>
      `<button onclick="verificar('${data.pregunta.replace(/'/g, "\\'")}', '${opcion.replace(/'/g, "\\'")}', '${data.respuesta.replace(/'/g, "\\'")}', '${categoria}', ${data.puntos}); return false;" 
              class="opcion-btn bg-white text-purple-700 px-6 py-3 rounded-lg hover:bg-purple-100 transition font-semibold w-full sm:w-auto min-w-[200px] shadow-md hover:shadow-lg transform hover:scale-105">
         ${opcion}
       </button>`
    ).join('');

    let turnoMensaje = '';
    if (estadoJuego.numJugadores === 2) {
      turnoMensaje = `<p class="mb-2 text-xl font-bold text-yellow-300">
      🎮 Turno de ${estadoJuego.turnoActual === 1 ? estadoJuego.nombre1 : estadoJuego.nombre2}</p>`;
    }

    // Mostrar comodines disponibles
    let comodinHTML = '';
    const tieneComodin5050 = estadoJuego.numJugadores === 1
      ? estadoJuego.jugador1Comodin5050
      : (estadoJuego.turnoActual === 1 ? estadoJuego.jugador1Comodin5050 : estadoJuego.jugador2Comodin5050);

    const tieneComodinCambiar = estadoJuego.numJugadores === 1
      ? estadoJuego.jugador1ComodinCambiar
      : (estadoJuego.turnoActual === 1 ? estadoJuego.jugador1ComodinCambiar : estadoJuego.jugador2ComodinCambiar);

    const tieneComodinSaltar = estadoJuego.numJugadores === 1
      ? estadoJuego.jugador1ComodinSaltar
      : (estadoJuego.turnoActual === 1 ? estadoJuego.jugador1ComodinSaltar : estadoJuego.jugador2ComodinSaltar);

    if (tieneComodin5050 || tieneComodinCambiar || tieneComodinSaltar) {
      comodinHTML = '<div class="mb-4 flex gap-2 justify-center flex-wrap">';

      if (tieneComodin5050 && data.opciones.length > 2) {
        comodinHTML += `
          <button onclick="usarComodin5050(); return false;" 
                  id="btn-comodin-5050"
                  class="bg-yellow-500 text-black px-3 py-2 rounded-lg hover:bg-yellow-400 transition font-bold shadow-lg text-sm">
            🎯 50/50
          </button>
        `;
      }

      if (tieneComodinCambiar) {
        comodinHTML += `
          <button onclick="usarComodinCambiar(); return false;" 
                  id="btn-comodin-cambiar"
                  class="bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-400 transition font-bold shadow-lg text-sm">
            🔄 Cambiar
          </button>
        `;
      }

      if (tieneComodinSaltar) {
        comodinHTML += `
          <button onclick="usarComodinSaltar(); return false;" 
                  id="btn-comodin-saltar"
                  class="bg-green-500 text-white px-3 py-2 rounded-lg hover:bg-green-400 transition font-bold shadow-lg text-sm">
            ⏭️ Saltar
          </button>
        `;
      }

      comodinHTML += '</div>';
    }

    // Mostrar la pregunta en pantalla
    document.getElementById("pregunta").innerHTML = `
      <div class="text-center">
        ${turnoMensaje}
        <p class="mb-2 text-2xl font-semibold">${categoriaEmojis[categoria]} Categoría: <span class="capitalize text-yellow-300">${categoria}</span></p>
        <p class="mb-4 text-lg ${dificultadColores[data.dificultad]}">Dificultad: ${dificultadEmojis[data.dificultad]} ${data.dificultad.toUpperCase()} (${data.puntos} puntos)</p>
        <div id="temporizador" class="hidden"></div>
        ${comodinHTML}
        <p class="mb-6 text-xl font-medium">${data.pregunta}</p>
        <div id="opciones-container" class="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl mx-auto">
          ${opcionesHTML}
        </div>
      </div>
    `;

    // ✨ NUEVO: Iniciar temporizador
    iniciarTemporizador();

  } catch (error) {
    console.error('Error cargando pregunta:', error);
    document.getElementById("pregunta").innerHTML = `
      <div class="text-center">
        <p class="text-red-300 mb-4">❌ Error cargando la pregunta</p>
        <button onclick="nuevaPregunta()" class="mt-4 bg-blue-500 px-4 py-2 rounded hover:bg-blue-400">Intentar de nuevo</button>
      </div>
    `;
  }
}

async function usarComodin5050() {
  if (!preguntaActual) return;

  try {
    const res = await fetch('/usar-comodin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        comodin: '5050',
        opciones: preguntaActual.opciones,
        respuesta_correcta: preguntaActual.respuesta
      })
    });

    if (!res.ok) {
      const error = await res.json();
      alert(error.error || 'No puedes usar este comodín');
      return;
    }

    const data = await res.json();

    if (data.success) {
      opcionesEliminadas = data.opciones_eliminadas;

      // Actualizar estado local
      if (estadoJuego.numJugadores === 1) {
        estadoJuego.jugador1Comodin5050 = false;
      } else {
        if (estadoJuego.turnoActual === 1) {
          estadoJuego.jugador1Comodin5050 = false;
        } else {
          estadoJuego.jugador2Comodin5050 = false;
        }
      }

      // Eliminar botón de comodín
      const btnComodin = document.getElementById('btn-comodin-5050');
      if (btnComodin) {
        btnComodin.remove();
      }

      // Actualizar las opciones en pantalla
      const botonesOpciones = document.querySelectorAll('.opcion-btn');
      botonesOpciones.forEach(btn => {
        const textoBoton = btn.textContent.trim();
        if (opcionesEliminadas.includes(textoBoton)) {
          btn.style.opacity = '0.3';
          btn.style.textDecoration = 'line-through';
          btn.disabled = true;
          btn.classList.remove('hover:bg-purple-100', 'hover:scale-105');
        }
      });

      reproducirSonido('correcto');
    }
  } catch (error) {
    console.error('Error usando comodín:', error);
    alert('Error al usar el comodín');
  }
}

async function usarComodinCambiar() {
  if (!preguntaActual) return;

  try {
    // ✨ Detener temporizador antes de cambiar pregunta
    detenerTemporizador();

    const res = await fetch('/usar-comodin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        comodin: 'cambiar',
        categoria: preguntaActual.categoria,
        opciones: preguntaActual.opciones,
        respuesta_correcta: preguntaActual.respuesta
      })
    });

    if (!res.ok) {
      const error = await res.json();
      alert(error.error || 'No puedes usar este comodín');
      return;
    }

    const data = await res.json();

    if (data.success && data.tipo === 'cambiar') {
      // Actualizar estado local
      if (estadoJuego.numJugadores === 1) {
        estadoJuego.jugador1ComodinCambiar = false;
      } else {
        if (estadoJuego.turnoActual === 1) {
          estadoJuego.jugador1ComodinCambiar = false;
        } else {
          estadoJuego.jugador2ComodinCambiar = false;
        }
      }

      reproducirSonido('correcto');

      // Recargar pregunta con los nuevos datos
      preguntaActual = data;
      opcionesOriginales = [...data.opciones];
      opcionesEliminadas = [];

      // Actualizar visualmente
      const categoriaEmojis = {
        'historia': '🏛️',
        'ciencia': '🔬',
        'arte': '🎨',
        'deportes': '⚽',
        'cine': '🎬',
        'musica': '🎵',
        'geografia': '🌍'
      };

      const dificultadEmojis = {
        'facil': '⭐',
        'media': '⭐⭐',
        'dificil': '⭐⭐⭐'
      };

      const dificultadColores = {
        'facil': 'text-green-300',
        'media': 'text-yellow-300',
        'dificil': 'text-red-300'
      };

      const opcionesHTML = data.opciones.map(opcion =>
        `<button onclick="verificar('${data.pregunta.replace(/'/g, "\\'")}', '${opcion.replace(/'/g, "\\'")}', '${data.respuesta.replace(/'/g, "\\'")}', '${data.categoria}', ${data.puntos}); return false;" 
                class="opcion-btn bg-white text-purple-700 px-6 py-3 rounded-lg hover:bg-purple-100 transition font-semibold w-full sm:w-auto min-w-[200px] shadow-md hover:shadow-lg transform hover:scale-105">
           ${opcion}
         </button>`
      ).join('');

      let turnoMensaje = '';
      if (estadoJuego.numJugadores === 2) {
        turnoMensaje = `<p class="mb-2 text-xl font-bold text-yellow-300">🎮 Turno de ${estadoJuego.turnoActual === 1 ? estadoJuego.nombre1 : estadoJuego.nombre2}</p>`;
      }

      // Actualizar comodines disponibles
      const tieneComodin5050 = estadoJuego.numJugadores === 1
        ? estadoJuego.jugador1Comodin5050
        : (estadoJuego.turnoActual === 1 ? estadoJuego.jugador1Comodin5050 : estadoJuego.jugador2Comodin5050);

      const tieneComodinSaltar = estadoJuego.numJugadores === 1
        ? estadoJuego.jugador1ComodinSaltar
        : (estadoJuego.turnoActual === 1 ? estadoJuego.jugador1ComodinSaltar : estadoJuego.jugador2ComodinSaltar);

      let comodinHTML = '';
      if (tieneComodin5050 || tieneComodinSaltar) {
        comodinHTML = '<div class="mb-4 flex gap-2 justify-center flex-wrap">';

        if (tieneComodin5050 && data.opciones.length > 2) {
          comodinHTML += `
            <button onclick="usarComodin5050(); return false;" 
                    id="btn-comodin-5050"
                    class="bg-yellow-500 text-black px-3 py-2 rounded-lg hover:bg-yellow-400 transition font-bold shadow-lg text-sm">
              🎯 50/50
            </button>
          `;
        }

        if (tieneComodinSaltar) {
          comodinHTML += `
            <button onclick="usarComodinSaltar(); return false;" 
                    id="btn-comodin-saltar"
                    class="bg-green-500 text-white px-3 py-2 rounded-lg hover:bg-green-400 transition font-bold shadow-lg text-sm">
              ⏭️ Saltar
            </button>
          `;
        }

        comodinHTML += '</div>';
      }

      document.getElementById("pregunta").innerHTML = `
        <div class="text-center">
          <p class="text-lg mb-2 text-green-300 animate-pulse">✨ ¡Pregunta cambiada!</p>
          ${turnoMensaje}
          <p class="mb-2 text-2xl font-semibold">${categoriaEmojis[data.categoria]} Categoría: <span class="capitalize text-yellow-300">${data.categoria}</span></p>
          <p class="mb-4 text-lg ${dificultadColores[data.dificultad]}">Dificultad: ${dificultadEmojis[data.dificultad]} ${data.dificultad.toUpperCase()} (${data.puntos} puntos)</p>
          <div id="temporizador" class="hidden"></div>
          ${comodinHTML}
          <p class="mb-6 text-xl font-medium">${data.pregunta}</p>
          <div id="opciones-container" class="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl mx-auto">
            ${opcionesHTML}
          </div>
        </div>
      `;

      // ✨ Reiniciar temporizador con nueva pregunta
      iniciarTemporizador();
    }
  } catch (error) {
    console.error('Error usando comodín cambiar:', error);
    alert('Error al cambiar la pregunta');
  }
}

async function usarComodinSaltar() {
  if (!preguntaActual) return;

  try {
    // ✨ Detener temporizador
    detenerTemporizador();

    const res = await fetch('/usar-comodin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        comodin: 'saltar'
      })
    });

    if (!res.ok) {
      const error = await res.json();
      alert(error.error || 'No puedes usar este comodín');
      return;
    }

    const data = await res.json();

    if (data.success && data.tipo === 'saltar') {
      // Actualizar estado local
      if (estadoJuego.numJugadores === 1) {
        estadoJuego.jugador1ComodinSaltar = false;
      } else {
        if (estadoJuego.turnoActual === 1) {
          estadoJuego.jugador1ComodinSaltar = false;
        } else {
          estadoJuego.jugador2ComodinSaltar = false;
        }
      }

      reproducirSonido('correcto');

      // Mostrar mensaje y continuar
      document.getElementById("pregunta").innerHTML = `
        <div class="text-center animate-bounce">
          <h2 class="text-4xl mb-4">⏭️ ¡Pregunta saltada!</h2>
          <p class="text-xl mb-4">Sin penalización</p>
          <div class="flex gap-3 justify-center flex-wrap mt-6">
            <button onclick="nuevaPregunta()" class="bg-blue-500 px-6 py-3 rounded-lg hover:bg-blue-400 transition font-bold shadow-lg transform hover:scale-105">🎯 Continuar</button>
            <button onclick="terminarJuego()" class="bg-red-500 px-6 py-3 rounded-lg hover:bg-red-400 transition font-bold shadow-lg transform hover:scale-105">🏁 Terminar juego</button>
          </div>
        </div>
      `;
    }
  } catch (error) {
    console.error('Error usando comodín saltar:', error);
    alert('Error al saltar la pregunta');
  }
}

async function verificar(pregunta, respuestaSeleccionada, respuestaCorrecta, categoria, puntos) {
  try {
    // ✨ DETENER TEMPORIZADOR
    detenerTemporizador();

    const res = await fetch('/verificar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        pregunta,
        respuesta: respuestaSeleccionada,
        categoria: categoria,
        puntos: puntos,
        tiempo_restante: tiempoRestante
      })
    });
    const data = await res.json();

    // Actualizar estado
    if (data.modo === "multijugador") {
      estadoJuego.turnoActual = data.turno_actual;
      estadoJuego.jugador1Puntos = data.jugador1_puntos;
      estadoJuego.jugador2Puntos = data.jugador2_puntos;
      estadoJuego.jugador1Vidas = data.jugador1_vidas;
      estadoJuego.jugador2Vidas = data.jugador2_vidas;
      estadoJuego.jugador1Racha = data.jugador1_racha;
      estadoJuego.jugador2Racha = data.jugador2_racha;
      estadoJuego.juegoTerminado = data.juego_terminado;
      estadoJuego.categoriaBloqueada = data.categoria_bloqueada;

      actualizarInfoJugadores();

      if (data.juego_terminado) {
        reproducirSonido('correcto');
        setTimeout(() => {
          window.location.href = '/resultado';
        }, 3000);

        document.getElementById("pregunta").innerHTML = `
          <div class="text-center animate-bounce">
            <h2 class="text-5xl mb-4">🏆 ¡JUEGO TERMINADO!</h2>
            <p class="text-3xl mb-4">Ganador: ${data.ganador === 1 ? estadoJuego.nombre1 : estadoJuego.nombre2}</p>
            <p class="text-sm">Redirigiendo...</p>
          </div>
        `;
        return;
      }
    } else {
      estadoJuego.jugador1Puntos = data.puntos;
      estadoJuego.jugador1Racha = data.racha;
      estadoJuego.categoriaBloqueada = data.categoria_bloqueada;
      actualizarInfoJugadores();
    }

    if (data.correcta) {
      reproducirSonido('correcto');

      let mensajeTurno = '';
      let mensajeRacha = '';
      let bonusRachaMsg = '';

      if (data.modo === "multijugador") {
        const jugadorAnterior = data.turno_actual === 1 ? 2 : 1;
        const rachaActual = jugadorAnterior === 1 ? data.jugador1_racha : data.jugador2_racha;

        if (rachaActual >= 3) {
          mensajeRacha = `<p class="text-2xl mb-2 text-orange-400">🔥 ¡RACHA DE ${rachaActual}! 🔥</p>`;
        }

        if (data.bonus_racha > 0) {
          bonusRachaMsg = `<p class="text-xl text-yellow-300">+${data.bonus_racha} puntos de bonus por racha!</p>`;
        }

        mensajeTurno = `<p class="text-lg mb-2">${jugadorAnterior === 1 ? estadoJuego.nombre1 : estadoJuego.nombre2} continúa...</p>`;
      } else {
        if (data.racha >= 3) {
          mensajeRacha = `<p class="text-2xl mb-2 text-orange-400">🔥 ¡RACHA DE ${data.racha}! 🔥</p>`;
        }

        if (data.bonus_racha > 0) {
          bonusRachaMsg = `<p class="text-xl text-yellow-300">+${data.bonus_racha} puntos de bonus por racha!</p>`;
        }
      }

      document.getElementById("pregunta").innerHTML = `
        <div class="text-center animate-pulse">
          <h2 class="text-4xl mb-4">✅ ¡Correcto!</h2>
          ${mensajeRacha}
          ${mensajeTurno}
          <p class="text-2xl mb-2 text-green-300">Tu respuesta: <strong>${respuestaSeleccionada}</strong></p>
          <p class="text-xl mb-4">+${puntos} puntos</p>
          ${bonusRachaMsg}
          <div class="flex gap-3 justify-center flex-wrap mt-6">
            <button onclick="nuevaPregunta()" class="bg-blue-500 px-6 py-3 rounded-lg hover:bg-blue-400 transition font-bold shadow-lg transform hover:scale-105">🎯 Continuar</button>
            <button onclick="terminarJuego()" class="bg-red-500 px-6 py-3 rounded-lg hover:bg-red-400 transition font-bold shadow-lg transform hover:scale-105">🏁 Terminar juego</button>
          </div>
        </div>
      `;

    } else {
      reproducirSonido('incorrecto');

      // ⚠️ Si es modo 1 jugador, restamos una vida
      if (data.modo === "individual") {
        estadoJuego.jugador1Vidas -= 1;

        // Si se queda sin vidas, termina el juego
        if (estadoJuego.jugador1Vidas <= 0) {
          estadoJuego.juegoTerminado = true;

          document.getElementById("pregunta").innerHTML = `
            <div class="text-center animate-bounce">
              <h2 class="text-5xl mb-4 text-red-400">💀 ¡Juego terminado!</h2>
              <p class="text-2xl mb-4">Te quedaste sin vidas.</p>
              <p class="text-lg mb-4">La respuesta correcta era: <span class="text-yellow-300 font-bold">${respuestaCorrecta}</span></p>
              <p class="text-2xl mb-4 text-green-300 font-semibold">Puntaje final: ${estadoJuego.jugador1Puntos}</p>
              <button onclick="terminarJuego()" class="bg-red-500 px-6 py-3 rounded-lg hover:bg-red-400 transition font-bold shadow-lg transform hover:scale-105">
                🏁 Ver resultado
              </button>
            </div>
          `;

          setTimeout(() => {
            window.location.href = '/resultado';
          }, 4000);

          return;
        }
      }

      // ✨ NUEVO: Mensaje si el tiempo se agotó
      let mensajeTiempo = '';
      if (tiempoRestante <= 0) {
        mensajeTiempo = '<p class="text-xl mb-2 text-red-400">⏰ ¡Se acabó el tiempo!</p>';
      }

      // 💬 Si todavía tiene vidas, mostrar mensaje normal
      let mensajeTurno = '';
      if (data.modo === "multijugador") {
        mensajeTurno = `<p class="text-lg mb-2 text-yellow-300">Turno de ${data.turno_actual === 1 ? estadoJuego.nombre1 : estadoJuego.nombre2}</p>`;
      }

      actualizarInfoJugadores();

      document.getElementById("pregunta").innerHTML = `
        <div class="text-center">
          <h2 class="text-4xl mb-4">❌ Incorrecto</h2>
          ${mensajeTiempo}
          ${mensajeTurno}
          <p class="text-xl mb-2 text-red-300">Tu respuesta: <strong>${respuestaSeleccionada || '(Sin respuesta)'}</strong></p>
          <p class="text-xl mb-4">La respuesta correcta era: <span class="text-yellow-300 font-bold">${respuestaCorrecta}</span></p>
          ${data.modo === "individual" ? `<p class="text-lg mb-4 text-pink-300">💔 Te queda${estadoJuego.jugador1Vidas === 1 ? '' : 'n'} ${estadoJuego.jugador1Vidas} vida${estadoJuego.jugador1Vidas === 1 ? '' : 's'}</p>` : ''}
          <div class="flex gap-3 justify-center flex-wrap mt-6">
            <button onclick="nuevaPregunta()" class="bg-blue-500 px-6 py-3 rounded-lg hover:bg-blue-400 transition font-bold shadow-lg transform hover:scale-105">🎯 Continuar</button>
            <button onclick="terminarJuego()" class="bg-red-500 px-6 py-3 rounded-lg hover:bg-red-400 transition font-bold shadow-lg transform hover:scale-105">🏁 Terminar juego</button>
          </div>
        </div>
      `;
    }

  } catch (error) {
    console.error('Error verificando respuesta:', error);
    alert("❌ Error al verificar la respuesta.");
  }
}

function nuevaPregunta() {
  document.getElementById("pregunta").innerHTML = `
    <p class="text-center text-xl">🎡 Gira la ruleta para la siguiente pregunta</p>
  `;
  canvas.style.transform = 'rotate(0deg)';
  canvas.style.transition = 'none';

  boton.style.backgroundColor = "#EAB308";
  boton.style.color = "black";
  boton.textContent = "GIRAR";

  // Resetear variables de pregunta
  preguntaActual = null;
  opcionesOriginales = [];
  opcionesEliminadas = [];

  // ✨ Detener temporizador si está activo
  detenerTemporizador();
}

function terminarJuego() {
  detenerTemporizador();
  window.location.href = '/resultado';
}