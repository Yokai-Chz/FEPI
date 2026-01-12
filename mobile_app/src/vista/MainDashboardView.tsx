import React from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView, 
  StatusBar 
} from 'react-native';
import { useRouter } from 'expo-router';
import { 
  Menu, Bell, User, 
  FileText, Truck, Camera, Clock, 
  Search, ShieldAlert, BookOpen 
} from 'lucide-react-native';

export default function MainDashboardView() {
  const router = useRouter();
  
  // Colores Institucionales CDMX
  const gobVino = '#691C32';
  const gobDorado = '#BC955C';

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={gobVino} />
      
      {/* Header Superior */}
      <View style={[styles.header, { backgroundColor: gobVino }]}>
        <View style={styles.headerLeft}>
          <Menu size={24} color="white" />
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>TRÁNSITO CDMX</Text>
            <Text style={styles.headerSubtitle}>SECRETARÍA DE SEGURIDAD CIUDADANA</Text>
          </View>
        </View>
        <Bell size={20} color="#fbbf24" />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Perfil del Oficial */}
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <User size={30} color="#9ca3af" />
          </View>
          <View>
            <Text style={[styles.welcomeText, { color: gobVino }]}>Hola, Oficial García</Text>
            <Text style={styles.idText}>ID: 4429 • SECTOR JUÁREZ</Text>
          </View>
        </View>

        {/* Filtros Rápidos */}
        <View style={styles.filterContainer}>
          <TouchableOpacity style={[styles.filterBtn, { backgroundColor: gobVino }]}>
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
          <Text style={[styles.sectionTitle, { color: gobVino }]}>SERVICIOS DE TRÁNSITO</Text>
          <View style={styles.grid3}>
            
            <TouchableOpacity style={styles.serviceCard} onPress={() => router.push('/nueva-infraccion')}>
              <View style={[styles.iconLarge, { backgroundColor: gobVino }]}>
                <FileText size={20} color="white" />
              </View>
              <Text style={styles.serviceLabel}>CREAR MULTA</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.serviceCard} onPress={() => router.push('/detalles')}>
              <View style={[styles.iconLarge, { backgroundColor: '#10b981' }]}>
                <Truck size={20} color="white" />
              </View>
              <Text style={styles.serviceLabel}>PEDIR GRÚA</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.serviceCard} onPress={() => router.push('/evidencia')}>
              <View style={[styles.iconLarge, { backgroundColor: gobDorado }]}>
                <Camera size={20} color="white" />
              </View>
              <Text style={styles.serviceLabel}>EVIDENCIAS</Text>
            </TouchableOpacity>

          </View>
        </View>

        {/* Mis Atajos */}
        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionTitle, { color: gobVino }]}>MIS ATAJOS</Text>
          <View style={styles.grid2}>
            
            <TouchableOpacity style={styles.shortcutCard} onPress={() => router.push('/parquimetro')}>
              <View style={[styles.iconSmall, { backgroundColor: `${gobDorado}20` }]}>
                <Clock size={16} color={gobDorado} />
              </View>
              <View>
                <Text style={styles.shortcutMain}>PARQUÍMETRO</Text>
                <Text style={styles.shortcutSub}>Consultar Tiempo</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.shortcutCard, { opacity: 0.6 }]}>
              <View style={[styles.iconSmall, { backgroundColor: '#eff6ff' }]}>
                <Search size={16} color="#3b82f6" />
              </View>
              <View>
                <Text style={styles.shortcutMain}>ADEUDOS</Text>
                <Text style={styles.shortcutSub}>Estatus Historial</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.shortcutCard, { opacity: 0.6 }]}>
              <View style={[styles.iconSmall, { backgroundColor: '#fff1f2' }]}>
                <ShieldAlert size={16} color="#f43f5e" />
              </View>
              <View>
                <Text style={styles.shortcutMain}>ROBO</Text>
                <Text style={styles.shortcutSub}>Verificación SSC</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.shortcutCard, { opacity: 0.6 }]}>
              <View style={[styles.iconSmall, { backgroundColor: '#f9fafb' }]}>
                <BookOpen size={16} color="#4b5563" />
              </View>
              <View>
                <Text style={styles.shortcutMain}>REGLAMENTO</Text>
                <Text style={styles.shortcutSub}>Artículos</Text>
              </View>
            </TouchableOpacity>

          </View>
        </View>
      </ScrollView>

      {/* Tab Bar Inferior */}
      <View style={styles.tabBar}>
        <TouchableOpacity style={styles.tabItem}>
          <View style={[styles.tabIconActive, { backgroundColor: `${gobVino}15` }]}>
            <Clock size={18} color={gobVino} />
          </View>
          <Text style={[styles.tabText, { color: gobVino }]}>INICIO</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.tabItem}>
          <FileText size={18} color="#d1d5db" />
          <Text style={[styles.tabText, { color: '#d1d5db' }]}>SERVICIOS</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabItem}>
          <BookOpen size={18} color="#d1d5db" />
          <Text style={[styles.tabText, { color: '#d1d5db' }]}>FOLIOS</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabItem}>
          <User size={18} color="#d1d5db" />
          <Text style={[styles.tabText, { color: '#d1d5db' }]}>PERFIL</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  header: { padding: 16, paddingTop: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 3 },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  headerTitleContainer: { justifyContent: 'center' },
  headerTitle: { color: 'white', fontSize: 12, fontWeight: '900', letterSpacing: 0.5 },
  headerSubtitle: { color: 'white', fontSize: 8, opacity: 0.8, fontWeight: 'bold' },
  
  scrollContent: { padding: 20, paddingBottom: 100 },
  
  profileSection: { flexDirection: 'row', alignItems: 'center', gap: 16, marginVertical: 8 },
  avatarContainer: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#e5e7eb', borderWeight: 2, borderColor: 'white', alignItems: 'center', justifyContent: 'center', elevation: 2 },
  welcomeText: { fontSize: 18, fontWeight: '900' },
  idText: { fontSize: 10, color: '#9ca3af', fontWeight: 'bold', letterSpacing: 1 },

  filterContainer: { flexDirection: 'row', gap: 8, marginVertical: 16 },
  filterBtn: { px: 20, paddingHorizontal: 20, paddingVertical: 8, borderRadius: 20, elevation: 2 },
  filterBtnInactive: { paddingHorizontal: 20, paddingVertical: 8, borderRadius: 20, backgroundColor: '#f3f4f6' },
  filterTextActive: { color: 'white', fontSize: 10, fontWeight: '900' },
  filterTextInactive: { color: '#9ca3af', fontSize: 10, fontWeight: '900' },

  statusBox: { backgroundColor: '#ecfdf5', borderColor: '#d1fae5', borderWidth: 1, borderRadius: 16, padding: 12, flexDirection: 'row', alignItems: 'center', gap: 12 },
  statusDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#10b981' },
  statusText: { color: '#047857', fontSize: 9, fontWeight: '900', letterSpacing: 1 },

  sectionContainer: { marginTop: 24 },
  sectionTitle: { fontSize: 11, fontWeight: '900', letterSpacing: 1.5, marginBottom: 16, marginLeft: 4, fontStyle: 'italic' },
  
  grid3: { flexDirection: 'row', justifyContent: 'space-between' },
  serviceCard: { width: '30%', backgroundColor: 'white', borderRadius: 24, padding: 16, alignItems: 'center', gap: 12, elevation: 2, borderWidth: 1, borderColor: '#f3f4f6' },
  iconLarge: { width: 48, height: 48, borderRadius: 16, alignItems: 'center', justifyContent: 'center', elevation: 3 },
  serviceLabel: { fontSize: 9, fontWeight: '900', color: '#4b5563', textAlign: 'center' },

  grid2: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  shortcutCard: { width: '48%', backgroundColor: 'white', borderRadius: 16, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 12, elevation: 1, borderWidth: 1, borderColor: '#f3f4f6' },
  iconSmall: { width: 32, height: 32, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  shortcutMain: { fontSize: 10, fontWeight: '900', color: '#1f2937' },
  shortcutSub: { fontSize: 8, color: '#9ca3af', fontWeight: 'bold', marginTop: 2 },

  tabBar: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'white', borderTopWidth: 1, borderTopColor: '#f3f4f6', flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 32, paddingVertical: 12 },
  tabItem: { alignItems: 'center', gap: 4 },
  tabIconActive: { paddingHorizontal: 16, paddingVertical: 4, borderRadius: 20 },
  tabText: { fontSize: 9, fontWeight: '900' }
});