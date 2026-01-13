import { useRouter } from "expo-router";
import React, { createContext, useContext, useEffect, useState } from "react";
import { authService, loginCredential, userData } from "../services/auth.service";

interface AuthContextType {
    user: userData | null;
    isLoading: boolean;
    signIn: (credentials: loginCredential) => Promise<void>;
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
                const id = await authService.getId();

                if (token && id) {
                    //Llamar al servicio para obtener los datos

                    setUser({
                        id: id,
                        name: "Oficial Perez",
                        sector: "SECTOR JUAREZ",
                        token: token,
                    });
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
            router.replace('/dashboard');
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