import express from 'express';
import  { PORT } from './config.js';
import usuariosRoutes from './routes/usuarios_deposito.routes.js';
import gruasRoutes from './routes/gruas.routes.js';
import depositosRoutes from './routes/depositos.routes.js';
import solicitudesRoutes from './routes/solicitudes.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';
import { createSolicitud } from './controllers/solicitudes.controllers.js'; // Importación directa para debug
 
const app = express();

app.use(express.json());

// Middleware de Log para Diagnóstico
app.use((req, res, next) => {
  console.log(`[DEBUG] Recibida petición: ${req.method} ${req.url}`);
  next();
});

// RUTA DIRECTA DE DEBUG
app.post('/solicitudes-debug', createSolicitud);

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.use(usuariosRoutes);
app.use(gruasRoutes);
app.use(depositosRoutes);
app.use(solicitudesRoutes);
app.use(dashboardRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});