import { API_CONFIG } from "./api.config";

// Lo que la App envía
export interface PeticionArrastre {
  latitud: number;
  longitud: number;
  placas_vehiculo: string;
  marca_vehiculo: string;
  color_vehiculo: string;
  tipo_vehiculo: string;
  motivo_arrastre: string;
  id_infraccion_vinculada: number | string;
  observaciones: string;
}

// Lo que el servidor responde
export interface RespuestaServidorGrua {
  mensaje: string;
  solicitud: {
    id_solicitud: number;
    folio: string;
    fecha_solicitud: string;
    id_grua: number;
    id_deposito_destino: number;
    id_ubicacion_origen: number;
    placas_vehiculo: string;
    marca_vehiculo: string;
    color_vehiculo: string;
    tipo_vehiculo: string;
    id_infraccion_vinculada: number;
    motivo_arrastre: string;
    estatus_servicio: string;
    observaciones: string;
  };
  asignacion: {
    deposito: string;
    distancia_deposito_km: string;
    grua: string;
    distancia_grua_km: string;
    ubicacion_origen: {
      vialidad: string;
      numero_exterior: string;
      asentamiento: string;
      codigo_postal: string;
      municipio: string;
      entidad: string;
      coordenadas: string;
    };
  };
}

export const gruasService = {
  
  async solicitarServicio(datos: PeticionArrastre): Promise<RespuestaServidorGrua> {
    // LLAMADA REAL (Comentada para que puedas probar la App ahora mismo)
    
    console.log('Json de la peticion de gruas: \n',JSON.stringify(datos,null,2))
    
    const response = await fetch(`${API_CONFIG.BASE_URL_GRUAS}/solicitudes`, {
      method: 'POST',
      headers: API_CONFIG.HEADERS,
      body: JSON.stringify(datos),
    });

    if (!response.ok) {
      throw new Error('No se pudo procesar la solicitud de grúa');
    }
    return await response.json();
  }
};
