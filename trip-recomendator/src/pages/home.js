import React, { useState } from 'react';
import '../App.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Inicializar el icono del marcador
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const Home = () => {
  const [destination, setDestination] = useState('');
  const [error, setError] = useState('');
  const [recommendations, setRecommendations] = useState([]);

  const handleSubmit = async () => {
    if (!destination) {
      setError('Please fill in all fields before submitting.');
      return;
    }
  
    setError('');
    setRecommendations([]);
  
    try {
      const response = await fetch('http://localhost:5000/api/recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ destination }), // Enviar el destino al servidor
      });
  
      if (!response.ok) {
        const errorMessage = await response.text(); // Capturar el mensaje de error
        throw new Error(`Network response was not ok: ${errorMessage}`);
      }
  
      const data = await response.json();
      console.log('API Response:', data);
  
      if (data.recommendations) {
        setRecommendations(data.recommendations);
      } else {
        setError('No recommendations found.');
      }
    } catch (err) {
      setError(`Failed to fetch recommendations: ${err.message}`);
      console.error(err);
    }
  };

  return (
    <div className="home-container">
      <h1>Trip Recommender</h1>
      <div className="input-container">
        <input
          type="text"
          placeholder="Enter your destination"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
        />
        <button onClick={handleSubmit}>Get Recommendation</button>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {recommendations.length > 0 && (
        <div className="recommendation-container">
          <h3>Recommendations:</h3>
          <ul>
            {recommendations.map((place, index) => (
              <li key={index}>{place}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Mapa interactivo */}
      {recommendations.length > 0 && (
        <MapContainer center={[20, 0]} zoom={2} style={{ height: '400px', width: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {recommendations.map((place, index) => {
            // Aquí puedes usar una API para obtener las coordenadas basadas en el nombre del lugar
            return (
              <Marker key={index} position={[20 + index * 2, 0 + index]}> {/* Ajustar las posiciones según el lugar */}
                <Popup>{place}</Popup>
              </Marker>
            );
          })}
        </MapContainer>
      )}
    </div>
  );
};

export default Home;
//AIzaSyDxAuY57jN_1csCLNYF9a-AVAsxtxs_Bqo