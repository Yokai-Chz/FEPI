/**
 * Configuración centralizada de la API
 */

export const API_CONFIG = {
  // En Expo, las variables de entorno deben empezar con EXPO_PUBLIC_
  // y se acceden mediante process.env
  BASE_URL: process.env.EXPO_PUBLIC_API_URL || 'http://192.168.0.219:4000',
  API_KEY: process.env.EXPO_PUBLIC_API_KEY || '',
  TIMEOUT: 15000,
  HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
};

// Función auxiliar para obtener el token de autenticación si se guarda en algún lugar (ej. SecureStore)
export const getAuthHeader = (token: string) => ({
  ...API_CONFIG.HEADERS,
  'Authorization': `Bearer ${token}`,
});
