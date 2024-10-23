import React, { useState, useEffect } from 'react';
import { getPokemonTypes } from '../services/pokeapi';

const PokemonSelector = () => {
  const [types, setTypes] = useState([]);
  const [firstType, setFirstType] = useState('');
  const [secondType, setSecondType] = useState('');
  const [description, setDescription] = useState(''); 
  const [loading, setLoading] = useState(false); 
  const [image, setImage] = useState(''); 
  const [error, setError] = useState(''); 

  useEffect(() => {
    const fetchData = async () => {
      const data = await getPokemonTypes(); 
      setTypes(data);
    };
    fetchData();
  }, []);

  // Función para hacer la solicitud a la API de Stable Diffusion
  const generateImage = async (prompt) => {
	try {
	  setLoading(true);
	  const response = await fetch('/sdapi/v1/txt2img', {
		method: 'POST',
		headers: {
		  'Content-Type': 'application/json',
		},
		body: JSON.stringify({
		  prompt: prompt,
		  width: 600,
		  height: 600,
		  seed: 1,
		  steps: 30,
		}),
	  });
  
	  if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.status}`);
	  }
  
	  const data = await response.json();
	  console.log(data); // Muestra la respuesta
  
	  // Verifica que la imagen esté en la respuesta
	  if (data.images && data.images.length > 0) {
		const base64Image = `data:image/png;base64,${data.images[0]}`;
		setImage(base64Image);
	  } else {
		setError('No images were returned from the API.');
	  }
	} catch (error) {
	  setError(`Failed to generate image: ${error.message}`);
	} finally {
	  setLoading(false);
	}
  };

  const handleSubmit = () => {
    if (!firstType || !secondType || !description) {
      setError('Please fill in all fields before submitting.');
      return;
    }

    setError(''); // Resetea errores
    const prompt = `A Pokémon with types ${firstType} and ${secondType}. Description: ${description}`;
    generateImage(prompt); // Llamada para generar imagen
  };

  return (
    <div>
      <h1>Select Pokémon Type</h1>
      <label>Choose First Type: </label>
      <select className="pokemon1" value={firstType} onChange={(e) => setFirstType(e.target.value)}>
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
          <select className="pokemon1" value={secondType} onChange={(e) => setSecondType(e.target.value)}>
            <option value="">-- select --</option>
            {types.map((type) => (
              <option key={type.name} value={type.name} disabled={type.name === firstType}>
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
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter a description"
        ></textarea>
      </div>

      <button onClick={handleSubmit} disabled={loading}>
        {loading ? 'Loading...' : 'Submit'}
      </button>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '20px' }}>
        {image && <img src={image} alt="Generated Pokémon" style={{ width: '200px', height: 'auto' }} />}
      </div>
    </div>
  );
};

export default PokemonSelector;
