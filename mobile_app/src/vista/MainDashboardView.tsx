<<<<<<< HEAD
import { useRouter } from 'expo-router';
import {
  Bell,
  BookOpen,
  Camera, Clock,
  FileText,
  Menu,
  Search, ShieldAlert,
  Truck,
  User
} from 'lucide-react-native';
import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import OfficialProfile from '../../components/OfficialProfile';
import ServiceCard from '../../components/ServiceCard';
import ShortcutCard from '../../components/ShortcutCard';
import { COLORS, FONT_SIZE, SPACING } from '../../constants/theme';
import { useAuth } from '../context/AuthContext';
import { globalStyles } from '../styles/globalStyles';

=======
import React from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView, 
  StatusBar,
  Alert 
} from 'react-native';
import { useRouter } from 'expo-router';
import { 
  Menu, Bell, User, 
  FileText, Truck, Camera, Clock, 
  Search, ShieldAlert, BookOpen,
  LogOut 
} from 'lucide-react-native';
import { AuthService } from '../services/AuthService'; 
>>>>>>> c4ab953 (fetch,token)

export default function MainDashboardView() {
  const router = useRouter();
  const { user } = useAuth();
  
<<<<<<< HEAD
=======
  // Colores
  const gobVino = '#691C32';
  const gobDorado = '#BC955C';

  // CIERRE DE SESIÓN
  const manejarCerrarSesion = () => {
    Alert.alert(
      "TERMINAR TURNO",
      "¿Desea cerrar sesión y salir del sistema?",
      [
        { text: "CANCELAR", style: "cancel" },
        { 
          text: "SALIR", 
          style: "destructive",
          onPress: async () => {
            try {
              await AuthService.cerrarSesion(); 
              router.replace('/');
            } catch (error) {
              Alert.alert("Error", "No se pudo cerrar la sesión correctamente.");
            }
          } 
        }
      ]
    );
  };

>>>>>>> c4ab953 (fetch,token)
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      
      {/* Header Superior */}
      <View style={[styles.header, { backgroundColor: COLORS.primary }]}>
        <View style={globalStyles.row}>
          <Menu size={24} color="white" style={{ marginRight: SPACING.md }} />
          <View>
            <Text style={styles.headerTitle}>TRÁNSITO CDMX</Text>
            <Text style={styles.headerSubtitle}>SECRETARÍA DE SEGURIDAD CIUDADANA</Text>
          </View>
        </View>
        <Bell size={20} color={COLORS.warning} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        
<<<<<<< HEAD
        {/* Perfil del Oficial */}
        <OfficialProfile 
          nombre={user?.name || 'Oficial'} 
          id={user?.id || '----'} 
          sector={user?.sector || 'SIN SECTOR'} 
        />
=======
        {/* Perfil del Oficial con Botón de Salida */}
        <View style={styles.profileRow}>
          <View style={styles.profileSection}>
            <View style={styles.avatarContainer}>
              <User size={30} color="#9ca3af" />
            </View>
            <View>
              <Text style={[styles.welcomeText, { color: gobVino }]}>Hola, Oficial García</Text>
              <Text style={styles.idText}>ID: 4429 • SECTOR JUÁREZ</Text>
            </View>
          </View>

          {/* BOTÓN SALIR */}
          <TouchableOpacity 
            style={styles.logoutBtn} 
            onPress={manejarCerrarSesion}
          >
            <LogOut size={16} color="#ef4444" />
            <Text style={styles.logoutText}>SALIR</Text>
          </TouchableOpacity>
        </View>
>>>>>>> c4ab953 (fetch,token)

        {/* Filtros Rápidos */}
        <View style={styles.filterContainer}>
          <TouchableOpacity style={[styles.filterBtn, { backgroundColor: COLORS.primary }]}>
            <Text style={styles.filterTextActive}>GENERAL</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterBtnInactive}>
            <Text style={styles.filterTextInactive}>OPERATIVO</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterBtnInactive}>
            <Text style={styles.filterTextInactive}>VIALIDAD</Text>
          </TouchableOpacity>
        </View>

        {/* Status Sistema */}
        <View style={styles.statusBox}>
          <View style={styles.statusDot} />
          <Text style={styles.statusText}>SISTEMA CONECTADO (CDMX-HUB)</Text>
        </View>

        {/* Servicios de Tránsito */}
        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionTitle, { color: COLORS.primary }]}>SERVICIOS DE TRÁNSITO</Text>
          <View style={globalStyles.rowBetween}>
            
            <ServiceCard 
              label="CREAR MULTA"
              icon={FileText}
              bgColor={COLORS.primary}
              onPress={() => router.push('/nueva-infraccion')}
            />

            <ServiceCard 
              label="PEDIR GRÚA"
              icon={Truck}
              bgColor={COLORS.success}
              onPress={() => router.push('/detalles')}
            />

            <ServiceCard 
              label="EVIDENCIAS"
              icon={Camera}
              bgColor={COLORS.secondary}
              onPress={() => router.push('/evidencia')}
            />

          </View>
        </View>

        {/* Mis Atajos */}
        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionTitle, { color: COLORS.primary }]}>MIS ATAJOS</Text>
          <View style={styles.grid2}>
            
            <ShortcutCard 
              title="PARQUÍMETRO"
              subtitle="Consultar Tiempo"
              icon={Clock}
              iconColor={COLORS.secondary}
              iconBgColor={`${COLORS.secondary}20`}
              onPress={() => router.push('/parquimetro')}
            />

            <ShortcutCard 
              title="ADEUDOS"
              subtitle="Estatus Historial"
              icon={Search}
              iconColor={COLORS.info}
              iconBgColor={`${COLORS.info}20`}
              disabled={true}
            />

            <ShortcutCard 
              title="ROBO"
              subtitle="Verificación SSC"
              icon={ShieldAlert}
              iconColor={COLORS.error}
              iconBgColor={`${COLORS.error}20`}
              disabled={true}
            />

            <ShortcutCard 
              title="REGLAMENTO"
              subtitle="Artículos"
              icon={BookOpen}
              iconColor={COLORS.textSec}
              iconBgColor={COLORS.background}
              disabled={true}
            />

          </View>
        </View>
      </ScrollView>

      {/* Tab Bar Inferior */}
      <View style={styles.tabBar}>
        <TouchableOpacity style={globalStyles.center}>
          <View style={[styles.tabIconActive, { backgroundColor: `${COLORS.primary}15` }]}>
            <Clock size={18} color={COLORS.primary} />
          </View>
          <Text style={[styles.tabText, { color: COLORS.primary }]}>INICIO</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={globalStyles.center}>
          <FileText size={18} color={COLORS.textLight} />
          <Text style={[styles.tabText, { color: COLORS.textLight }]}>SERVICIOS</Text>
        </TouchableOpacity>

        <TouchableOpacity style={globalStyles.center}>
          <BookOpen size={18} color={COLORS.textLight} />
          <Text style={[styles.tabText, { color: COLORS.textLight }]}>FOLIOS</Text>
        </TouchableOpacity>

        <TouchableOpacity style={globalStyles.center}>
          <User size={18} color={COLORS.textLight} />
          <Text style={[styles.tabText, { color: COLORS.textLight }]}>PERFIL</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { 
    padding: SPACING.md, 
    paddingTop: 20, 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    elevation: 4, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.2, 
    shadowRadius: 3 
  },
  headerTitle: { color: 'white', fontSize: FONT_SIZE.sm, fontWeight: '900', letterSpacing: 0.5 },
  headerSubtitle: { color: 'white', fontSize: 8, opacity: 0.8, fontWeight: 'bold' },
  
  scrollContent: { padding: SPACING.lg, paddingBottom: 100 },
  
