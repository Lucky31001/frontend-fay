import React from 'react';
import { Text, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import { COLOR } from '@/constant/color';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function VibeScreen() {
  const theme = useTheme();
  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: theme.colors.background }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 12,
        }}
      >
        <Ionicons name={'sparkles-outline'} color={COLOR.BLUE} size={24} />
        <Text
          style={{
            color: theme.colors.onSurface,
            marginLeft: 8,
            fontSize: 16,
            fontWeight: '500',
          }}
        >
          Vibe Matching
        </Text>
      </View>
    </View>
  );
}
