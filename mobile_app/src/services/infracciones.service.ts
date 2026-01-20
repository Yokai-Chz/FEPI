import * as Network from 'expo-network';
import * as FileSystem from 'expo-file-system/legacy';
import { API_CONFIG, getAuthHeader } from './api.config';
import { storageService } from './storage.service';

export const infraccionesService = {
  
  // Función principal para levantar multa
  async crearInfraccion(data: any, token: string) {
    const networkState = await Network.getNetworkStateAsync();
    
    if (networkState.isConnected && networkState.isInternetReachable) {
      try {
        return await this.sendToServer(data, token);
      } catch (error) {
        console.warn("Fallo envío, guardando en cola offline:", error);
        return await storageService.saveOffline(data);
      }
    } else {
      console.log("Sin conexión, guardando offline...");
      return await storageService.saveOffline(data);
    }
  },

  // Envío real al servidor
  async sendToServer(data: any, token: string) {
    // SIMULACIÓN: En lugar de Base64, enviamos URLs simuladas
    // En producción, aquí se subirían las imágenes a un Storage (S3, Cloudinary)
    // y se obtendrían sus URLs públicas.
    const evidenciasSimuladas = data.evidencias.map((uri: string, index: number) => {
        const nombreArchivo = uri.split('/').pop() || `evidencia_${index}.jpg`;
        return `https://storage.cdmx.gob.mx/multas/${data.placa}/${new Date().getTime()}_${nombreArchivo}`;
    });

    const payload = {
      ...data,
      evidencias: evidenciasSimuladas
    };

    const response = await fetch(`${API_CONFIG.BASE_URL}/infracciones`, {
      method: 'POST',
      headers: getAuthHeader(token),
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error enviando infracción:', response.status, errorText);
      try {
          const errorData = JSON.parse(errorText);
          throw new Error(errorData.message || `Error del servidor: ${response.status}`);
      } catch (e) {
          throw new Error(`Error del servidor: ${response.status} - ${errorText}`);
      }
    }

    return await response.json();
  },

  // Proceso de sincronización de pendientes
  async syncOfflineData(token: string) {
    const queue = await storageService.getQueue();
    if (queue.length === 0) return;

    console.log(`Sincronizando ${queue.length} multas pendientes...`);
    
    for (const item of queue) {
      try {
        // Quitamos metadata local antes de enviar
        const { id_local, intentos, ...serverData } = item;
        await this.sendToServer(serverData, token);
        await storageService.removeFromQueue(id_local);
        console.log(`Sincronizado: ${id_local}`);
      } catch (e) {
        console.error(`Error sincronizando ${item.id_local}:`, e);
      }
    }
  }
};
