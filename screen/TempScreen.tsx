import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import {storage} from "@/utils/storage";

export default function TempScreen() {
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
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <Text style={{ fontSize: 20, marginBottom: 12 }}>Vous êtes connecté (temporaire)</Text>
      <TouchableOpacity
        onPress={logout}
        style={{
          backgroundColor: '#ef4444',
          paddingVertical: 12,
          paddingHorizontal: 20,
          borderRadius: 8,
        }}
      >
        <Text style={{ color: '#fff', fontWeight: '600' }}>Connected</Text>
      </TouchableOpacity>
    </View>
  );
}
