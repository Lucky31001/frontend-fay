import React, { useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
// ...existing code...
import { ThemeContext } from '@/context/ThemeContext';
import { Switch, useTheme, IconButton } from 'react-native-paper';

export default function Header() {
  const { isDark, toggle } = useContext(ThemeContext);
  const paperTheme = useTheme();

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: paperTheme.colors.background }]}
      edges={['top']}
    >
      <View style={[styles.inner, { borderBottomColor: paperTheme.colors.outline }]}>
        <View style={styles.left}>
          <Text style={[styles.title, { color: paperTheme.colors.onSurface }]}>Fay</Text>
        </View>
        <View style={styles.right}>
          <IconButton
            icon={isDark ? 'weather-night' : 'white-balance-sunny'}
            onPress={() => toggle()}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  left: { flexDirection: 'row', alignItems: 'center' },
  right: { flexDirection: 'row', alignItems: 'center' },
  title: { fontSize: 18, fontWeight: '700' },
});
