import React from 'react';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { Stack } from 'expo-router';
import { useTheme } from 'react-native-paper';
import Toast from "react-native-toast-message";

export default function RootLayout() {
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
