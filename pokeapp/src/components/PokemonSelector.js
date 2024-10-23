import React, { useState, useEffect } from 'react';
import { getPokemonTypes } from '../services/pokeapi';
import { usePollinationsImage } from '@pollinations/react';

const PokemonSelector = () => {
  const [types, setTypes] = useState([]);
  const [firstType, setFirstType] = useState('');
  const [secondType, setSecondType] = useState('');
  const [description, setDescription] = useState(''); 
  const [loading, setLoading] = useState(false); 
  const [image, setImage] = useState(''); 
  const [error, setError] = useState(''); 

  const [shouldGenerateImage, setShouldGenerateImage] = useState(false); // Controla la generación manual

  // Hook de Pollinations que se activa según el trigger `shouldGenerateImage`
  const imageUrl = usePollinationsImage(
    shouldGenerateImage
      ? `A Pokémon with types ${firstType} and ${secondType}. Description: ${description}`
      : '', // Solo se activa cuando el usuario hace clic en submit
    {
      width: 600,
      height: 600,
      seed: 1,
      model: 'flux',
    }
  );

  useEffect(() => {
    const fetchData = async () => {
      const data = await getPokemonTypes(); 
      setTypes(data);
    };
    fetchData();
  }, []);

  // Actualiza la imagen una vez generada por Pollinations
  useEffect(() => {
    if (imageUrl && shouldGenerateImage) {
      setImage(imageUrl);
      setLoading(false); // Quita la carga
      setShouldGenerateImage(false); // Resetea el trigger
    }
  }, [imageUrl, shouldGenerateImage]);

  const handleSelectChange = (event) => {
    setFirstType(event.target.value);
    setSecondType('');
  };

  const handleSelectChange2 = (event) => {
    const selectedValue = event.target.value;
    if (selectedValue === firstType) {
      return;
    }
    setSecondType(selectedValue);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handleSubmit = () => {
    // Verifica si todos los campos están completos
    if (!firstType || !secondType || !description) {
      setError('Please fill in all fields before submitting.');
      return;
    }

    setError(''); // Resetea errores
    setLoading(true); // Activa el estado de carga
    setShouldGenerateImage(true); // Activa la generación de la imagen
  };

  return (
    <div>
      <h1>Select Pokémon Type</h1>
      <label>Choose First Type: </label>
      <select className="pokemon1" value={firstType} onChange={handleSelectChange}>
        <option value="">-- select --</option>
        {types.map((type) => (
          <option key={type.name} value={type.name}>
            {type.name[0].toUpperCase() + type.name.slice(1)}
          </option>
        ))}
      </select>

      {firstType && (
        <div>
          <label>Choose Second Type: </label>
          <select className="pokemon1" value={secondType} onChange={handleSelectChange2}>
            <option value="">-- select --</option>
            {types.map((type) => (
              <option
                key={type.name}
                value={type.name}
                disabled={type.name === firstType}
                style={type.name === firstType ? { backgroundColor: 'lightgrey' } : {}}
              >
                {type.name[0].toUpperCase() + type.name.slice(1)}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="form-group">
        <label>Description: </label>
        <textarea
          value={description}
          onChange={handleDescriptionChange}
          placeholder="Enter a description"
        ></textarea>
      </div>

      <button onClick={handleSubmit} disabled={loading}>
        {loading ? 'Loading...' : 'Submit'}
      </button>

      {error && <p style={{ color: 'red' }}>{error}</p>} {/* Mostrar errores */}
      
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '20px' }}>
        {image && <img src={image} alt="Generated Pokémon" style={{ width: '200px', height: 'auto' }} />}
      </div>
    </div>
  );
};

export default PokemonSelector;
