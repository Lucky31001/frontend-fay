import React, { useContext } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { AuthProvider, AuthContext } from '@/context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { Stack } from 'expo-router';

export default function RootLayout() {
    const { loading, isAuthenticated } = useContext(AuthContext);
    const navigation = useNavigation();


    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    if (isAuthenticated) {
        navigation.reset({ index: 0, routes: [{ name: 'home' as never }] });
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
