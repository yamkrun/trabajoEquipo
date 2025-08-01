let cardsR = document.querySelector("#cards");

async function mostrarCards() {
  const respuesta = await fetch("https://rickandmortyapi.com/api/character");
  const data = await respuesta.json();
  console.log(data);

  for (let i = 0; i < 10; i++) {
    let personaje = data.results[i];
    cardsR.innerHTML += `
      <div class="flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden md:flex-row md:max-w-xl hover:shadow-xl transition-shadow dark:border-gray-700 dark:bg-gray-800">
        <img class="object-cover w-full rounded-t-lg h-96 md:h-auto md:w-48 md:rounded-none md:rounded-s-lg" src="${personaje.image}" alt="${personaje.name}">
        <div class="flex flex-col justify-between p-4 leading-normal text-gray-800 dark:text-white">
          <h5 class="mb-2 text-2xl font-bold tracking-tight">${personaje.name}</h5>
          <p class="mb-1 font-normal">Género: ${personaje.gender}</p>
          <p class="mb-1 font-normal">Estado: ${personaje.status}</p>
          <p class="mb-3 font-normal">Especie: ${personaje.species}</p>

          <button class="w-fit px-4 py-2 text-sm font-semibold text-black bg-lime-400 hover:bg-lime-500 transition-all rounded-full shadow-md ring-2 ring-lime-500 hover:scale-105 focus:outline-none">
            Más información
          </button>
        </div>
      </div>
    `;
  }
}

mostrarCards();

let paginaActual = 1;

async function cargarPagina(pagina) {
  const respuesta = await fetch(`https://rickandmortyapi.com/api/character?page=${pagina}`);
  const data = await respuesta.json();
  cardsR.innerHTML = "";
  for (let i = 0; i < 10; i++) {
    let personaje = data.results[i];
    cardsR.innerHTML += `
      <a href="#" class="flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow-sm md:flex-row md:max-w-xl hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
        <img class="object-cover w-full rounded-t-lg h-96 md:h-auto md:w-48 md:rounded-none md:rounded-s-lg" src="${personaje.image}" alt="${personaje.name}">
        <div class="flex flex-col justify-between p-4 leading-normal">
          <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">${personaje.name}</h5>
          <p class="mb-1 font-normal text-gray-700 dark:text-gray-400">Género: ${personaje.gender}</p>
          <p class="mb-1 font-normal text-gray-700 dark:text-gray-400">Estado: ${personaje.status}</p>
          <p class="font-normal text-gray-700 dark:text-gray-400">Especie: ${personaje.species}</p>
          <button class="w-fit px-4 py-2 text-sm font-semibold text-black bg-lime-400 hover:bg-lime-500 transition-all rounded-full shadow-md ring-2 ring-lime-500 hover:scale-105 focus:outline-none">
            Más información
          </button>
        </div>
      </a>
    `;
  }

  document.getElementById("anterior").disabled = pagina === 1;
  document.getElementById("siguiente").disabled = !data.info.next;
}
document.getElementById("anterior").addEventListener("click", () => {
  if (paginaActual > 1) {
    paginaActual--;
    cargarPagina(paginaActual);
  }
});

document.getElementById("siguiente").addEventListener("click", () => {
  paginaActual++;
  cargarPagina(paginaActual);
});
cargarPagina(paginaActual);

