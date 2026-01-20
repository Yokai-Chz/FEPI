import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  SafeAreaView,
  Platform,
  KeyboardAvoidingView,
  ActivityIndicator
} from 'react-native';
import { useRouter } from 'expo-router';
import { X } from 'lucide-react-native';

// Hook de Lógica
import { useNuevaInfraccionForm } from '../hooks/useNuevaInfraccionForm';

// Componentes UI
import VehiclePlateInput from '../../components/infraccion/VehiclePlateInput';
import InfractionSelector from '../../components/infraccion/InfractionSelector';
import EvidencePreview from '../../components/infraccion/EvidencePreview';
import AdditionalIdInput from '../../components/infraccion/AdditionalIdInput';
import OffenderAddressInput from '../../components/infraccion/OffenderAddressInput';
import CommercialVehicleToggle from '../../components/infraccion/CommercialVehicleToggle';
import LocationInput from '../../components/infraccion/LocationInput';
import NotesInput from '../../components/infraccion/NotesInput';

export default function NuevaInfraccionView() {
  const router = useRouter();
  
  // Extraemos toda la lógica y estado del Hook
  const {
    placa, setPlaca,
    esForaneo, setEsForaneo,
    niv, setNiv,
    licencia, setLicencia,
    domicilioInfractor, setDomicilioInfractor,
    notas, setNotas,
    articulosSeleccionados,
    ubicacionHecho, setUbicacionHecho,
    esComercial, setEsComercial,
    fotos,
    enviando,
    cargandoUbicacion,
    esFormularioValido,
    isNotesValid,
    obtenerUbicacionActual,
    agregarArticulo,
    removerArticulo,
    finalizarBoleta
  } = useNuevaInfraccionForm();

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

          {/* IDENTIFICACIÓN ADICIONAL */}
          <AdditionalIdInput 
            niv={niv} 
            onChangeNiv={setNiv} 
            licencia={licencia} 
            onChangeLicencia={setLicencia} 
          />

          {/* DOMICILIO DEL CONDUCTOR */}
          <OffenderAddressInput 
            address={domicilioInfractor} 
            onChange={setDomicilioInfractor} 
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
          <CommercialVehicleToggle 
            value={esComercial} 
            onValueChange={setEsComercial} 
          />

          {/* Ubicación del Hecho */}
          <LocationInput 
            value={ubicacionHecho} 
            onChange={setUbicacionHecho} 
            onRefresh={obtenerUbicacionActual} 
            isLoading={cargandoUbicacion} 
          />

          {/* Notas / Garantía */}
          <NotesInput 
            value={notas} 
            onChange={setNotas} 
            isForeign={esForaneo} 
            isValid={isNotesValid} 
          />

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
  
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 20, backgroundColor: 'white' },
  mainBtn: { backgroundColor: '#691C32', paddingVertical: 18, borderRadius: 16, alignItems: 'center', elevation: 8 },
  mainBtnDisabled: { backgroundColor: '#e5e7eb', elevation: 0 },
  mainBtnText: { color: 'white', fontWeight: '900', letterSpacing: 2, fontSize: 14 },
  mainBtnTextDisabled: { color: '#9ca3af' },
});
