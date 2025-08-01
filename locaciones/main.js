let lugares=document.querySelector("#cardsLugares")

async function mostrarLugares() {
  const respuesta = await fetch("https://rickandmortyapi.com/api/location");
  const data = await respuesta.json();
  lugares.innerHTML = "";

  data.results.forEach(element => {
    lugares.innerHTML += `
      <div class="flex flex-col gap-4 bg-purple-800 border rounded-lg shadow-sm p-4 dark:bg-gray-800 dark:border-gray-700 text-black dark:text-white">
        <h5 class="text-xl font-bold text-lime-400">${element.name}</h5>
        <p class="text-sm">🌍 Tipo: ${element.type || "Desconocido"}</p>
        <p class="text-sm">🌌 Dimensión: ${element.dimension || "Desconocida"}</p>
      </div>
    `;
  });
}

mostrarLugares();
