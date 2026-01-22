import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Text, StyleSheet, Animated, Platform, SafeAreaView, View } from 'react-native';
import * as Network from 'expo-network';
import { useAuth } from './AuthContext';
import { infraccionesService } from '../services/infracciones.service';
import { COLORS } from '../../constants/theme';

interface InfraccionContextType {
  fotos: Record<string, string | null>;
  setFoto: (categoria: string, uri: string | null) => void;
  resetFotos: () => void;
  notificaciones: string[];
  limpiarNotificaciones: () => void;
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

  const [notificaciones, setNotificaciones] = useState<string[]>([]);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Lógica de Sincronización Offline
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const attemptSync = async () => {
      if (user?.token) {
        try {
          const networkState = await Network.getNetworkStateAsync();
          if (networkState.isConnected && networkState.isInternetReachable) {
             const result = await infraccionesService.syncOfflineData(user.token);
             
             if (result.synced > 0) {
                showSyncNotification(result.synced);
                setNotificaciones(prev => [...prev, `✅ Se subieron ${result.synced} multa(s) pendiente(s).`]);
             }

             if (result.failed.length > 0) {
                setNotificaciones(prev => [...prev, ...result.failed]);
             }
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

  const showSyncNotification = (count: number) => {
    setSyncMessage(`✅ Conexión recuperada. Se han subido ${count} infracción(es) pendiente(s).`);
    
    // Fade In
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true
    }).start();

    // Ocultar después de 10 segundos
    setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true
      }).start(() => {
        setSyncMessage(null);
      });
    }, 10000);
  };

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

  const limpiarNotificaciones = () => {
    setNotificaciones([]);
  };

  return (
    <InfraccionContext.Provider value={{ fotos, setFoto, resetFotos, notificaciones, limpiarNotificaciones }}>
      {children}
      {syncMessage && (
        <Animated.View style={[styles.notificationContainer, { opacity: fadeAnim }]}>
           <SafeAreaView>
              <View style={styles.notificationContent}>
                <Text style={styles.notificationText}>{syncMessage}</Text>
              </View>
           </SafeAreaView>
        </Animated.View>
      )}
    </InfraccionContext.Provider>
  );
}

const styles = StyleSheet.create({
  notificationContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.success, // Usamos color success del theme o hardcodeado si no está disponible aquí
    zIndex: 9999,
    elevation: 9999,
  },
  notificationContent: {
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 14
  }
});

export const useInfraccion = () => useContext(InfraccionContext);
