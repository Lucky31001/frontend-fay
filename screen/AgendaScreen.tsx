import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { storage } from '@/utils/storage';
import { useTheme } from 'react-native-paper';

export default function AgendaScreen() {
  const router = useRouter();

  const logout = async () => {
    try {
      storage.removeItem('access_token');
      storage.removeItem('refresh_token');
      Alert.alert('Déconnecté');

      router.replace('/login');
    } catch (err: any) {
      Alert.alert('Erreur', err?.message || 'Impossible de se déconnecter');
    }
  };

  return (
    <>
      {(() => {
        const theme = useTheme();
        return (
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              padding: 20,
              backgroundColor: theme.colors.background,
            }}
          >
            <Text style={{ fontSize: 20, marginBottom: 12, color: theme.colors.onSurface }}>
              Vous êtes connecté (temporaire)
            </Text>
            <TouchableOpacity
              onPress={logout}
              style={{
                backgroundColor: theme.colors.error || '#ef4444',
                paddingVertical: 12,
                paddingHorizontal: 20,
                borderRadius: 8,
              }}
            >
              <Text style={{ color: theme.colors.onError || '#fff', fontWeight: '600' }}>
                Connected
              </Text>
            </TouchableOpacity>
          </View>
        );
      })()}
    </>
  );
}
