import * as Network from 'expo-network';
import * as FileSystem from 'expo-file-system';
import axios from 'axios';
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
    // Convertir URIs de fotos a Base64 para cumplir con el JSON solicitado
    const evidenciasBase64 = await Promise.all(
      data.evidencias.map(async (uri: string) => {
        const base64 = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
        return `data:image/jpeg;base64,${base64}`;
      })
    );

    const payload = {
      ...data,
      evidencias: evidenciasBase64
    };

    const response = await axios.post(`${API_CONFIG.BASE_URL}/infracciones`, payload, {
      headers: getAuthHeader(token),
      timeout: API_CONFIG.TIMEOUT
    });

    return response.data;
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
