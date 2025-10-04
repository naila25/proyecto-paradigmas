
const canvas = document.getElementById("ruleta");
const ctx = canvas.getContext("2d");
const boton = document.getElementById("botonGirar");

const categorias = ["historia", "ciencia", "arte", "deportes"];
const colores = ["#EF4444", "#22C55E", "#3B82F6", "#EAB308"];
const tam = canvas.width / 2;

let anguloInicio = 0;
let girando = false;

function dibujarRuleta() {
  for (let i = 0; i < categorias.length; i++) {
    const angulo = (2 * Math.PI) / categorias.length;
    ctx.beginPath();
    ctx.moveTo(tam, tam);
    ctx.arc(tam, tam, tam, anguloInicio, anguloInicio + angulo);
    ctx.fillStyle = colores[i];
    ctx.fill();
    ctx.save();
    ctx.translate(tam, tam);
    ctx.rotate(anguloInicio + angulo / 2);
    ctx.textAlign = "right";
    ctx.fillStyle = "white";
    ctx.font = "bold 22px sans-serif";
    ctx.fillText(categorias[i].toUpperCase(), tam - 20, 10);
    ctx.restore();
    anguloInicio += angulo;
  }
}
dibujarRuleta();

boton.addEventListener("click", () => {
  if (girando) return;
  girando = true;

  const giroTotal = Math.floor(Math.random() * 360) + 1080;
  const categoriaSeleccionada = categorias[Math.floor(Math.random() * categorias.length)];

  canvas.style.transition = "transform 4s ease-out";
  canvas.style.transform = `rotate(${giroTotal}deg)`;

  setTimeout(() => {
    girando = false;
    cargarPregunta(categoriaSeleccionada);
  }, 4000);
});

async function cargarPregunta(categoria) {
  const res = await fetch(`/pregunta/${categoria}`);
  const data = await res.json();

  document.getElementById("pregunta").innerHTML = `
    <p class="mb-2 text-2xl font-semibold">📚 Categoría: <span class="capitalize">${categoria}</span></p>
    <p class="mb-4">${data.pregunta}</p>
    <input id="resp" class="p-2 text-black rounded-md w-2/3" placeholder="Tu respuesta...">
    <button onclick="verificar('${data.pregunta}','${data.respuesta}')" class="ml-2 bg-indigo-500 px-4 py-2 rounded hover:bg-indigo-400">Enviar</button>
  `;
}

async function verificar(pregunta, correcta) {
  const resp = document.getElementById("resp").value;
  const res = await fetch('/verificar', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({pregunta, respuesta: resp})
  });
  const data = await res.json();

  if (data.correcta) {
    alert("✅ ¡Correcto! +10 puntos");
  } else {
    alert(`❌ Incorrecto. La respuesta era: ${correcta}`);
  }
}
