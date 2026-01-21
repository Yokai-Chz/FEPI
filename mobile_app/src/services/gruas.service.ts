import { API_CONFIG } from './api.config';

// Lo que la App envía
export interface PeticionArrastre {
  id_agente: string;
  coordenadas: {
    lat: number;
    lng: number;
  };
  referencia_manual: string;
  detalles_vehiculo: any; 
}

// Lo que el servidor responde (incluyendo el Folio generado)
export interface RespuestaServidorGrua {
  folio_servicio: string; // Generado por el server
  deposito_asignado: string;
  unidad_asignada: string;
  tiempo_estimado: string;
  estatus: string;
}

export const gruasService = {
  
  async solicitarServicio(datos: PeticionArrastre): Promise<RespuestaServidorGrua> {
    // LLAMADA REAL (Comentada para que puedas probar la App ahora mismo)
    /*
    const response = await fetch(`${API_CONFIG.BASE_URL}/servicios/gruas`, {
      method: 'POST',
      headers: API_CONFIG.HEADERS,
      body: JSON.stringify(datos),
    });

    if (!response.ok) {
      throw new Error('No se pudo procesar la solicitud de grúa');
    }
    return await response.json();
    */

    // SIMULACIÓN DE RESPUESTA DEL SERVIDOR
    return new Promise((resolve) => {
      console.log("[GruasService] Petición enviada al servidor:", JSON.stringify(datos, null, 2));
      
      setTimeout(() => {
        resolve({
          folio_servicio: `GR-${Math.floor(Math.random() * 9000) + 1000}`, // El server da el folio
          deposito_asignado: "Depósito Vehicular Renovación",
          unidad_asignada: "T-104 (Plataforma)",
          tiempo_estimado: "15 min",
          estatus: "ASIGNADO"
        });
      }, 2000);
    });
  }
};
