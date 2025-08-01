const API_EPISODES = "https://rickandmortyapi.com/api/episode";
const API_CHARACTERS = "https://rickandmortyapi.com/api/character";

const selectorPagina = document.getElementById("selectorPagina");
const listaEpisodios = document.getElementById("listaEpisodios");
const personajesContainer = document.getElementById("personajesContainer");

async function cargarDropdown() {
  const res = await fetch(API_EPISODES);
  const data = await res.json();
  const totalPaginas = data.info.pages;

  for (let i = 1; i <= totalPaginas; i++) {
    const opcion = document.createElement("option");
    opcion.value = i;
    opcion.textContent = `Página ${i}`;
    selectorPagina.appendChild(opcion);
  }
  selectorPagina.value = 1;
  cargarEpisodios(1);
}
selectorPagina.addEventListener("change", (e) => {
  const pagina = parseInt(e.target.value);
  cargarEpisodios(pagina);
});
async function cargarEpisodios(pagina = 1) {
  listaEpisodios.innerHTML = "";
  personajesContainer.innerHTML = "";

  const res = await fetch(`${API_EPISODES}?page=${pagina}`);
  const data = await res.json();

  data.results.forEach((ep) => {
    const li = document.createElement("li");
    li.className = "bg-purple-800 hover:bg-purple-700 text-green-200 p-2 rounded cursor-pointer";
    li.textContent = `${ep.episode} - ${ep.name}`;
    li.addEventListener("click", () => mostrarPersonajes(ep.characters));
    listaEpisodios.appendChild(li);
  });
}

async function mostrarPersonajes(listaUrls) {
  personajesContainer.innerHTML = "";
  const ids = listaUrls.map(url => url.split("/").pop());
  const res = await fetch(`${API_CHARACTERS}/${ids.join(",")}`);
  const data = await res.json();
  const personajes = Array.isArray(data) ? data : [data];
  personajes.forEach(personaje => {
    const card = document.createElement("div");
    card.className = "bg-purple-800 rounded-xl overflow-hidden shadow-lg text-center";
    card.innerHTML = `
      <img src="${personaje.image}" alt="${personaje.name}" class="w-full h-48 object-cover">
      <div class="p-2">
        <h3 class="text-lg font-bold text-green-300">${personaje.name}</h3>
        <p class="text-sm text-green-200">${personaje.species}</p>
      </div>
    `;
    personajesContainer.appendChild(card);
  });
}

cargarDropdown();