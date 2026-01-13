import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, View, Text, TextInput, TouchableOpacity, 
  Image, SafeAreaView, ScrollView, Alert, ActivityIndicator 
} from 'react-native';
import { useRouter } from 'expo-router';
import * as Location from 'expo-location';
import { MapPin, ChevronRight, Clock, Building2, Car, X } from 'lucide-react-native';

export default function TowRequestView() {
  const router = useRouter(); 

  const [notas, setNotas] = useState('');
  const [vehiculo, setVehiculo] = useState({
    modelo: 'VOLKSWAGEN - JETTA 2022',
    placa: '123-ABC-A'
  });

  const [ubicacion, setUbicacion] = useState<any>({ lat: null, lng: null, cargando: true });
  const [eta, setEta] = useState<number | null>(null);
  const [corralonAsignado, setCorralonAsignado] = useState<any>(null);

  const colors = { primary: '#691C32' };

  const corralonesDisponibles = [
    { id: 1, nombre: "Corralón Centro Histórico", direccion: "Eje Central Lázaro Cárdenas 12" },
    { id: 2, nombre: "Depósito Vehicular Norte", direccion: "Av. Insurgentes Norte 450" },
    { id: 3, nombre: "Corralón Oriente - Iztapalapa", direccion: "Calz. Ermita Iztapalapa 201" }
  ];

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setUbicacion({ lat: "19.432", lng: "-99.133", cargando: false });
        setCorralonAsignado(corralonesDisponibles[0]);
        setEta(15);
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setUbicacion({
        lat: location.coords.latitude.toFixed(5),
        lng: location.coords.longitude.toFixed(5),
        cargando: false
      });
      
      const asignado = corralonesDisponibles[Math.floor(Math.random() * corralonesDisponibles.length)];
      setCorralonAsignado(asignado);
      setEta(Math.floor(Math.random() * (12 - 4 + 1)) + 4);
    })();
  }, []);

  const manejarEnvio = () => {
    if (!vehiculo.modelo || !vehiculo.placa) {
      Alert.alert("Error", "El modelo y la placa son obligatorios para el arrastre.");
      return;
    }
    
    Alert.alert(
      "Solicitud Exitosa",
      `Grúa en camino.\n\nDepósito: ${corralonAsignado?.nombre}\nETA: ${eta} minutos.`,
      [{ text: "OK", onPress: () => router.replace('/dashboard') }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.logoBox}>
            <Image source={require('../../assets/images/logo_gobierno.png')} style={styles.logo} />
          </View>
          <Text style={styles.headerTitle}>SOLICITAR GRÚA</Text>
        </View>
        <TouchableOpacity onPress={() => router.replace('/dashboard')}>
          <X color="white" size={28} />
        </TouchableOpacity>
      </View>

      <ScrollView>
        {/* Mapa Simulado */}
        <View style={styles.mapContainer}>
          {ubicacion.cargando ? (
            <View style={styles.centered}>
              <ActivityIndicator color="#9ca3af" />
              <Text style={styles.loadingText}>LOCALIZANDO...</Text>
            </View>
          ) : (
            <View style={styles.mapMock}>
              <View style={styles.pinContainer}>
                <MapPin size={24} color="white" />
              </View>
              <View style={styles.coordBadge}>
                <Text style={styles.coordText}>COORD: {ubicacion.lat}, {ubicacion.lng}</Text>
              </View>
            </View>
          )}
        </View>

        <View style={styles.content}>
          {/* Card Vehículo */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.sectionTitle}><Car size={14} color={colors.primary} /> DATOS DEL VEHÍCULO</Text>
              <View style={styles.statusBadge}><Text style={styles.statusBadgeText}>VERIFICAR</Text></View>
            </View>
            
            <View style={styles.inputGap}>
              <Text style={styles.label}>MODELO Y AÑO:</Text>
              <TextInput 
                style={styles.input}
                value={vehiculo.modelo}
                onChangeText={(t) => setVehiculo({...vehiculo, modelo: t.toUpperCase()})}
              />
              <Text style={[styles.label, {marginTop: 10}]}>PLACAS:</Text>
              <TextInput 
                style={[styles.input, styles.placaInput]}
                value={vehiculo.placa}
                onChangeText={(t) => setVehiculo({...vehiculo, placa: t.toUpperCase()})}
              />
            </View>
          </View>

          {/* Corralón */}
          <View style={styles.infoRow}>
            <View style={styles.iconBox}>
              <Building2 size={20} color={colors.primary} />
            </View>
            <View style={{flex: 1}}>
              <Text style={styles.label}>DEPÓSITO ASIGNADO</Text>
              <Text style={styles.infoValue}>{corralonAsignado ? corralonAsignado.nombre : 'Buscando...'}</Text>
            </View>
            <ChevronRight size={18} color="#d1d5db" />
          </View>

          {/* Notas */}
          <View style={styles.card}>
            <Text style={styles.label}>OBSERVACIONES DEL ARRASTRE:</Text>
            <TextInput 
              style={styles.textArea}
              value={notas}
              onChangeText={setNotas}
              placeholder="Motivo de la solicitud..."
              multiline
              numberOfLines={4}
            />
          </View>

          {/* Botón y ETA */}
          <View style={styles.footer}>
            <TouchableOpacity 
              onPress={manejarEnvio}
              disabled={ubicacion.cargando}
              style={[styles.mainBtn, ubicacion.cargando && {backgroundColor: '#d1d5db'}]}
            >
              <Text style={styles.mainBtnText}>
                {ubicacion.cargando ? 'OBTENIENDO UBICACIÓN...' : 'CONFIRMAR SOLICITUD'}
              </Text>
            </TouchableOpacity>

            {eta && !ubicacion.cargando && (
              <View style={styles.etaRow}>
                <Clock size={14} color={colors.primary} />
                <Text style={styles.etaText}>
                  TIEMPO ESTIMADO: <Text style={{color: '#1f2937'}}>{eta} MINUTOS</Text>
                </Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f4f6' },
  header: { backgroundColor: '#691C32', padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  logoBox: { width: 44, height: 44, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  logo: { width: 35, height: 35, resizeMode: 'contain' },
  headerTitle: { color: 'white', fontWeight: 'bold', fontSize: 13, letterSpacing: 1 },

  mapContainer: { h: 180, height: 180, backgroundColor: '#e2e8f0', borderBottomWidth: 1, borderBottomColor: '#cbd5e1' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 8 },
  loadingText: { fontSize: 9, fontWeight: 'bold', color: '#9ca3af' },
  mapMock: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#cbd5e1' },
  pinContainer: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#691C32', borderWeight: 4, borderColor: 'white', justifyContent: 'center', alignItems: 'center', elevation: 5 },
  coordBadge: { position: 'absolute', bottom: 12, right: 12, backgroundColor: 'rgba(255,255,255,0.9)', padding: 6, borderRadius: 8 },
  coordText: { fontSize: 8, fontWeight: '900', color: '#4b5563' },

  content: { padding: 16, gap: 16 },
  card: { backgroundColor: 'white', borderRadius: 20, padding: 20, elevation: 2 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  sectionTitle: { fontSize: 11, fontWeight: '900', color: '#691C32', letterSpacing: 1 },
  statusBadge: { backgroundColor: '#fffbeb', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, borderWidth: 1, borderColor: '#fef3c7' },
  statusBadgeText: { fontSize: 8, color: '#d97706', fontWeight: 'bold' },
  
  label: { fontSize: 9, color: '#9ca3af', fontWeight: 'bold', marginBottom: 6, letterSpacing: 0.5 },
  input: { backgroundColor: '#f9fafb', borderRadius: 12, padding: 12, fontSize: 13, fontWeight: 'bold', color: '#374151' },
  placaInput: { letterSpacing: 3 },
  
  infoRow: { backgroundColor: 'white', borderRadius: 20, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 12, elevation: 1 },
  iconBox: { width: 40, height: 40, backgroundColor: '#f9fafb', borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  infoValue: { fontSize: 12, fontWeight: '900', color: '#1f2937' },

  textArea: { backgroundColor: '#f9fafb', borderRadius: 12, padding: 15, fontSize: 12, textAlignVertical: 'top' },
  
  footer: { marginTop: 8, paddingBottom: 40 },
  mainBtn: { backgroundColor: '#691C32', padding: 20, borderRadius: 20, alignItems: 'center', elevation: 4 },
  mainBtnText: { color: 'white', fontWeight: '900', fontSize: 12, letterSpacing: 2 },
  etaRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 16 },
  etaText: { fontSize: 10, fontWeight: 'bold', color: '#9ca3af' }
});