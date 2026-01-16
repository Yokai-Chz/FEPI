import React, { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/auth.service';

export default function ChangePasswordView() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChangePassword = async () => {
    if (!newPassword || !confirmPassword) {
      setError('Por favor, complete todos los campos');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (newPassword.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
        // TODO: Implement change password service
        await authService.changePassword(user?.id || '', newPassword);
        setSuccess(true);
    } catch (err: any) {
        setError(err.message || 'Error al cambiar la contraseña');
    } finally {
        setIsLoading(false);
    }
  };

  const handleSuccessContinue = () => {
    // Navigate to dashboard or require login again?
    // Usually if we just changed password, we might be good to go to dashboard if the token is still valid,
    // or we might need to re-login.
    // Assuming we can go to dashboard.
    router.replace('/dashboard');
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
            <Text style={styles.mainTitle}>SEGURIDAD</Text>
            <Text style={styles.subTitle}>ACTUALIZACIÓN DE CONTRASEÑA</Text>
          </View>

          {/* Tarjeta Blanca */}
          <View style={styles.card}>
            <Text style={styles.welcomeTitle}>Cambio de Contraseña</Text>
            <Text style={styles.welcomeSub}>Es necesario actualizar su contraseña para continuar.</Text>

            {/* Mensaje de Error */}
            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            {/* Input Nueva Contraseña */}
            <View style={styles.inputWrapper}>
              <Text style={styles.label}>NUEVA CONTRASEÑA</Text>
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
                  value={newPassword}
                  onChangeText={setNewPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Image 
                    source={require('../../assets/images/icon_ojo.png')} 
                    style={styles.eyeIcon} 
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Input Confirmar Contraseña */}
            <View style={styles.inputWrapper}>
              <Text style={styles.label}>CONFIRMAR CONTRASEÑA</Text>
              <View style={styles.inputContainer}>
                <Image 
                  source={require('../../assets/images/icon_candado.png')} 
                  style={styles.inputIcon} 
                />
                <TextInput 
                  placeholder="••••••••"
                  placeholderTextColor="#9ca3af"
                  secureTextEntry={!showConfirmPassword}
                  style={styles.input}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                />
                <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                  <Image 
                    source={require('../../assets/images/icon_ojo.png')} 
                    style={styles.eyeIcon} 
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Botón Actualizar */}
            <TouchableOpacity 
              style={[styles.button, isLoading && styles.buttonDisabled]} 
              onPress={handleChangePassword}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.buttonText}>ACTUALIZAR CONTRASEÑA</Text>
              )}
            </TouchableOpacity>
            
            <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => signOut()}
            >
                <Text style={styles.cancelButtonText}>CANCELAR Y SALIR</Text>
            </TouchableOpacity>

          </View>

          {/* Modal de Éxito */}
          <Modal
            animationType="fade"
            transparent={true}
            visible={success}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <View style={styles.successIconContainer}>
                    {/* Placeholder check icon */}
                    <Text style={{fontSize: 30, color: 'white'}}>✓</Text>
                </View>
                <Text style={styles.modalTitle}>¡Contraseña Actualizada!</Text>
                <Text style={styles.modalText}>
                  Su contraseña ha sido cambiada exitosamente.
                </Text>
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={handleSuccessContinue}
                >
                  <Text style={styles.modalButtonText}>CONTINUAR</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

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
  mainTitle: { color: 'white', fontSize: 28, fontWeight: 'bold', letterSpacing: 4 },
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
  
  cancelButton: { marginTop: 16, paddingVertical: 12, alignItems: 'center' },
  cancelButtonText: { color: '#9ca3af', fontWeight: 'bold', fontSize: 12, letterSpacing: 1 },

  footer: { backgroundColor: 'white', paddingBottom: 24, alignItems: 'center' },
  footerText: { color: '#d1d5db', fontSize: 9, fontWeight: 'bold', letterSpacing: 1 },
  footerBar: { width: 48, height: 4, backgroundColor: '#f3f4f6', borderRadius: 2, marginTop: 12 },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  successIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  modalButton: {
    backgroundColor: '#691C32',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  }
});
