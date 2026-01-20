import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import * as Network from 'expo-network';
import { COLORS, FONT_SIZE } from '../constants/theme';

export default function ConnectionStatus() {
  const [isConnected, setIsConnected] = useState<boolean>(true);
  const [ipAddress, setIpAddress] = useState<string | null>(null);

  useEffect(() => {
    checkConnection();
    // En un caso real, aquí usaríamos un listener si la librería lo soporta o polling
    const interval = setInterval(checkConnection, 10000); // Checar cada 10s
    return () => clearInterval(interval);
  }, []);

  const checkConnection = async () => {
    try {
      const status = await Network.getNetworkStateAsync();
      const ip = await Network.getIpAddressAsync();
      
      setIsConnected(status.isConnected ?? false);
      setIpAddress(ip);
    } catch (e) {
      setIsConnected(false);
    }
  };

  return (
    <View style={[
      styles.statusBox, 
      isConnected ? styles.statusOnline : styles.statusOffline
    ]}>
      <View style={[
        styles.statusDot, 
        isConnected ? styles.dotOnline : styles.dotOffline
      ]} />
      <View>
        <Text style={[
          styles.statusText,
          isConnected ? styles.textOnline : styles.textOffline
        ]}>
          {isConnected ? 'SISTEMA CONECTADO (CDMX-HUB)' : 'SIN CONEXIÓN - MODO OFFLINE'}
        </Text>
        {isConnected && ipAddress && (
          <Text style={styles.ipText}>IP: {ipAddress}</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  statusBox: { 
    borderWidth: 1, 
    borderRadius: 16, 
    padding: 12, 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 12 
  },
  statusOnline: {
    backgroundColor: '#ecfdf5', 
    borderColor: '#d1fae5', 
  },
  statusOffline: {
    backgroundColor: '#fef2f2',
    borderColor: '#fecaca',
  },
  
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  dotOnline: { backgroundColor: COLORS.success },
  dotOffline: { backgroundColor: COLORS.error },
  
  statusText: { fontSize: 9, fontWeight: '900', letterSpacing: 1 },
  textOnline: { color: '#047857' },
  textOffline: { color: '#b91c1c' },

  ipText: { fontSize: 8, color: '#6b7280', marginTop: 2 }
});
