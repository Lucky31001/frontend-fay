import React, { useEffect, useState } from 'react';
import { FlatList, ListRenderItem, Text, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import { COLOR } from '@/constant/color';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Event } from '@/types/types';
import { get_event } from '@/services/event';

export default function FollowScreen() {
  const [creator, setCreator] = useState<any[]>([]);
  const theme = useTheme();

  useEffect(() => {
    const fetchEvent = async () => {
      const data = await get_event();
      setCreator(data);
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
      {(() => {
        const theme = useTheme();
        return (
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              padding: 20,
              backgroundColor: theme.colors.background,
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 12,
              }}
            >
              <Ionicons name={'musical-notes-outline'} color={COLOR.BLUE} size={24} />
              <Text
                style={{
                  color: theme.colors.onSurface,
                  marginLeft: 8,
                  fontSize: 16,
                  fontWeight: '500',
                }}
              >
                {'Artistes à découvrir'}
              </Text>
            </View>
          </View>
        );
      })()}
    </>
  );
}
