import { AuthService } from './AuthService';

export interface InfraccionData {
  fecha: string;
  latitud: number;
  longitud: number;
  placa: string;
  niv: string;
  id_agente: string;
  id_licencia: string;
  infracciones: string[]; 
}

const API_BASE_URL = 'http://192.168.1.XX:3000'; //  IP

export const InfraccionService = {
  enviar: async (datos: InfraccionData) => {
    try {
      const token = await AuthService.obtenerToken();
      
      const response = await fetch(`${API_BASE_URL}/api/finanzas/linea-captura`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token || 'SSC_TOKEN_2026'}` 
        },
        body: JSON.stringify(datos)
      });

      // Verificamos si el servidor respondió bien
      if (!response.ok) {
        throw new Error('Error en la respuesta del servidor');
      }

      // Convertimos la respuesta a JSON y la regresamos a la Vista
      const resultado = await response.json();
      return resultado;

    } catch (error) {
      console.error("Error en InfraccionService:", error);
      throw error;
    }
  }
};