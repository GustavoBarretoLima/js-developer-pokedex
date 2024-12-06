const pokeApi = {};

function convertPokeApiDetailToPokemon(pokeDetail) {
  const pokemon = new Pokemon();
  pokemon.number = pokeDetail.id;
  pokemon.name = pokeDetail.name;
  pokemon.height = pokeDetail.height;
  pokemon.weight = pokeDetail.weight;
  pokemon.abilities = pokeDetail.abilities.map(
    (ability) => ability.ability.name
  );

  const types = pokeDetail.types.map((typeSlot) => typeSlot.type.name);
  const [type] = types;

  pokemon.types = types;
  pokemon.type = type;

  pokemon.photo = pokeDetail.sprites.other.dream_world.front_default;

  // Mapeando os status
  pokemon.stats = pokeDetail.stats.map((stat) => ({
    name: stat.stat.name, // Nome do status (e.g., "hp", "attack")
    value: stat.base_stat, // Valor base do status
  }));

  return pokeApi.getPokemonSpecies(pokemon.number).then((description) => {
    pokemon.description = description;
    return pokemon;
  });
}

pokeApi.getPokemonDetail = (pokemon) => {
  return fetch(pokemon.url)
    .then((response) => response.json())
    .then(convertPokeApiDetailToPokemon);
};

pokeApi.getPokemons = (offset = 0, limit = 5) => {
  const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`;

  return fetch(url)
    .then((response) => response.json())
    .then((jsonBody) => jsonBody.results)
    .then((pokemons) => pokemons.map(pokeApi.getPokemonDetail))
    .then((detailRequests) => Promise.all(detailRequests))
    .then((pokemonsDetails) => pokemonsDetails);
};
pokeApi.getPokemonSpecies = (pokemonId) => {
  const url = `https://pokeapi.co/api/v2/pokemon-species/${pokemonId}/`;

  return fetch(url)
    .then((response) => response.json())
    .then((species) => {
      const flavorTextEntry = species.flavor_text_entries.find(
        (entry) => entry.language.name === "en"
      );

      return flavorTextEntry
        ? flavorTextEntry.flavor_text
        : "No description available.";
    });
};
