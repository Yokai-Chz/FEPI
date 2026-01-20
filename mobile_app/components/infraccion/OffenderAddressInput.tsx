import React from 'react';
import { StyleSheet, View, Text, TextInput } from 'react-native';

interface Address {
  municipio: string;
  vialidad: string;
  numero_exterior: string;
  nombre_asentamiento: string;
  codigo_postal: string;
  nombre_entidad: string;
}

interface OffenderAddressInputProps {
  address: Address;
  onChange: (updatedAddress: Address) => void;
}

export default function OffenderAddressInput({ address, onChange }: OffenderAddressInputProps) {
  const handleChange = (key: keyof Address, value: string) => {
    onChange({ ...address, [key]: value });
  };

  return (
    <View style={styles.card}>
      <Text style={styles.sectionLabel}>DOMICILIO DEL CONDUCTOR (OPCIONAL)</Text>
      
      <View style={styles.grid2}>
        <View style={{ flex: 1.5, marginRight: 8 }}>
          <Text style={styles.rowLabel}>Calle / Vialidad</Text>
          <TextInput
            style={styles.ubiInput}
            value={address.vialidad}
            onChangeText={text => handleChange('vialidad', text)}
            placeholder="Ej. Av. Reforma"
          />
        </View>
        <View style={{ flex: 0.5 }}>
          <Text style={styles.rowLabel}>No. Ext</Text>
          <TextInput
            style={styles.ubiInput}
            value={address.numero_exterior}
            onChangeText={text => handleChange('numero_exterior', text)}
            placeholder="222"
          />
        </View>
      </View>

      <View style={[styles.grid2, { marginTop: 12 }]}>
        <View style={{ flex: 1, marginRight: 8 }}>
          <Text style={styles.rowLabel}>Colonia / Asentamiento</Text>
          <TextInput
            style={styles.ubiInput}
            value={address.nombre_asentamiento}
            onChangeText={text => handleChange('nombre_asentamiento', text)}
            placeholder="Ej. Juárez"
          />
        </View>
        <View style={{ flex: 0.6 }}>
          <Text style={styles.rowLabel}>C.P.</Text>
          <TextInput
            style={styles.ubiInput}
            value={address.codigo_postal}
            onChangeText={text => handleChange('codigo_postal', text)}
            placeholder="06600"
            keyboardType="numeric"
            maxLength={5}
          />
        </View>
      </View>

      <View style={[styles.grid2, { marginTop: 12 }]}>
        <View style={{ flex: 1, marginRight: 8 }}>
          <Text style={styles.rowLabel}>Alcaldía / Municipio</Text>
          <TextInput
            style={styles.ubiInput}
            value={address.municipio}
            onChangeText={text => handleChange('municipio', text)}
            placeholder="Cuauhtémoc"
          />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.rowLabel}>Entidad</Text>
          <TextInput
            style={styles.ubiInput}
            value={address.nombre_entidad}
            onChangeText={text => handleChange('nombre_entidad', text)}
            placeholder="CDMX"
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: 'white', borderRadius: 20, padding: 20, marginBottom: 16, elevation: 2 },
  sectionLabel: { color: '#691C32', fontWeight: '900', fontSize: 11, marginBottom: 16, letterSpacing: 1 },
  rowLabel: { fontSize: 12, fontWeight: 'bold', color: '#374151', marginBottom: 4 },
  grid2: { flexDirection: 'row', justifyContent: 'space-between' },
  ubiInput: { fontSize: 12, fontWeight: 'bold', color: '#4b5563', backgroundColor: '#f9fafb', borderRadius: 12, padding: 12, borderWidth: 1, borderColor: '#f3f4f6' },
});
