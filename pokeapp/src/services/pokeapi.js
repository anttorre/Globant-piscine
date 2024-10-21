import axios from 'axios';

const POKEAPI_URL = 'https://pokeapi.co/api/v2/';

export const getPokemonList = async () => {
  try {
    const response = await axios.get(`${POKEAPI_URL}pokemon?limit=150`);
    return response.data.results;
  } catch (error) {
    console.error('Error fetching the Pokémon list', error);
    return [];
  }
};
