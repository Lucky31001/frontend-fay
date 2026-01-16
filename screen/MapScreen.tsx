import { List_event } from '@/services/event.service';
import React, { useEffect, useState } from 'react';
import MapView, {Marker} from 'react-native-maps';
import { StyleSheet, View, Image, Text, ActivityIndicator } from 'react-native';
import type { APIEvent } from '@/types/api.types';
import * as Location from "expo-location";


export default function MapScreen() {
  const [events, setEvents] = useState<APIEvent[]>([]);
  const [location, setLocation] = useState<Location.LocationObjectCoords>();
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
      const fetchEvent = async () => {
        const data = await List_event()
        setEvents(data);
      };
      fetchEvent();
    }, []);


    useEffect(() => {
      (async () => {
        // Ask for location permission
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setErrorMsg("Permission refusée");
          return;
        }

        // Get user geolocation in real time
        Location.watchPositionAsync(
          { accuracy: Location.Accuracy.High, distanceInterval: 5 },
          (loc) => setLocation(loc.coords));
      })(); 
    }, []);

  if (errorMsg) {
    return (
      <View style={styles.center}>
        <Text>{errorMsg}</Text>
      </View> 
    );
  }

  if (!location) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.map}>
      <MapView 
        style={styles.map} 
        initialRegion={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        <Marker
          coordinate={{
            latitude: location.latitude,
            longitude: location.longitude
          }}
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

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
