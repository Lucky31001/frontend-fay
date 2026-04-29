import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, TextInput, ScrollView } from 'react-native';
import { useTheme, Button } from 'react-native-paper';
import { get_event_type } from '@/services/event';

type Props = {
  value: string[];
  onChange: (types: string[]) => void;
  showError?: boolean;
};

export default function EventTypeSelector({ value, onChange, showError }: Props) {
  const theme = useTheme();
  const [menuVisible, setMenuVisible] = useState(false);
  const [types, setTypes] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [custom, setCustom] = useState('');

  useEffect(() => {
    if (value.length == 0) {
      let mounted = true;
      (async () => {
        try {
          const data = await get_event_type();
          const names = (data || []).map((t: any) => t.name);
          if (mounted) setTypes(names);
        } catch {
          if (mounted) setTypes([]);
        }
      })();
      return () => {
        mounted = false;
      };
    }
  }, [showError]);

  const filtered = types.filter((t) => t.toLowerCase().includes(search.toLowerCase()));

  const toggleType = (t: string) => {
    if (value.includes(t)) onChange(value.filter((x) => x !== t));
    else onChange([...value, t]);
  };

  const addCustom = () => {
    const trimmed = custom.trim();
    if (!trimmed) return;
    if (!types.includes(trimmed)) setTypes((s) => [trimmed, ...s]);
    if (!value.includes(trimmed)) onChange([...value, trimmed]);
    setCustom('');
  };

  return (
    <View>
      <Button
        mode="outlined"
        onPress={() => setMenuVisible((v) => !v)}
        style={{ justifyContent: 'center', borderRadius: 8 }}
        contentStyle={{ height: 44 }}
      >
        {value.length > 0 ? value.join(', ') : 'Choisir un ou plusieurs types'}
      </Button>

      {menuVisible && (
        <View
          style={{
            marginTop: 8,
            padding: 8,
            borderRadius: 8,
            backgroundColor: theme.colors.surface,
          }}
        >
          <TextInput
            placeholder="Rechercher"
            placeholderTextColor={theme.colors.onSurface}
            value={search}
            onChangeText={setSearch}
            keyboardAppearance={theme.dark ? 'dark' : 'light'}
            style={{
              borderWidth: 1,
              borderColor: theme.colors.outline,
              paddingHorizontal: 12,
              paddingVertical: 8,
              borderRadius: 8,
              marginBottom: 8,
              color: theme.colors.onSurface,
              backgroundColor: theme.colors.background,
            }}
          />

          <ScrollView horizontal contentContainerStyle={{ flexWrap: 'wrap' }}>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
              {filtered.map((t) => {
                const sel = value.includes(t);
                return (
                  <Pressable
                    key={t}
                    onPress={() => toggleType(t)}
                    style={{
                      paddingHorizontal: 12,
                      paddingVertical: 8,
                      borderRadius: 20,
                      marginRight: 8,
                      marginBottom: 8,
                      backgroundColor: sel ? theme.colors.primary : theme.colors.background,
                      borderWidth: 1,
                      borderColor: sel ? theme.colors.primary : theme.colors.outline,
                    }}
                  >
                    <Text
                      style={{
                        color: sel
                          ? (theme.colors as any).onPrimary || '#fff'
                          : theme.colors.onSurface,
                      }}
                    >
                      {t}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </ScrollView>

          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
            <TextInput
              placeholder="Ajouter un type"
              placeholderTextColor={theme.colors.onSurface}
              value={custom}
              onChangeText={setCustom}
              keyboardAppearance={theme.dark ? 'dark' : 'light'}
              style={{
                flex: 1,
                borderWidth: 1,
                borderColor: theme.colors.outline,
                paddingHorizontal: 12,
                paddingVertical: 8,
                borderRadius: 8,
                color: theme.colors.onSurface,
                backgroundColor: theme.colors.background,
              }}
            />
            <Button
              mode="contained"
              onPress={addCustom}
              style={{ marginLeft: 8, alignSelf: 'flex-start' }}
            >
              Ajouter
            </Button>
          </View>
        </View>
      )}

      {showError && value.length === 0 && (
        <Text
          style={{ color: (theme.colors as any).error || '#f44336', marginTop: 8, fontSize: 12 }}
        >
          Ce champ est obligatoire
        </Text>
      )}
    </View>
  );
}
