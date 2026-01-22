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
  Platform,
  Switch
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { X, Check, Truck, Car, Bike, Bus } from 'lucide-react-native';

import VehiclePlateInput from '../../components/infraccion/VehiclePlateInput';

export default function DetallesVehiculoView() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const motivoInicial = (params.motivo as string) || "";

  // --- ESTADOS ---
  const [datosVehiculo, setDatosVehiculo] = useState({
    placa: (params.placa as string) || "",
    marcaModelo: "",
    color: "",
    tipo: "COMPACTO", // COMPACTO, SUV, MOTO, PESADO
    tieneLlaves: false
  });
  
  // Estado para el componente de placa
  const [esForaneo, setEsForaneo] = useState(false);

  const [inventario, setInventario] = useState<any>({
    cristalesRotos: false,
    sinLlantas: false,
    objetosValor: false,
    golpesCarroceria: false
  });
  
  const [observaciones, setObservaciones] = useState("");

  // --- LÓGICA ---
  const esFormularioValido = 
    datosVehiculo.placa.length >= 3 &&
    datosVehiculo.marcaModelo.length > 2 &&
    datosVehiculo.color.length > 2;

  const handleInputChange = (name: string, value: string) => {
    setDatosVehiculo(prev => ({ ...prev, [name]: value }));
  };

  const toggleCheckbox = (campo: string) => {
    setInventario((prev: any) => ({ ...prev, [campo]: !prev[campo] }));
  };

  const irASolicitud = () => {
    // Pasamos los datos a la siguiente vista
    router.push({
      pathname: '/grua',
      params: {
        vehiculo: JSON.stringify({
          ...datosVehiculo,
          esForaneo, // Pasamos el dato de foráneo
          inventario,
          observaciones,
          motivo: motivoInicial // Pasamos el motivo original
        })
      }
    });
  };

  // Componente interno para botón de tipo
  const TypeButton = ({ id, label, icon: Icon }: any) => (
    <TouchableOpacity 
      style={[styles.typeBtn, datosVehiculo.tipo === id && styles.typeBtnActive]}
      onPress={() => setDatosVehiculo({...datosVehiculo, tipo: id})}
    >
      <Icon size={24} color={datosVehiculo.tipo === id ? 'white' : '#691C32'} />
      <Text style={[styles.typeText, datosVehiculo.tipo === id && styles.typeTextActive]}>{label}</Text>
    </TouchableOpacity>
  );

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
              <Image source={require('../../assets/images/logo_gobierno.png')} style={styles.logo} />
            </View>
            <Text style={styles.headerTitle}>INVENTARIO DE VEHÍCULO</Text>
          </View>
          <TouchableOpacity onPress={() => router.back()}>
            <X color="white" size={28} />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          
          {/* TIPO DE GRÚA REQUERIDA */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionLabel}>TIPO DE VEHÍCULO (DEFINE GRÚA)</Text>
            <View style={styles.grid4}>
              <TypeButton id="COMPACTO" label="SEDAN" icon={Car} />
              <TypeButton id="SUV" label="SUV/VAN" icon={Truck} />
              <TypeButton id="MOTO" label="MOTO" icon={Bike} />
              <TypeButton id="PESADO" label="+3.5 TON" icon={Bus} />
            </View>
          </View>

          {/* DATOS DE PLACA (COMPONENTE REUTILIZADO) */}
          <VehiclePlateInput 
            value={datosVehiculo.placa} 
            onChange={(t) => handleInputChange("placa", t)}
            isForeign={esForaneo}
            onForeignChange={setEsForaneo}
          />

          {/* OTROS DATOS */}
          <View style={styles.card}>
            <Text style={styles.sectionLabel}>DETALLES ADICIONALES</Text>
            
            <View style={styles.rowGap}>
              <View style={{flex: 1.5}}>
                <Text style={styles.fieldLabel}>COLOR</Text>
                <TextInput 
                  style={styles.input}
                  value={datosVehiculo.color}
                  onChangeText={(t) => handleInputChange("color", t)}
                  placeholder="Ej. ROJO ÓXIDO"
                  autoCapitalize="characters"
                />
              </View>
            </View>

            <View style={{marginTop: 12}}>
              <Text style={styles.fieldLabel}>MARCA Y MODELO</Text>
              <TextInput 
                style={styles.input}
                value={datosVehiculo.marcaModelo}
                onChangeText={(t) => handleInputChange("marcaModelo", t)}
                placeholder="Ej. NISSAN VERSA 2020"
                autoCapitalize="characters"
              />
            </View>

            {/* Switch Llaves */}
            <View style={styles.switchRow}>
              <View>
                <Text style={styles.switchTitle}>¿CUENTA CON LLAVES?</Text>
                <Text style={styles.switchSub}>Si no, se enviará grúa con patines (dollies)</Text>
              </View>
              <Switch
                trackColor={{ false: "#e5e7eb", true: "#691C32" }}
                thumbColor={"white"}
                onValueChange={(val) => setDatosVehiculo({...datosVehiculo, tieneLlaves: val})}
                value={datosVehiculo.tieneLlaves}
              />
            </View>
          </View>

          {/* ESTADO FÍSICO / INVENTARIO */}
          <View style={[styles.card, styles.cardAccent]}>
            <Text style={styles.sectionLabel}>ESTADO FÍSICO (PROTECCIÓN LEGAL)</Text>
            <View style={styles.checkboxList}>
              {[
                { id: 'cristalesRotos', label: 'Cristales Rotos / Estrellados' },
                { id: 'sinLlantas', label: 'Falta de Neumáticos / Rines' },
                { id: 'golpesCarroceria', label: 'Golpes Preexistentes Visibles' },
                { id: 'objetosValor', label: 'Objetos de Valor a la vista' }
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
              placeholder="Describa daños preexistentes o inventario de valor..."
              multiline
              numberOfLines={3}
            />
          </View>

        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          <TouchableOpacity 
            style={[styles.mainBtn, !esFormularioValido && styles.btnDisabled]}
            onPress={irASolicitud}
            disabled={!esFormularioValido}
          >
            <Text style={[styles.btnText, !esFormularioValido && styles.btnTextDisabled]}>
              SIGUIENTE: SOLICITUD Y UBICACIÓN
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
  
  sectionContainer: { marginBottom: 20 },
  grid4: { flexDirection: 'row', justifyContent: 'space-between', gap: 8 },
  typeBtn: { flex: 1, backgroundColor: 'white', paddingVertical: 12, borderRadius: 12, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#e5e7eb', elevation: 1 },
  typeBtnActive: { backgroundColor: '#691C32', borderColor: '#691C32' },
  typeText: { fontSize: 9, fontWeight: 'bold', marginTop: 4, color: '#691C32' },
  typeTextActive: { color: 'white' },

  card: { backgroundColor: 'white', borderRadius: 20, padding: 20, marginBottom: 16, elevation: 2 },
  cardAccent: { borderLeftWidth: 4, borderLeftColor: '#BC955C' }, // Color Dorado Oficial
  
  sectionLabel: { color: '#691C32', fontWeight: '900', fontSize: 10, marginBottom: 12, letterSpacing: 1 },
  fieldLabel: { fontSize: 9, color: '#6b7280', fontWeight: 'bold', marginBottom: 6 },
  
  rowGap: { flexDirection: 'row', gap: 12 },
  input: { backgroundColor: '#f9fafb', borderRadius: 10, padding: 12, fontSize: 13, fontWeight: 'bold', color: '#1f2937', borderWidth: 1, borderColor: '#f3f4f6' },
  placaInput: { textAlign: 'center', letterSpacing: 1, fontSize: 16 },

  switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: '#f3f4f6' },
  switchTitle: { fontSize: 12, fontWeight: 'bold', color: '#1f2937' },
  switchSub: { fontSize: 10, color: '#6b7280', marginTop: 2 },

  checkboxList: { gap: 12, marginBottom: 15 },
  checkboxItem: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  checkbox: { width: 24, height: 24, borderRadius: 6, borderWidth: 2, borderColor: '#e5e7eb', justifyContent: 'center', alignItems: 'center' },
  checkboxChecked: { backgroundColor: '#BC955C', borderColor: '#BC955C' },
  checkboxLabel: { fontSize: 12, fontWeight: 'bold', color: '#4b5563' },
  
  textArea: { backgroundColor: '#f9fafb', borderRadius: 12, padding: 12, fontSize: 12, textAlignVertical: 'top', borderWidth: 1, borderColor: '#f3f4f6' },

  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 20, backgroundColor: 'white' },
  mainBtn: { backgroundColor: '#691C32', paddingVertical: 18, borderRadius: 16, alignItems: 'center' },
  btnDisabled: { backgroundColor: '#e5e7eb' },
  btnText: { color: 'white', fontWeight: '900', letterSpacing: 1, fontSize: 13 },
  btnTextDisabled: { color: '#9ca3af' }
});
