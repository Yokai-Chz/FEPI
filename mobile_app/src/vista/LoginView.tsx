import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'expo-router';
import LoginHeader from '../../components/auth/LoginHeader';
import AuthInput from '../../components/auth/AuthInput';
import AuthButton from '../../components/auth/AuthButton';
import FirstLoginModal from '../../components/auth/FirstLoginModal';
import { COLORS, SPACING } from '../../constants/theme';

export default function LoginView() {
  const { signIn } = useAuth();
  const router = useRouter();
  const [placa, setPlaca] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showFirstLoginModal, setShowFirstLoginModal] = useState(false);

  const manejarLogin = async () => {
    if (!placa || !password) {
      setError('Por favor, ingrese sus credenciales');
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      const data = await signIn({ username:placa, password });
      if (data.primer_ingreso) {
        setShowFirstLoginModal(true);
      }
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFirstLoginContinue = () => {
    setShowFirstLoginModal(false);
    router.push('/change-password');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
          style={styles.flex1}
        >
          
          <LoginHeader />

          {/* Tarjeta Blanca */}
          <View style={styles.card}>
            <Text style={styles.welcomeTitle}>Bienvenido</Text>
            <Text style={styles.welcomeSub}>Ingrese sus credenciales de oficial</Text>

            {/* Mensaje de Error */}
            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <AuthInput 
              label="NÚMERO DE PLACA / ID"
              placeholder="982734"
              value={placa}
              onChangeText={setPlaca}
              iconSource={require('../../assets/images/icon_user.png')}
              autoCapitalize="none"
            />

            <AuthInput 
              label="CONTRASEÑA (NIP)"
              placeholder="••••••••"
              value={password}
              onChangeText={setPassword}
              iconSource={require('../../assets/images/icon_candado.png')}
              isPassword={true}
            />

            <AuthButton 
              text="INICIAR TURNO"
              onPress={manejarLogin}
              isLoading={isLoading}
            />

            <TouchableOpacity style={styles.forgotContainer}>
              <Text style={styles.forgotText}>¿OLVIDÓ SUS CREDENCIALES? CONTACTE A MESA DE CONTROL</Text>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>SECRETARÍA DE SEGURIDAD CIUDADANA</Text>
            <View style={styles.footerBar} />
          </View>

          <FirstLoginModal 
            visible={showFirstLoginModal}
            onContinue={handleFirstLoginContinue}
          />

        </KeyboardAvoidingView>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.primary },
  flex1: { flex: 1 },
  
  card: { flex: 1, backgroundColor: 'white', borderTopLeftRadius: 45, borderTopRightRadius: 45, paddingHorizontal: 32, paddingTop: 48 },
  welcomeTitle: { fontSize: 24, fontWeight: 'bold', color: '#1f2937' },
  welcomeSub: { color: '#9ca3af', fontSize: 14, marginBottom: 32 },

  errorText: { color: COLORS.error, fontSize: 12, marginBottom: 16, fontWeight: 'bold', textAlign: 'center' },

  forgotContainer: { marginTop: 40, alignItems: 'center', marginBottom: 20 },
  forgotText: { color: COLORS.secondary, fontSize: 10, fontWeight: 'bold', textAlign: 'center' },

  footer: { backgroundColor: 'white', paddingBottom: 24, alignItems: 'center' },
  footerText: { color: '#d1d5db', fontSize: 9, fontWeight: 'bold', letterSpacing: 1 },
  footerBar: { width: 48, height: 4, backgroundColor: '#f3f4f6', borderRadius: 2, marginTop: 12 },
});
