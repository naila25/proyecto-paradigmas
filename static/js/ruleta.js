const canvas = document.getElementById("ruleta");
const ctx = canvas.getContext("2d");
const boton = document.getElementById("botonGirar");

const categorias = ["arte", "deportes", "historia", "ciencia"];
const colores = ["#3B82F6", "#EAB308", "#EF4444", "#22C55E"];
const tam = canvas.width / 2;

let anguloInicio = 0;
let girando = false;

// Estado del juego
let estadoJuego = {
  numJugadores: NUM_JUGADORES,
  turnoActual: 1,
  jugador1Puntos: 0,
  jugador2Puntos: 0,
  jugador1Vidas: 3,
  jugador2Vidas: 3,
  juegoTerminado: false
};

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
    infoDiv.innerHTML = `
      <div class="bg-white/20 backdrop-blur-md rounded-lg p-4 inline-block">
        <p class="text-2xl font-bold">Puntos: ${estadoJuego.jugador1Puntos}</p>
      </div>
    `;
  } else {
    const turno1 = estadoJuego.turnoActual === 1 ? 'ring-4 ring-yellow-400' : '';
    const turno2 = estadoJuego.turnoActual === 2 ? 'ring-4 ring-yellow-400' : '';
    
    const vidas1 = '❤️'.repeat(estadoJuego.jugador1Vidas) + '🖤'.repeat(3 - estadoJuego.jugador1Vidas);
    const vidas2 = '❤️'.repeat(estadoJuego.jugador2Vidas) + '🖤'.repeat(3 - estadoJuego.jugador2Vidas);
    
    infoDiv.innerHTML = `
      <div class="flex gap-4 justify-center flex-wrap">
        <div class="bg-blue-500/30 backdrop-blur-md rounded-lg p-4 ${turno1}">
          <p class="text-xl font-bold">👤 Jugador 1</p>
          <p class="text-2xl">${estadoJuego.jugador1Puntos} puntos</p>
          <p class="text-lg">${vidas1}</p>
        </div>
        <div class="bg-red-500/30 backdrop-blur-md rounded-lg p-4 ${turno2}">
          <p class="text-xl font-bold">👤 Jugador 2</p>
          <p class="text-2xl">${estadoJuego.jugador2Puntos} puntos</p>
          <p class="text-lg">${vidas2}</p>
        </div>
      </div>
      <p class="mt-2 text-yellow-300 text-lg font-bold">
        🎮 Turno del Jugador ${estadoJuego.turnoActual}
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
    estadoJuego.juegoTerminado = data.juego_terminado;
    
    actualizarInfoJugadores();
  } catch (error) {
    console.error('Error cargando estado:', error);
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

  const vueltasCompletas = Math.floor(Math.random() * 4) + 5;
  const anguloFinal = Math.random() * 360;
  const giroTotal = vueltasCompletas * 360 + anguloFinal;

  const anguloNormalizado = (360 - (anguloFinal % 360)) % 360;
  const segmentoPorCategoria = 360 / categorias.length;
  const indiceCategoria = Math.floor(anguloNormalizado / segmentoPorCategoria);
  const categoriaSeleccionada = categorias[indiceCategoria];

  canvas.style.transition = "transform 4s cubic-bezier(0.23, 1, 0.32, 1)";
  canvas.style.transform = `rotate(${giroTotal}deg)`;

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
      'deportes': '⚽'
    };

    if (!data.pregunta || !data.opciones || !data.respuesta) {
      throw new Error('Datos de pregunta incompletos');
    }

    const opcionesHTML = data.opciones.map(opcion => 
      `<button onclick="verificar('${data.pregunta.replace(/'/g, "\\'")}', '${opcion.replace(/'/g, "\\'")}', '${data.respuesta.replace(/'/g, "\\'")}'); return false;" 
              class="bg-white text-purple-700 px-6 py-3 rounded-lg hover:bg-purple-100 transition font-semibold w-full sm:w-auto min-w-[200px] shadow-md hover:shadow-lg transform hover:scale-105">
         ${opcion}
       </button>`
    ).join('');

    let turnoMensaje = '';
    if (estadoJuego.numJugadores === 2) {
      turnoMensaje = `<p class="mb-2 text-xl font-bold text-yellow-300">🎮 Turno del Jugador ${estadoJuego.turnoActual}</p>`;
    }

    document.getElementById("pregunta").innerHTML = `
      <div class="text-center">
        ${turnoMensaje}
        <p class="mb-4 text-2xl font-semibold">${categoriaEmojis[categoria]} Categoría: <span class="capitalize text-yellow-300">${categoria}</span></p>
        <p class="mb-6 text-xl font-medium">${data.pregunta}</p>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl mx-auto">
          ${opcionesHTML}
        </div>
      </div>
    `;

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

async function verificar(pregunta, respuestaSeleccionada, respuestaCorrecta) {
  try {
    const res = await fetch('/verificar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pregunta, respuesta: respuestaSeleccionada })
    });
    const data = await res.json();

    // Actualizar estado
    if (data.modo === "multijugador") {
      estadoJuego.turnoActual = data.turno_actual;
      estadoJuego.jugador1Puntos = data.jugador1_puntos;
      estadoJuego.jugador2Puntos = data.jugador2_puntos;
      estadoJuego.jugador1Vidas = data.jugador1_vidas;
      estadoJuego.jugador2Vidas = data.jugador2_vidas;
      estadoJuego.juegoTerminado = data.juego_terminado;
      
      actualizarInfoJugadores();
      
      if (data.juego_terminado) {
        // Juego terminado
        setTimeout(() => {
          window.location.href = '/resultado';
        }, 3000);
        
        document.getElementById("pregunta").innerHTML = `
          <div class="text-center">
            <h2 class="text-5xl mb-4">🏆 ¡JUEGO TERMINADO!</h2>
            <p class="text-3xl mb-4">Ganador: Jugador ${data.ganador}</p>
            <p class="text-sm">Redirigiendo...</p>
          </div>
        `;
        return;
      }
    } else {
      estadoJuego.jugador1Puntos = data.puntos;
      actualizarInfoJugadores();
    }

    if (data.correcta) {
      let mensajeTurno = '';
      if (data.modo === "multijugador") {
        const jugadorAnterior = data.turno_actual === 1 ? 2 : 1;
        mensajeTurno = `<p class="text-lg mb-2">Jugador ${jugadorAnterior} continúa...</p>`;
      }
      
      document.getElementById("pregunta").innerHTML = `
        <div class="text-center">
          <h2 class="text-4xl mb-4">✅ ¡Correcto!</h2>
          ${mensajeTurno}
          <p class="text-2xl mb-2 text-green-300">Tu respuesta: <strong>${respuestaSeleccionada}</strong></p>
          <p class="text-xl mb-4">+10 puntos</p>
          <div class="flex gap-3 justify-center flex-wrap mt-6">
            <button onclick="nuevaPregunta()" class="bg-blue-500 px-6 py-3 rounded-lg hover:bg-blue-400 transition font-bold">🎯 Continuar</button>
            <button onclick="terminarJuego()" class="bg-red-500 px-6 py-3 rounded-lg hover:bg-red-400 transition font-bold">🏁 Terminar juego</button>
          </div>
        </div>
      `;
    } else {
      let mensajeTurno = '';
      if (data.modo === "multijugador") {
        mensajeTurno = `<p class="text-lg mb-2 text-yellow-300">Turno del Jugador ${data.turno_actual}</p>`;
      }
      
      document.getElementById("pregunta").innerHTML = `
        <div class="text-center">
          <h2 class="text-4xl mb-4">❌ Incorrecto</h2>
          ${mensajeTurno}
          <p class="text-xl mb-2 text-red-300">Tu respuesta: <strong>${respuestaSeleccionada}</strong></p>
          <p class="text-xl mb-4">La respuesta correcta era: <span class="text-yellow-300 font-bold">${respuestaCorrecta}</span></p>
          <div class="flex gap-3 justify-center flex-wrap mt-6">
            <button onclick="nuevaPregunta()" class="bg-blue-500 px-6 py-3 rounded-lg hover:bg-blue-400 transition font-bold">🎯 Continuar</button>
            <button onclick="terminarJuego()" class="bg-red-500 px-6 py-3 rounded-lg hover:bg-red-400 transition font-bold">🏁 Terminar juego</button>
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
}

function terminarJuego() {
  window.location.href = '/resultado';
}