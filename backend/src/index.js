const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const certificateRoutes = require('./routes/certificates');

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos (templates)
app.use('/templates', express.static(path.join(__dirname, 'templates')));

// Rutas
app.use('/api/certificates', certificateRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ 
    message: 'API de Certificados funcionando correctamente',
    endpoints: {
      generateCertificates: 'POST /api/certificates/generate',
      health: 'GET /api/certificates/health'
    }
  });
});

// Manejador de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Algo salió mal!', 
    message: err.message 
  });
});

// Solo iniciar el servidor si no estamos en Vercel
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  });
}

// Exportar la app para Vercel
module.exports = app;