import express from 'express';
import  { PORT } from './config.js';
import usuariosRoutes from './routes/usuarios_deposito.routes.js';
import gruasRoutes from './routes/gruas.routes.js';
import depositosRoutes from './routes/depositos.routes.js';
import solicitudesRoutes from './routes/solicitudes.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';
import parquimetrosRoutes from './routes/parquimetros.routes.js';
 
const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.use(usuariosRoutes);
app.use(gruasRoutes);
app.use(depositosRoutes);
app.use(solicitudesRoutes);
app.use(dashboardRoutes);
app.use(parquimetrosRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});