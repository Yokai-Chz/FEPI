import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { User } from 'lucide-react-native';

interface OfficialProfileProps {
  nombre: string;
  id: string;
  sector: string;
}

export default function OfficialProfile({ nombre, id, sector }: OfficialProfileProps) {
  // Colores Institucionales CDMX
  const gobVino = '#691C32';

  return (
    <View style={styles.profileSection}>
      <View style={styles.avatarContainer}>
        <User size={30} color="#9ca3af" />
      </View>
      <View>
        <Text style={[styles.welcomeText, { color: gobVino }]}>Hola, {nombre}</Text>
        <Text style={styles.idText}>ID: {id} • {sector}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  profileSection: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 16, 
    marginVertical: 8 
  },
  avatarContainer: { 
    width: 56, 
    height: 56, 
    borderRadius: 28, 
    backgroundColor: '#e5e7eb', 
    borderWidth: 2, 
    borderColor: 'white', 
    alignItems: 'center', 
    justifyContent: 'center', 
    elevation: 2 
  },
  welcomeText: { 
    fontSize: 18, 
    fontWeight: '900' 
  },
  idText: { 
    fontSize: 10, 
    color: '#9ca3af', 
    fontWeight: 'bold', 
    letterSpacing: 1 
  },
});
