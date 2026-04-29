import React, {useContext, useEffect} from 'react';
import { View, ActivityIndicator } from 'react-native';
import { AuthProvider, AuthContext } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';
import Header from '@/components/Header';
import Toast from 'react-native-toast-message';
import { useRouter, Stack } from 'expo-router';
import { useTheme } from 'react-native-paper';

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

    useEffect(() => {
        if (!loading && isAuthenticated) {
            router.replace('/(tabs)/agenda');
        }
    }, [loading, isAuthenticated]);

  return (
    <AuthProvider>
      <ThemeProvider>
        <LayoutContent />
      </ThemeProvider>
    </AuthProvider>
  );
}

function LayoutContent() {
  const theme = useTheme();
  return (
    <>
      <Toast />
      <Stack
        initialRouteName="login"
        screenOptions={{
          headerShown: false,
          headerStyle: { backgroundColor: theme.colors.surface },
          headerTintColor: theme.colors.onSurface,
          headerTitleStyle: { fontWeight: '600' },
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false, title: 'Register' }} />
        <Stack.Screen name="login" options={{ headerShown: false, title: 'Login' }} />
          <Stack.Screen name="profile" options={{ headerShown: false, title: 'Creation du profile' }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false, title: 'Nav' }} />
      </Stack>
    </>
  );
}
