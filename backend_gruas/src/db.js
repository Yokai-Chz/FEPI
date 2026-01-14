import pg from 'pg';
import { DB_CONFIG } from './config.js';

export const pool = new pg.Pool({
  user: DB_CONFIG.user,
  host: DB_CONFIG.host,
  database: DB_CONFIG.database,
  password: DB_CONFIG.password,
  port: DB_CONFIG.port,
});


