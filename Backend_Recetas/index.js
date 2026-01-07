const express = require('express');
const cors = require('cors');

const app = express();
// Middlewares
app.use(cors());// Permite que React se conecte
app.use(express.json());

// --- AQUÍ OCURRE LA MAGIA ---

// 1. Importamos el archivo de rutas
const recetasRoutes = require('./routes/recetas.routes');

// 2. Le decimos: "Todo lo que empiece por /api/recetas, mándalo a ese archivo"
app.use('/api/recetas', recetasRoutes);

// -----------------------------

app.listen(3000, () => {
    console.log('🚀 Servidor corriendo...');
});
