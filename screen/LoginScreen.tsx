import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Alert, TouchableOpacity, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { login } from '@/services/auth.service';
import { AuthContext } from '@/context/AuthContext';

export default function LoginScreen() {
  const router = useRouter();
  const { signIn } = useContext(AuthContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const pwdTooShort = password.length > 0 && password.length < 8;

  const onSubmit = async () => {
    if (!username || !password) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    try {
      setLoading(true);
      const payload = { username, password } as any;
      const data = await login(payload);
      if (data && data.access) {
        await signIn(data.access, data.refresh_token);
      }
    } catch (err: any) {
      Alert.alert('Erreur', err?.message || 'Impossible de se connecter');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#f6f8fb',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
      }}
    >
      <View
        style={{
          width: '100%',
          maxWidth: 420,
          backgroundColor: '#fff',
          borderRadius: 12,
          padding: 20,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.08,
          shadowRadius: 8,
          elevation: 4,
        }}
      >
        <Text
          style={{
            fontSize: 22,
            fontWeight: '600',
            marginBottom: 14,
            textAlign: 'center',
            color: '#111827',
          }}
        >
          Bienvenue
        </Text>

        <Text style={{ marginBottom: 6, color: '#374151', fontWeight: '500' }}>
          Nom d'utilisateur
        </Text>
        <TextInput
          placeholder="Nom d'utilisateur"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          style={{
            borderWidth: 1,
            borderColor: '#e6e9ef',
            padding: 12,
            borderRadius: 8,
            marginBottom: 12,
            backgroundColor: '#fafafa',
          }}
        />

        <Text style={{ marginBottom: 6, color: '#374151', fontWeight: '500' }}>Mot de passe</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
          <TextInput
            placeholder="Mot de passe"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            style={{
              flex: 1,
              borderWidth: 1,
              borderColor: '#e6e9ef',
              padding: 12,
              borderRadius: 8,
              backgroundColor: '#fafafa',
            }}
          />
          <Pressable onPress={() => setShowPassword((s) => !s)} style={{ marginLeft: 8 }}>
            <Text style={{ color: '#2563eb', fontWeight: '600' }}>
              {showPassword ? 'Masquer' : 'Afficher'}
            </Text>
          </Pressable>
        </View>

        {pwdTooShort ? (
          <Text style={{ color: '#ef4444', marginBottom: 8 }}>
            Le mot de passe est trop court (minimum 8 caractères)
          </Text>
        ) : null}

        <TouchableOpacity
          onPress={onSubmit}
          disabled={loading}
          style={{
            backgroundColor: loading ? '#a5c6ff' : '#2563eb',
            paddingVertical: 12,
            borderRadius: 8,
            alignItems: 'center',
            marginBottom: 12,
          }}
        >
          <Text style={{ color: '#fff', fontWeight: '600' }}>
            {loading ? 'En cours...' : 'Se connecter'}
          </Text>
        </TouchableOpacity>

        <View style={{ alignItems: 'center' }}>
          <Text style={{ color: '#6b7280', marginBottom: 8 }}>Pas encore de compte ?</Text>
          <TouchableOpacity onPress={() => router.replace('/')}>
            <Text style={{ color: '#2563eb', fontWeight: '600' }}>Aller à l'inscription</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
