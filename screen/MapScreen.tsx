import React, { useEffect, useState } from 'react';
import { View, Image, Text, ActivityIndicator } from 'react-native';
import { useTheme } from 'react-native-paper';
import * as Location from 'expo-location';

export default function MapScreen() {
  const [location, setLocation] = useState<Location.LocationObjectCoords | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const theme = useTheme();

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
        try {
          sub.remove();
        } catch (e) {
          // ignore
        }
      };
    })();
  }, []);

  if (errorMsg) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: theme.colors.background,
        }}
      >
        <Text style={{ color: theme.colors.onSurface }}>{errorMsg}</Text>
      </View>
    );
  }

  if (!location) {
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
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.colors.background,
      }}
    >
      <Text style={{ color: theme.colors.onSurface, marginBottom: 8 }}>
        Carte non disponible sur le web
      </Text>
      <Image
        source={require('../assets/images/location-pin.png')}
        style={{ width: 48, height: 48, tintColor: theme.colors.error }}
        resizeMode="contain"
      />
      <Text style={{ marginTop: 8, color: theme.colors.onSurface }}>
        Latitude: {location.latitude.toFixed(6)}
      </Text>
      <Text style={{ color: theme.colors.onSurface }}>
        Longitude: {location.longitude.toFixed(6)}
      </Text>
    </View>
  );
}
