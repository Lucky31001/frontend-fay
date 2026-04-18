import React from 'react';
import { View } from 'react-native';
import { useTheme } from 'react-native-paper';
import Calandar from '@/components/Calandar';

export default function AgendaScreen() {
  const theme = useTheme();

  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: theme.colors.background }}>
      <Calandar />
    </View>
  );
}
