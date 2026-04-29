import { Tabs } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useTheme } from 'react-native-paper';
import Toast from "react-native-toast-message";
import React from "react";
import Header from "@/components/Header";

export default function TabLayout() {
  const theme = useTheme();
  return (
    <>
        <Header />
        <Tabs
        screenOptions={{
          tabBarActiveTintColor: theme.colors.primary,
          tabBarInactiveTintColor: theme.colors.onSurface,
          tabBarStyle: { backgroundColor: theme.colors.surface },
          headerShown: false,
        }}
      >
        <Tabs.Screen
          name="vibe"
          options={{
            title: 'Vibe',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? 'sparkles-sharp' : 'sparkles-outline'}
                color={color}
                size={24}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="follow"
          options={{
            title: 'Follow',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons name={focused ? 'heart-sharp' : 'heart-outline'} color={color} size={24} />
            ),
          }}
        />
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
            title: 'Liste',
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
