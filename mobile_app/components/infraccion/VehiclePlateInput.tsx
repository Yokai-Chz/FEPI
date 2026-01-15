import React from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Switch } from 'react-native';
import { Check, AlertCircle, Globe } from 'lucide-react-native';
import { isValidCDMXPlate, formatPlate } from '../../src/utils/plateValidation';

interface VehiclePlateInputProps {
  value: string;
  onChange: (text: string) => void;
  isForeign: boolean;
  onForeignChange: (val: boolean) => void;
}

export default function VehiclePlateInput({ value, onChange, isForeign, onForeignChange }: VehiclePlateInputProps) {
  const isCdmxValid = isValidCDMXPlate(value);
  const isForeignValid = value.length >= 3;
  
  // Si es foráneo, validamos solo longitud. Si no, validamos regex CDMX.
  const isValid = isForeign ? isForeignValid : isCdmxValid;
  
  // Caracteres prohibidos solo aplican si es CDMX (en foráneos podrían variar, aunque I/O/Q suelen evitarse, asumiremos flexibilidad)
  const hasProhibitedChars = !isForeign && /[IOQÑ]/i.test(value);

  const handleTextChange = (text: string) => {
    // Si es foráneo, no formateamos (permitimos formato libre)
    // Si es CDMX, aplicamos formato automático
    const formatted = isForeign ? text.toUpperCase() : formatPlate(text);
    onChange(formatted);
  };

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.sectionLabel}>DATOS DEL VEHÍCULO</Text>
        <View style={styles.foreignContainer}>
          <Text style={styles.foreignLabel}>¿Foráneo?</Text>
          <Switch 
            value={isForeign} 
            onValueChange={onForeignChange}
            trackColor={{ false: "#e5e7eb", true: "#691C32" }}
            thumbColor={"white"}
          />
        </View>
      </View>

      <View style={[
        styles.placaInputContainer, 
        isValid ? styles.placaValida : (value.length > 0 ? styles.placaInvalida : null)
      ]}>
        <TextInput
          style={styles.placaInput}
          value={value}
          onChangeText={handleTextChange}
          placeholder="PLACA"
          placeholderTextColor="#d1d5db"
          autoCapitalize="characters"
          maxLength={12} 
        />
      </View>
      
      {isValid && (
        <View style={[styles.alertSuccess, isForeign && styles.alertInfo]}>
          {isForeign ? <Globe color="#0284c7" size={14} /> : <Check color="#047857" size={14} />}
          <Text style={[styles.alertText, isForeign && styles.alertInfoText]}>
            {isForeign ? "Vehículo Foráneo / Extranjero" : "Formato Válido (CDMX)"}
          </Text>
        </View>
      )}

      {hasProhibitedChars && (
        <View style={styles.alertError}>
          <AlertCircle color="#dc2626" size={14} />
          <Text style={styles.alertErrorText}>No se permiten letras I, O, Q, Ñ en CDMX</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: 'white', borderRadius: 20, padding: 20, marginBottom: 16, elevation: 2 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionLabel: { color: '#691C32', fontWeight: '900', fontSize: 11, letterSpacing: 1 },
  foreignContainer: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  foreignLabel: { fontSize: 10, fontWeight: 'bold', color: '#6b7280' },
  
  placaInputContainer: { borderWidth: 2, borderStyle: 'dashed', borderColor: '#e5e7eb', borderRadius: 16, padding: 16 },
  placaValida: { borderColor: '#d1fae5', backgroundColor: '#f0fdf4', borderStyle: 'solid' },
  placaInvalida: { borderColor: '#fecaca', backgroundColor: '#fef2f2', borderStyle: 'solid' },
  placaInput: { textAlign: 'center', fontSize: 32, fontWeight: '900', color: '#1f2937' },
  
  alertSuccess: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#ecfdf5', padding: 10, borderRadius: 8, marginTop: 12 },
  alertInfo: { backgroundColor: '#e0f2fe' },
  alertText: { color: '#047857', fontSize: 10, fontWeight: 'bold' },
  alertInfoText: { color: '#0284c7' },
  
  alertError: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#fef2f2', padding: 10, borderRadius: 8, marginTop: 12 },
  alertErrorText: { color: '#dc2626', fontSize: 10, fontWeight: 'bold' },
});
