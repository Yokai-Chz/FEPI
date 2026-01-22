import * as Location from 'expo-location';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { CheckCircle, ShieldAlert, X } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  SafeAreaView, ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { useAuth } from '../context/AuthContext';

import LocationInput from '../../components/infraccion/LocationInput';

import { gruasService, PeticionArrastre } from '../services/gruas.service';

export default function TowRequestView() {
  const router = useRouter(); 
  const params = useLocalSearchParams();
  const { user } = useAuth();
  
  // Datos recibidos desde la redirección
  const placaInicial = params.placa as string || "";
  const latInicial = params.lat ? parseFloat(params.lat as string) : null;
  const lonInicial = params.lon ? parseFloat(params.lon as string) : null;
  const direccionInicial = params.direccion as string || "Obteniendo ubicación...";

  // Folio de la infracción previamente creada (Ligado)
  const FOLIO_INFRACCION = "0001"; 

  // --- ESTADOS ---
  const [ubicacion, setUbicacion] = useState<{
    lat: number | null, 
    lng: number | null,
    direccion: string
  }>({ 
    lat: latInicial, 
    lng: lonInicial, 
    direccion: direccionInicial 
  });
  
  // Si ya tenemos datos, no cargamos GPS de nuevo al inicio
  const [cargandoGPS, setCargandoGPS] = useState(!latInicial);
  const [referencia, setReferencia] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [servicioConfirmado, setServicioConfirmado] = useState<any>(null);

  const vehiculoData = { placa: placaInicial };

  useEffect(() => {
    if (!latInicial) {
        obtenerGPS();
    }
  }, []);

  const obtenerGPS = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Error', 'Se requiere permiso de GPS para solicitar el arrastre.');
        setUbicacion(prev => ({ ...prev, direccion: "Sin Permiso GPS" }));
        setCargandoGPS(false);
        return;
      }

      let location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
      const { latitude, longitude } = location.coords;

      let direccionLegible = `GPS: ${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;
      try {
        let addressResponse = await Location.reverseGeocodeAsync({ latitude, longitude });
        if (addressResponse.length > 0) {
          const addr = addressResponse[0];
          direccionLegible = `${addr.street || ''} ${addr.streetNumber || ''}, ${addr.district || ''}`;
        }
      } catch (error) {
        console.log("Modo Offline");
      }

      setUbicacion({
        lat: latitude,
        lng: longitude,
        direccion: direccionLegible
      });

    } catch (e) {
      Alert.alert('Error GPS', 'No se pudieron obtener las coordenadas.');
      setUbicacion(prev => ({ ...prev, direccion: "Error de Ubicación" }));
    } finally {
      setCargandoGPS(false);
    }
  };

  const enviarPeticion = async () => {
    if (!ubicacion.lat || !ubicacion.lng) {
      Alert.alert("Error", "No hay señal de GPS válida.");
      return;
    }

    setEnviando(true);
    
    try {
      // Parsear los datos del vehículo recibidos
      const infoVehiculo = params.vehiculo ? JSON.parse(params.vehiculo as string) : {};

      const payload: PeticionArrastre = {
        latitud: ubicacion.lat,
        longitud: ubicacion.lng,
        placas_vehiculo: infoVehiculo.placa || placaInicial,
        marca_vehiculo: infoVehiculo.marcaModelo || "No especificada",
        color_vehiculo: infoVehiculo.color || "No especificado",
        tipo_vehiculo: infoVehiculo.tipo || "COMPACTO",
        motivo_arrastre: infoVehiculo.motivo || "Obstrucción de entrada", 
        id_infraccion_vinculada: FOLIO_INFRACCION, 
        observaciones: `${referencia}. ${infoVehiculo.observaciones || ''}`.trim()
      };

      const respuesta = await gruasService.solicitarServicio(payload);
      setServicioConfirmado(respuesta);

    } catch (error) {
      Alert.alert("Error", "No se pudo procesar la solicitud de grúa. Intente nuevamente.");
    } finally {
      setEnviando(false);
    }
  };

  if (servicioConfirmado) {
    return (
      <SafeAreaView style={styles.containerSuccess}>
        <View style={styles.successContent}>
          <CheckCircle size={80} color="#16a34a" />
          <Text style={styles.successTitle}>GRÚA SOLICITADA</Text>
          <Text style={styles.successFolio}>FOLIO: {servicioConfirmado.solicitud.folio}</Text>
          
          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>DEPÓSITO DE DESTINO</Text>
            <Text style={styles.infoValue}>{servicioConfirmado.asignacion.deposito}</Text>
            <Text style={styles.distText}>A {servicioConfirmado.asignacion.distancia_deposito_km} km de distancia</Text>
            
            <View style={styles.divider} />
            
            <View style={styles.rowInfo}>
              <View>
                <Text style={styles.infoLabel}>UNIDAD ASIGNADA</Text>
                <Text style={styles.infoValue}>{servicioConfirmado.asignacion.grua}</Text>
              </View>
              <View style={{alignItems: 'flex-end'}}>
                <Text style={styles.infoLabel}>DISTANCIA DE APOYO</Text>
                <Text style={styles.infoValue}>{servicioConfirmado.asignacion.distancia_grua_km} KM</Text>
              </View>
            </View>
            <Text style={styles.estatusBadge}>{servicioConfirmado.solicitud.estatus_servicio}</Text>
          </View>

          <TouchableOpacity 
            style={styles.mainBtn} 
            onPress={() => router.replace('/dashboard')}
          >
            <Text style={styles.btnText}>VOLVER AL MENÚ</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <ShieldAlert size={24} color="white" />
          <Text style={styles.headerTitle}>CONFIRMAR ARRASTRE</Text>
        </View>
        <TouchableOpacity onPress={() => router.back()} disabled={enviando}>
          <X color="white" size={28} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        <LocationInput 
          label="UBICACIÓN DE RECOLECCIÓN"
          value={ubicacion.direccion}
          subValue={ubicacion.lat ? `Lat: ${ubicacion.lat.toFixed(6)} | Lng: ${ubicacion.lng?.toFixed(6)}` : undefined}
          onRefresh={obtenerGPS}
          isLoading={cargandoGPS}
          readOnly={true}
        />

        <View style={styles.card}>
          <Text style={styles.sectionLabel}>REFERENCIAS ADICIONALES</Text>
          <Text style={styles.inputLabel}>¿DÓNDE EXACTAMENTE DEBE RECOGER EL VEHÍCULO?</Text>
          <TextInput 
            style={styles.inputRef} 
            placeholder="Ej. Frente a tienda OXXO, sentido poniente..."
            value={referencia}
            onChangeText={setReferencia}
            multiline
          />
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>VINCULADO A:</Text>
          <Text style={styles.summaryText}>• Multa: {FOLIO_INFRACCION}</Text>
          <Text style={styles.summaryText}>• Vehículo: {placaInicial}</Text>
          <Text style={styles.summaryText}>• Oficial: {user?.name} ({user?.sector})</Text>
        </View>

      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.mainBtn, (enviando || cargandoGPS) && styles.btnDisabled]}
          onPress={enviarPeticion}
          disabled={enviando || cargandoGPS}
        >
          {enviando ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.btnText}>SOLICITAR ARRASTRE</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f4f6' },
  containerSuccess: { flex: 1, backgroundColor: '#f0fdf4', justifyContent: 'center' },
  header: { backgroundColor: '#691C32', padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  headerTitle: { color: 'white', fontWeight: 'bold', fontSize: 14, letterSpacing: 1 },
  scrollContent: { padding: 16 },
  
  card: { backgroundColor: 'white', borderRadius: 16, padding: 20, marginBottom: 16, elevation: 2 },
  sectionLabel: { color: '#691C32', fontWeight: '900', fontSize: 10, marginBottom: 16, letterSpacing: 1 },
  
  gpsRow: { flexDirection: 'row', gap: 15, alignItems: 'center', marginBottom: 20 },
  gpsIconBox: { width: 44, height: 44, backgroundColor: '#fdf2f8', borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  coordValue: { fontSize: 15, fontWeight: '900', color: '#1f2937', letterSpacing: 0.5 },
  
  inputLabel: { fontSize: 10, fontWeight: 'bold', color: '#6b7280', marginBottom: 8 },
  inputRef: { backgroundColor: '#f9fafb', padding: 15, borderRadius: 10, fontSize: 13, borderWidth: 1, borderColor: '#e5e7eb', minHeight: 80, textAlignVertical: 'top' },

  summaryCard: { padding: 16, backgroundColor: '#e5e7eb', borderRadius: 12 },
  summaryLabel: { fontSize: 10, fontWeight: 'bold', color: '#4b5563', marginBottom: 6 },
  summaryText: { fontSize: 12, fontWeight: 'bold', color: '#1f2937', marginBottom: 2 },

  successContent: { padding: 30, alignItems: 'center' },
  successTitle: { fontSize: 24, fontWeight: '900', color: '#15803d', marginTop: 20 },
  successFolio: { fontSize: 16, fontWeight: 'bold', color: '#166534', marginBottom: 30 },
  infoCard: { width: '100%', backgroundColor: 'white', borderRadius: 20, padding: 24, elevation: 4, marginBottom: 30 },
  infoLabel: { fontSize: 9, fontWeight: 'bold', color: '#9ca3af', marginBottom: 4 },
  infoValue: { fontSize: 16, fontWeight: '900', color: '#1f2937', marginBottom: 16 },
  distText: { fontSize: 11, color: '#6b7280', marginTop: -12, marginBottom: 16, fontWeight: '600' },
  estatusBadge: { 
    alignSelf: 'flex-start', 
    backgroundColor: '#dcfce7', 
    color: '#166534', 
    paddingHorizontal: 12, 
    paddingVertical: 4, 
    borderRadius: 12, 
    fontSize: 10, 
    fontWeight: '900',
    marginTop: 10
  },
  divider: { height: 1, backgroundColor: '#f3f4f6', marginBottom: 16 },
  rowInfo: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },

  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 20, backgroundColor: 'white' },
  mainBtn: { backgroundColor: '#691C32', paddingVertical: 18, borderRadius: 16, alignItems: 'center', width: '100%' },
  btnDisabled: { backgroundColor: '#e5e7eb' },
  btnText: { color: 'white', fontWeight: '900', letterSpacing: 1, fontSize: 14 }
});
