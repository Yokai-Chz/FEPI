import React from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Image, ActivityIndicator } from 'react-native';

interface LocationInputProps {
  value: string;
  onChange: (text: string) => void;
  onRefresh: () => void;
  isLoading: boolean;
}

export default function LocationInput({ value, onChange, onRefresh, isLoading }: LocationInputProps) {
  return (
    <View style={styles.card}>
      <View style={styles.ubiHeader}>
        <View style={{ flex: 1 }}>
          <Text style={styles.sectionLabel}>LUGAR DE LOS HECHOS (GPS)</Text>
          <TextInput
            style={styles.ubiInput}
            value={value}
            onChangeText={onChange}
            multiline
            placeholder="Obteniendo ubicación..."
          />
        </View>
        <TouchableOpacity 
          style={styles.ubiIconBtn} 
          onPress={onRefresh}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#691C32" />
          ) : (
            <Image source={require('../../assets/images/icon_ubi.png')} style={styles.ubiIcon} />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: 'white', borderRadius: 20, padding: 20, marginBottom: 16, elevation: 2 },
  sectionLabel: { color: '#691C32', fontWeight: '900', fontSize: 11, marginBottom: 16, letterSpacing: 1 },
  ubiHeader: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  ubiInput: { fontSize: 12, fontWeight: 'bold', color: '#4b5563', backgroundColor: '#f9fafb', borderRadius: 12, padding: 12, borderWidth: 1, borderColor: '#f3f4f6' },
  ubiIconBtn: { width: 48, height: 48, backgroundColor: '#f9fafb', borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  ubiIcon: { width: 30, height: 30 },
});
