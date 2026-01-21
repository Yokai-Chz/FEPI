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
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/auth.service';
import LoginHeader from '../../components/auth/LoginHeader';
import AuthInput from '../../components/auth/AuthInput';
import AuthButton from '../../components/auth/AuthButton';
import AuthModal from '../../components/auth/AuthModal';
import { COLORS } from '../../constants/theme';

export default function ChangePasswordView() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
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
        await authService.changePassword(user?.id || '', newPassword);
        setSuccess(true);
    } catch (err: any) {
        setError(err.message || 'Error al cambiar la contraseña');
    } finally {
        setIsLoading(false);
    }
  };

  const handleSuccessContinue = () => {
    router.replace('/dashboard');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
          style={styles.flex1}
        >
          
          <LoginHeader 
            title="SEGURIDAD" 
            subtitle="ACTUALIZACIÓN DE CONTRASEÑA" 
          />

          {/* Tarjeta Blanca */}
          <View style={styles.card}>
            <Text style={styles.welcomeTitle}>Cambio de Contraseña</Text>
            <Text style={styles.welcomeSub}>Es necesario actualizar su contraseña para continuar.</Text>

            {/* Mensaje de Error */}
            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <AuthInput 
              label="NUEVA CONTRASEÑA"
              placeholder="••••••••"
              value={newPassword}
              onChangeText={setNewPassword}
              iconSource={require('../../assets/images/icon_candado.png')}
              isPassword={true}
            />

            <AuthInput 
              label="CONFIRMAR CONTRASEÑA"
              placeholder="••••••••"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              iconSource={require('../../assets/images/icon_candado.png')}
              isPassword={true}
            />

            <AuthButton 
              text="ACTUALIZAR CONTRASEÑA"
              onPress={handleChangePassword}
              isLoading={isLoading}
            />
            
            <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => signOut()}
            >
                <Text style={styles.cancelButtonText}>CANCELAR Y SALIR</Text>
            </TouchableOpacity>

          </View>

          <AuthModal 
            visible={success}
            onAction={handleSuccessContinue}
            title="¡Contraseña Actualizada!"
            message="Su contraseña ha sido cambiada exitosamente."
            type="success"
          />

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
  container: { flex: 1, backgroundColor: COLORS.primary },
  flex1: { flex: 1 },
  
  card: { flex: 1, backgroundColor: 'white', borderTopLeftRadius: 45, borderTopRightRadius: 45, paddingHorizontal: 32, paddingTop: 48 },
  welcomeTitle: { fontSize: 24, fontWeight: 'bold', color: '#1f2937' },
  welcomeSub: { color: '#9ca3af', fontSize: 14, marginBottom: 32 },

  errorText: { color: COLORS.error, fontSize: 12, marginBottom: 16, fontWeight: 'bold', textAlign: 'center' },

  cancelButton: { marginTop: 16, paddingVertical: 12, alignItems: 'center' },
  cancelButtonText: { color: '#9ca3af', fontWeight: 'bold', fontSize: 12, letterSpacing: 1 },

  footer: { backgroundColor: 'white', paddingBottom: 24, alignItems: 'center' },
  footerText: { color: '#d1d5db', fontSize: 9, fontWeight: 'bold', letterSpacing: 1 },
  footerBar: { width: 48, height: 4, backgroundColor: '#f3f4f6', borderRadius: 2, marginTop: 12 },
});
