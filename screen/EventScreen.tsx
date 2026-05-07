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
import SelectEventTypeModal from '@/components/SelectEventTypeModal';

export default function EventScreen() {
  const [events, setEvents] = useState<Event[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<Event | null>(null);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [eventTypeModalVisible, setEventTypeModalVisible] = useState(false);
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

  const handleSelectedFilters = (selectedTypes: string[]) => {
    setActiveFilters(selectedTypes);
    setEventTypeModalVisible(false);
  };

  useFocusEffect(
    useCallback(() => {
      fetchEvents();
      
    }, [fetchEvents]),
  );

  const displayedEvents = activeFilters.length > 0
    ? events.filter(event => {
        const types = Array.isArray(event.event_type)
          ? event.event_type
          : event.event_type
          ? [event.event_type]
          : [];

        return types.some((type: any) =>
          activeFilters.includes(typeof type === 'string' ? type : type?.name ?? String(type))
        );
      })
    : events;

  const renderItem: ListRenderItem<Event> = ({ item }) => (
    <EventCard
      event={item}
      onPress={() => setSelected(item)}
    />
  );

  return (
    <>
      <View style={{ flex: 1, backgroundColor: theme.colors.background, padding: 16 }}>
        
        <View style={{ 
          flexDirection: 'row', 
          alignItems: 'center', 
          marginBottom: 16,
          gap: 8
        }}>
          {hasRole(ROLE.CREATOR) && (
            <IconButton
              icon="plus"
              mode="contained"
              containerColor={theme.colors.primaryContainer}
              onPress={() => router.push('/(tabs)/create_event')}
              size={24}
              style={{ margin: 0 }} 
            />
          )}
          <Button 
            mode="contained" 
            onPress={() => setEventTypeModalVisible(true)}
            style={{ flex: 1 }}
            icon="filter-variant"
          >
            {activeFilters.length > 0 ? `Filtrer (${activeFilters.length})` : "Filtrer par type"}
          </Button>
        </View>

        <FlatList
          data={displayedEvents}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
          ListEmptyComponent={
            error ? (
              <View style={{ alignItems: 'center', marginTop: 24 }}>
                <Text style={{ color: theme.colors.onSurface, marginBottom: 12 }}>{error}</Text>
                <Button mode="contained" onPress={() => fetchEvents()}>
                  Réessayer
                </Button>
              </View>
            ) : null
          }
        />
      </View>

      <SelectEventTypeModal 
        visible={eventTypeModalVisible} 
        onClose={() => setEventTypeModalVisible(false)}
        onSelect={handleSelectedFilters}
      />

      <EventDetailsModal 
        visible={!!selected} 
        event={selected} 
        onClose={() => setSelected(null)} 
      />
    </>
  );
}