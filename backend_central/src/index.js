import express from 'express';
import  { PORT } from './config.js';
import infraccionesRouter from './routes/infracciones.routes.js';
import catalogosRouter from './routes/catalogo.routes.js';

const app = express();


app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.use(infraccionesRouter);
app.use(catalogosRouter);


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});