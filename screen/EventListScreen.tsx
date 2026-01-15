import { List_event } from '@/services/event.service';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ListRenderItem } from 'react-native';
import type { APIEvent } from '@/types/api.types';

export default function EventListScreen() {
  const [events, setEvents] = useState<APIEvent[]>([]);

  useEffect(() => {
    const fetchEvent = async () => {
      const data = await List_event();
      setEvents(data);
    };
    fetchEvent();
  }, []);

  const renderItem: ListRenderItem<APIEvent> = ({ item }) => (
    <View style={{ padding: 12, marginBottom: 12, borderWidth: 1, borderRadius: 6 }}>
      <Text style={{ fontWeight: 'bold' }}>{item.name}</Text>
      <Text>{item.location}</Text>
      <Text>{item.price} €</Text>
    </View>
  );

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <FlatList data={events} keyExtractor={(item) => item.id.toString()} renderItem={renderItem} />
    </View>
  );
}
