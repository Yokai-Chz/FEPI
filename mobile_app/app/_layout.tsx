import { Stack } from 'expo-router';
<<<<<<< HEAD
=======
<<<<<<< HEAD
import { AuthProvider } from '../src/context/AuthContext';
=======
>>>>>>> c4ab953 (fetch,token)
>>>>>>> fa95497e263def591906ea02f3a3383341e37251

export default function Layout() {
  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </AuthProvider>
  );
}