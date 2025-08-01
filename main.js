let contenedor = document.querySelector("#personajes-container");
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
  } catch (error) {
    contenedor.innerHTML = `<p class='text-red-500 text-lg font-bold text-center'>No se encontraron personajes.</p>`;
  }
}

function renderizarPersonaje({
  image,
  name,
  id,
  status,
  species,
  type,
  gender,
  origin,
  location,
  episode
}) {
  contenedor.innerHTML += `
  <div class="max-w-sm mx-auto bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
    <img class="rounded-t-lg w-full h-64 object-cover" src="${image}" alt="${name}" />
    <div class="p-5">
      <h5 class="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white capitalize">${name}</h5>
      <p class="text-gray-500 mb-1">#${id}</p>
      <p class="text-gray-700 dark:text-gray-300 mb-2">Estado: ${status}</p>
      <p class="text-gray-700 dark:text-gray-300 mb-2">Especie: ${species}</p>
      <button class="mas-info inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800"
        data-img="${image}"
        data-name="${name}"
        data-id="#${id}"
        data-status="${status}"
        data-species="${species}"
        data-type="${type || "N/A"}"
        data-gender="${gender}"
        data-origin="${origin.name}"
        data-location="${location.name}"
        data-episodios='${JSON.stringify(episode.slice(0, 5))}'>
        Más información
        <svg class="w-3.5 h-3.5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 14 10">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12M13 5l-4-4m4 4l-4 4"/>
        </svg>
      </button>
    </div>
  </div>`;
}

document.addEventListener("click", function (e) {
  if (e.target.closest(".mas-info")) {
    const btn = e.target.closest(".mas-info");

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
    document.querySelector("#modal-episodios").innerHTML =
      episodios.map((url, i) => `<li>Episodio ${i + 1}: ${url}</li>`).join("");

    document.querySelector("#modal-personaje").classList.remove("hidden");
  }
});

document.querySelector("#cerrar-modal").addEventListener("click", () => {
  document.querySelector("#modal-personaje").classList.add("hidden");
});

// Paginación
document.querySelector("#siguiente").addEventListener("click", () => {
  paginaActual++;
  traerPersonajes(paginaActual);
});

document.querySelector("#anterior").addEventListener("click", () => {
  if (paginaActual > 1) {
    paginaActual--;
    traerPersonajes(paginaActual);
  }
});
document.querySelector("#filtros").addEventListener("change", (e) => {
  const { name, value } = e.target;
  filtros[name] = value.trim();
  paginaActual = 1;
  traerPersonajes();
});

document.querySelector('#filtros input[name="name"]').addEventListener("keyup", (e) => {
  filtros.name = e.target.value.trim();
  paginaActual = 1;
  traerPersonajes();
});
cargarEspecies().then(() => {
  traerPersonajes();
});