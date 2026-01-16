import React from 'react';
import { StyleSheet, View, Text, TextInput } from 'react-native';

interface AdditionalIdInputProps {
  niv: string;
  onChangeNiv: (text: string) => void;
  licencia: string;
  onChangeLicencia: (text: string) => void;
}

export default function AdditionalIdInput({ niv, onChangeNiv, licencia, onChangeLicencia }: AdditionalIdInputProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.sectionLabel}>IDENTIFICACIÓN ADICIONAL</Text>
      
      <Text style={styles.rowLabel}>NIV (Número de Identificación Vehicular)</Text>
      <TextInput
        style={[styles.ubiInput, { marginBottom: 16 }]}
        value={niv}
        onChangeText={text => onChangeNiv(text.toUpperCase())}
        placeholder="17 Caracteres"
        maxLength={17}
        autoCapitalize="characters"
      />

      <Text style={styles.rowLabel}>No. LICENCIA DE CONDUCIR</Text>
      <TextInput
        style={styles.ubiInput}
        value={licencia}
        onChangeText={text => onChangeLicencia(text.toUpperCase())}
        placeholder="Número de Licencia"
        autoCapitalize="characters"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: 'white', borderRadius: 20, padding: 20, marginBottom: 16, elevation: 2 },
  sectionLabel: { color: '#691C32', fontWeight: '900', fontSize: 11, marginBottom: 16, letterSpacing: 1 },
  rowLabel: { fontSize: 12, fontWeight: 'bold', color: '#374151', marginBottom: 4 },
  ubiInput: { fontSize: 12, fontWeight: 'bold', color: '#4b5563', backgroundColor: '#f9fafb', borderRadius: 12, padding: 12, borderWidth: 1, borderColor: '#f3f4f6' },
});
