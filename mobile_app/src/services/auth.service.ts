import * as SecureStore from 'expo-secure-store';
import { jwtDecode } from "jwt-decode";
import { Platform } from 'react-native';
import { API_CONFIG } from "./api.config";

export interface loginCredential {
    username: string;
    password: string;
}

export interface userData {
    id: string;
    name: string;
    sector: string;
    token: string;
    primer_ingreso?: boolean;
}

interface DecodedToken {
    id_usuario: string;
    username: string;
    sector?: string;
    iat?: number;
    exp?: number;
}

export const authService = {

    async login(credentials: loginCredential): Promise<userData> {
        //return new Promise((resolve, reject) => {
        //    setTimeout(async () => {
        //        if (credentials.username === '982734' && credentials.password === '123456') {
        //            const fakeUser: userData = {
        //                id: '982734',
        //                name: "Oficial Perez",
        //                sector: "SECTOR JUAREZ",
        //                token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.fake-token",
        //            };
        //            await this.saveSession(fakeUser.token, fakeUser.id);
        //            resolve(fakeUser);
        //            
        //        } else {
        //            reject(new Error("Credenciales incorrectas"))
        //        }
        //    },1500);
        //});
        
        //console.log('Sending login payload:', JSON.stringify(credentials, null, 2));
        
        const response = await fetch(`${API_CONFIG.BASE_URL}/login`, {
            method: 'POST',
            headers: API_CONFIG.HEADERS,
            body: JSON.stringify(credentials),
        });

        //console.log(response);

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.mensaje || errorData.message || "Error de autenticación");
        }

        const data = await response.json();
        
        try {
            const decoded = jwtDecode<DecodedToken>(data.token);
            
            const user: userData = {
                id: String(decoded.id_usuario || credentials.username),
                name: decoded.username || "Oficial",
                sector: decoded.sector || "SECTOR CDMX",
                token: data.token,
                primer_ingreso: data.primer_ingreso
            };

            console.log('Data user: \n', JSON.stringify(decoded, null, 2 ))

            await this.saveSession(user.token, user.id);
            return user;
        } catch (error) {
            console.error("Error decoding token:", error);
            throw new Error("Token inválido recibido del servidor");
        }
    },

    async changePassword(userId: string, newPassword: string): Promise<void> {
        const token = await this.getToken();

        console.log('Sending user: ', userId);
        
        console.log('Data: \n', JSON.stringify({
            newPassword: newPassword
        }, null, 2))


        const response = await fetch(`${API_CONFIG.BASE_URL}/users/${userId}/password`, {
            method: 'PATCH',
            headers: {
                ...API_CONFIG.HEADERS,
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                newPassword: newPassword
            }),
        });

        console.log("",response);        

        if(!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.mensaje || errorData.message || "Error de autenticación");
        }

        const data = await response.json();

        return data;
    },


    async getUserFromToken(token: string): Promise<Partial<userData> | null> {
        try {
            const decoded = jwtDecode<DecodedToken>(token);
            return {
                id: String(decoded.id_usuario),
                name: decoded.username,
                sector: decoded.sector || "SECTOR CDMX",
                token: token
            };
        } catch (error) {
            console.error("Error decoding token on restore:", error);
            return null;
        }
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
