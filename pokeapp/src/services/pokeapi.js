import axios from 'axios';

const POKEAPI_URL = 'https://pokeapi.co/api/v2/type';

export const getPokemonTypes = async () => {
  try {
    const response = await axios.get(POKEAPI_URL);  // Cambia a la URL correcta
    return response.data.results;  // Devuelve la lista de tipos
  } catch (error) {
    console.error('Error fetching the Pokémon types', error);
    return [];
  }
};

