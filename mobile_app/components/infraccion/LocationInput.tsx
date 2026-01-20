import React from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { MapPin, Navigation } from 'lucide-react-native';

interface LocationInputProps {
  value: string;
  onChange?: (text: string) => void;
  onRefresh: () => void;
  isLoading: boolean;
  label?: string;
  subValue?: string; // Para mostrar coordenadas debajo de la dirección
  readOnly?: boolean;
}

export default function LocationInput({ 
  value, 
  onChange, 
  onRefresh, 
  isLoading, 
  label = "LUGAR DE LOS HECHOS (GPS)",
  subValue,
  readOnly = false
}: LocationInputProps) {
  return (
    <View style={styles.card}>
      <View style={styles.ubiHeader}>
        <View style={{ flex: 1 }}>
          <Text style={styles.sectionLabel}>{label}</Text>
          
          <View style={styles.inputContainer}>
            <View style={styles.iconBox}>
              <MapPin size={20} color="#691C32" />
            </View>
            <View style={{flex: 1}}>
              <TextInput
                style={styles.ubiInput}
                value={value}
                onChangeText={onChange}
                multiline
                placeholder="Obteniendo ubicación..."
                editable={!readOnly}
              />
              {subValue && <Text style={styles.subText}>{subValue}</Text>}
            </View>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.ubiIconBtn} 
          onPress={onRefresh}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#691C32" />
          ) : (
            <Navigation size={24} color="#691C32" />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: 'white', borderRadius: 20, padding: 20, marginBottom: 16, elevation: 2 },
  sectionLabel: { color: '#691C32', fontWeight: '900', fontSize: 10, marginBottom: 16, letterSpacing: 1 },
  
  ubiHeader: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  inputContainer: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  iconBox: { marginTop: 4 },
  
  ubiInput: { 
    fontSize: 13, 
    fontWeight: 'bold', 
    color: '#1f2937', 
    backgroundColor: '#f9fafb', 
    borderRadius: 12, 
    padding: 12, 
    borderWidth: 1, 
    borderColor: '#f3f4f6',
    minHeight: 50
  },
  subText: { fontSize: 10, color: '#6b7280', marginTop: 4, marginLeft: 4, fontWeight: '500' },
  
  ubiIconBtn: { 
    width: 48, 
    height: 48, 
    backgroundColor: '#fdf2f8', 
    borderRadius: 12, 
    justifyContent: 'center', 
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#fce7f3'
  }
});