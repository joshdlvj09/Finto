// =======================================================
// SERVIDOR DE FINTO
// API REST que conecta la app con MongoDB (base de datos "finto")
// =======================================================

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

if (!process.env.MONGO_URI || !process.env.JWT_SECRET) {
    console.error('❌ Faltan MONGO_URI o JWT_SECRET en el archivo .env');
    process.exit(1);
}

const app = express();

// Necesario si se despliega detrás de un proxy (Render, Railway, etc.)
app.set('trust proxy', 1);

// --- 1. MIDDLEWARES ---
// La app móvil no envía header Origin, por eso CORS queda abierto
app.use(cors());
app.use(express.json({ limit: '100kb' }));

// --- 2. RUTAS ---
app.get('/api/health', (_req, res) => {
    res.json({ ok: true, db: mongoose.connection.readyState === 1 });
});
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/transactions', require('./routes/transactionRoutes'));

app.use((_req, res) => res.status(404).json({ msg: 'Ruta no encontrada' }));

// Manejador final de errores: nunca expone rutas, código ni detalles internos al cliente
app.use((err, _req, res, _next) => {
    if (err.type === 'entity.parse.failed') {
        return res.status(400).json({ msg: 'La solicitud tiene un formato inválido' });
    }
    if (err.type === 'entity.too.large') {
        return res.status(413).json({ msg: 'La solicitud es demasiado grande' });
    }
    console.error('Error no controlado:', err);
    res.status(500).json({ msg: 'Ocurrió un error inesperado' });
});

// --- 3. CONEXIÓN A BASE DE DATOS Y ARRANQUE ---
const PORT = process.env.PORT || 4000;

mongoose
    .connect(process.env.MONGO_URI, { dbName: 'finto' })
    .then(() => {
        console.log('✅ Conectado a MongoDB (base de datos: finto)');
        // Escucha en todas las interfaces para que el celular pueda conectarse por la red local
        app.listen(PORT, '0.0.0.0', () => console.log(`🚀 API de Finto en el puerto ${PORT}`));
    })
    .catch((error) => {
        console.error('❌ No se pudo conectar a MongoDB:', error.message);
        process.exit(1);
    });