<<<<<<< HEAD
  filterContainer: { flexDirection: 'row', gap: SPACING.sm, marginVertical: SPACING.md },
  filterBtn: { paddingHorizontal: 20, paddingVertical: 8, borderRadius: 20, elevation: 2 },
  filterBtnInactive: { paddingHorizontal: 20, paddingVertical: 8, borderRadius: 20, backgroundColor: COLORS.background },
  filterTextActive: { color: 'white', fontSize: FONT_SIZE.xs, fontWeight: '900' },
  filterTextInactive: { color: COLORS.textLight, fontSize: FONT_SIZE.xs, fontWeight: '900' },

  statusBox: { 
    backgroundColor: '#ecfdf5', 
    borderColor: '#d1fae5', 
    borderWidth: 1, 
    borderRadius: 16, 
    padding: 12, 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 12 
  },
  statusDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.success },
=======
  // NUEVO: Fila para alinear perfil y salir
  profileRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  profileSection: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  avatarContainer: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#e5e7eb', alignItems: 'center', justifyContent: 'center', elevation: 2 },
  welcomeText: { fontSize: 18, fontWeight: '900' },
  idText: { fontSize: 10, color: '#9ca3af', fontWeight: 'bold', letterSpacing: 1 },

  // NUEVO: Estilo botón salir
  logoutBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#fee2e2', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12 },
  logoutText: { color: '#ef4444', fontSize: 10, fontWeight: '900' },

  filterContainer: { flexDirection: 'row', gap: 8, marginVertical: 16 },
  filterBtn: { paddingHorizontal: 20, paddingVertical: 8, borderRadius: 20, elevation: 2 },
  filterBtnInactive: { paddingHorizontal: 20, paddingVertical: 8, borderRadius: 20, backgroundColor: '#f3f4f6' },
  filterTextActive: { color: 'white', fontSize: 10, fontWeight: '900' },
  filterTextInactive: { color: '#9ca3af', fontSize: 10, fontWeight: '900' },

  statusBox: { backgroundColor: '#ecfdf5', borderColor: '#d1fae5', borderWidth: 1, borderRadius: 16, padding: 12, flexDirection: 'row', alignItems: 'center', gap: 12 },
  statusDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#10b981' },
>>>>>>> c4ab953 (fetch,token)
  statusText: { color: '#047857', fontSize: 9, fontWeight: '900', letterSpacing: 1 },

  sectionContainer: { marginTop: SPACING.lg },
  sectionTitle: { fontSize: 11, fontWeight: '900', letterSpacing: 1.5, marginBottom: SPACING.md, marginLeft: 4, fontStyle: 'italic' },
  
  grid2: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    justifyContent: 'space-between',
    rowGap: SPACING.md 
  },

  tabBar: { 
    position: 'absolute', 
    bottom: 0, 
    left: 0, 
    right: 0, 
    backgroundColor: 'white', 
    borderTopWidth: 1, 
    borderTopColor: COLORS.border, 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    paddingHorizontal: SPACING.xl, 
    paddingVertical: 12 
  },
  tabIconActive: { paddingHorizontal: 16, paddingVertical: 4, borderRadius: 20, marginBottom: 4 },
  tabText: { fontSize: 9, fontWeight: '900' }
});