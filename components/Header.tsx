import React, { useContext } from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemeContext } from '@/context/ThemeContext';
import { useTheme, IconButton, Menu } from 'react-native-paper';
import { useSegments, useRouter } from 'expo-router';
import { AuthContext } from '@/context/AuthContext';
import GradientButton from '@/components/GradientButton';

export default function Header() {
  const { isDark, toggle } = useContext(ThemeContext);
  const { signOut } = useContext(AuthContext);
  const theme = useTheme();
  const segments = useSegments();
  const current = String(segments[segments.length - 1] ?? '');
  const hideActions = current === 'login' || current === 'index' || current === '';
  const router = useRouter();
  const [menuVisible, setMenuVisible] = React.useState(false);

  return (
    <SafeAreaView
      style={{ width: '100%', backgroundColor: theme.colors.background }}
      edges={['top']}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 16,
          paddingVertical: 10,
          borderBottomWidth: 1,
          borderBottomColor: theme.colors.outlineVariant,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', width: 80 }}>
          <GradientButton
            onClick={() => router.push('/(tabs)/agenda')}
            style={{
              width: 36,
              height: 36,
              marginRight: 8,
              marginBottom: 5,
            }}
            label={'F'}
          ></GradientButton>
          <Text style={{ fontSize: 18, fontWeight: '700', color: theme.colors.onSurface }}>
            Fay
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            width: 160,
            justifyContent: 'flex-end',
          }}
        >
          <IconButton
            icon={isDark ? 'white-balance-sunny' : 'weather-night'}
            onPress={() => toggle()}
          />

          {!hideActions && (
            <>
              <IconButton
                icon={isDark ? 'bell' : 'bell-outline'}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 8,
                  borderWidth: 1,
                  marginLeft: 8,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderColor: theme.colors.outline,
                  backgroundColor: theme.colors.surface,
                }}
              />

              <Menu
                visible={menuVisible}
                onDismiss={() => setMenuVisible(false)}
                anchor={
                  <IconButton
                    icon={isDark ? 'cog' : 'cog-outline'}
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 8,
                      borderWidth: 1,
                      marginLeft: 8,
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderColor: theme.colors.outline,
                      backgroundColor: theme.colors.surface,
                    }}
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

// styles moved inline per component-level styling preference
