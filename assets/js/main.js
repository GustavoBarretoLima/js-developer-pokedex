const pokemonList = document.getElementById("pokemonList");
const loadMoreButton = document.getElementById("loadMoreButton");

const maxRecords = 151;
const limit = 10;
let offset = 0;

// Array para armazenar os pokémons carregados
let allPokemons = [];

function convertPokemonToLi(pokemon) {
  return `
    <li class="pokemon ${pokemon.type}">
      <span class="number">#${pokemon.number}</span>
      <span class="name">${pokemon.name}</span>

      <div class="detail">
        <ol class="types">
          ${pokemon.types
            .map((type) => `<li class="type ${type}">${type}</li>`)
            .join("")}
        </ol>

        <img src="${pokemon.photo}" alt="${pokemon.name}">
      </div>
    </li>
  `;
}

function loadPokemonItens(offset, limit) {
  pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
    allPokemons = [...allPokemons, ...pokemons]; // Adiciona os novos pokémons ao array existente

    const newHtml = pokemons.map(convertPokemonToLi).join("");
    pokemonList.innerHTML += newHtml;

    // Atribuindo eventos de clique aos novos Pokémon carregados
    const pokemonItems = document.querySelectorAll(".pokemon");
    pokemonItems.forEach((item, index) => {
      item.addEventListener("click", () => {
        const pokemon = allPokemons[index]; // Garante o Pokémon correto
        showPokemonProfile(pokemon);
      });
    });
  });
}

loadPokemonItens(offset, limit);

loadMoreButton.addEventListener("click", () => {
  offset += limit;
  const qtdRecordsWithNextPage = offset + limit;

  if (qtdRecordsWithNextPage >= maxRecords) {
    const newLimit = maxRecords - offset;
    loadPokemonItens(offset, newLimit);

    loadMoreButton.parentElement.removeChild(loadMoreButton); // Remove o botão quando atingir o máximo
  } else {
    loadPokemonItens(offset, limit);
  }
});

// Função para mostrar o perfil do Pokémon
function showPokemonProfile(pokemon) {
  const modalHtml = `
    <div class="modal">
      <div class="modal-content">
        <span class="close-button">&times;</span>
        <h2>${pokemon.name.toUpperCase()}</h2>
        <img src="${pokemon.photo}" alt="${pokemon.name}">
        <p><strong>ID:</strong> ${pokemon.number}</p>
        <p><strong>Altura:</strong> ${pokemon.height / 10} m</p>
        <p><strong>Peso:</strong> ${pokemon.weight / 10} kg</p>
        <p><strong>Tipos:</strong> ${pokemon.types.join(", ")}</p>
        <p><strong>Descrição:</strong> ${pokemon.description}</p>
        <h3>Status</h3>
        <ul class="stats">
          ${pokemon.stats
            .map(
              (stat) => `
                <li>
                  <span class="stat-name">${stat.name.toUpperCase()}:</span>
                  <div class="progress-bar">
                    <div class="progress" style="width: ${
                      (stat.value / 255) * 100
                    }%;"></div>
                  </div>
                  <span class="stat-value">${stat.value}</span>
                </li>
              `
            )
            .join("")}
        </ul>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML("beforeend", modalHtml);

  const closeButton = document.querySelector(".close-button");
  closeButton.addEventListener("click", () => {
    document.querySelector(".modal").remove();
  });
}
