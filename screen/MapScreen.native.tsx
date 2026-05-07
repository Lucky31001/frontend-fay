import React, { useEffect, useState, useCallback } from 'react';
import MapView, { Marker } from 'react-native-maps';
import { View, ActivityIndicator } from 'react-native';
import { useTheme } from 'react-native-paper';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { get_event } from '@/services/event';
import { Event } from '@/types/types';
import EventDetailsModal from '@/components/EventDetailsModal';
import { useFocusEffect } from '@react-navigation/native';

const EventMarker = ({ event, onPress }: { event: Event; onPress: (e: Event) => void }) => {
  const [coords, setCoords] = useState<{ latitude: number; longitude: number } | null>(null);

  useEffect(() => {
    (async () => {
      const result = await Location.geocodeAsync(event.location);
      if (result.length > 0) {
        setCoords({
          latitude: result[0].latitude,
          longitude: result[0].longitude,
        });
      }
    })();
  }, [event.location]);

  if (!coords) return null;

  return (
    <Marker
      coordinate={coords}
      title={event.name}
      onPress={(e) => {
        e.stopPropagation();
        onPress(event);
      }}
    >
      <Ionicons name="location" size={30} color="red" />
    </Marker>
  );
};

export default function MapScreenNative() {
  const [location, setLocation] = useState<Location.LocationObjectCoords | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [events, setEvents] = useState<Event[]>([]);
  const [selected, setSelected] = useState<Event | null>(null);
  const theme = useTheme();

  useFocusEffect(
    useCallback(() => {
      const fetchEvents = async () => {
        const data = await get_event();
        setEvents(data || []);
      };

      fetchEvents();

      return () => {
      };
    }, []),
  );

  useEffect(() => {
    const fetchEvents = async () => {
      const data = await get_event();
      setEvents(data || []);
    };
    fetchEvents();
  }, []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        if (mounted) setErrorMsg('Permission refusée');
        return;
      }
      const sub = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.High, distanceInterval: 5 },
        (loc) => {
          if (mounted) setLocation(loc.coords);
        },
      );
      return () => {
        mounted = false;
        sub.remove();
      };
    })();
  }, []);

  if (errorMsg || !location) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: theme.colors.background,
        }}
      >
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={{ flex: 1 }}
        initialRegion={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        <Marker coordinate={location} anchor={{ x: 0.5, y: 1 }}>
          <Ionicons name="man-outline" size={32} color="yellow" />
        </Marker>

        {events.map((event, index) => (
          <EventMarker key={event.id || index} event={event} onPress={(ev) => setSelected(ev)} />
        ))}
      </MapView>
      <EventDetailsModal visible={!!selected} event={selected} onClose={() => setSelected(null)} />
    </View>
  );
}
