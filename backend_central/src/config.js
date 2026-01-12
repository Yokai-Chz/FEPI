export const DB_CONFIG = {
    user: process.env.DB_USER, 
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5430,
};

export const API_FINANZAS = process.env.API_FINANZAS || 'https://api.finanzas.com';
export const API_REPUVE = process.env.API_REPUVE || 'https://api.repuve.gob.mx';
export const API_SEMOVI_CONDUCTORES = process.env.API_SEMOVI_CONDUCTORES || 'https://api.semoviconductores.gob.mx';

export const PORT = process.env.PORT || 3000;

