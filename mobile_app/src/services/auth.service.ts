import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
// import { API_CONFIG	} from "./api.config";

export interface loginCredential {
    placa: string;
    password: string;
}

export interface userData {
    id: string
    name: string;
    sector: string;
    token: string;
}

export const authService = {
    async login(credentials: loginCredential): Promise<userData> {
        return new Promise((resolve, reject) => {
            setTimeout(async () => {
                if (credentials.placa === '982734' && credentials.password === '123456') {
                    const fakeUser: userData = {
                        id: '982734',
                        name: "Oficial Perez",
                        sector: "SECTOR JUAREZ",
                        token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.fake-token",
                    };

                    await this.saveSession(fakeUser.token, fakeUser.id);
                    resolve(fakeUser);
                    
                } else {
                    reject(new Error("Credenciales incorrectas"))
                }
            },1500);
        });
        
        /*
        const response = await fetch(`${API_CONFIG.BASE_URL}/login`, {
            method: 'POST',
            headers: API_CONFIG.HEADERS,
            body: JSON.stringify(credentials),
        });

        if (!response.ok){
            const errorData = await response.json();
            throw new Error(errorData.message || "Error de autenticación");
        }

        return await response.json();
        */
    },

    async logout() {
        if (Platform.OS === 'web') {
            localStorage.removeItem('token');
            localStorage.removeItem('id');
        } else {
            await SecureStore.deleteItemAsync('token');
            await SecureStore.deleteItemAsync('id');
        }

    },

    async getToken() {
        if (Platform.OS === 'web') {
            return localStorage.getItem('token');
        } else {
            return await SecureStore.getItemAsync('token');
        }
    },

    async getId() {
        if (Platform.OS === 'web') {
            return localStorage.getItem('id');
        } else {
            return await SecureStore.getItemAsync('id');
        }
    },

    async saveSession(token: string, id: string) {
        if (Platform.OS === 'web') {
            localStorage.setItem('token', token);
            localStorage.setItem('id', id);
        } else {
            await SecureStore.setItemAsync('token', token);
            await SecureStore.setItemAsync('id', id);
        }
    }

}

