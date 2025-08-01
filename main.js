const contenedor = document.querySelector("#personajes-container");
let paginaActual = 1;
let filtros = {
  name: "",
  status: "",
  species: "",
  type: "",
  gender: ""
};

async function cargarEspecies() {
  const url = "https://rickandmortyapi.com/api/character";
  let especiesSet = new Set();
  let next = url;

  try {
    while (next) {
      const res = await fetch(next);
      const data = await res.json();
      data.results.forEach(p => {
        if (p.species) especiesSet.add(p.species);
      });
      next = data.info.next;
    }
    const speciesSelect = document.querySelector("#species-select");
    [...especiesSet].sort().forEach(specie => {
      const option = document.createElement("option");
      option.value = specie;
      option.textContent = specie;
      speciesSelect.appendChild(option);
    });
  } catch (error) {
    console.error("Error cargando especies:", error);
  }
}

// Traer personajes con filtros y paginación
async function traerPersonajes(pagina = 1) {
  contenedor.innerHTML = "";
  let url = new URL("https://rickandmortyapi.com/api/character");
  url.searchParams.set("page", pagina);
  for (let clave in filtros) {
    if (filtros[clave]) {
      url.searchParams.set(clave, filtros[clave]);
    }
  }

  try {
    let res = await fetch(url);
    if (!res.ok) throw new Error("No se encontraron resultados");
    let data = await res.json();

    data.results.forEach(renderizarPersonaje);

    document.getElementById("anterior").disabled = pagina === 1;
    document.getElementById("siguiente").disabled = !data.info.next;

  } catch (error) {
    contenedor.innerHTML = `<p class='text-red-500 text-lg font-bold text-center'>No se encontraron personajes.</p>`;
  }
}
function renderizarPersonaje({
  image, name, id, status, species, type, gender, origin, location, episode
}) {
  contenedor.innerHTML += `
    <div class="bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl shadow-lg overflow-hidden w-full max-w-xs mx-auto">
      <img class="w-full h-48 object-cover" src="${image}" alt="${name}" />
      <div class="p-4">
        <h3 class="text-lg font-bold mb-1">${name}</h3>
        <p class="text-sm text-gray-600 dark:text-gray-300">Estado: ${status}</p>
        <p class="text-sm text-gray-600 dark:text-gray-300">Especie: ${species}</p>
        <button
          class="mas-info mt-3 inline-block px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm"
          data-img="${image}"
          data-name="${name}"
          data-id="#${id}"
          data-status="${status}"
          data-species="${species}"
          data-type="${type || "N/A"}"
          data-gender="${gender}"
          data-origin="${origin.name}"
          data-location="${location.name}"
          data-episodios='${JSON.stringify(episode.slice(0, 5))}'
        >
          Más información
        </button>
      </div>
    </div>`;
}

document.addEventListener("click", (e) => {
  const btn = e.target.closest(".mas-info");
  if (!btn) return;

  document.querySelector("#modal-img").src = btn.dataset.img;
  document.querySelector("#modal-nombre").textContent = btn.dataset.name;
  document.querySelector("#modal-id").textContent = btn.dataset.id;
  document.querySelector("#modal-estado").textContent = btn.dataset.status;
  document.querySelector("#modal-especie").textContent = btn.dataset.species;
  document.querySelector("#modal-tipo").textContent = btn.dataset.type;
  document.querySelector("#modal-genero").textContent = btn.dataset.gender;
  document.querySelector("#modal-origen").textContent = btn.dataset.origin;
  document.querySelector("#modal-ubicacion").textContent = btn.dataset.location;

  const episodios = JSON.parse(btn.dataset.episodios);
  document.querySelector("#modal-episodios").innerHTML = episodios.map((url, i) => `<li>Episodio ${i + 1}: ${url}</li>`).join("");

  document.querySelector("#modal-personaje").classList.remove("hidden");
});

document.querySelector("#cerrar-modal").addEventListener("click", () => {
  document.querySelector("#modal-personaje").classList.add("hidden");
});

document.getElementById("siguiente").addEventListener("click", () => {
  paginaActual++;
  traerPersonajes(paginaActual);
});

document.getElementById("anterior").addEventListener("click", () => {
  if (paginaActual > 1) {
    paginaActual--;
    traerPersonajes(paginaActual);
  }
});

const filtrosForm = document.querySelector("#filtros");
filtrosForm.addEventListener("change", (e) => {
  const { name, value } = e.target;
  filtros[name] = value.trim();
  paginaActual = 1;
  traerPersonajes(paginaActual);
});

filtrosForm.querySelector('input[name="name"]').addEventListener("keyup", (e) => {
  filtros.name = e.target.value.trim();
  paginaActual = 1;
  traerPersonajes(paginaActual);
});

cargarEspecies().then(() => traerPersonajes());