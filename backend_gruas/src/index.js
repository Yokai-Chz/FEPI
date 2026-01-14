import express from 'express';
import  { PORT } from './config.js';
 
const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello, World!');
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});