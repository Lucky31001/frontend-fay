import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Alert, Switch, TouchableOpacity, Pressable } from 'react-native';
import { useTheme } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { register } from '@/services/auth';
import { AuthContext } from '@/context/AuthContext';
import { ROLE } from '@/constant/role';

export default function RegisterScreen() {
  const router = useRouter();
  const { signIn } = useContext(AuthContext);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isCreator, setIsCreator] = useState(false);
  const [loading, setLoading] = useState(false);

  const validatePassword = (pwd: string) => {
    const rules = {
      minLength: pwd.length >= 8,
      hasUpper: /[A-Z]/.test(pwd),
      hasLower: /[a-z]/.test(pwd),
      hasNumber: /[0-9]/.test(pwd),
      hasSpecial: /[^A-Za-z0-9]/.test(pwd),
    };
    const valid = Object.values(rules).every(Boolean);
    return { valid, rules };
  };

  const pwdCheck = validatePassword(password);

  const onSubmit = async () => {
    if (!username || !email || !password) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    if (!pwdCheck.valid) {
      Alert.alert(
        'Mot de passe invalide',
        'Votre mot de passe doit respecter les règles indiquées.',
      );
      return;
    }

    const payload = {
      username,
      email,
      password,
      role: isCreator ? ROLE.CREATOR : ROLE.USER,
    };

    try {
      setLoading(true);
      const data = await register(payload);
      if (data && data.access_token) {
        await signIn(data.access_token, data.refresh_token);
      }
    } catch (err: any) {
      Alert.alert('Erreur', err?.message || "Impossible de s'inscrire");
    } finally {
      setLoading(false);
    }
  };

  const theme = useTheme();

  const renderRule = (ok: boolean, label: string) => (
    <Text
      style={{
        color: ok ? theme.colors.primary : theme.colors.error,
        fontSize: 13,
        marginBottom: 4,
      }}
    >
      {ok ? '✓' : '✕'} {label}
    </Text>
  );

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
          shadowOpacity: 0.1,
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
          Créer un compte
        </Text>

        <Text style={{ marginBottom: 6, color: theme.colors.onSurface, fontWeight: '500' }}>
          Nom d ’utilisateur
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
          Email
        </Text>
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
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
        <TextInput
          placeholder="Mot de passe"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholderTextColor={theme.colors.onSurface}
          keyboardAppearance={theme.dark ? 'dark' : 'light'}
          style={{
            borderWidth: 1,
            borderColor: theme.colors.outline || '#e6e9ef',
            padding: 12,
            borderRadius: 8,
            marginBottom: 10,
            backgroundColor: theme.colors.surface,
            color: theme.colors.onSurface,
          }}
        />

        <View style={{ marginBottom: 12 }}>
          {renderRule(pwdCheck.rules.minLength, 'Au moins 8 caractères')}
          {renderRule(pwdCheck.rules.hasUpper, 'Au moins une lettre majuscule')}
          {renderRule(pwdCheck.rules.hasLower, 'Au moins une lettre minuscule')}
          {renderRule(pwdCheck.rules.hasNumber, 'Au moins un chiffre')}
          {renderRule(pwdCheck.rules.hasSpecial, 'Au moins un caractère spécial')}
        </View>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 16,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ marginRight: 10, color: theme.colors.onSurface }}>Role utilisateur</Text>
            <Switch value={isCreator} onValueChange={setIsCreator} />
          </View>

          <Text style={{ color: theme.colors.onSurface }}>{isCreator ? 'CREATOR' : 'USER'}</Text>
        </View>

        <Pressable
          onPress={onSubmit}
          disabled={loading}
          style={({ pressed }) => ({
            backgroundColor: loading
              ? theme.colors.primary || '#a5c6ff'
              : pressed
                ? theme.colors.primary
                : theme.colors.primary,
            paddingVertical: 12,
            borderRadius: 8,
            alignItems: 'center',
            marginBottom: 12,
            opacity: loading ? 0.7 : 1,
          })}
        >
          <Text style={{ color: theme.colors.onPrimary || '#fff', fontWeight: '600' }}>
            {loading ? 'En cours...' : 'S\u2019inscrire'}
          </Text>
        </Pressable>

        <View style={{ alignItems: 'center' }}>
          <Text style={{ color: theme.colors.outline || '#6b7280', marginBottom: 8 }}>
            Déjà un compte ?
          </Text>
          <TouchableOpacity onPress={() => router.replace('/login')}>
            <Text style={{ color: theme.colors.primary, fontWeight: '600' }}>Connection</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
