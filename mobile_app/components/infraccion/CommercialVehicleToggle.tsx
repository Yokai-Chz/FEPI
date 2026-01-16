import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

interface CommercialVehicleToggleProps {
  value: boolean;
  onValueChange: (val: boolean) => void;
}

export default function CommercialVehicleToggle({ value, onValueChange }: CommercialVehicleToggleProps) {
  return (
    <View style={styles.cardRow}>
      <Text style={styles.rowLabel}>¿VEHÍCULO COMERCIAL / CARGA?</Text>
      <TouchableOpacity 
        style={[styles.switch, value && styles.switchOn]}
        onPress={() => onValueChange(!value)}
      >
        <View style={[styles.switchDot, value && styles.switchDotOn]} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  cardRow: { backgroundColor: 'white', borderRadius: 20, padding: 20, marginBottom: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', elevation: 2 },
  rowLabel: { fontSize: 12, fontWeight: 'bold', color: '#374151' },
  switch: { width: 48, height: 24, backgroundColor: '#e5e7eb', borderRadius: 12, padding: 2 },
  switchOn: { backgroundColor: '#691C32' },
  switchDot: { width: 20, height: 20, backgroundColor: 'white', borderRadius: 10 },
  switchDotOn: { alignSelf: 'flex-end' },
});
