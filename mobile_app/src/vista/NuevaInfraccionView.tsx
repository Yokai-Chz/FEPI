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
import { useAuth } from '../context/AuthContext';
import { useInfraccion } from '../context/InfraccionContext';
import { isValidCDMXPlate } from '../utils/plateValidation';
import { infraccionesService } from '../services/infracciones.service';

export default function NuevaInfraccionView() {
  const router = useRouter();
  const { user } = useAuth();
  const { fotos, resetFotos } = useInfraccion();

  // --- ESTADOS ---
  const [enviando, setEnviando] = useState(false);
  const [placa, setPlaca] = useState("");
  const [esForaneo, setEsForaneo] = useState(false);
  const [niv, setNiv] = useState("");
  const [licencia, setLicencia] = useState("");
  
  // Domicilio del conductor (infractor)
  const [domicilioInfractor, setDomicilioInfractor] = useState({
    municipio: "",
    vialidad: "",
    numero_exterior: "",
    nombre_asentamiento: "",
    codigo_postal: "",
    nombre_entidad: ""
  });

  const [notas, setNotas] = useState("");
  const [articulosSeleccionados, setArticulosSeleccionados] = useState<InfractionArticle[]>([]);
  
  // Ubicación del HECHO (GPS)
  const [ubicacionHecho, setUbicacionHecho] = useState("");
  const [coordenadas, setCoordenadas] = useState<{lat: number, lon: number} | null>(null);
  const [cargandoUbicacion, setCargandoUbicacion] = useState(false);

  const [esComercial, setEsComercial] = useState(false);

  // Validación
  const isPlateValid = esForaneo ? placa.length >= 3 : isValidCDMXPlate(placa);
  const isNotesValid = esForaneo ? notas.trim().length > 3 : true;
  const isNivValid = niv.trim().length === 0 || niv.length === 17; 
  const isLicenciaValid = licencia.trim().length === 0 || licencia.length >= 5; 

  const esFormularioValido = 
    !enviando &&
    isPlateValid &&
    isNotesValid &&
    isNivValid &&
    isLicenciaValid &&
    articulosSeleccionados.length > 0 && 
    ubicacionHecho.trim().length >= 5;

  // --- FUNCIONES ---
  
  useEffect(() => {
    obtenerUbicacionActual();
  }, []);

  const obtenerUbicacionActual = async () => {
    setCargandoUbicacion(true);
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permiso denegado', 'Se necesita acceso a la ubicación para registrar el lugar del hecho.');
        setCargandoUbicacion(false);
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      setCoordenadas({ lat: latitude, lon: longitude });

      let addressResponse = await Location.reverseGeocodeAsync({ latitude, longitude });
      
      if (addressResponse.length > 0) {
        const addr = addressResponse[0];
        const direccionFormateada = `${addr.street || ''} ${addr.streetNumber || ''}, ${addr.district || ''}, ${addr.subregion || addr.city || ''}`;
        setUbicacionHecho(direccionFormateada.trim());
      } else {
        setUbicacionHecho(`${latitude}, ${longitude}`);
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

  const finalizarBoleta = async () => {
    setEnviando(true);
    try {
      const evidenciasArray = Object.values(fotos).filter(uri => uri !== null) as string[];

      const dataToSend = {
        fecha: new Date().toISOString(),
        latitud: coordenadas?.lat || 0,
        longitud: coordenadas?.lon || 0,
        placa: placa,
        niv: niv.trim() || null,
        id_agente: user?.id || "ANONYMOUS", 
        id_licencia: licencia.trim() || null,
        descripcion: notas || "Sin observaciones adicionales",
        infracciones: articulosSeleccionados.map(a => a.id),
        ubicacion_infractor: {
          municipio: domicilioInfractor.municipio.trim() || null,
          vialidad: domicilioInfractor.vialidad.trim() || null,
          numero_exterior: domicilioInfractor.numero_exterior.trim() || null,
          nombre_asentamiento: domicilioInfractor.nombre_asentamiento.trim() || null,
          codigo_postal: domicilioInfractor.codigo_postal.trim() || null,
          nombre_entidad: domicilioInfractor.nombre_entidad.trim() || null
        },
        evidencias: evidenciasArray
      };

      await infraccionesService.crearInfraccion(dataToSend, user?.token || "");

      Alert.alert(
        "Éxito", 
        `✅ Infracción registrada.\n${!coordenadas ? '(Guardada localmente por falta de conexión)' : ''}`,
        [{ 
          text: "Terminar", 
          onPress: () => {
            resetFotos(); 
            router.replace('/dashboard');
          } 
        }]
      );
    } catch (error) {
      Alert.alert("Error", "No se pudo procesar la infracción");
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
          <VehiclePlateInput 
            value={placa} 
            onChange={setPlaca} 
            isForeign={esForaneo}
            onForeignChange={setEsForaneo}
          />

          <View style={styles.card}>
            <Text style={styles.sectionLabel}>IDENTIFICACIÓN ADICIONAL</Text>
            
            <Text style={styles.rowLabel}>NIV (Número de Identificación Vehicular)</Text>
            <TextInput
              style={[styles.ubiInput, { marginBottom: 16 }]}
              value={niv}
              onChangeText={text => setNiv(text.toUpperCase())}
              placeholder="17 Caracteres"
              maxLength={17}
              autoCapitalize="characters"
            />

            <Text style={styles.rowLabel}>No. LICENCIA DE CONDUCIR</Text>
            <TextInput
              style={styles.ubiInput}
              value={licencia}
              onChangeText={text => setLicencia(text.toUpperCase())}
              placeholder="Número de Licencia"
              autoCapitalize="characters"
            />
          </View>

          {/* NUEVA SECCIÓN: DOMICILIO DEL CONDUCTOR */}
          <View style={styles.card}>
            <Text style={styles.sectionLabel}>DOMICILIO DEL CONDUCTOR (OPCIONAL)</Text>
            
            <View style={styles.grid2}>
              <View style={{ flex: 1.5, marginRight: 8 }}>
                <Text style={styles.rowLabel}>Calle / Vialidad</Text>
                <TextInput
                  style={styles.ubiInput}
                  value={domicilioInfractor.vialidad}
                  onChangeText={text => setDomicilioInfractor({...domicilioInfractor, vialidad: text})}
                  placeholder="Ej. Av. Reforma"
                />
              </View>
              <View style={{ flex: 0.5 }}>
                <Text style={styles.rowLabel}>No. Ext</Text>
                <TextInput
                  style={styles.ubiInput}
                  value={domicilioInfractor.numero_exterior}
                  onChangeText={text => setDomicilioInfractor({...domicilioInfractor, numero_exterior: text})}
                  placeholder="222"
                />
              </View>
            </View>

            <View style={[styles.grid2, { marginTop: 12 }]}>
              <View style={{ flex: 1, marginRight: 8 }}>
                <Text style={styles.rowLabel}>Colonia / Asentamiento</Text>
                <TextInput
                  style={styles.ubiInput}
                  value={domicilioInfractor.nombre_asentamiento}
                  onChangeText={text => setDomicilioInfractor({...domicilioInfractor, nombre_asentamiento: text})}
                  placeholder="Ej. Juárez"
                />
              </View>
              <View style={{ flex: 0.6 }}>
                <Text style={styles.rowLabel}>C.P.</Text>
                <TextInput
                  style={styles.ubiInput}
                  value={domicilioInfractor.codigo_postal}
                  onChangeText={text => setDomicilioInfractor({...domicilioInfractor, codigo_postal: text})}
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
                  value={domicilioInfractor.municipio}
                  onChangeText={text => setDomicilioInfractor({...domicilioInfractor, municipio: text})}
                  placeholder="Cuauhtémoc"
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.rowLabel}>Entidad</Text>
                <TextInput
                  style={styles.ubiInput}
                  value={domicilioInfractor.nombre_entidad}
                  onChangeText={text => setDomicilioInfractor({...domicilioInfractor, nombre_entidad: text})}
                  placeholder="CDMX"
                />
              </View>
            </View>
          </View>

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

          {/* Ubicación del Hecho */}
          <View style={styles.card}>
            <View style={styles.ubiHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.sectionLabel}>LUGAR DE LOS HECHOS (GPS)</Text>
                <TextInput
                  style={styles.ubiInput}
                  value={ubicacionHecho}
                  onChangeText={setUbicacionHecho}
                  multiline
                  placeholder="Obteniendo ubicación..."
                />
              </View>
              <TouchableOpacity 
                style={styles.ubiIconBtn} 
                onPress={obtenerUbicacionActual}
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

          {/* Notas / Garantía */}
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
  
  rowLabel: { fontSize: 12, fontWeight: 'bold', color: '#374151', marginBottom: 4 },
  grid2: { flexDirection: 'row', justifyContent: 'space-between' },

  switch: { width: 48, height: 24, backgroundColor: '#e5e7eb', borderRadius: 12, padding: 2 },
  switchOn: { backgroundColor: '#691C32' },
  switchDot: { width: 20, height: 20, backgroundColor: 'white', borderRadius: 10 },
  switchDotOn: { alignSelf: 'flex-end' },

  ubiHeader: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  ubiInput: { fontSize: 12, fontWeight: 'bold', color: '#4b5563', backgroundColor: '#f9fafb', borderRadius: 12, padding: 12, borderWidth: 1, borderColor: '#f3f4f6' },
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