  import { List_event } from '@/services/event.service';
  import React, { useEffect, useState } from 'react';
  import { View, Text, FlatList, ListRenderItem, Pressable } from 'react-native';
  import type { APIEvent } from '@/types/api.types';
  import { Stack } from 'expo-router';
  import { useRouter } from 'expo-router';

  export default function EventListScreen() {
    const [events, setEvents] = useState<APIEvent[]>([]);
    const router = useRouter();

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
      <Text>{item.price}€</Text>
    </View>
  );

    return (
      <>
        <Stack.Screen
          options={{
            title: 'Événements',
            headerRight: () => (
              <Pressable
                onPress={() => router.push('/(tabs)/create_event')}
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: "50%",
                  borderWidth: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 12,
                }}
              >
                <Text style={{ fontSize: 20 }}>+</Text>
              </Pressable>
            ),
          }}
        />

        <View style={{ flex: 1, padding: 16 }}>
          <FlatList
            data={events}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
          />
        </View>
      </>
    );
  }
