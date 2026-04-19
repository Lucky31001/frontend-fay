import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { useTheme } from 'react-native-paper';
import { Event } from '@/types/types';

interface Props {
  event: Event;
  onPress?: () => void;
}

export default function EventCard({ event, onPress }: Props) {
  const theme = useTheme();
  const raw: any = event as any;

  const renderTypes = () => {
    const typesRaw: any = raw.event_types ?? raw.event_type ?? raw.eventTypes ?? [];
    let typesArr: string[] = [];
    if (Array.isArray(typesRaw))
      typesArr = typesRaw.map((t) => (typeof t === 'string' ? t : (t?.name ?? String(t))));
    else if (typeof typesRaw === 'string') {
      try {
        const parsed = JSON.parse(typesRaw);
        if (Array.isArray(parsed))
          typesArr = parsed.map((t) => (typeof t === 'string' ? t : (t?.name ?? String(t))));
        else typesArr = [typesRaw];
      } catch (e) {
        typesArr = [typesRaw];
      }
    } else if (typesRaw && typeof typesRaw === 'object')
      typesArr = [typesRaw.name ?? String(typesRaw)];

    return typesArr.slice(0, 3).map((t) => (
      <View
        key={t}
        style={{
          backgroundColor: 'rgba(0,0,0,0.6)',
          paddingHorizontal: 8,
          paddingVertical: 4,
          borderRadius: 12,
          marginRight: 6,
          marginBottom: 6,
        }}
      >
        <Text style={{ color: '#fff', fontSize: 12 }}>{t}</Text>
      </View>
    ));
  };

  return (
    <TouchableOpacity activeOpacity={0.9} onPress={onPress} style={{ marginBottom: 12 }}>
      <View
        style={[
          { borderWidth: 1, borderRadius: 8, overflow: 'hidden' },
          { backgroundColor: theme.colors.surface, borderColor: theme.colors.outline },
        ]}
      >
        {raw.image ? (
          <View style={{ position: 'relative' }}>
            <Image
              source={{ uri: raw.image }}
              style={{ width: '100%', height: 140, resizeMode: 'cover' }}
            />
            <View
              style={{
                position: 'absolute',
                left: 8,
                top: 8,
                flexDirection: 'row',
                flexWrap: 'wrap',
              }}
            >
              {renderTypes()}
            </View>
          </View>
        ) : null}

        <View style={{ padding: 12 }}>
          <Text style={{ fontWeight: '700', marginBottom: 6, color: theme.colors.onSurface }}>
            {raw.name}
          </Text>
          <Text style={{ color: theme.colors.onSurface, marginBottom: 4 }}>{raw.location}</Text>
          <Text style={{ color: theme.colors.onSurface }}>{raw.price}€</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
