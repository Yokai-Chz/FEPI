import React from 'react';
import { StyleSheet, View, Text, TextInput } from 'react-native';

interface NotesInputProps {
  value: string;
  onChange: (text: string) => void;
  isForeign: boolean;
  isValid: boolean;
}

export default function NotesInput({ value, onChange, isForeign, isValid }: NotesInputProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.sectionLabel}>
        {isForeign ? "DOCUMENTO RETENIDO (GARANTÍA) *" : "OBSERVACIONES / NOTAS"}
      </Text>
      <TextInput
        style={[styles.notesInput, isForeign && !isValid && styles.inputError]}
        value={value}
        onChangeText={onChange}
        placeholder={isForeign ? "Especifique Placa o Licencia retenida..." : "Opcional..."}
        multiline
        numberOfLines={3}
        textAlignVertical="top"
      />
      {isForeign && !isValid && (
        <Text style={styles.errorText}>* Requerido para vehículos foráneos</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: 'white', borderRadius: 20, padding: 20, marginBottom: 16, elevation: 2 },
  sectionLabel: { color: '#691C32', fontWeight: '900', fontSize: 11, marginBottom: 16, letterSpacing: 1 },
  notesInput: { fontSize: 14, color: '#374151', backgroundColor: '#f9fafb', borderRadius: 12, padding: 12, minHeight: 80, borderWidth: 1, borderColor: '#e5e7eb' },
  inputError: { borderColor: '#dc2626', backgroundColor: '#fef2f2' },
  errorText: { color: '#dc2626', fontSize: 11, marginTop: 4, fontWeight: 'bold' }
});
