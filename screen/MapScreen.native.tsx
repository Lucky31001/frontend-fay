import React, { useEffect, useState } from 'react';
import MapView, { Marker } from 'react-native-maps';
import { View, Image, ActivityIndicator } from 'react-native';
import { useTheme } from 'react-native-paper';
import * as Location from 'expo-location';

export default function MapScreenNative() {
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
        } catch {
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
        <ActivityIndicator size="small" color={theme.colors.primary} />
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
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <MapView
        style={{ flex: 1 }}
        initialRegion={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        <Marker
          coordinate={{ latitude: location.latitude, longitude: location.longitude }}
          anchor={{ x: 0.5, y: 1 }}
        >
          <Image
            source={require('../assets/images/location-pin.png')}
            style={{ width: 32, height: 32 }}
            resizeMode="contain"
          />
        </Marker>
      </MapView>
    </View>
  );
}
