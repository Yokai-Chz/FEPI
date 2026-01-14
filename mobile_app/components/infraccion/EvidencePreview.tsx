import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Plus } from 'lucide-react-native';

interface EvidencePreviewProps {
  photos: any[]; // Se puede tipar mejor si tenemos la estructura de la foto
  onAddPress: () => void;
}

export default function EvidencePreview({ photos, onAddPress }: EvidencePreviewProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.sectionLabel}>EVIDENCIA FOTOGRÁFICA</Text>
      <View style={styles.fotoRow}>
        {/* Simulación de fotos capturadas */}
        {photos.map((_, i) => (
          <View key={i} style={styles.fotoPreview} />
        ))}
        <TouchableOpacity 
          style={styles.addFotoBtn}
          onPress={onAddPress}
        >
          <Plus color="#BC955C" size={30} />
        </TouchableOpacity>
      </View>
      <Text style={styles.fotoStatus}>REQUIERE 4 FOTOS REGLAMENTARIAS</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: 'white', borderRadius: 20, padding: 20, marginBottom: 16, elevation: 2 },
  sectionLabel: { color: '#691C32', fontWeight: '900', fontSize: 11, marginBottom: 16, letterSpacing: 1 },
  fotoRow: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  addFotoBtn: { width: 64, height: 64, borderWidth: 2, borderStyle: 'dashed', borderColor: '#BC955C', backgroundColor: '#fdfaf6', borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  fotoPreview: { width: 64, height: 64, backgroundColor: '#e5e7eb', borderRadius: 12 },
  fotoStatus: { fontSize: 10, color: '#9ca3af', fontWeight: 'bold' },
});
