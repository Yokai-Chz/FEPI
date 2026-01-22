import { API_CONFIG, getAuthHeader } from './api.config';

export const vehiculosService = {
  /**
   * Obtiene la información de un vehículo por su placa.
   * @param placa La placa del vehículo a consultar.
   * @param token El token de autenticación del oficial.
   */
  async getVehiculoPorPlaca(placa: string, token: string) {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/vehiculos/${placa}`, {
        method: 'GET',
        headers: getAuthHeader(token),
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = "Error al obtener información del vehículo";
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.message || errorData.mensaje || errorMessage;
        } catch (e) {}

        const error: any = new Error(errorMessage);
        error.status = response.status;
        throw error;
      }

      return await response.json();
    } catch (error) {
      console.error(`Error en getVehiculoPorPlaca (${placa}):`, error);
      throw error;
    }
  }
};
