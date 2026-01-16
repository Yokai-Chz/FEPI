import React, { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function LoginView() {
  const { signIn } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [placa, setPlaca] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const manejarLogin = async () => {
    if (!placa || !password) {
      setError('Por favor, ingrese sus credenciales');
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      await signIn({ username:placa, password });
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
          style={styles.flex1}
        >
          
          {/* Header con Logos */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <View style={styles.iconBox}>
                <Image 
                  source={require('../../assets/images/logo_gobierno.png')} 
                  style={styles.logoIcon} 
                  resizeMode="contain" 
                />
              </View>
              <Text style={styles.logoText}>GOBIERNO CDMX</Text>
            </View>

            <View style={styles.logoContainer}>
              <View style={styles.iconBox}>
                <Image 
                  source={require('../../assets/images/logo_ssc.png')} 
                  style={styles.logoIcon} 
                  resizeMode="contain" 
                />
              </View>
              <Text style={styles.logoText}>SECRETARÍA DE{'\n'}SEGURIDAD CIUDADANA</Text>
            </View>
          </View>

          {/* Titulo Central */}
          <View style={styles.centerTitleContainer}>
            <Text style={styles.mainTitle}>SSC</Text>
            <Text style={styles.subTitle}>CONTROL DE TRÁNSITO</Text>
          </View>

          {/* Tarjeta Blanca */}
          <View style={styles.card}>
            <Text style={styles.welcomeTitle}>Bienvenido</Text>
            <Text style={styles.welcomeSub}>Ingrese sus credenciales de oficial</Text>

            {/* Mensaje de Error */}
            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            {/* Input Placa */}
            <View style={styles.inputWrapper}>
              <Text style={styles.label}>NÚMERO DE PLACA / ID</Text>
              <View style={styles.inputContainer}>
                <Image 
                  source={require('../../assets/images/icon_user.png')} 
                  style={styles.inputIcon} 
                />
                <TextInput 
                  placeholder="982734"
                  placeholderTextColor="#9ca3af"
                  style={styles.input}
                  value={placa}
                  onChangeText={setPlaca}
                  autoCapitalize="none"
                />
              </View>
            </View>

            {/* Input Password */}
            <View style={styles.inputWrapper}>
              <Text style={styles.label}>CONTRASEÑA (NIP)</Text>
              <View style={styles.inputContainer}>
                <Image 
                  source={require('../../assets/images/icon_candado.png')} 
                  style={styles.inputIcon} 
                />
                <TextInput 
                  placeholder="••••••••"
                  placeholderTextColor="#9ca3af"
                  secureTextEntry={!showPassword}
                  style={styles.input}
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Image 
                    source={require('../../assets/images/icon_ojo.png')} 
                    style={styles.eyeIcon} 
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Botón Iniciar Turno */}
            <TouchableOpacity 
              style={[styles.button, isLoading && styles.buttonDisabled]} 
              onPress={manejarLogin}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.buttonText}>INICIAR TURNO</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity style={styles.forgotContainer}>
              <Text style={styles.forgotText}>¿OLVIDÓ SUS CREDENCIALES? CONTACTE A MESA DE CONTROL</Text>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>SECRETARÍA DE SEGURIDAD CIUDADANA</Text>
            <View style={styles.footerBar} />
          </View>

        </KeyboardAvoidingView>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#691C32' },
  flex1: { flex: 1 },
  header: { padding: 24, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  logoContainer: { alignItems: 'center' },
  iconBox: { width: 48, height: 48, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 4 },
  logoIcon: { width: 40, height: 40 },
  logoText: { color: 'white', fontSize: 9, fontWeight: 'bold', textAlign: 'center' },
  
  centerTitleContainer: { alignItems: 'center', marginTop: 16, marginBottom: 40 },
  mainTitle: { color: 'white', fontSize: 36, fontWeight: 'bold', letterSpacing: 8 },
  subTitle: { color: 'white', opacity: 0.8, fontSize: 10, letterSpacing: 2, marginTop: 4 },

  card: { flex: 1, backgroundColor: 'white', borderTopLeftRadius: 45, borderTopRightRadius: 45, paddingHorizontal: 32, paddingTop: 48 },
  welcomeTitle: { fontSize: 24, fontWeight: 'bold', color: '#1f2937' },
  welcomeSub: { color: '#9ca3af', fontSize: 14, marginBottom: 32 },

  errorText: { color: '#dc2626', fontSize: 12, marginBottom: 16, fontWeight: 'bold', textAlign: 'center' },

  inputWrapper: { marginBottom: 24 },
  label: { color: '#691C32', fontSize: 10, fontWeight: '900', letterSpacing: 1, marginBottom: 8 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f9fafb', borderWidth: 1, borderColor: '#f3f4f6', borderRadius: 16, paddingHorizontal: 16, paddingVertical: Platform.OS === 'ios' ? 16 : 8 },
  inputIcon: { width: 24, height: 24, opacity: 0.4, marginRight: 12 },
  input: { flex: 1, color: '#374151', fontWeight: 'bold', fontSize: 16 },
  eyeIcon: { width: 24, height: 24, opacity: 0.4 },

  button: { backgroundColor: '#691C32', paddingVertical: 18, borderRadius: 24, alignItems: 'center', marginTop: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 5, elevation: 5 },
  buttonDisabled: { opacity: 0.7 },
  buttonText: { color: 'white', fontWeight: 'bold', letterSpacing: 2, fontSize: 12 },

  forgotContainer: { marginTop: 40, alignItems: 'center', marginBottom: 20 },
  forgotText: { color: '#BC955C', fontSize: 10, fontWeight: 'bold', textAlign: 'center' },

  footer: { backgroundColor: 'white', paddingBottom: 24, alignItems: 'center' },
  footerText: { color: '#d1d5db', fontSize: 9, fontWeight: 'bold', letterSpacing: 1 },
  footerBar: { width: 48, height: 4, backgroundColor: '#f3f4f6', borderRadius: 2, marginTop: 12 }
});
