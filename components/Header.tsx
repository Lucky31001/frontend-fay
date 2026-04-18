import React, { useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemeContext } from '@/context/ThemeContext';
import { useTheme, IconButton, Menu } from 'react-native-paper';
import { useSegments, useRouter } from 'expo-router';
import { AuthContext } from '@/context/AuthContext';

export default function Header() {
  const { isDark, toggle } = useContext(ThemeContext);
  const { signOut } = useContext(AuthContext);
  const paperTheme = useTheme();
  const segments = useSegments();
  const current = String(segments[segments.length - 1] ?? '');
  const hideActions = current === 'login' || current === 'index' || current === '';
  const router = useRouter();
  const [menuVisible, setMenuVisible] = React.useState(false);

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: paperTheme.colors.background }]}
      edges={['top']}
    >
      <View style={[styles.inner, { borderBottomColor: paperTheme.colors.outline }]}>
        <View style={styles.left}>
          <IconButton
            icon={'alpha-f'}
            style={[
              styles.squareButton,
              {
                borderColor: paperTheme.colors.outline,
                backgroundColor: paperTheme.colors.surface,
              },
            ]}
          />
          <Text style={[styles.title, { color: paperTheme.colors.onSurface }]}>Fay</Text>
        </View>
        <View style={styles.right}>
          <IconButton
            icon={isDark ? 'white-balance-sunny' : 'weather-night'}
            onPress={() => toggle()}
          />

          {!hideActions && (
            <>
              <IconButton
                icon={isDark ? 'bell' : 'bell-outline'}
                style={[
                  styles.squareButton,
                  {
                    borderColor: paperTheme.colors.outline,
                    backgroundColor: paperTheme.colors.surface,
                  },
                ]}
              />

              <Menu
                visible={menuVisible}
                onDismiss={() => setMenuVisible(false)}
                anchor={
                  <IconButton
                    icon={isDark ? 'cog' : 'cog-outline'}
                    style={[
                      styles.squareButton,
                      {
                        borderColor: paperTheme.colors.outline,
                        backgroundColor: paperTheme.colors.surface,
                      },
                    ]}
                    onPress={() => setMenuVisible(true)}
                  />
                }
              >
                <Menu.Item
                  onPress={async () => {
                    setMenuVisible(false);
                    await signOut();
                  }}
                  title="Log Out"
                />
                <Menu.Item title={'Configuration Fay AI'} />
              </Menu>
            </>
          )}
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
  left: { flexDirection: 'row', alignItems: 'center', width: 80 },
  center: { flex: 1, alignItems: 'center' },
  right: { flexDirection: 'row', alignItems: 'center', width: 160, justifyContent: 'flex-end' },
  title: { fontSize: 18, fontWeight: '700' },
  pageTitle: { fontSize: 16, fontWeight: '600' },
  squareButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    borderWidth: 1,
    marginLeft: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
