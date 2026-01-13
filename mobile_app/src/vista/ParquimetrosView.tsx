import React, { useState } from 'react';
import { 
  StyleSheet, View, Text, TextInput, TouchableOpacity, 
  SafeAreaView, ScrollView, Alert, ActivityIndicator 
} from 'react-native';
import { useRouter } from 'expo-router';
import { AlertTriangle, Lock, FileText, X } from 'lucide-react-native';

export default function ParquimetroView() {
  const router = useRouter();
  const [placa, setPlaca] = useState("");
  const [loading, setLoading] = useState(false);
  
  const [infoVehiculo, setInfoVehiculo] = useState<any>({
    existe: false,
    tiempoExpiradoSegundos: 0,
    zona: "",
    finDePago: "",
    estatus: "" 
  });

  const TOLERANCIA_ALERTA = 300; // 5 min
  const TOLERANCIA_INMOVILIZADOR = 600; // 10 min

  const consultarPlacaAlBackend = async (placaIngresada: string) => {
    setLoading(true);
    // Simulación de API de Parquímetros CDMX
    setTimeout(() => {
      const respuestaSimulada = {
        existe: true,
        tiempoExpiradoSegundos: Math.floor(Math.random() * (1200 - 400 + 1)) + 400,
        zona: "POLANCO - SECC. " + Math.floor(Math.random() * 5),
        finDePago: "14:" + Math.floor(Math.random() * 59) + " HRS",
        estatus: "VENCIDO"
      };
      setInfoVehiculo(respuestaSimulada);
      setLoading(false);
    }, 800); 
  };

  const obtenerTiempoLegible = (segundos: number) => {
    const min = Math.floor(segundos / 60);
    const seg = segundos % 60;
    return `${min} MIN ${seg < 10 ? '0' : ''}${seg} S`;
  };

  const manejarInmovilizador = () => {
    Alert.alert(
      "SOLICITUD ENVIADA",
      `Inmovilizador (Araña) solicitado para la unidad ${placa}.\n\nMotivo: Tiempo excedido > 10 min.`,
      [{ text: "ENTENDIDO", onPress: () => router.replace('/dashboard') }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>CONSULTA PARQUÍMETRO</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <X color="white" size={24} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Entrada de Placa */}
        <View style={styles.cardPlaca}>
          <Text style={styles.inputLabel}>INGRESE PLACA DE LA UNIDAD</Text>
          <View style={styles.inputContainer}>
            <TextInput 
              style={styles.placaInput}
              value={placa}
              onChangeText={(t) => {
                const val = t.toUpperCase();
                setPlaca(val);
                if (val.length >= 6) consultarPlacaAlBackend(val);
                else setInfoVehiculo({ ...infoVehiculo, existe: false });
              }}
              placeholder="000-000"
              placeholderTextColor="#d1d5db"
              autoCapitalize="characters"
              maxLength={8}
            />
          </View>
          {loading && (
            <View style={styles.loadingBox}>
              <ActivityIndicator size="small" color="#BC955C" />
              <Text style={styles.loadingText}>SINCRONIZANDO CON SISTEMA...</Text>
            </View>
          )}
        </View>

        {/* Alerta de Tiempo Expirado */}
        {infoVehiculo.existe && infoVehiculo.tiempoExpiradoSegundos > TOLERANCIA_ALERTA && (
          <View style={styles.cardAlert}>
            <View style={styles.alertCircle}>
              <AlertTriangle size={40} color="#ef4444" />
            </View>
            <Text style={styles.alertTitle}>TIEMPO EXPIRADO</Text>
            <View style={styles.timeBadge}>
              <Text style={styles.timeText}>HACE {obtenerTiempoLegible(infoVehiculo.tiempoExpiradoSegundos)}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.row}>
              <View style={styles.col}>
                <Text style={styles.miniLabel}>ZONA</Text>
                <Text style={styles.valText}>{infoVehiculo.zona}</Text>
              </View>
              <View style={styles.col}>
                <Text style={[styles.miniLabel, {textAlign: 'right'}]}>LÍMITE PAGO</Text>
                <Text style={[styles.valText, {textAlign: 'right'}]}>{infoVehiculo.finDePago}</Text>
              </View>
            </View>
          </View>
        )}

        {/* Botonera */}
        <View style={styles.footer}>
          <TouchableOpacity 
            style={[styles.btn, !infoVehiculo.existe && styles.btnOff]}
            onPress={() => router.push('/nueva-infraccion')}
            disabled={!infoVehiculo.existe}
          >
            <FileText color={infoVehiculo.existe ? "white" : "#9ca3af"} size={20} />
            <Text style={[styles.btnText, !infoVehiculo.existe && styles.btnTextOff]}>GENERAR INFRACCIÓN</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[
              styles.btnOutline, 
              infoVehiculo.tiempoExpiradoSegundos < TOLERANCIA_INMOVILIZADOR && styles.btnOutlineOff
            ]}
            onPress={manejarInmovilizador}
            disabled={infoVehiculo.tiempoExpiradoSegundos < TOLERANCIA_INMOVILIZADOR}
          >
            <Lock color={infoVehiculo.tiempoExpiradoSegundos >= TOLERANCIA_INMOVILIZADOR ? "#691C32" : "#d1d5db"} size={20} />
            <Text style={[
              styles.btnOutlineText, 
              infoVehiculo.tiempoExpiradoSegundos < TOLERANCIA_INMOVILIZADOR && styles.btnOutlineTextOff
            ]}>SOLICITAR INMOVILIZADOR</Text>
          </TouchableOpacity>

          <Text style={styles.legalText}>
            LA INMOVILIZACIÓN APLICA AL EXCEDER 10 MINUTOS DE TOLERANCIA (ART. 33 REGLAMENTO DE TRÁNSITO).
          </Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f4f6' },
  header: { backgroundColor: '#691C32', padding: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerTitle: { color: 'white', fontWeight: 'bold', fontSize: 13, letterSpacing: 1.5 },
  
  scrollContent: { padding: 16 },
  cardPlaca: { backgroundColor: 'white', borderRadius: 24, padding: 24, elevation: 2, alignItems: 'center' },
  inputLabel: { fontSize: 10, color: '#691C32', fontWeight: '900', letterSpacing: 1, marginBottom: 15 },
  inputContainer: { width: '100%', backgroundColor: '#f9fafb', borderRadius: 16, borderWidth: 2, borderColor: '#f3f4f6', paddingVertical: 10 },
  placaInput: { textAlign: 'center', fontSize: 36, fontWeight: '900', letterSpacing: 4, color: '#1f2937' },
  
  loadingBox: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 12 },
  loadingText: { fontSize: 9, fontWeight: 'bold', color: '#9ca3af' },

  cardAlert: { backgroundColor: '#fef2f2', borderRadius: 32, padding: 24, marginTop: 16, alignItems: 'center', borderWidth: 2, borderColor: '#fee2e2' },
  alertCircle: { width: 70, height: 70, borderRadius: 35, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', elevation: 4, marginBottom: 12 },
  alertTitle: { fontSize: 22, fontWeight: '900', color: '#dc2626', letterSpacing: -0.5 },
  timeBadge: { backgroundColor: '#fee2e2', paddingHorizontal: 15, paddingVertical: 5, borderRadius: 20, marginTop: 5 },
  timeText: { fontSize: 10, fontWeight: '900', color: '#991b1b' },
  
  divider: { width: '100%', height: 1, backgroundColor: '#fecaca', marginVertical: 20, opacity: 0.5 },
  row: { flexDirection: 'row', width: '100%' },
  col: { flex: 1 },
  miniLabel: { fontSize: 9, color: '#94a3b8', fontWeight: 'bold', marginBottom: 4 },
  valText: { fontSize: 12, fontWeight: '900', color: '#475569' },

  footer: { marginTop: 20, gap: 12, paddingBottom: 40 },
  btn: { backgroundColor: '#691C32', padding: 20, borderRadius: 100, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10, elevation: 5 },
  btnOff: { backgroundColor: '#e5e7eb', elevation: 0 },
  btnText: { color: 'white', fontWeight: '900', fontSize: 12, letterSpacing: 1.5 },
  btnTextOff: { color: '#9ca3af' },
  
  btnOutline: { padding: 20, borderRadius: 100, borderWeight: 2, borderColor: '#691C32', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10, borderStyle: 'solid', borderWidth: 2 },
  btnOutlineOff: { borderColor: '#e5e7eb' },
  btnOutlineText: { color: '#691C32', fontWeight: '900', fontSize: 12, letterSpacing: 1.5 },
  btnOutlineTextOff: { color: '#d1d5db' },

  legalText: { fontSize: 10, color: '#9ca3af', fontWeight: 'bold', textAlign: 'center', marginTop: 15, paddingHorizontal: 30, lineHeight: 14 }
});