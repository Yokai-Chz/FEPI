import * as SecureStore from 'expo-secure-store';

const API_URL = 'http://TU_IP_LOCAL:3000'; // La IP 

export const AuthService = {
  // Guardar el token cuando el oficial hace login
  guardarToken: async (token: string) => {
    await SecureStore.setItemAsync('userToken', token);
  },

  // Obtener el token para mandarlo en las infracciones
  obtenerToken: async () => {
    return await SecureStore.getItemAsync('userToken');
  },

  // Borrar el token
  cerrarSesion: async () => {
    await SecureStore.deleteItemAsync('userToken');
  }
};