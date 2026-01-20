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
        const response = await fetch(`${API_CONFIG.BASE_URL}/login`, {
            method: 'POST',
            headers: API_CONFIG.HEADERS,
            body: JSON.stringify(credentials),
        });

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

            await this.saveSession(user.token, user.id);
            return user;
        } catch (error) {
            console.error("Error decoding token:", error);
            throw new Error("Token inválido recibido del servidor");
        }
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

    async changePassword(userId: string, newPassword: string): Promise<void> {
        const token = await this.getToken();
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

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Error al cambiar la contraseña");
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

