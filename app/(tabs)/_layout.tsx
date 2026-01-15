import { Tabs } from 'expo-router';
import { Stack } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function TabLayout() {
  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: '#ffd33d',
        }}
        >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons name={focused ? 'home-sharp' : 'home-outline'} color={color} size={24} />
            ),
          }}
          />
        <Tabs.Screen
          name="event_list"
          options={{ title: 'Événements',}}
          />
        <Tabs.Screen
          name="create_event"
          options={{
            href: null,
            
          }}
          />
      </Tabs>
      
    </>
  );
}
