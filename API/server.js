import express from 'express';
import partidasRoutes from './routes/partidas.js';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = 3000;

// Necesario para ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Servir la raíz del proyecto (subir dos niveles)
app.use(express.static(path.join(__dirname, '../')));

// API
app.use('/partidas', partidasRoutes);

app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
    console.log("Frontend servido desde:", path.join(__dirname, '../'));
});
