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
  KeyboardAvoidingView, 
  Platform 
} from 'react-native';
import { useRouter } from 'expo-router';
import { X, Check } from 'lucide-react-native';

export default function DetallesVehiculoView() {
  const router = useRouter();

  // ESTADOS 
  const [datosRegistro, setDatosRegistro] = useState({
    marcaModelo: "",
    vin: "",
    tarjetaID: ""
  });
  const [inventario, setInventario] = useState<any>({
    cristalesRotos: false,
    sinLlantas: false,
    objetosValor: false
  });
  const [observaciones, setObservaciones] = useState("");
  const [pesoCarga, setPesoCarga] = useState("");

  // LÓGICA DE NEGOCIO 
  const LIMITE_PESO_CDMX = 3500; 
  
  const vinValido = datosRegistro.vin.length === 17;
  const tarjetaVigente = datosRegistro.tarjetaID.length > 5;
  const numPeso = Number(pesoCarga);
  const pesoExcedido = numPeso > LIMITE_PESO_CDMX;

  const puedeSolicitarGrua = 
    datosRegistro.marcaModelo.trim().length > 2 &&
    vinValido &&
    numPeso > 0 &&
    !pesoExcedido && 
    (inventario.cristalesRotos || inventario.sinLlantas || inventario.objetosValor || observaciones.trim().length > 0);

  const handleInputChange = (name: string, value: string) => {
    if (name === "vin" && value.length > 17) return;
    setDatosRegistro(prev => ({ ...prev, [name]: value.toUpperCase() }));
  };

  const toggleCheckbox = (campo: string) => {
    setInventario((prev: any) => ({ ...prev, [campo]: !prev[campo] }));
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
            <View style={styles.logoBox}>
              <Image 
                source={require('../../assets/images/logo_gobierno.png')} 
                style={styles.logo} 
              />
            </View>
            <Text style={styles.headerTitle}>DETALLES DEL VEHÍCULO</Text>
          </View>
          <TouchableOpacity onPress={() => router.back()}>
            <X color="white" size={28} />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          
          {/* Datos de Registro */}
          <View style={[styles.card, styles.cardAccent]}>
            <Text style={styles.sectionLabel}>DATOS DE REGISTRO</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.fieldLabel}>MARCA / MODELO:</Text>
              <TextInput 
                style={styles.input}
                value={datosRegistro.marcaModelo}
                onChangeText={(t) => handleInputChange("marcaModelo", t)}
                placeholder="Ej. NISSAN TSURU 2015"
                placeholderTextColor="#9ca3af"
              />
            </View>

            <View style={styles.inputGroup}>
              <View style={styles.rowBetween}>
                <Text style={styles.fieldLabel}>NÚMERO DE SERIE (VIN):</Text>
                <Text style={[styles.counter, { color: vinValido ? '#059669' : '#d97706' }]}>
                  {datosRegistro.vin.length}/17
                </Text>
              </View>
              <TextInput 
                style={[styles.input, { letterSpacing: 2, fontWeight: 'bold' }]}
                value={datosRegistro.vin}
                onChangeText={(t) => handleInputChange("vin", t)}
                maxLength={17}
                autoCapitalize="characters"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.fieldLabel}>TARJETA DE CIRCULACIÓN:</Text>
              <TextInput 
                style={styles.input}
                value={datosRegistro.tarjetaID}
                onChangeText={(t) => handleInputChange("tarjetaID", t)}
              />
              {datosRegistro.tarjetaID.length > 0 && (
                <Text style={[styles.statusText, { color: tarjetaVigente ? '#059669' : '#dc2626' }]}>
                  {tarjetaVigente ? '✓ DOCUMENTO VIGENTE' : '✕ DOCUMENTO VENCIDO'}
                </Text>
              )}
            </View>
          </View>

          {/* Inventario */}
          <View style={styles.card}>
            <Text style={styles.sectionLabel}>INVENTARIO RÁPIDO</Text>
            <View style={styles.checkboxList}>
              {[
                { id: 'cristalesRotos', label: 'Cristales rotos / Daños visibles' },
                { id: 'sinLlantas', label: 'Sin llantas / Refacción' },
                { id: 'objetosValor', label: 'Objetos de valor a la vista' }
              ].map((item) => (
                <TouchableOpacity 
                  key={item.id} 
                  style={styles.checkboxItem}
                  onPress={() => toggleCheckbox(item.id)}
                >
                  <View style={[styles.checkbox, inventario[item.id] && styles.checkboxChecked]}>
                    {inventario[item.id] && <Check size={14} color="white" />}
                  </View>
                  <Text style={styles.checkboxLabel}>{item.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
            
            <TextInput 
              style={styles.textArea}
              value={observaciones}
              onChangeText={setObservaciones}
              placeholder="Observaciones adicionales (golpes, estado de pintura, etc)..."
              multiline
              numberOfLines={3}
            />
          </View>

          {/* Datos de Carga */}
          <View style={[styles.card, pesoExcedido ? styles.cardError : styles.cardInfo]}>
            <Text style={[styles.sectionLabel, { color: pesoExcedido ? '#991b1b' : '#1d4ed8' }]}>
              CONTROL DE PESO (LÍMITE: {LIMITE_PESO_CDMX} KG)
            </Text>
            <Text style={styles.fieldLabel}>PESO BRUTO ESTIMADO (KG):</Text>
            <TextInput 
              style={styles.inputWhite}
              value={pesoCarga}
              onChangeText={setPesoCarga}
              keyboardType="numeric"
            />
            {numPeso > 0 && (
              <View style={styles.statusRow}>
                <View style={[styles.dot, { backgroundColor: pesoExcedido ? '#dc2626' : '#16a34a' }]} />
                <Text style={[styles.boldStatus, { color: pesoExcedido ? '#b91c1c' : '#15803d' }]}>
                  {pesoExcedido ? 'UNIDAD EXCEDE LÍMITE DE ARRASTRE' : 'APTO PARA MANIOBRA'}
                </Text>
              </View>
            )}
          </View>

        </ScrollView>

        {/* Botón Final */}
        <View style={styles.footer}>
          <TouchableOpacity 
            style={[styles.mainBtn, !puedeSolicitarGrua && styles.btnDisabled]}
            onPress={() => puedeSolicitarGrua && router.push('/grua')}
            disabled={!puedeSolicitarGrua}
          >
            <Text style={[styles.btnText, !puedeSolicitarGrua && styles.btnTextDisabled]}>
              {pesoExcedido ? 'PESO EXCEDIDO' : 
               (!vinValido && datosRegistro.vin.length > 0) ? 'VIN INVÁLIDO' : 
               'CONTINUAR A SOLICITUD'}
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
  logoBox: { width: 44, height: 44, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  logo: { width: 35, height: 35, resizeMode: 'contain' },
  headerTitle: { color: 'white', fontWeight: 'bold', fontSize: 13, letterSpacing: 1 },
  
  scrollContent: { padding: 16, paddingBottom: 120 },
  card: { backgroundColor: 'white', borderRadius: 20, padding: 20, marginBottom: 16, elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10 },
  cardAccent: { borderLeftWidth: 4, borderLeftColor: '#BC955C' },
  cardInfo: { backgroundColor: '#eff6ff', borderColor: '#dbeafe', borderWidth: 1 },
  cardError: { backgroundColor: '#fef2f2', borderColor: '#fecaca', borderWidth: 1 },
  
  sectionLabel: { color: '#691C32', fontWeight: '900', fontSize: 11, marginBottom: 16, letterSpacing: 1 },
  inputGroup: { marginBottom: 15 },
  fieldLabel: { fontSize: 9, color: '#9ca3af', fontWeight: 'bold', marginBottom: 5, letterSpacing: 0.5 },
  input: { backgroundColor: '#f9fafb', borderRadius: 10, padding: 12, fontSize: 14, color: '#1f2937' },
  inputWhite: { backgroundColor: 'white', borderRadius: 10, padding: 12, fontSize: 14, fontWeight: 'bold', elevation: 1 },
  
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  counter: { fontSize: 9, fontWeight: 'bold' },
  statusText: { fontSize: 10, fontWeight: 'bold', marginTop: 5 },

  checkboxList: { gap: 12, marginBottom: 15 },
  checkboxItem: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  checkbox: { width: 24, height: 24, borderRadius: 6, borderWidth: 2, borderColor: '#e5e7eb', justifyContent: 'center', alignItems: 'center' },
  checkboxChecked: { backgroundColor: '#691C32', borderColor: '#691C32' },
  checkboxLabel: { fontSize: 12, fontWeight: 'bold', color: '#4b5563' },
  
  textArea: { backgroundColor: '#f9fafb', borderRadius: 12, padding: 15, fontSize: 12, textAlignVertical: 'top' },

  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 12 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  boldStatus: { fontSize: 11, fontWeight: '900' },

  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 20, backgroundColor: 'white' },
  mainBtn: { backgroundColor: '#691C32', paddingVertical: 18, borderRadius: 16, alignItems: 'center' },
  btnDisabled: { backgroundColor: '#e5e7eb' },
  btnText: { color: 'white', fontWeight: '900', letterSpacing: 2, fontSize: 14 },
  btnTextDisabled: { color: '#9ca3af' }
});