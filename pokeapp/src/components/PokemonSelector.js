import React, { useState, useEffect } from 'react';
import { getPokemonTypes } from '../services/pokeapi'; // Asegúrate de importar la función correcta

const PokemonSelector = () => {
  const [types, setTypes] = useState([]);
  const [firstType, setFirstType] = useState('');
  const [secondType, setSecondType] = useState('');
  const [description, setDescription] = useState(''); // Estado para la descripción
  const [loading, setLoading] = useState(false); // Estado de carga para la petición a la IA
  const [image, setImage] = useState(''); // Estado para almacenar la imagen generada
  const [error, setError] = useState(''); // Estado para manejar errores

  useEffect(() => {
    const fetchData = async () => {
      const data = await getPokemonTypes(); // Llama a la función para obtener tipos
      setTypes(data);
    };
    fetchData();
  }, []);

  const handleSelectChange = (event) => {
    setFirstType(event.target.value);
    setSecondType("");
  };

  const handleSelectChange2 = (event) => {
    const selectedValue = event.target.value;
    if (selectedValue === firstType) {
      return; // No hacer nada si se intenta seleccionar el mismo valor
    }
    setSecondType(selectedValue);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const generateImage = async () => {
    setLoading(true);
    setError('');
    try {
      const query = `A Pokémon with types ${firstType} and ${secondType}. Description: ${description}`;
      const response = await fetch(`https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}`, {
        method: 'GET',
        headers: {
          'Authorization': `Client-ID CLHGfzylMaGbP3VijJSML_O7SQSz64q0o7VcCor48-A`, // Reemplaza con tu Access Key de Unsplash
        },
      });

      // Comprueba si la respuesta fue exitosa
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      if (data.results.length > 0) {
        setImage(data.results[0].urls.small); // Usa la primera imagen encontrada
      } else {
        setError('No images found');
      }
    } catch (err) {
      setError('Error generating image');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    await generateImage(); // Genera la imagen usando la descripción y los tipos seleccionados
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
              <option key={type.name} value={type.name} disabled={type.name === firstType}
                style={type.name === firstType ? { backgroundColor: 'lightgrey' } : {}}>
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
        {image && <img src={image} alt="Generated" style={{ width: '200px', height: 'auto' }} />}
      </div>
    </div>
  );
};

export default PokemonSelector;
