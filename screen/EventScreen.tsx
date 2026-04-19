import { get_event } from '@/services/event';
import React, { useCallback, useContext, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { FlatList, ListRenderItem, Text, View } from 'react-native';
import { IconButton, useTheme, Button } from 'react-native-paper';
import EventCard from '@/components/EventCard';
import { Event } from '@/types/types';
import { useRouter } from 'expo-router';
import { AuthContext } from '@/context/AuthContext';
import { ROLE } from '@/constant/role';
import EventDetailsModal from '@/components/EventDetailsModal';

export default function EventScreen() {
  const [events, setEvents] = useState<Event[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<Event | null>(null);
  const router = useRouter();
  const theme = useTheme();
  const { hasRole } = useContext(AuthContext);

  const fetchEvents = useCallback(async () => {
    try {
      setError(null);
      const data = await get_event();
      setEvents(data || []);
    } catch (err: any) {
      const message = err?.message || 'Erreur lors du chargement des événements';
      setEvents([]);
      setError(message);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchEvents();
    }, [fetchEvents]),
  );

  const renderItem: ListRenderItem<Event> = ({ item }) => (
    <EventCard
      event={item}
      onPress={() => {
        setSelected(item);
      }}
    />
  );

  return (
    <>
      <View style={{ flex: 1, padding: 16, backgroundColor: theme.colors.background }}>
        {hasRole(ROLE.CREATOR) && (
          <IconButton
            icon="plus"
            onPress={() => router.push('/(tabs)/create_event')}
            size={20}
            style={{ marginRight: 6 }}
          />
        )}
        <FlatList
          data={events}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
        />

        {events.length === 0 && error && (
          <View style={{ alignItems: 'center', marginTop: 24 }}>
            <Text style={{ color: theme.colors.onSurface, marginBottom: 12 }}>{error}</Text>
            <Button mode="contained" onPress={() => fetchEvents()}>
              Réessayer
            </Button>
          </View>
        )}
      </View>
      <EventDetailsModal visible={!!selected} event={selected} onClose={() => setSelected(null)} />
    </>
  );
}
