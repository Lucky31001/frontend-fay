import React, { useRef, useState } from 'react';
import { View, Text, Pressable, ActivityIndicator } from 'react-native';
import { Button, useTheme } from 'react-native-paper';
import Ionicons from '@expo/vector-icons/Ionicons';
import FieldInput from '@/components/FieldInput';
import * as Location from 'expo-location';

type Props = {
  value: string;
  onChange: (value: string, coords?: { latitude: number; longitude: number }) => void;
  showError?: boolean;
};

export default function LocationPicker({ value, onChange, showError }: Props) {
  const theme = useTheme();
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const timer = useRef<number | null>(null);

  const handleSearch = (text: string) => {
    onChange(text);
    if (timer.current) clearTimeout(timer.current as any);
    if (text.length < 3) {
      setSuggestions([]);
      return;
    }
    timer.current = setTimeout(async () => {
      try {
        setLoading(true);
        const q = encodeURIComponent(text);
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=5&q=${q}`,
          { headers: { 'User-Agent': 'FAY-App' } },
        );
        const json = await res.json();
        setSuggestions(json || []);
      } catch (e) {
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 500) as unknown as number;
  };

  const useMyPosition = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;
      const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
      const rev = await Location.reverseGeocodeAsync({
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
      });
      const first = rev && rev[0];
      if (first) {
        const parts = [
          first.name,
          first.street,
          first.postalCode,
          first.city,
          first.region,
          first.country,
        ].filter(Boolean);
        onChange(parts.join(', '), {
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        });
      } else {
        onChange(`${pos.coords.latitude.toFixed(5)}, ${pos.coords.longitude.toFixed(5)}`, {
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        });
      }
      setSuggestions([]);
    } catch (e) {
      // ignore
    }
  };

  const pickSuggestion = async (s: any) => {
    try {
      // Nominatim result shape includes lat/lon and display_name
      onChange(s.display_name, { latitude: Number(s.lat), longitude: Number(s.lon) });
    } catch (e) {
      onChange(s.display_name);
    } finally {
      setSuggestions([]);
    }
  };

  return (
    <View>
      <FieldInput
        label="Localisation"
        value={value}
        onChangeText={handleSearch}
        placeholder="Paris, France"
        showError={showError}
        required
      />

      {loading && (
        <View style={{ paddingVertical: 6 }}>
          <ActivityIndicator color={theme.colors.primary} />
        </View>
      )}

      {suggestions.length > 0 && (
        <View
          style={{
            backgroundColor: theme.colors.surface,
            borderRadius: 8,
            marginTop: 6,
            padding: 6,
          }}
        >
          {suggestions.map((s, idx) => {
            const addr = s.address || {};
            const title = (s.display_name || '').split(',')[0];
            const subtitleParts: string[] = [];
            if (addr.road || addr.house_number)
              subtitleParts.push([addr.road, addr.house_number].filter(Boolean).join(' '));
            if (addr.city || addr.town || addr.village)
              subtitleParts.push(addr.city || addr.town || addr.village);
            if (addr.state) subtitleParts.push(addr.state);
            if (addr.country) subtitleParts.push(addr.country);
            const subtitle = subtitleParts.join(', ');

            return (
              <Pressable key={idx} onPress={() => pickSuggestion(s)} style={{ paddingVertical: 8 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Ionicons
                    name="location-outline"
                    size={16}
                    color={theme.colors.primary}
                    style={{ marginRight: 8 }}
                  />
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: theme.colors.onSurface, fontWeight: '600' }}>
                      {title}
                    </Text>
                    {subtitle ? (
                      <Text style={{ color: theme.colors.onSurface, opacity: 0.7, fontSize: 12 }}>
                        {subtitle}
                      </Text>
                    ) : null}
                  </View>
                </View>
              </Pressable>
            );
          })}
        </View>
      )}

      <View style={{ flexDirection: 'row', marginTop: 8, gap: 8 }}>
        <Button mode="outlined" onPress={useMyPosition} style={{ marginRight: 8 }}>
          Utiliser ma position
        </Button>
      </View>
    </View>
  );
}
