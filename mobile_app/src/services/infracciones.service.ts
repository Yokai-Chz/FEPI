import * as Network from 'expo-network';
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
      let errorMessage = "Error del servidor";
      try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.message || errorData.mensaje || errorMessage;
      } catch (e) {}

      // Lanzamos un error que incluya el status
      const error: any = new Error(errorMessage);
      error.status = response.status;
      throw error;
    }

    return await response.json();
  },

  // Proceso de sincronización de pendientes
  async syncOfflineData(token: string): Promise<{synced: number, failed: string[]}> {
    const queue = await storageService.getQueue();
    if (queue.length === 0) return { synced: 0, failed: [] };

    let syncedCount = 0;
    let failedMessages: string[] = [];
    
    for (const item of queue) {
      try {
        const { id_local, intentos, ...serverData } = item;
        await this.sendToServer(serverData, token);
        await storageService.removeFromQueue(id_local);
        syncedCount++;
      } catch (e: any) {
        console.error(`Error sincronizando ${item.id_local}:`, e);
        
        // Si es un error 400-499 es un error FATAL de datos (ej. placa no existe)
        // No tiene sentido reintentar, lo borramos de la cola pero avisamos
        if (e.status >= 400 && e.status < 500) {
            await storageService.removeFromQueue(item.id_local);
            failedMessages.push(`Multa descartada (${item.placa}): ${e.message}`);
        }
      }
    }
    return { synced: syncedCount, failed: failedMessages };
  }
};
