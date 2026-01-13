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
  ActivityIndicator,
  Platform,
  KeyboardAvoidingView
} from 'react-native';
import { useRouter } from 'expo-router';
import { X, Check, MapPin, Plus } from 'lucide-react-native';
import { InfraccionService, InfraccionData } from '../services/InfraccionService';

export default function NuevaInfraccionView() {
  const router = useRouter();

  // ESTADOS
  const [placa, setPlaca] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [articuloSeleccionado, setArticuloSeleccionado] = useState<any>(null);
  const [ubicacion, setUbicacion] = useState("Av. Insurgentes Sur 123, CDMX");
  const [esComercial, setEsComercial] = useState(false);
  const [fotosCapturadas, setFotosCapturadas] = useState([]);
  const [enviando, setEnviando] = useState(false);

  // Validación
  const esFormularioValido = 
    placa.trim().length >= 3 && 
    articuloSeleccionado !== null && 
    ubicacion.trim().length >= 10;

  // FUNCIONES
  const seleccionarArticulo = () => {
    setArticuloSeleccionado({
      titulo: "Art. 9, Fracc II: Semáforo en Rojo",
      sancion: "10 a 20 UMAs ($1,085 - $2,171)"
    });
    setBusqueda(""); 
  };

  const finalizarBoleta = async () => {
  setEnviando(true);

  // Extraemos el ID del título 
  const idArticulo = articuloSeleccionado?.titulo.includes("Art. 9") ? "ART-09" : "ART-GENERICO";

  const nuevaMulta: InfraccionData = {
    fecha: new Date().toISOString(),
    latitud: 19.4326, 
    longitud: -99.1332,
    placa: placa, 
    niv: "1GKSKDEFGH1234567", 
    id_agente: "4429", 
    id_licencia: "LIC-XYZ",
    infracciones: [idArticulo]
  };

  try {
    const respuesta = await InfraccionService.enviar(nuevaMulta);
    
    Alert.alert(
      "ÉXITO", 
      `Infracción registrada correctamente.\nFolio: ${respuesta.folioInfraccion || 'Pendiente'}`,
      [{ text: "OK", onPress: () => router.replace('/dashboard') }]
    );
  } catch (error) {
    Alert.alert("ERROR DE RED", "No se pudo conectar con el servidor. Verifica que el backend esté activo y en la misma red.");
  } finally {
    setEnviando(false);
  }
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
          <View style={styles.card}>
            <Text style={styles.sectionLabel}>DATOS DEL VEHÍCULO</Text>
            <View style={[
              styles.placaInputContainer, 
              placa.length >= 3 && styles.placaValida
            ]}>
              <TextInput
                style={styles.placaInput}
                value={placa}
                onChangeText={(text) => setPlaca(text.toUpperCase())}
                placeholder="PLACA"
                placeholderTextColor="#d1d5db"
                autoCapitalize="characters"
                maxLength={10}
              />
            </View>
            {placa.length >= 3 && (
              <View style={styles.alertSuccess}>
                <Check color="#047857" size={14} />
                <Text style={styles.alertText}>SCC: Vehículo sin reporte de robo</Text>
              </View>
            )}
          </View>

          {/* SECCIÓN MOTIVO */}
          <View style={styles.card}>
            <Text style={styles.sectionLabel}>MOTIVO DE INFRACCIÓN</Text>
            {!articuloSeleccionado ? (
              <View>
                <TextInput
                  style={styles.searchInput}
                  value={busqueda}
                  onChangeText={setBusqueda}
                  placeholder="Buscar artículo o falta..."
                />
                {busqueda.toLowerCase().includes("art") && (
                  <TouchableOpacity style={styles.suggestion} onPress={seleccionarArticulo}>
                    <Text style={styles.suggestionTitle}>Art. 9, Fracc II: Semáforo en Rojo</Text>
                    <Text style={styles.suggestionSub}>TOCA PARA SELECCIONAR</Text>
                  </TouchableOpacity>
                )}
              </View>
            ) : (
              <View style={styles.selectedArtBox}>
                <TouchableOpacity 
                  style={styles.changeBtn} 
                  onPress={() => setArticuloSeleccionado(null)}
                >
                  <Text style={styles.changeBtnText}>CAMBIAR</Text>
                </TouchableOpacity>
                <Text style={styles.artTitle}>{articuloSeleccionado.titulo}</Text>
                <Text style={styles.artSancion}>{articuloSeleccionado.sancion}</Text>
              </View>
            )}
          </View>

          {/* EVIDENCIA */}
          <View style={styles.card}>
            <Text style={styles.sectionLabel}>EVIDENCIA FOTOGRÁFICA</Text>
            <View style={styles.fotoRow}>
              {/* Simulación de fotos capturadas */}
              {fotosCapturadas.map((_, i) => (
                <View key={i} style={styles.fotoPreview} />
              ))}
              <TouchableOpacity 
                style={styles.addFotoBtn}
                onPress={() => router.push('/evidencia')}
              >
                <Plus color="#BC955C" size={30} />
              </TouchableOpacity>
            </View>
            <Text style={styles.fotoStatus}>REQUIERE 4 FOTOS REGLAMENTARIAS</Text>
          </View>

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
                <Text style={styles.sectionLabel}>UBICACIÓN ACTUAL</Text>
                <TextInput
                  style={styles.ubiInput}
                  value={ubicacion}
                  onChangeText={setUbicacion}
                  multiline
                />
              </View>
              <TouchableOpacity style={styles.ubiIconBtn}>
                <Image source={require('../../assets/images/icon_ubi.png')} style={styles.ubiIcon} />
              </TouchableOpacity>
            </View>
          </View>

        </ScrollView>

        {/* Botón Final */}
        <View style={styles.footer}>
          <TouchableOpacity 
            style={[styles.mainBtn, (!esFormularioValido || enviando) && styles.mainBtnDisabled]}
            disabled={!esFormularioValido || enviando}
            onPress={finalizarBoleta}
          >
          {enviando ? (
            <ActivityIndicator color="white" /> 
            ) : (
          <Text style={[styles.mainBtnText, !esFormularioValido && styles.mainBtnTextDisabled]}>
          {esFormularioValido ? 'GENERAR BOLETA' : 'CAPTURAR DATOS'}
          </Text>
          )}
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
  
  placaInputContainer: { borderWidth: 2, borderStyle: 'dashed', borderColor: '#e5e7eb', borderRadius: 16, padding: 16 },
  placaValida: { borderColor: '#d1fae5', backgroundColor: '#f0fdf4' },
  placaInput: { textAlign: 'center', fontSize: 32, fontWeight: '900', color: '#1f2937' },
  
  alertSuccess: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#ecfdf5', padding: 10, borderRadius: 8, marginTop: 12 },
  alertText: { color: '#047857', fontSize: 10, fontWeight: 'bold' },

  searchInput: { backgroundColor: '#f9fafb', borderWidth: 1, borderColor: '#f3f4f6', borderRadius: 12, padding: 14, fontSize: 14 },
  suggestion: { marginTop: 12, backgroundColor: '#FFF9F2', borderWidth: 2, borderStyle: 'dashed', borderColor: '#BC955C', borderRadius: 12, padding: 14 },
  suggestionTitle: { fontSize: 12, fontWeight: 'bold', color: '#1f2937' },
  suggestionSub: { fontSize: 9, color: '#BC955C', fontWeight: '900', textAlign: 'right', marginTop: 4 },

  selectedArtBox: { backgroundColor: 'rgba(105,28,50,0.05)', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: 'rgba(105,28,50,0.1)' },
  artTitle: { fontSize: 13, fontWeight: 'bold', color: '#691C32', paddingRight: 60 },
  artSancion: { fontSize: 10, color: '#6b7280', marginTop: 4, fontWeight: 'bold' },
  changeBtn: { position: 'absolute', top: 12, right: 12 },
  changeBtnText: { color: '#691C32', fontSize: 10, fontWeight: '900', textDecorationLine: 'underline' },

  fotoRow: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  addFotoBtn: { width: 64, height: 64, borderWidth: 2, borderStyle: 'dashed', borderColor: '#BC955C', backgroundColor: '#fdfaf6', borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  fotoPreview: { width: 64, height: 64, backgroundColor: '#e5e7eb', borderRadius: 12 },
  fotoStatus: { fontSize: 10, color: '#9ca3af', fontWeight: 'bold' },

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
  mainBtnTextDisabled: { color: '#9ca3af' }
});