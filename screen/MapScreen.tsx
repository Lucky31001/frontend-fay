// import { List_event } from '@/services/event.service';
// import React, { useEffect, useState } from 'react';
// import MapView, { Marker } from 'react-native-maps';
// import { StyleSheet, View, Image, Text, ActivityIndicator } from 'react-native';
// import { useTheme } from 'react-native-paper';
// import type { APIEvent } from '@/types/api.types';
// import * as Location from 'expo-location';
//
// export default function MapScreen() {
//   const [events, setEvents] = useState<APIEvent[]>([]);
//   const [location, setLocation] = useState<Location.LocationObjectCoords>();
//   const [errorMsg, setErrorMsg] = useState('');
//   const theme = useTheme();
//
//   useEffect(() => {
//     const fetchEvent = async () => {
//       const data = await List_event();
//       setEvents(data);
//     };
//     fetchEvent();
//   }, []);
//
//   useEffect(() => {
//     (async () => {
//       // Ask for location permission
//       let { status } = await Location.requestForegroundPermissionsAsync();
//       if (status !== 'granted') {
//         setErrorMsg('Permission refusée');
//         return;
//       }
//
//       // Get user geolocation in real time
//       Location.watchPositionAsync(
//         { accuracy: Location.Accuracy.High, distanceInterval: 5 },
//         (loc) => setLocation(loc.coords),
//       );
//     })();
//   }, []);
//
//   if (errorMsg) {
//     return (
//       <View style={[styles.center, { backgroundColor: theme.colors.background }]}>
//         <Text style={{ color: theme.colors.onSurface }}>{errorMsg}</Text>
//       </View>
//     );
//   }
//
//   if (!location) {
//     return (
//       <View style={[styles.center, { backgroundColor: theme.colors.background }]}>
//         <ActivityIndicator size="large" color={theme.colors.primary} />
//       </View>
//     );
//   }
//
//   return (
//     <View style={[styles.map, { backgroundColor: theme.colors.background }]}>
//       <MapView
//         style={styles.map}
//         initialRegion={{
//           latitude: location.latitude,
//           longitude: location.longitude,
//           latitudeDelta: 0.0922,
//           longitudeDelta: 0.0421,
//         }}
//       >
//         <Marker
//           coordinate={{
//             latitude: location.latitude,
//             longitude: location.longitude,
//           }}
//           style={{
//             zIndex: 1,
//           }}
//           anchor={{ x: 0.5, y: 1 }}
//         >
//           <Image
//             source={require('../assets/images/location-pin.png')}
//             style={{ width: 32, height: 32, tintColor: theme.colors.error }}
//             resizeMode="contain"
//           />
//         </Marker>
//       </MapView>
//     </View>
//   );
// }
//
// const styles = StyleSheet.create({
//   map: {
//     flex: 1,
//   },
//   center: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
// });
