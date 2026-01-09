// import React, {useState} from 'react';
// import MapView, { Marker } from 'react-native-maps';
// import { StyleSheet, View } from 'react-native';
//
// export default function App() {
//
//     const points = [
//         { id: 1, lat: 48.8566, lng: 2.3522, category: 'restaurant' },
//         { id: 2, lat: 48.8584, lng: 2.2945, category: 'monument' },
//         { id: 3, lat: 48.8606, lng: 2.3376, category: 'museum' },
//     ];
//
//     const [filter, setFilter] = useState('restaurant');
//
//     const filteredPoints = points.filter(point => point.category === filter);
//
//
//     return (
//       <View style={styles.container}>
//         <MapView
//           style={{ flex: 1 }}
//           initialRegion={{
//             latitude: 48.8566,
//             longitude: 2.3522,
//             latitudeDelta: 0.05,
//             longitudeDelta: 0.05,
//           }}
//         >
//           {filteredPoints.map(point => (
//             <Marker
//               key={point.id}
//               coordinate={{ latitude: point.lat, longitude: point.lng }}
//               title={point.category}
//             />
//           ))}
//         </MapView>
//        </View>
//   );
// }
//
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   map: {
//     width: '100%',
//     height: '100%',
//   },
// });
