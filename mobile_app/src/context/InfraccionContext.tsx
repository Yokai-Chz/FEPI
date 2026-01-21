import React, { createContext, useContext, useState, useEffect } from 'react';
import * as Network from 'expo-network';
import { useAuth } from './AuthContext';
import { infraccionesService } from '../services/infracciones.service';

interface InfraccionContextType {
  fotos: Record<string, string | null>;
  setFoto: (categoria: string, uri: string | null) => void;
  resetFotos: () => void;
}

const InfraccionContext = createContext<InfraccionContextType>({} as InfraccionContextType);

export function InfraccionProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [fotos, setFotos] = useState<Record<string, string | null>>({
    placa: null,
    infraccion: null,
    frente: null,
    posterior: null
  });

  // Lógica de Sincronización Offline
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const attemptSync = async () => {
      // Solo intentamos si hay usuario logueado y token
      if (user?.token) {
        try {
          const networkState = await Network.getNetworkStateAsync();
          if (networkState.isConnected && networkState.isInternetReachable) {
             console.log("Conexión detectada, verificando cola offline...");
             await infraccionesService.syncOfflineData(user.token);
          }
        } catch (error) {
          console.log("Error al verificar conexión para sync:", error);
        }
      }
    };

    if (user) {
      // 1. Intentar sincronizar inmediatamente al detectar usuario (Login)
      attemptSync();

      // 2. Programar chequeo periódico (cada 30 segs)
      intervalId = setInterval(attemptSync, 30000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [user]);

  const setFoto = (categoria: string, uri: string | null) => {
    setFotos(prev => ({ ...prev, [categoria]: uri }));
  };

  const resetFotos = () => {
    setFotos({
      placa: null,
      infraccion: null,
      frente: null,
      posterior: null
    });
  };

  return (
    <InfraccionContext.Provider value={{ fotos, setFoto, resetFotos }}>
      {children}
    </InfraccionContext.Provider>
  );
}

export const useInfraccion = () => useContext(InfraccionContext);
