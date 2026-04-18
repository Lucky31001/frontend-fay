import { Tabs } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useTheme } from 'react-native-paper';

export default function TabLayout() {
  const theme = useTheme();
  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: theme.colors.primary,
          tabBarInactiveTintColor: theme.colors.onSurface,
          tabBarStyle: { backgroundColor: theme.colors.surface },
            headerShown: false
        }}
      >
        <Tabs.Screen
          name="agenda"
          options={{
            title: 'Aganda',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? 'calendar-sharp' : 'calendar-outline'}
                color={color}
                size={24}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="event"
          options={{
            title: 'Événements',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons name={focused ? 'list-sharp' : 'list-outline'} color={color} size={24} />
            ),
          }}
        />
        <Tabs.Screen name="create_event" options={{ href: null }} />
        <Tabs.Screen
          name="map"
          options={{
            title: 'Maps',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons name={focused ? 'map-sharp' : 'map-outline'} color={color} size={24} />
            ),
          }}
        />
      </Tabs>
    </>
  );
}
