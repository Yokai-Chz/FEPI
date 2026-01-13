import { Stack } from 'expo-router';
<<<<<<< HEAD
import { AuthProvider } from '../src/context/AuthContext';
=======
>>>>>>> c4ab953 (fetch,token)

export default function Layout() {
  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </AuthProvider>
  );
}