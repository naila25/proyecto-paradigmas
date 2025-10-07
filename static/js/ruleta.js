const canvas = document.getElementById("ruleta");
const ctx = canvas.getContext("2d");
const boton = document.getElementById("botonGirar");

const categorias = ["arte", "deportes", "historia", "ciencia"];
const colores = ["#3B82F6", "#EAB308", "#EF4444", "#22C55E"];
const tam = canvas.width / 2;

let anguloInicio = 0;
let girando = false;
let puntosTotales = 0;

function dibujarRuleta() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  anguloInicio = 0;

  for (let i = 0; i < categorias.length; i++) {
    const angulo = (2 * Math.PI) / categorias.length;

    // Dibujar sector
    ctx.beginPath();
    ctx.moveTo(tam, tam);
    ctx.arc(tam, tam, tam - 10, anguloInicio, anguloInicio + angulo);
    ctx.fillStyle = colores[i];
    ctx.fill();
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 3;
    ctx.stroke();

    // Dibujar texto
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

dibujarRuleta();

boton.addEventListener("click", () => {
  if (girando) return;
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
    console.log('Cargando pregunta para categoría:', categoria);
    const res = await fetch(`/pregunta/${categoria}`);

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    console.log('Datos recibidos:', data);

    const categoriaEmojis = {
      'historia': '🏛️',
      'ciencia': '🔬',
      'arte': '🎨',
      'deportes': '⚽'
    };

    if (!data.pregunta || !data.respuesta) {
      throw new Error('Datos de pregunta incompletos');
    }

    document.getElementById("pregunta").innerHTML = `
      <div class="text-center">
        <p class="mb-4 text-2xl font-semibold">${categoriaEmojis[categoria]} Categoría: <span class="capitalize text-yellow-300">${categoria}</span></p>
        <p class="mb-6 text-lg font-medium">${data.pregunta}</p>
        <div class="flex flex-col sm:flex-row gap-2 items-center justify-center">
          <input id="resp" class="p-3 text-black rounded-lg flex-1 max-w-md" placeholder="Escribe tu respuesta aquí..." onkeypress="if(event.key==='Enter') verificar('${data.pregunta.replace(/'/g, "\\'")}','${data.respuesta.replace(/'/g, "\\'")}')">
          <button onclick="verificar('${data.pregunta.replace(/'/g, "\\'")}','${data.respuesta.replace(/'/g, "\\'")}'); return false;" class="bg-green-500 px-6 py-3 rounded-lg hover:bg-green-400 transition font-bold">📤 Enviar</button>
        </div>
        <p class="mt-4 text-sm opacity-75">Puntos actuales: ${puntosTotales}</p>
      </div>
    `;

    setTimeout(() => {
      const input = document.getElementById("resp");
      if (input) input.focus();
    }, 100);

  } catch (error) {
    console.error('Error cargando pregunta:', error);
    document.getElementById("pregunta").innerHTML = `
      <div class="text-center">
        <p class="text-red-300 mb-4">❌ Error cargando la pregunta</p>
        <p class="text-sm">Error: ${error.message}</p>
        <button onclick="nuevaPregunta()" class="mt-4 bg-blue-500 px-4 py-2 rounded hover:bg-blue-400">Intentar de nuevo</button>
      </div>
    `;
  }
}

async function verificar(pregunta, correcta) {
  const resp = document.getElementById("resp").value.trim();

  if (!resp) {
    alert("⚠️ Por favor, escribe una respuesta antes de enviar.");
    return;
  }

  try {
    const res = await fetch('/verificar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pregunta, respuesta: resp })
    });
    const data = await res.json();

    puntosTotales = data.puntos;

    if (data.correcta) {
      document.getElementById("pregunta").innerHTML = `
        <div class="text-center">
          <h2 class="text-3xl mb-4">✅ ¡Correcto!</h2>
          <p class="text-xl mb-4">+10 puntos</p>
          <p class="mb-6">Puntos totales: <span class="text-yellow-300 font-bold">${puntosTotales}</span></p>
          <button onclick="nuevaPregunta()" class="bg-blue-500 px-6 py-3 rounded-lg hover:bg-blue-400 transition">🎯 Nueva pregunta</button>
          <button onclick="terminarJuego()" class="ml-2 bg-red-500 px-6 py-3 rounded-lg hover:bg-red-400 transition">🏁 Terminar juego</button>
        </div>
      `;
    } else {
      document.getElementById("pregunta").innerHTML = `
        <div class="text-center">
          <h2 class="text-3xl mb-4">❌ Incorrecto</h2>
          <p class="text-lg mb-4">La respuesta correcta era: <span class="text-yellow-300 font-bold">${correcta}</span></p>
          <p class="mb-6">Puntos totales: <span class="text-yellow-300 font-bold">${puntosTotales}</span></p>
          <button onclick="nuevaPregunta()" class="bg-blue-500 px-6 py-3 rounded-lg hover:bg-blue-400 transition">🎯 Nueva pregunta</button>
          <button onclick="terminarJuego()" class="ml-2 bg-red-500 px-6 py-3 rounded-lg hover:bg-red-400 transition">🏁 Terminar juego</button>
        </div>
      `;
    }

  } catch (error) {
    console.error('Error verificando respuesta:', error);
    alert("❌ Error al verificar la respuesta. Intenta de nuevo.");
  }
}

function nuevaPregunta() {
  document.getElementById("pregunta").innerHTML = `
    <p class="text-center text-xl">🎡 Gira la ruleta para elegir una nueva categoría</p>
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