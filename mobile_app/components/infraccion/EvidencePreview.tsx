import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import { Plus, Camera } from 'lucide-react-native';

interface EvidencePreviewProps {
  photos: Record<string, string | null>;
  onAddPress: () => void;
}

const CATEGORIES = [
  { id: 'placa', label: 'PLACA' },
  { id: 'infraccion', label: 'MOTIVO' },
  { id: 'frente', label: 'FRENTE' },
  { id: 'posterior', label: 'TRASERA' }
];

export default function EvidencePreview({ photos, onAddPress }: EvidencePreviewProps) {
  const count = Object.values(photos).filter(uri => uri !== null).length;

  return (
    <View style={styles.card}>
      <Text style={styles.sectionLabel}>EVIDENCIA FOTOGRÁFICA</Text>
      
      <View style={styles.grid}>
        {CATEGORIES.map((cat) => (
          <View key={cat.id} style={styles.photoSlot}>
            {photos[cat.id] ? (
              <Image source={{ uri: photos[cat.id]! }} style={styles.photoImage} />
            ) : (
              <View style={styles.emptySlot}>
                <Camera size={20} color="#d1d5db" />
              </View>
            )}
            <Text style={styles.slotLabel}>{cat.label}</Text>
          </View>
        ))}

        <TouchableOpacity 
          style={styles.addFotoBtn}
          onPress={onAddPress}
        >
          <Plus color="#BC955C" size={30} />
        </TouchableOpacity>
      </View>

      <Text style={styles.fotoStatus}>
        {count}/4 FOTOS REGLAMENTARIAS
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: 'white', borderRadius: 20, padding: 20, marginBottom: 16, elevation: 2 },
  sectionLabel: { color: '#691C32', fontWeight: '900', fontSize: 11, marginBottom: 16, letterSpacing: 1 },
  
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 12, alignItems: 'center' },
  
  photoSlot: { alignItems: 'center', gap: 4 },
  photoImage: { width: 56, height: 56, borderRadius: 12, backgroundColor: '#f3f4f6' },
  emptySlot: { width: 56, height: 56, borderRadius: 12, backgroundColor: '#f9fafb', borderWidth: 1, borderColor: '#e5e7eb', justifyContent: 'center', alignItems: 'center' },
  slotLabel: { fontSize: 8, fontWeight: 'bold', color: '#9ca3af' },

  addFotoBtn: { width: 56, height: 56, borderWidth: 2, borderStyle: 'dashed', borderColor: '#BC955C', backgroundColor: '#fdfaf6', borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginBottom: 14 },
  
  fotoStatus: { fontSize: 10, color: '#9ca3af', fontWeight: 'bold', textAlign: 'right' },
});
