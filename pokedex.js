const pokemonList = document.getElementById("pokemon-list");
const pokemonDetail = document.getElementById("pokemon-detail");
const pokemonInfo = document.getElementById("pokemon-info");
const backButton = document.getElementById("back-button");
const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");
const prevButton = document.getElementById("prev-button");
const nextButton = document.getElementById("next-button");
const totalP = document.getElementById("totalPokemon");
const lastPageButton = document.getElementById("last-page");
const firstPageButton = document.getElementById("first-page");
const paginationButtons = document.getElementById("pagination-buttons");

let currentPage = 1;
const itemPerPage = 52;
let totalPokemon = 0;

async function fetchPokemonData(pokemonID) {
  if (pokemonID == 0) {
    let limit = 1025;
    const response = await fetch(
      `http://127.0.0.1:3000/api/pokemon?limit=${limit}`
    );
    const responseTotal = await response.json();
    //return (resultsCounter = responseTotal.count);
    //return (resultsCounter = responseTotal.results.length);
    return (resultsCounter = limit);
  } else {
    const response = await fetch(
      `http://127.0.0.1:3000/api/pokemon/${pokemonID}`
    );
    const pokemon = await response.json();
    return pokemon;
  }
}

async function loadPokedex(page) {
  totalPokemon = await fetchPokemonData(0);
  paginaActual = page;
  pokemonList.innerHTML = "";
  const start = (page - 1) * itemPerPage + 1;
  const end = page * itemPerPage;

  updatePaginationButton(page);
  let finalPage = 0;
  if (end >= totalPokemon) {
    finalPage = totalPokemon;
  } else {
    finalPage = end;
  }
  totalP.innerHTML = `Página ${paginaActual} de ${Math.ceil(
    totalPokemon / itemPerPage
  )} mostrando los Pokémones del ${start} hasta el ${finalPage} de un total de ${totalPokemon}`;

  for (let i = start; i <= finalPage; i++) {
    const pokemon = await fetchPokemonData(i);
    listPokemon(pokemon);
  }

  return;
}

function listPokemon(pokemon) {
  const pokemonCard = document.createElement("div");
  pokemonCard.classList.add("pokemon-card");
  if (pokemon.view) {
    pokemonCard.classList.add("p-view");
  }
  if (pokemon.catch) {
    pokemonCard.classList.add("p-catch");
  }
  if (pokemon.inTeam) {
    pokemonCard.classList.add("p-inteam");
  }
  pokemonCard.innerHTML = `
  <div class="pokemon-title"><span class="pokemon-id">${
    pokemon.pokemon_id
  }</span><h3>${pokemon.name.toUpperCase()}</h3>    </div>  
  <div class="pomekon-img">
  <img src = "${pokemon.image}" alt="${pokemon.name}"/>
  </div>  
  <p><strong>Habilidades:</strong></p>    
    ${pokemon.types}
    <ul class="pokemon-status">
    <li><span title="Pokemon visto">&#9732;</span></li>
    <li><span title="Pokemon capturado">&#9854;</span></li>
    <li><span title="Pokemon en equipo">&#9741;</span></li>
    </ul>
    `;
  pokemonCard.addEventListener("click", () => showPokemonDetail(pokemon));
  pokemonList.appendChild(pokemonCard);
  return;
}

backButton.addEventListener("click", () => {
  pokemonDetail.style.display = "none";
  pokemonList.style.display = "flex";
  backButton.style.display = "none";
});

function showPokemonDetail(pokemon) {
  backButton.style.display = "block";
  pokemonList.style.display = "none";
  pokemonDetail.style.display = "flex";
  paginationButtons.style.display = "none";
  pokemonInfo.classList.remove("p-view");
  pokemonInfo.classList.remove("p-catch");
  pokemonInfo.classList.remove("p-inteam");
  pokemonInfo.classList.add("pokemon-card");
  if (pokemon.view) {
    pokemonInfo.classList.add("p-view");
  }
  if (pokemon.catch) {
    pokemonInfo.classList.add("p-catch");
  }
  if (pokemon.inTeam) {
    pokemonInfo.classList.add("p-inteam");
  }
  pokemonInfo.innerHTML = `
  <div class="pokemon-title"><span class="pokemon-id">${
    pokemon.pokemon_id
  }</span><h3>${pokemon.name.toUpperCase()}</h3></div>
  <div class="pomekon-img">
  <img src="${pokemon.image}" alt="${pokemon.name}">
  </div>
  <p><strong>Altura</strong> = ${pokemon.height}</p>
  <p><strong>Peso</strong> = ${pokemon.weight}</p>
  <p><strong>Tipos</strong> = ${pokemon.types}</p>
  <ul class="pokemon-status">
    <li><span title="Pokemon visto">&#9732;</span></li>
    <li><span title="Pokemon capturado">&#9854;</span></li>
    <li><span title="Pokemon en equipo">&#9741;</span></li>
    </ul>
  `;
  return;
}

async function searchPokemon() {
  const query = searchInput.value.toLowerCase().trim(); // la palabra la coloca toda en minúscula con toLowerCase y le quita todos los espacios en blanco con trim
  if (query) {
    try {
      const pokemon = await fetchPokemonData(query);
      pokemonList.style.display = "none";
      showPokemonDetail(pokemon);
    } catch (error) {
      alert("Pokémon no encontrado, intentelo de nuevo");
    }
  } else {
    alert("Ingresar un nombre o un ID de Pokémon");
  }
}

searchButton.addEventListener("click", searchPokemon);

function updatePaginationButton(page) {
  prevButton.disabled = page === 1;
  firstPageButton.disabled = page === 1;
  nextButton.disabled = page === Math.ceil(totalPokemon / itemPerPage);
  lastPageButton.disabled = page === Math.ceil(totalPokemon / itemPerPage);
}

nextButton.addEventListener("click", () => {
  currentPage++;
  loadPokedex(currentPage);
});

prevButton.addEventListener("click", () => {
  console.log(currentPage);

  if (currentPage > 1) {
    currentPage--;
    loadPokedex(currentPage);
  }
});

lastPageButton.addEventListener("click", () => {
  let lastPage = Math.ceil(totalPokemon / itemPerPage);
  currentPage = lastPage;
  loadPokedex(lastPage);
});

firstPageButton.addEventListener("click", () => {
  currentPage = 1;
  loadPokedex(currentPage);
});

loadPokedex(currentPage);
