import pg from 'pg';

const connectionString = 'postgresql://postgres.zhwgmdxqzktfezpgbbdi:TheWeirdo08++@aws-0-us-west-2.pooler.supabase.com:6543/postgres'

export const pool = new pg.Pool({
  connectionString: connectionString, 
  ssl: {
    rejectUnauthorized: false, 
  },
});

pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Error conectando a Base de Datos:', err);
  } else {
    console.log('Conectado con Base de datos exitosamente.');
  }
});