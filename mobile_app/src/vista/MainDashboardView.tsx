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
import OfficialProfile from '../../components/OfficialProfile';
import ServiceCard from '../../components/ServiceCard';
import ShortcutCard from '../../components/ShortcutCard';
import { useAuth } from '../context/AuthContext';

export default function MainDashboardView() {
  const router = useRouter();
  const { user } = useAuth();
  
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
        <OfficialProfile 
          nombre={user?.name || 'Oficial'} 
          id={user?.id || '----'} 
          sector={user?.sector || 'SIN SECTOR'} 
        />

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
            
            <ServiceCard 
              label="CREAR MULTA"
              icon={FileText}
              bgColor={gobVino}
              onPress={() => router.push('/nueva-infraccion')}
            />

            <ServiceCard 
              label="PEDIR GRÚA"
              icon={Truck}
              bgColor="#10b981"
              onPress={() => router.push('/detalles')}
            />

            <ServiceCard 
              label="EVIDENCIAS"
              icon={Camera}
              bgColor={gobDorado}
              onPress={() => router.push('/evidencia')}
            />

          </View>
        </View>

        {/* Mis Atajos */}
        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionTitle, { color: gobVino }]}>MIS ATAJOS</Text>
          <View style={styles.grid2}>
            
            <ShortcutCard 
              title="PARQUÍMETRO"
              subtitle="Consultar Tiempo"
              icon={Clock}
              iconColor={gobDorado}
              iconBgColor={`${gobDorado}20`}
              onPress={() => router.push('/parquimetro')}
            />

            <ShortcutCard 
              title="ADEUDOS"
              subtitle="Estatus Historial"
              icon={Search}
              iconColor="#3b82f6"
              iconBgColor="#eff6ff"
              disabled={true}
            />

            <ShortcutCard 
              title="ROBO"
              subtitle="Verificación SSC"
              icon={ShieldAlert}
              iconColor="#f43f5e"
              iconBgColor="#fff1f2"
              disabled={true}
            />

            <ShortcutCard 
              title="REGLAMENTO"
              subtitle="Artículos"
              icon={BookOpen}
              iconColor="#4b5563"
              iconBgColor="#f9fafb"
              disabled={true}
            />

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

  grid2: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },

  tabBar: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'white', borderTopWidth: 1, borderTopColor: '#f3f4f6', flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 32, paddingVertical: 12 },
  tabItem: { alignItems: 'center', gap: 4 },
  tabIconActive: { paddingHorizontal: 16, paddingVertical: 4, borderRadius: 20 },
  tabText: { fontSize: 9, fontWeight: '900' }
});