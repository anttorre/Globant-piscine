import React, { useState, useEffect } from 'react';
import { getPokemonTypes } from '../services/pokeapi';  // Asegúrate de importar la función correcta

const PokemonSelector = () => {
  const [types, setTypes] = useState([]);
  const [selectedType, setSelectedType] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const data = await getPokemonTypes();  // Llama a la función para obtener tipos
      setTypes(data);
    };
    fetchData();
  }, []);

  const handleSelectChange = (event) => {
    setSelectedType(event.target.value);
  };

  return (
    <div>
      <h1>Select Pokémon Type</h1>
      <label>Choose Type: </label>
      <select className="pokemon1" value={selectedType} onChange={handleSelectChange}>
        <option value="">-- select --</option>
        {types.map((type) => (
          <option key={type.name} value={type.name}>
            {type.name}
          </option>
        ))}
      </select>
      {selectedType && (
        <div>
          <h2>You selected the type: {selectedType}</h2>
        </div>
      )}
    </div>
  );
};

export default PokemonSelector;
