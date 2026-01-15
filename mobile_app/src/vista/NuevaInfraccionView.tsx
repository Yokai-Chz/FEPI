import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Image, 
  ScrollView, 
  SafeAreaView, 
  Alert,
  Platform,
  KeyboardAvoidingView,
  ActivityIndicator
} from 'react-native';
import { useRouter } from 'expo-router';
import { X } from 'lucide-react-native';
import * as Location from 'expo-location';

// Componentes
import VehiclePlateInput from '../../components/infraccion/VehiclePlateInput';
import InfractionSelector, { InfractionArticle } from '../../components/infraccion/InfractionSelector';
import EvidencePreview from '../../components/infraccion/EvidencePreview';
import { useInfraccion } from '../context/InfraccionContext';
import { isValidCDMXPlate } from '../utils/plateValidation';

export default function NuevaInfraccionView() {
  const router = useRouter();
  const { fotos, resetFotos } = useInfraccion();

  // --- ESTADOS ---
  const [placa, setPlaca] = useState("");
  const [esForaneo, setEsForaneo] = useState(false);
  const [notas, setNotas] = useState("");
  const [articulosSeleccionados, setArticulosSeleccionados] = useState<InfractionArticle[]>([]);
  
  // Ubicación y GPS
  const [ubicacion, setUbicacion] = useState("");
  const [coordenadas, setCoordenadas] = useState<{lat: number, lon: number} | null>(null);
  const [cargandoUbicacion, setCargandoUbicacion] = useState(false);

  const [esComercial, setEsComercial] = useState(false);

  // Validación
  const isPlateValid = esForaneo ? placa.length >= 3 : isValidCDMXPlate(placa);
  // Si es foráneo, la nota (documento retenido) es obligatoria
  const isNotesValid = esForaneo ? notas.trim().length > 3 : true;

  const esFormularioValido = 
    isPlateValid &&
    isNotesValid &&
    articulosSeleccionados.length > 0 && 
    ubicacion.trim().length >= 5;

  // --- FUNCIONES ---
  
  useEffect(() => {
    obtenerUbicacion();
    // No reseteamos fotos al montar para permitir volver de la cámara sin perder datos
    // resetFotos() se llamaría al enviar exitosamente o salir
  }, []);

  const obtenerUbicacion = async () => {
    setCargandoUbicacion(true);
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permiso denegado', 'Se necesita acceso a la ubicación para registrar la infracción.');
        setCargandoUbicacion(false);
        return;
      }

      // Obtener Coordenadas
      let location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      setCoordenadas({ lat: latitude, lon: longitude });

      // Geocodificación Inversa (Coords -> Dirección)
      let addressResponse = await Location.reverseGeocodeAsync({ latitude, longitude });
      
      if (addressResponse.length > 0) {
        const addr = addressResponse[0];
        const direccionFormateada = `${addr.street || 'Calle desconocida'} ${addr.streetNumber || ''}, ${addr.district || ''}, ${addr.city || ''}`;
        setUbicacion(direccionFormateada.trim());
      } else {
        setUbicacion(`${latitude}, ${longitude}`);
      }

    } catch (error) {
      Alert.alert('Error GPS', 'No se pudo obtener la ubicación actual.');
    } finally {
      setCargandoUbicacion(false);
    }
  };

  const agregarArticulo = (articulo: InfractionArticle) => {
    setArticulosSeleccionados((prev) => [...prev, articulo]);
  };

  const removerArticulo = (id: string) => {
    setArticulosSeleccionados((prev) => prev.filter(a => a.id !== id));
  };

  const finalizarBoleta = () => {
    console.log("Enviando al backend:", {
      placa,
      esForaneo,
      notas, // Documento retenido
      infracciones: articulosSeleccionados,
      gps: coordenadas,
      fotos: fotos // Aquí van las URIs temporales
    });

    Alert.alert(
      "Éxito", 
      `✅ Folio generado.\nGPS: ${coordenadas?.lat.toFixed(4)}, ${coordenadas?.lon.toFixed(4)}`,
      [{ 
        text: "OK", 
        onPress: () => {
          resetFotos(); // Limpiar fotos tras éxito
          router.replace('/dashboard');
        } 
      }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={{ flex: 1 }}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.logoCircle}>
              <Image 
                source={require('../../assets/images/logo_gobierno.png')} 
                style={styles.logoImg} 
              />
            </View>
            <Text style={styles.headerTitle}>NUEVA INFRACCIÓN</Text>
          </View>
          <TouchableOpacity onPress={() => router.back()}>
            <X color="white" size={28} />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          
          {/* SECCIÓN DATOS DEL VEHÍCULO */}
          <VehiclePlateInput 
            value={placa} 
            onChange={setPlaca} 
            isForeign={esForaneo}
            onForeignChange={setEsForaneo}
          />

          {/* SECCIÓN MOTIVO */}
          <InfractionSelector
            selectedArticles={articulosSeleccionados}
            onAdd={agregarArticulo}
            onRemove={removerArticulo}
          />

          {/* EVIDENCIA */}
          <EvidencePreview 
            photos={fotos}
            onAddPress={() => router.push('/evidencia')}
          />

          {/* Vehículo Comercial */}
          <View style={styles.cardRow}>
            <Text style={styles.rowLabel}>¿VEHÍCULO COMERCIAL / CARGA?</Text>
            <TouchableOpacity 
              style={[styles.switch, esComercial && styles.switchOn]}
              onPress={() => setEsComercial(!esComercial)}
            >
              <View style={[styles.switchDot, esComercial && styles.switchDotOn]} />
            </TouchableOpacity>
          </View>

          {/* Ubicación */}
          <View style={styles.card}>
            <View style={styles.ubiHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.sectionLabel}>UBICACIÓN ACTUAL (GPS)</Text>
                <TextInput
                  style={styles.ubiInput}
                  value={ubicacion}
                  onChangeText={setUbicacion}
                  multiline
                  placeholder="Obteniendo ubicación..."
                />
              </View>
              <TouchableOpacity 
                style={styles.ubiIconBtn} 
                onPress={obtenerUbicacion}
                disabled={cargandoUbicacion}
              >
                {cargandoUbicacion ? (
                  <ActivityIndicator color="#691C32" />
                ) : (
                  <Image source={require('../../assets/images/icon_ubi.png')} style={styles.ubiIcon} />
                )}
              </TouchableOpacity>
            </View>
          </View>

          {/* Notas / Garantía (Opcional o Requerido si es foráneo) */}
          <View style={styles.card}>
            <Text style={styles.sectionLabel}>
              {esForaneo ? "DOCUMENTO RETENIDO (GARANTÍA) *" : "OBSERVACIONES / NOTAS"}
            </Text>
            <TextInput
              style={[styles.notesInput, esForaneo && !isNotesValid && styles.inputError]}
              value={notas}
              onChangeText={setNotas}
              placeholder={esForaneo ? "Especifique Placa o Licencia retenida..." : "Opcional..."}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
            {esForaneo && !isNotesValid && (
              <Text style={styles.errorText}>* Requerido para vehículos foráneos</Text>
            )}
          </View>

        </ScrollView>

        {/* Botón Final */}
        <View style={styles.footer}>
          <TouchableOpacity 
            style={[styles.mainBtn, !esFormularioValido && styles.mainBtnDisabled]}
            disabled={!esFormularioValido}
            onPress={finalizarBoleta}
          >
            <Text style={[styles.mainBtnText, !esFormularioValido && styles.mainBtnTextDisabled]}>
              {esFormularioValido ? 'GENERAR BOLETA' : 'CAPTURAR DATOS'}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f4f6' },
  header: { backgroundColor: '#691C32', padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  logoCircle: { width: 44, height: 44, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  logoImg: { width: 35, height: 35, resizeMode: 'contain' },
  headerTitle: { color: 'white', fontWeight: 'bold', fontSize: 14, letterSpacing: 1 },
  
  scrollContent: { padding: 16, paddingBottom: 120 },
  card: { backgroundColor: 'white', borderRadius: 20, padding: 20, marginBottom: 16, elevation: 2 },
  cardRow: { backgroundColor: 'white', borderRadius: 20, padding: 20, marginBottom: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionLabel: { color: '#691C32', fontWeight: '900', fontSize: 11, marginBottom: 16, letterSpacing: 1 },
  
  rowLabel: { fontSize: 12, fontWeight: 'bold', color: '#374151' },
  switch: { width: 48, height: 24, backgroundColor: '#e5e7eb', borderRadius: 12, padding: 2 },
  switchOn: { backgroundColor: '#691C32' },
  switchDot: { width: 20, height: 20, backgroundColor: 'white', borderRadius: 10 },
  switchDotOn: { alignSelf: 'flex-end' },

  ubiHeader: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  ubiInput: { fontSize: 12, fontWeight: 'bold', color: '#4b5563', backgroundColor: '#f9fafb', borderRadius: 12, padding: 12 },
  ubiIconBtn: { width: 48, height: 48, backgroundColor: '#f9fafb', borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  ubiIcon: { width: 30, height: 30 },

  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 20, backgroundColor: 'white' },
  mainBtn: { backgroundColor: '#691C32', paddingVertical: 18, borderRadius: 16, alignItems: 'center', elevation: 8 },
  mainBtnDisabled: { backgroundColor: '#e5e7eb', elevation: 0 },
  mainBtnText: { color: 'white', fontWeight: '900', letterSpacing: 2, fontSize: 14 },
  mainBtnTextDisabled: { color: '#9ca3af' },

  notesInput: { fontSize: 14, color: '#374151', backgroundColor: '#f9fafb', borderRadius: 12, padding: 12, minHeight: 80, borderWidth: 1, borderColor: '#e5e7eb' },
  inputError: { borderColor: '#dc2626', backgroundColor: '#fef2f2' },
  errorText: { color: '#dc2626', fontSize: 11, marginTop: 4, fontWeight: 'bold' }
});