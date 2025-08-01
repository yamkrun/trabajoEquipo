let cardsR = document.querySelector("#cards");

async function mostrarCards() {
  const respuesta = await fetch("https://rickandmortyapi.com/api/character");
  const data = await respuesta.json();
  console.log(data);

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
          <button type="button" class="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700">Mas información</button>
        </div>
      </a>
    `;
  }
}

mostrarCards();