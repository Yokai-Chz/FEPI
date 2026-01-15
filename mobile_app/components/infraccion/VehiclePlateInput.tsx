import React from 'react';
import { StyleSheet, View, Text, TextInput } from 'react-native';
import { Check } from 'lucide-react-native';

interface VehiclePlateInputProps {
  value: string;
  onChange: (text: string) => void;
}

export default function VehiclePlateInput({ value, onChange }: VehiclePlateInputProps) {
  const isLengthValid = value.length >= 3;

  return (
    <View style={styles.card}>
      <Text style={styles.sectionLabel}>DATOS DEL VEHÍCULO</Text>
      <View style={[
        styles.placaInputContainer, 
        isLengthValid && styles.placaValida
      ]}>
        <TextInput
          style={styles.placaInput}
          value={value}
          onChangeText={(text) => onChange(text.toUpperCase())}
          placeholder="PLACA"
          placeholderTextColor="#d1d5db"
          autoCapitalize="characters"
          maxLength={10}
        />
      </View>
      {isLengthValid && (
        <View style={styles.alertSuccess}>
          <Check color="#047857" size={14} />
          <Text style={styles.alertText}>SCC: Vehículo sin reporte de robo</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: 'white', borderRadius: 20, padding: 20, marginBottom: 16, elevation: 2 },
  sectionLabel: { color: '#691C32', fontWeight: '900', fontSize: 11, marginBottom: 16, letterSpacing: 1 },
  placaInputContainer: { borderWidth: 2, borderStyle: 'dashed', borderColor: '#e5e7eb', borderRadius: 16, padding: 16 },
  placaValida: { borderColor: '#d1fae5', backgroundColor: '#f0fdf4' },
  placaInput: { textAlign: 'center', fontSize: 32, fontWeight: '900', color: '#1f2937' },
  alertSuccess: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#ecfdf5', padding: 10, borderRadius: 8, marginTop: 12 },
  alertText: { color: '#047857', fontSize: 10, fontWeight: 'bold' },
});
