import { useRouter } from "expo-router";
import React, { createContext, useContext, useEffect, useState } from "react";
import { authService, loginCredential, userData } from "../services/auth.service";

interface AuthContextType {
    user: userData | null;
    isLoading: boolean;
    signIn: (credentials: loginCredential) => Promise<userData>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({children}: { children: React.ReactNode }) {
    const [user, setUser] = useState<userData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const loadStoregeData = async () => {
            try {
                const token = await authService.getToken();

                if (token) {
                    const userData = await authService.getUserFromToken(token);
                    if (userData) {
                        setUser(userData as userData);
                    } else {
                        // Si el token es inválido o no se pudo decodificar
                        await authService.logout();
                    }
                }   
            } catch (e) {
                console.log(e);
            } finally {
                setIsLoading(false);
            }
        };
        loadStoregeData();
    }, []);

    const signIn = async (credentials: loginCredential) => {
        try {
            const data = await authService.login(credentials);
            setUser(data);
            
            // Si es primer ingreso, no redirigimos automáticamente.
            // La vista de Login se encargará de mostrar el modal y navegar a cambio de contraseña.
            if (!data.primer_ingreso) {
                router.replace('/dashboard');
            }
            
            return data;
        } catch (e) {
            throw e;
        }
    };

    const signOut = async () => {
        try {
            await authService.logout();
            setUser(null);
            router.replace('/');
        } catch (e) {
            throw e;
        }
    }

    return (
        <AuthContext.Provider value={{user, isLoading, signIn, signOut}}>
            {children}
        </AuthContext.Provider>
    );
}


export const useAuth = () => useContext(AuthContext);