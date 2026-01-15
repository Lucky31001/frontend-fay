import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Alert, Switch, TouchableOpacity, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { register } from '@/services/auth.service';
import { AuthContext } from '@/context/AuthContext';

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
      role: isCreator ? 'CREATOR' : 'USER',
    };

    try {
      setLoading(true);
      const data = await register(payload);
      if (data && data.access_token) {
        await signIn(data.access_token, data.refresh_token);
        router.push('/(tabs)/home');
      }
    } catch (err: any) {
      Alert.alert('Erreur', err?.message || "Impossible de s'inscrire");
    } finally {
      setLoading(false);
    }
  };

  const renderRule = (ok: boolean, label: string) => (
    <Text style={{ color: ok ? '#10b981' : '#ef4444', fontSize: 13, marginBottom: 4 }}>
      {ok ? '✓' : '✕'} {label}
    </Text>
  );

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
            color: '#111827',
          }}
        >
          Créer un compte
        </Text>

        <Text style={{ marginBottom: 6, color: '#374151', fontWeight: '500' }}>
          Nom d ’utilisateur
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

        <Text style={{ marginBottom: 6, color: '#374151', fontWeight: '500' }}>Email</Text>
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
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
        <TextInput
          placeholder="Mot de passe"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={{
            borderWidth: 1,
            borderColor: '#e6e9ef',
            padding: 12,
            borderRadius: 8,
            marginBottom: 10,
            backgroundColor: '#fafafa',
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
            <Text style={{ marginRight: 10, color: '#374151' }}>Créateur</Text>
            <Switch value={isCreator} onValueChange={setIsCreator} />
          </View>

          <Text style={{ color: '#6b7280' }}>{isCreator ? 'CREATOR' : 'USER'}</Text>
        </View>

        <Pressable
          onPress={onSubmit}
          disabled={loading}
          style={({ pressed }) => ({
            backgroundColor: loading ? '#a5c6ff' : pressed ? '#1d4ed8' : '#2563eb',
            paddingVertical: 12,
            borderRadius: 8,
            alignItems: 'center',
            marginBottom: 12,
            opacity: loading ? 0.7 : 1,
          })}
        >
          <Text style={{ color: '#fff', fontWeight: '600' }}>
            {loading ? 'En cours...' : 'S\u2019inscrire'}
          </Text>
        </Pressable>

        <View style={{ alignItems: 'center' }}>
          <Text style={{ color: '#6b7280', marginBottom: 8 }}>Déjà un compte ?</Text>
          <TouchableOpacity onPress={() => router.replace('/login')}>
            <Text style={{ color: '#2563eb', fontWeight: '600' }}>Aller au login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
