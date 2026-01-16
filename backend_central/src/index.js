import express from 'express';
import  { PORT } from './config.js';
import infraccionesRouter from './routes/infracciones.routes.js';
import catalogosRouter from './routes/catalogo.routes.js';
import userRoutes from './routes/user.routes.js';
import authRoutes from './routes/auth.routes.js';
import vehiculosRoutes from './routes/vehiculos.routes.js';
 
const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.use(infraccionesRouter);
app.use(catalogosRouter);
app.use(userRoutes);
app.use(authRoutes);
app.use(vehiculosRoutes);


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});