import { List_event } from '@/services/event.service';
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ListRenderItem, Pressable, StyleSheet } from 'react-native';
import { useTheme, IconButton } from 'react-native-paper';
import type { APIEvent } from '@/types/api.types';
import { Stack } from 'expo-router';
import { useRouter } from 'expo-router';

export default function EventListScreen() {
  const [events, setEvents] = useState<APIEvent[]>([]);
  const router = useRouter();
  const theme = useTheme();

  useEffect(() => {
    const fetchEvent = async () => {
      const data = await List_event();
      setEvents(data);
    };
    fetchEvent();
  }, []);

  const renderItem: ListRenderItem<APIEvent> = ({ item }) => (
    <View
      style={[
        styles.item,
        { backgroundColor: theme.colors.surface, borderColor: theme.colors.outline },
      ]}
    >
      <Text style={[styles.itemTitle, { color: theme.colors.onSurface }]}>{item.name}</Text>
      <Text style={{ color: theme.colors.onSurface }}>{item.location}</Text>
      <Text style={{ color: theme.colors.onSurface }}>{item.price}€</Text>
    </View>
  );

  return (
    <>
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <IconButton
          icon="plus"
          onPress={() => router.push('/(tabs)/create_event')}
          size={20}
          style={{ marginRight: 6 }}
        />
        <FlatList
          data={events}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  item: { padding: 12, marginBottom: 12, borderWidth: 1, borderRadius: 6 },
  itemTitle: { fontWeight: 'bold', marginBottom: 4 },
});
