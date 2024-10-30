const express = require('express');
const axios = require('axios'); // Asegúrate de instalar axios
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.post('/api/recommendations', async (req, res) => {
  const { destination } = req.body;

  try {
    // Aquí es donde realizarías la solicitud a la IA Gemini
    const response = await axios.post('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=', {
      destination,
      // Puedes agregar más datos si es necesario
    });

    // Procesar la respuesta de la IA Gemini
    const recommendations = response.data.recommendations; // Ajusta esto según la estructura de la respuesta

    if (recommendations && recommendations.length > 0) {
      res.json({ recommendations });
    } else {
      res.status(404).json({ message: 'No recommendations found.' });
    }
  } catch (error) {
    console.error('Error fetching recommendations from Gemini:', error);
    res.status(500).json({ message: 'Failed to fetch recommendations.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
