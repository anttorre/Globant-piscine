import React, { useState, useEffect } from 'react';
import { getPokemonList } from './services/pokeapi';

const App = () => {
  const [pokemons, setPokemons] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getPokemonList();
      setPokemons(data);
    };
    fetchData();
  }, []);

  return (
    <div>
      <h1>Pokémon List</h1>
      <ul>
        {pokemons.map(pokemon => (
          <li key={pokemon.name}>{pokemon.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default App;

