export const DB_CONFIG = {
    user: process.env.DB_USER, 
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5430,
};

export const API_FINANZAS = process.env.API_FINANZAS || 'http://localhost:3000/api/finanzas/linea-captura';
export const API_REPUVE = process.env.API_REPUVE || 'http://localhost:8000/api/semovi/vehiculo/';
export const API_SEMOVI_CONDUCTORES = process.env.API_SEMOVI_CONDUCTORES || 'http://localhost:8000/api/semovi/licencia/';

export const PORT = process.env.PORT || 4000;

