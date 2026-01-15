import { View, Text, TextInput, Pressable, Alert } from 'react-native';
import { router, Stack } from 'expo-router';
import { useState } from 'react';
import { create_event } from '@/services/create_event.service';

export default function CreateEventScreen() {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [price, setPrice] = useState('');
  const [link, setLink] = useState('');
  const [description, setDescription] = useState('');
  const [eventType, setEventType] = useState('');
  const [note, setNote] = useState('');
  const [capacity, setCapacity] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    if (!name || !location || !price || !link || !description || !eventType || !note || !capacity) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }
    console.log("eventType : ", eventType)

    const payload = {
      name,
      location,
      price,
      link,
      description,
      event_type: eventType,
      note,
      capacity,
    };

    try {
      setLoading(true);
      const data = await create_event(payload);
      if (data) {
        Alert.alert('Succès', "L'événement a été créé avec succès");
        router.push('/(tabs)/event_list');
      }
    } catch (err: any) {
      setLoading(false);
      Alert.alert('Erreur', err?.message || "Impossible de créer l'événement");
    }
  };

  return (
    <>
      <Stack.Screen options={{ title: 'Créer un événement' }} />

      <View style={{ padding: 16 }}>
        <Text style={{ marginBottom: 6, color: '#374151', fontWeight: '500' }}>Nom</Text>
        <TextInput
          placeholder="bal de promo"
          value={name}
          onChangeText={setName}
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
        <Text style={{ marginBottom: 6, color: '#374151', fontWeight: '500' }}>Localisation</Text>
        <TextInput
          placeholder="Paris, France"
          value={location}
          onChangeText={setLocation}
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

        <Text style={{ marginBottom: 6, color: '#374151', fontWeight: '500' }}>Prix</Text>
        <TextInput
          placeholder="10.00"
          value={price}
          onChangeText={(text) => {
            const numeric = text.replace(/[^0-9.]/g, '');
            setPrice(numeric);
          }}
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

        <Text style={{ marginBottom: 6, color: '#374151', fontWeight: '500' }}>lien</Text>
        <TextInput
          placeholder="http://example.com"
          value={link}
          onChangeText={setLink}
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

        <Text style={{ marginBottom: 6, color: '#374151', fontWeight: '500' }}>description</Text>
        <TextInput
          placeholder="Un événement génial ou il y aura plein de monde"
          value={description}
          onChangeText={setDescription}
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

        <Text style={{ marginBottom: 6, color: '#374151', fontWeight: '500' }}>
          type d'événement
        </Text>
        <TextInput
          placeholder="Fun"
          value={eventType}
          onChangeText={setEventType}
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

        <Text style={{ marginBottom: 6, color: '#374151', fontWeight: '500' }}>note</Text>
        <TextInput
          placeholder="note sur 5"
          value={note}
          onChangeText={(text) => {
            const numeric = text.replace(/[^0-9.]/g, '');
            setNote(numeric);
          }}
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

        <Text style={{ marginBottom: 6, color: '#374151', fontWeight: '500' }}>capacité</Text>
        <TextInput
          placeholder="100 personnes"
          value={capacity}
          onChangeText={(text) => {
            const numeric = text.replace(/[^0-9]/g, '');
            setCapacity(numeric);
          }}
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
            {loading ? 'En cours...' : 'Créer l\u2019événement'}
          </Text>
        </Pressable>
      </View>
    </>
  );
}
