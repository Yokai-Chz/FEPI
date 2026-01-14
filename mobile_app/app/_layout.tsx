import { Stack } from 'expo-router';
import { AuthProvider } from '../src/context/AuthContext';
import { InfraccionProvider } from '../src/context/InfraccionContext';

export default function Layout() {
  return (
    <AuthProvider>
      <InfraccionProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </InfraccionProvider>
    </AuthProvider>
  );
}