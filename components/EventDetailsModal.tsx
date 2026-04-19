import React from 'react';
import {
  Modal,
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Linking,
  Alert,
} from 'react-native';
import { useTheme } from 'react-native-paper';
import Ionicons from '@expo/vector-icons/Ionicons';

type Props = {
  visible: boolean;
  event: any;
  onClose: () => void;
};

function renderTypes(raw: any) {
  const typesRaw: any = raw.event_types ?? raw.event_type ?? raw.eventTypes ?? [];
  let typesArr: string[] = [];
  if (Array.isArray(typesRaw))
    typesArr = typesRaw.map((t) => (typeof t === 'string' ? t : (t?.name ?? String(t))));
  else if (typeof typesRaw === 'string') typesArr = [typesRaw];
  else if (typesRaw && typeof typesRaw === 'object') typesArr = [typesRaw.name ?? String(typesRaw)];

  return typesArr.slice(0, 3).map((t) => (
    <View
      key={t}
      style={{
        backgroundColor: 'rgba(0,0,0,0.6)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        marginRight: 6,
      }}
    >
      <Text style={{ color: '#fff', fontSize: 12 }}>{t}</Text>
    </View>
  ));
}

export default function EventDetailsModal({ visible, event, onClose }: Props) {
  const theme = useTheme();
  if (!event) return null;

  const raw: any = event as any;

  // parse date if present
  const dateVal = raw.date ?? raw.datetime ?? raw.start_date ?? raw.created_at ?? null;
  let dateObj: Date | null = null;
  try {
    if (dateVal) dateObj = new Date(dateVal);
  } catch (e) {
    dateObj = null;
  }

  const locale = Intl?.DateTimeFormat?.().resolvedOptions?.().locale || 'fr-FR';
  const dateTitle = dateObj
    ? dateObj.toLocaleDateString(locale, { month: 'long', day: 'numeric', year: 'numeric' })
    : null;
  const timeText = dateObj
    ? dateObj.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })
    : null;

  const openMaps = async () => {
    try {
      const lat = raw.latitude ?? raw.lat ?? raw.geometry?.lat ?? null;
      const lon = raw.longitude ?? raw.lon ?? raw.geometry?.lon ?? raw.geometry?.lng ?? null;
      if (lat && lon) {
        const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${lat},${lon}`)}`;
        await Linking.openURL(url);
      } else if (raw.location) {
        const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(raw.location)}`;
        await Linking.openURL(url);
      } else {
        Alert.alert('Aucune localisation disponible');
      }
    } catch (e) {}
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.4)',
          justifyContent: 'center',
          padding: 16,
        }}
      >
        <View
          style={{
            backgroundColor: theme.colors.surface,
            borderRadius: 12,
            overflow: 'hidden',
            maxHeight: '90%',
          }}
        >
          <ScrollView>
            {/* Image block */}
            {raw.image ? (
              <View style={{ position: 'relative' }}>
                <Image
                  source={{ uri: raw.image }}
                  style={{ width: '100%', height: 180, resizeMode: 'cover' }}
                />
                <View style={{ position: 'absolute', left: 8, top: 8, flexDirection: 'row' }}>
                  {renderTypes(raw)}
                </View>
                <TouchableOpacity
                  onPress={onClose}
                  accessibilityRole="button"
                  style={{
                    position: 'absolute',
                    right: 8,
                    top: 8,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    padding: 6,
                    borderRadius: 16,
                  }}
                >
                  <Ionicons name="close" size={18} color="#fff" />
                </TouchableOpacity>
              </View>
            ) : null}

            {/* Name & description */}
            <View style={{ padding: 12 }}>
              <Text
                style={{
                  fontWeight: '700',
                  fontSize: 18,
                  marginBottom: 8,
                  color: theme.colors.onSurface,
                }}
              >
                {raw.name}
              </Text>
              {raw.description ? (
                <Text style={{ color: theme.colors.onSurface }}>{raw.description}</Text>
              ) : null}
            </View>

            {/* Info block */}
            <View style={{ paddingHorizontal: 12, paddingBottom: 12 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                <Ionicons
                  name="calendar-outline"
                  size={20}
                  color={theme.colors.primary}
                  style={{ marginRight: 8 }}
                />
                <View>
                  <Text style={{ color: theme.colors.onSurface }}>
                    {dateTitle ?? 'Date inconnue'}
                  </Text>
                  {timeText ? (
                    <Text style={{ color: theme.colors.onSurface, opacity: 0.7 }}>{timeText}</Text>
                  ) : null}
                </View>
              </View>

              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                <Ionicons
                  name="location-outline"
                  size={20}
                  color={theme.colors.error}
                  style={{ marginRight: 8 }}
                />
                <Text style={{ color: theme.colors.onSurface }}>
                  {raw.location ?? 'Adresse inconnue'}
                </Text>
              </View>

              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                <Ionicons name="star" size={20} color={'#FFD700'} style={{ marginRight: 8 }} />
                <Text style={{ color: theme.colors.onSurface }}>{raw.note ?? '—'}</Text>
              </View>
            </View>

            {/* Price block */}
            <View style={{ paddingHorizontal: 12, paddingBottom: 16 }}>
              <Text style={{ fontSize: 16, fontWeight: '700', color: theme.colors.onSurface }}>
                {raw.price != null ? `${raw.price} €` : 'Gratuit'}
              </Text>
            </View>

            {/* Open maps button */}
            <View style={{ padding: 12, paddingBottom: 13 }}>
              <TouchableOpacity
                onPress={openMaps}
                style={{
                  backgroundColor: theme.colors.primary,
                  paddingVertical: 12,
                  borderRadius: 8,
                  alignItems: 'center',
                }}
              >
                <Text
                  style={{ color: (theme.colors as any).onPrimary || '#fff', fontWeight: '600' }}
                >
                  Ouvrir dans Maps
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
          <TouchableOpacity onPress={onClose} style={{ padding: 10, alignItems: 'center' }}>
            <Text style={{ color: theme.colors.primary }}>Fermer</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
