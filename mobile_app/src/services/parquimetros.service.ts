import { API_CONFIG, getAuthHeader } from "./api.config";

export interface RespuestaParquimetro {
  placa: string;
  estatus: "VIGENTE" | "EXPIRADO" | "SIN_PAGO";
  minutos_restantes: number; // Positivo si vigente, negativo si expirado
  fecha_vencimiento: string;
  accion_sugerida: "NINGUNA" | "COLOCAR INMOVILIZADOR" | "MULTAR";
}

export const parquimetrosService = {

  async consultarPlaca(placa: string, token: string): Promise<RespuestaParquimetro | null> {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL_GRUAS}/parquimetros/consulta/${placa}`, {
        method: 'GET',
        headers: getAuthHeader(token),
      });

      if (response.status === 404) {
        return null; // Vehículo no registrado o sin pago
      }

      if (!response.ok) {
        throw new Error("Error consultando parquímetro");
      }

      const data = await response.json();
      console.log('Respuesta Parquímetro:', JSON.stringify(data, null, 2));
      return data;
      
    } catch (error) {
      console.error("Error en parquimetrosService:", error);
      throw error;
    }
  }
};
