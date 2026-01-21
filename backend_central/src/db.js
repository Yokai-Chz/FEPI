import pg from 'pg';
import { DB_CONFIG } from './config.js';


// const connectionString = 'postgresql://postgres.zhwgmdxqzktfezpgbbdi:TheWeirdo08++@aws-0-us-west-2.pooler.supabase.com:6543/postgres'

// export const pool = new pg.Pool({
//   connectionString: connectionString, 
//   ssl: {
//     rejectUnauthorized: false, 
//   },
// });


export const pool = new pg.Pool({
  user: DB_CONFIG.user,
  host: DB_CONFIG.host,
  database: DB_CONFIG.database,
  password: DB_CONFIG.password,
  port: DB_CONFIG.port,
});

//Agrega un temporizador de 15 segundos para ejecutarlo
setTimeout(() => {
    pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Error conectando a Base de Datos:', err);
  } else {
    console.log('Conectado con Base de datos exitosamente.');
  }
});
}, 5000);
