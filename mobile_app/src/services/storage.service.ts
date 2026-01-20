import * as FileSystem from 'expo-file-system/legacy';
import * as SecureStore from 'expo-secure-store';

const QUEUE_FILE = FileSystem.documentDirectory + 'offline_infracciones.json';
const PHOTOS_DIR = FileSystem.documentDirectory + 'permanente_evidencias/';

export const storageService = {
  // Asegura que el directorio de fotos exista
  async init() {
    const dir = await FileSystem.getInfoAsync(PHOTOS_DIR);
    if (!dir.exists) {
      await FileSystem.makeDirectoryAsync(PHOTOS_DIR, { intermediates: true });
    }
  },

  // Mueve una foto temporal a almacenamiento permanente para que no se borre
  async persistImage(tempUri: string): Promise<string> {
    await this.init();
    const filename = tempUri.split('/').pop();
    const newPath = PHOTOS_DIR + filename;
    await FileSystem.copyAsync({ from: tempUri, to: newPath });
    return newPath;
  },

  // Guarda una infracción en la cola local
  async saveOffline(data: any) {
    await this.init();
    const currentQueue = await this.getQueue();
    
    // Persistir cada imagen del array de evidencias
    const persistedEvidencias = await Promise.all(
      data.evidencias.map((uri: string) => this.persistImage(uri))
    );

    const offlineData = {
      ...data,
      evidencias: persistedEvidencias,
      id_local: Date.now().toString(),
      intentos: 0
    };

    currentQueue.push(offlineData);
    await FileSystem.writeAsStringAsync(QUEUE_FILE, JSON.stringify(currentQueue));
    return offlineData.id_local;
  },

  async getQueue(): Promise<any[]> {
    const file = await FileSystem.getInfoAsync(QUEUE_FILE);
    if (!file.exists) return [];
    const content = await FileSystem.readAsStringAsync(QUEUE_FILE);
    return JSON.parse(content);
  },

  async removeFromQueue(idLocal: string) {
    const queue = await this.getQueue();
    const newQueue = queue.filter(item => item.id_local !== idLocal);
    await FileSystem.writeAsStringAsync(QUEUE_FILE, JSON.stringify(newQueue));
  }
};
