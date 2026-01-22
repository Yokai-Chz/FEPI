import React, { useState } from 'react';
import { 
  StyleSheet, View, Text, TextInput, TouchableOpacity, 
  SafeAreaView, ScrollView, Alert, ActivityIndicator 
} from 'react-native';
import { useRouter } from 'expo-router';
import { AlertTriangle, Lock, FileText, X, CheckCircle, Search } from 'lucide-react-native';
import { useAuth } from '../context/AuthContext';
import { parquimetrosService, RespuestaParquimetro } from '../services/parquimetros.service';
import { COLORS, SPACING, FONT_SIZE } from '../../constants/theme';
import VehiclePlateInput from '../../components/infraccion/VehiclePlateInput';

export default function ParquimetroView() {
  const router = useRouter();
  const { user } = useAuth();
  const [placa, setPlaca] = useState("");
  const [esForaneo, setEsForaneo] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [infoVehiculo, setInfoVehiculo] = useState<RespuestaParquimetro | null>(null);

  const consultarPlacaAlBackend = async (placaIngresada: string) => {
    if (!user?.token) return;
    
    setLoading(true);
    try {
      const data = await parquimetrosService.consultarPlaca(placaIngresada, user.token);
      setInfoVehiculo(data);
    } catch (error) {
      Alert.alert("Error", "No se pudo conectar con el servidor de parquímetros");
    } finally {
      setLoading(false);
    }
  };

  const obtenerTiempoLegible = (minutos: number) => {
    const absMin = Math.abs(minutos);
    return `${absMin} MINUTOS`;
  };

  const manejarInmovilizador = () => {
    router.push({
      pathname: '/detalles',
      params: { 
        placa: placa,
        motivo: "Inmovilizador - Tiempo Excedido"
      }
    });
  };

  const formatHora = (fechaIso: string) => {
    try {
        const date = new Date(fechaIso);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' HRS';
    } catch (e) {
        return "---";
    }
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
        <View>
          <VehiclePlateInput 
            value={placa} 
            onChange={(t) => {
               setPlaca(t);
               if (t.length >= 7) consultarPlacaAlBackend(t);
               else setInfoVehiculo(null);
            }} 
            isForeign={esForaneo}
            onForeignChange={setEsForaneo}
          />
          
          <TouchableOpacity 
            style={styles.consultarBtn}
            onPress={() => consultarPlacaAlBackend(placa)}
          >
            <Search color="white" size={20} />
            <Text style={styles.consultarBtnText}>CONSULTAR PLACA</Text>
          </TouchableOpacity>

          {loading && (
            <View style={styles.loadingBox}>
              <ActivityIndicator size="small" color={COLORS.secondary} />
              <Text style={styles.loadingText}>SINCRONIZANDO CON SISTEMA...</Text>
            </View>
          )}
        </View>

        {/* CASO VIGENTE */}
        {infoVehiculo && infoVehiculo.estatus === "VIGENTE" && (
          <View style={[styles.cardAlert, styles.cardVigente]}>
            <View style={[styles.alertCircle, styles.circleVigente]}>
              <CheckCircle size={40} color={COLORS.success} />
            </View>
            <Text style={[styles.alertTitle, { color: COLORS.success }]}>PAGO VIGENTE</Text>
            <View style={[styles.timeBadge, { backgroundColor: '#d1fae5' }]}>
              <Text style={[styles.timeText, { color: '#065f46' }]}>RESTA: {obtenerTiempoLegible(infoVehiculo.minutos_restantes)}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.row}>
              <View style={styles.col}>
                <Text style={styles.miniLabel}>ESTATUS</Text>
                <Text style={styles.valText}>{infoVehiculo.estatus}</Text>
              </View>
              <View style={styles.col}>
                <Text style={[styles.miniLabel, {textAlign: 'right'}]}>VENCIMIENTO</Text>
                <Text style={[styles.valText, {textAlign: 'right'}]}>{formatHora(infoVehiculo.fecha_vencimiento)}</Text>
              </View>
            </View>
          </View>
        )}

        {/* CASO EXPIRADO */}
        {infoVehiculo && infoVehiculo.estatus === "EXPIRADO" && (
          <View style={styles.cardAlert}>
            <View style={styles.alertCircle}>
              <AlertTriangle size={40} color={COLORS.error} />
            </View>
            <Text style={styles.alertTitle}>TIEMPO EXPIRADO</Text>
            <View style={styles.timeBadge}>
              <Text style={styles.timeText}>HACE {obtenerTiempoLegible(infoVehiculo.minutos_restantes)}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.row}>
              <View style={styles.col}>
                <Text style={styles.miniLabel}>ESTATUS</Text>
                <Text style={styles.valText}>{infoVehiculo.estatus}</Text>
              </View>
              <View style={styles.col}>
                <Text style={[styles.miniLabel, {textAlign: 'right'}]}>VENCIMIENTO</Text>
                <Text style={[styles.valText, {textAlign: 'right'}]}>{formatHora(infoVehiculo.fecha_vencimiento)}</Text>
              </View>
            </View>
            
            <View style={styles.suggestedBox}>
                <Text style={styles.suggestedText}>ACCIÓN SUGERIDA: {infoVehiculo.accion_sugerida}</Text>
            </View>
          </View>
        )}

        {/* Botonera */}
        <View style={styles.footer}>
          <TouchableOpacity 
            style={[styles.btn, !infoVehiculo && styles.btnOff]}
            onPress={() => router.push('/nueva-infraccion')}
            disabled={!infoVehiculo}
          >
            <FileText color={infoVehiculo ? "white" : "#9ca3af"} size={20} />
            <Text style={[styles.btnText, !infoVehiculo && styles.btnTextOff]}>GENERAR INFRACCIÓN</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[
              styles.btnOutline, 
              (!infoVehiculo || infoVehiculo.estatus !== "EXPIRADO") && styles.btnOutlineOff
            ]}
            onPress={manejarInmovilizador}
            disabled={!infoVehiculo || infoVehiculo.estatus !== "EXPIRADO"}
          >
            <Lock color={infoVehiculo?.estatus === "EXPIRADO" ? COLORS.primary : "#d1d5db"} size={20} />
            <Text style={[
              styles.btnOutlineText, 
              (!infoVehiculo || infoVehiculo.estatus !== "EXPIRADO") && styles.btnOutlineTextOff
            ]}>SOLICITAR INMOVILIZADOR</Text>
          </TouchableOpacity>

          <Text style={styles.legalText}>
            LA INMOVILIZACIÓN APLICA SEGÚN EL ART. 33 DEL REGLAMENTO DE TRÁNSITO CUANDO EL PAGO HA EXPIRADO.
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
  
  consultarBtn: { backgroundColor: COLORS.primary, padding: 16, borderRadius: 16, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10, elevation: 3, marginBottom: 20 },
  consultarBtnText: { color: 'white', fontWeight: 'bold', fontSize: 13, letterSpacing: 1 },

  loadingBox: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 12 },
  loadingText: { fontSize: 9, fontWeight: 'bold', color: '#9ca3af' },

  cardAlert: { backgroundColor: '#fef2f2', borderRadius: 32, padding: 24, marginTop: 16, alignItems: 'center', borderWidth: 2, borderColor: '#fee2e2' },
  cardVigente: { backgroundColor: '#f0fdf4', borderColor: '#d1fae5' },
  alertCircle: { width: 70, height: 70, borderRadius: 35, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', elevation: 4, marginBottom: 12 },
  circleVigente: { borderColor: '#d1fae5', borderWidth: 1 },
  alertTitle: { fontSize: 22, fontWeight: '900', color: '#dc2626', letterSpacing: -0.5 },
  timeBadge: { backgroundColor: '#fee2e2', paddingHorizontal: 15, paddingVertical: 5, borderRadius: 20, marginTop: 5 },
  timeText: { fontSize: 10, fontWeight: '900', color: '#991b1b' },
  
  suggestedBox: { marginTop: 15, backgroundColor: 'rgba(0,0,0,0.05)', padding: 10, borderRadius: 10, width: '100%' },
  suggestedText: { fontSize: 9, fontWeight: 'bold', color: '#4b5563', textAlign: 'center', letterSpacing: 1 },

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
  
  btnOutline: { padding: 20, borderRadius: 100, borderColor: '#691C32', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10, borderStyle: 'solid', borderWidth: 2 },
  btnOutlineOff: { borderColor: '#e5e7eb' },
  btnOutlineText: { color: '#691C32', fontWeight: '900', fontSize: 12, letterSpacing: 1.5 },
  btnOutlineTextOff: { color: '#d1d5db' },

  legalText: { fontSize: 10, color: '#9ca3af', fontWeight: 'bold', textAlign: 'center', marginTop: 15, paddingHorizontal: 30, lineHeight: 14 }
});
