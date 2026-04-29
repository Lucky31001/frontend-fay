import React, {useCallback, useContext, useState} from 'react';
import { View, Text, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemeContext } from '@/context/ThemeContext';
import { useTheme, IconButton, Menu } from 'react-native-paper';
import { useSegments, useRouter, usePathname } from 'expo-router';
import { AuthContext } from '@/context/AuthContext';
import GradientButton from '@/components/GradientButton';
import {get_profile} from "@/services/profile";
import {Profile} from "@/types/types";
import {useFocusEffect} from "@react-navigation/native";

export default function Header() {
  const { isDark, toggle } = useContext(ThemeContext);
  const { signOut, username } = useContext(AuthContext);
  const [profile, setProfile] = useState<Profile | null>();
  const theme = useTheme();
  const segments = useSegments();
  const current = String(segments[segments.length - 1] ?? '');
  const router = useRouter();
  const [menuVisible, setMenuVisible] = React.useState(false);

    const fetchProfile = useCallback(async () => {
        try {
            const data = await get_profile();
            setProfile(data || null);
        } catch (err: any) {
            setProfile(null);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            fetchProfile();
        }, [fetchProfile]),
    );

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
                      <View style={{ paddingHorizontal: 12, paddingVertical: 10, width: 240 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                          {profile?.image ? (
                            <Image
                              source={{ uri: profile?.image }}
                              style={{ width: 36, height: 36, borderRadius: 18, marginRight: 12 }}
                            />
                          ) : (
                            <View
                              style={{
                                width: 36,
                                height: 36,
                                borderRadius: 18,
                                marginRight: 12,
                                backgroundColor: theme.colors.primary,
                                justifyContent: 'center',
                                alignItems: 'center',
                              }}
                            >
                              <Text style={{ color: theme.colors.onPrimary, fontWeight: '700' }}>
                                {profile?.name ? String(profile.name).charAt(0).toUpperCase() : 'U'}
                              </Text>
                            </View>
                          )}

                          <View style={{ flex: 1 }}>
                            <Text style={{ color: theme.colors.onSurface, fontWeight: '600' }}>
                              {profile?.name || 'Utilisateur'}
                            </Text>
                            {username ? (
                              <Text style={{ color: theme.colors.onSurface, opacity: 0.7, fontSize: 12 }}>
                                @{username}
                              </Text>
                            ) : null}
                          </View>
                        </View>
                      </View>
                <Menu.Item
                  onPress={async () => {
                    setMenuVisible(false);
                    await signOut();
                  }}
                  title="Log Out"
                />
                <Menu.Item title={'Configuration Fay AI'} />
              </Menu>
        </View>
      </View>
    </SafeAreaView>
  );
}

// styles moved inline per component-level styling preference
