import React, { useContext } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { AuthProvider, AuthContext } from '@/context/AuthContext';
import { useRouter , Stack } from 'expo-router';

export default function RootLayout() {
  const { loading, isAuthenticated } = useContext(AuthContext);
  const router = useRouter();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (isAuthenticated) {
    router.replace('/(tabs)/home');
  }

  return (
    <AuthProvider>
      <Stack initialRouteName="index">
        <Stack.Screen name="index" options={{ headerShown: false, title: 'Register' }} />
        <Stack.Screen name="login" options={{ headerShown: false, title: 'Login' }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false, title: 'Nav' }} />
      </Stack>
    </AuthProvider>
  );
}
