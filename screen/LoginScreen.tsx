import React, { useContext, useState } from 'react';
import { Alert, Pressable, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { login } from '@/services/auth';
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
      if (data && data.access_token) {
        await signIn(data.access_token, data.refresh_token);
      }
      router.push('/(tabs)/agenda');
    } catch (_err: any) {
      console.error(_err);
      Alert.alert('Erreur', 'Impossible de se connecter');
    } finally {
      setLoading(false);
    }
  };

  const theme = useTheme();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
      }}
    >
      <View
        style={{
          width: '100%',
          maxWidth: 420,
          backgroundColor: theme.colors.surface,
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
            color: theme.colors.onSurface,
          }}
        >
          Bienvenue
        </Text>

        <Text style={{ marginBottom: 6, color: theme.colors.onSurface, fontWeight: '500' }}>
          Nom d’utilisateur
        </Text>
        <TextInput
          placeholder="Nom d'utilisateur"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          placeholderTextColor={theme.colors.onSurface}
          keyboardAppearance={theme.dark ? 'dark' : 'light'}
          style={{
            borderWidth: 1,
            borderColor: theme.colors.outline || '#e6e9ef',
            padding: 12,
            borderRadius: 8,
            marginBottom: 12,
            backgroundColor: theme.colors.surface,
            color: theme.colors.onSurface,
          }}
        />

        <Text style={{ marginBottom: 6, color: theme.colors.onSurface, fontWeight: '500' }}>
          Mot de passe
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
          <TextInput
            placeholder="Mot de passe"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            placeholderTextColor={theme.colors.onSurface}
            keyboardAppearance={theme.dark ? 'dark' : 'light'}
            style={{
              flex: 1,
              borderWidth: 1,
              borderColor: theme.colors.outline || '#e6e9ef',
              padding: 12,
              borderRadius: 8,
              backgroundColor: theme.colors.surface,
              color: theme.colors.onSurface,
            }}
          />
          <Pressable onPress={() => setShowPassword((s) => !s)} style={{ marginLeft: 8 }}>
            <Text style={{ color: theme.colors.primary, fontWeight: '600' }}>
              {showPassword ? 'Masquer' : 'Afficher'}
            </Text>
          </Pressable>
        </View>

        {pwdTooShort ? (
          <Text style={{ color: theme.colors.error, marginBottom: 8 }}>
            Le mot de passe est trop court (minimum 8 caractères)
          </Text>
        ) : null}

        <TouchableOpacity
          onPress={onSubmit}
          disabled={loading}
          style={{
            backgroundColor: loading ? theme.colors.primary || '#a5c6ff' : theme.colors.primary,
            paddingVertical: 12,
            borderRadius: 8,
            alignItems: 'center',
            marginBottom: 12,
          }}
        >
          <Text style={{ color: theme.colors.onPrimary || '#fff', fontWeight: '600' }}>
            {loading ? 'En cours...' : 'Se connecter'}
          </Text>
        </TouchableOpacity>

        <View style={{ alignItems: 'center' }}>
          <Text style={{ color: theme.colors.outline || '#6b7280', marginBottom: 8 }}>
            Pas encore de compte ?
          </Text>
          <TouchableOpacity onPress={() => router.replace('/')}>
            <Text style={{ color: theme.colors.primary, fontWeight: '600' }}>Inscription</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
