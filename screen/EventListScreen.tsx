import { List_event } from '@/services/event.service';
import React, { useContext, useEffect, useState } from 'react';
import { FlatList, ListRenderItem, Text, View } from 'react-native';
import { IconButton, useTheme } from 'react-native-paper';
import { Event } from '@/types/api.types';
import { useRouter } from 'expo-router';
import { AuthContext } from '@/context/AuthContext';
import { ROLE } from '@/constant/role';

export default function EventListScreen() {
  const [events, setEvents] = useState<Event[]>([]);
  const router = useRouter();
  const theme = useTheme();
  const { hasRole } = useContext(AuthContext);

  useEffect(() => {
    const fetchEvent = async () => {
      const data = await List_event();
      setEvents(data);
    };
    fetchEvent();
  }, []);

  const renderItem: ListRenderItem<Event> = ({ item }) => (
    <View
      style={[
        { padding: 12, marginBottom: 12, borderWidth: 1, borderRadius: 6 },
        { backgroundColor: theme.colors.surface, borderColor: theme.colors.outline },
      ]}
    >
      <Text style={{ fontWeight: 'bold', marginBottom: 4, color: theme.colors.onSurface }}>
        {item.name}
      </Text>
      <Text style={{ color: theme.colors.onSurface }}>{item.location}</Text>
      <Text style={{ color: theme.colors.onSurface }}>{item.price}€</Text>
    </View>
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
      </View>
    </>
  );
}
