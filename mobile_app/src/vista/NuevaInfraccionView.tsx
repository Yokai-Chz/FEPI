import React, { useState } from 'react';
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
  KeyboardAvoidingView
} from 'react-native';
import { useRouter } from 'expo-router';
import { X } from 'lucide-react-native';

// Componentes
import VehiclePlateInput from '../../components/infraccion/VehiclePlateInput';
import InfractionSelector, { InfractionArticle } from '../../components/infraccion/InfractionSelector';
import EvidencePreview from '../../components/infraccion/EvidencePreview';

export default function NuevaInfraccionView() {
  const router = useRouter();

  // --- ESTADOS ---
  const [placa, setPlaca] = useState("");
  const [articulosSeleccionados, setArticulosSeleccionados] = useState<InfractionArticle[]>([]);
  const [ubicacion, setUbicacion] = useState("Av. Insurgentes Sur 123, CDMX");
  const [esComercial, setEsComercial] = useState(false);
  const [fotosCapturadas, setFotosCapturadas] = useState([]);

  // Validación
  const esFormularioValido = 
    placa.trim().length >= 3 && 
    articulosSeleccionados.length > 0 && 
    ubicacion.trim().length >= 10;

  // --- FUNCIONES ---
  const agregarArticulo = (articulo: InfractionArticle) => {
    setArticulosSeleccionados((prev) => [...prev, articulo]);
  };

  const removerArticulo = (id: string) => {
    setArticulosSeleccionados((prev) => prev.filter(a => a.id !== id));
  };

  const finalizarBoleta = () => {
    Alert.alert(
      "Éxito", 
      `✅ Folio generado con ${articulosSeleccionados.length} infracciones. Enviando reporte a plataforma SSC...`,
      [{ text: "OK", onPress: () => router.replace('/dashboard') }]
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
          />

          {/* SECCIÓN MOTIVO */}
          <InfractionSelector
            selectedArticles={articulosSeleccionados}
            onAdd={agregarArticulo}
            onRemove={removerArticulo}
          />

          {/* EVIDENCIA */}
          <EvidencePreview 
            photos={fotosCapturadas}
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
  mainBtnTextDisabled: { color: '#9ca3af' }
});