// server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fetch = require('node-fetch'); // Importar node-fetch
require('dotenv').config(); // Importar dotenv para manejar variables de entorno

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors()); // Permitir CORS para que el frontend pueda hacer solicitudes
app.use(bodyParser.json()); // Parsear el cuerpo de las solicitudes como JSON

// Ruta para obtener recomendaciones de viajes
app.post('/api/recommendations', async (req, res) => {
  const { destination } = req.body; // Obtiene el destino del cuerpo de la solicitud

  // Verificar que el destino esté presente
  if (!destination) {
    return res.status(400).json({ error: 'Destination is required.' });
  }

  try {
    // Realizar la solicitud a la API de IA
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${process.env.API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `Please recommend popular travel destinations or attractions in ${destination}.`,
              },
            ],
          },
        ],
      }),
    });

    // Comprobar si la respuesta de la API fue exitosa
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();

    // Asegurarse de que la respuesta tenga la estructura esperada
    if (data.contents && data.contents.length > 0 && data.contents[0].parts && data.contents[0].parts.length > 0) {
      const places = data.contents[0].parts[0].text.split(','); // Suponiendo que las recomendaciones están separadas por comas
      res.json({ recommendations: places.map(place => place.trim()) }); // Devolver las recomendaciones
    } else {
      res.status(404).json({ error: 'No recommendations found.' }); // No se encontraron recomendaciones
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch recommendations. Please try again later.' }); // Manejo de errores
  }
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
