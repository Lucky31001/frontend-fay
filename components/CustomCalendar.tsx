import React, { useEffect, useState, useMemo } from 'react';
import { View, Text, Pressable, Platform, Linking } from 'react-native';
import { useTheme } from 'react-native-paper';
import { Calendar as RNCalendar } from 'react-native-calendars';
import * as Calendar from 'expo-calendar';
import Ionicons from '@expo/vector-icons/Ionicons';
import DateTimePicker from '@react-native-community/datetimepicker';

type CalendarProps = {
  value?: string | null;
  onChange?: (dateString: string) => void;
};

function isoDate(d: Date) {
  const y = d.getFullYear();
  const m = `${d.getMonth() + 1}`.padStart(2, '0');
  const day = `${d.getDate()}`.padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export default function CustomCalendar({ value, onChange }: CalendarProps) {
  const theme = useTheme();
  const [current, setCurrent] = useState(new Date());
  const [markedDates, setMarkedDates] = useState<Record<string, any>>({});
  const [permissionGranted, setPermissionGranted] = useState<boolean | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(
    value ? String(value).split(/[T ]/)[0] : null,
  );
  const now = new Date();
  const [hour, setHour] = useState<string>(() => String(now.getHours()).padStart(2, '0'));
  const [minute, setMinute] = useState<string>(() => String(now.getMinutes()).padStart(2, '0'));
  const [showTimePicker, setShowTimePicker] = useState(false);

  // parse incoming value (if parent controls the value)
  useEffect(() => {
    if (!value) return;
    const parts = String(value).split(/[T ]/);
    const d = parts[0];
    if (d) setSelectedDate(d);
    if (parts[1]) {
      const [h = '00', m = '00'] = parts[1].split(':');
      setHour(String(h).padStart(2, '0'));
      setMinute(String(m).padStart(2, '0'));
    }
  }, [value]);

  // helper to request calendar permission on demand
  const requestPermissions = async () => {
    try {
      const { status } = await Calendar.requestCalendarPermissionsAsync();
      const ok = status === 'granted';
      setPermissionGranted(ok);
      return ok;
    } catch {
      setPermissionGranted(false);
      return false;
    }
  };

  // notify parent when date/time changes
  useEffect(() => {
    if (!selectedDate) return;
    const dt = `${selectedDate}T${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:00`;
    try {
      onChange && onChange(dt);
    } catch {}
  }, [selectedDate, hour, minute, onChange]);

  // load calendar events for the visible month (minimal, kept simple)
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        // ensure we have permission before loading events
        const { status } = await Calendar.requestCalendarPermissionsAsync();
        if (!mounted) return;
        setPermissionGranted(status === 'granted');
        if (status !== 'granted') return;
        const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
        const ids = calendars.map((c) => c.id);
        const start = new Date(current.getFullYear(), current.getMonth(), 1);
        const end = new Date(current.getFullYear(), current.getMonth() + 1, 0, 23, 59, 59);
        const events = await Calendar.getEventsAsync(ids, start, end);
        const marks: Record<string, any> = {};
        events.forEach((ev) => {
          const s = ev.startDate ? new Date(ev.startDate) : null;
          if (!s) return;
          const key = isoDate(s);
          marks[key] = { marked: true, dots: [{ color: theme.colors.primary }] };
        });

        const highlight = (base: any = {}) => ({
          ...base,
          customStyles: {
            container: {
              backgroundColor: theme.colors.primary,
              borderRadius: 8,
            },
            text: {
              color: (theme.colors as any).onPrimary || '#ffffff',
              fontWeight: '600',
            },
          },
        });

        const today = isoDate(new Date());
        marks[today] = highlight(marks[today]);
        if (selectedDate) marks[selectedDate] = highlight(marks[selectedDate]);
        if (mounted) setMarkedDates(marks);
      } catch {
        if (mounted) setMarkedDates({});
      }
    })();
    return () => {
      mounted = false;
    };
  }, [current, selectedDate, theme.colors]);

  // ask for permission on mount so we can show the permission UI quickly
  useEffect(() => {
    requestPermissions().catch(() => {});
  }, []);

  const onMonthChange = (m: { year: number; month: number }) =>
    setCurrent(new Date(m.year, m.month - 1, 1));

  const timeValue = useMemo(() => {
    try {
      return selectedDate ? new Date(`${selectedDate}T${hour}:${minute}:00`) : new Date();
    } catch {
      return new Date();
    }
  }, [selectedDate, hour, minute]);

  const pretty = useMemo(() => {
    if (!selectedDate) return null;
    try {
      const dt = new Date(`${selectedDate}T${hour}:${minute}:00`);
      const locale = (() => {
        try {
          const l = Intl?.DateTimeFormat?.().resolvedOptions?.().locale;
          return l || 'fr-FR';
        } catch (err) {
          // If Intl fails for some reason, fallback quietly and log for debugging
          console.error(err);
          return 'fr-FR';
        }
      })();

      return dt.toLocaleString(locale, {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return null;
    }
  }, [selectedDate, hour, minute]);

  return (
    <View style={{ backgroundColor: theme.colors.background, padding: 8 }}>
      {permissionGranted === false && (
        <View
          style={{
            padding: 12,
            backgroundColor: theme.colors.surface,
            borderRadius: 8,
            marginBottom: 12,
          }}
        >
          <Text style={{ color: theme.colors.onSurface, marginBottom: 8 }}>
            L’application n’a pas l’autorisation d’accéder au calendrier. Activez l’accès pour
            afficher vos événements.
          </Text>
          <View style={{ flexDirection: 'row' }}>
            <Pressable
              onPress={() => requestPermissions()}
              style={{
                marginRight: 8,
                paddingVertical: 8,
                paddingHorizontal: 12,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: theme.colors.primary,
              }}
            >
              <Text style={{ color: theme.colors.primary }}>Demander l’accès</Text>
            </Pressable>
            <Pressable
              onPress={() => Linking.openSettings()}
              style={{
                paddingVertical: 8,
                paddingHorizontal: 12,
                borderRadius: 2,
                backgroundColor: theme.colors.primary,
              }}
            >
              <Text style={{ color: (theme.colors as any).onPrimary || '#fff' }}>
                Ouvrir les paramètres
              </Text>
            </Pressable>
          </View>
        </View>
      )}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 8,
        }}
      >
        <Ionicons name={'calendar-outline'} color={theme.colors.primary} size={20} />
        <Text style={{ color: theme.colors.onSurface, marginLeft: 8, fontWeight: '500' }}>
          Mon Agenda
        </Text>
      </View>

      <RNCalendar
        markingType={'custom'}
        current={isoDate(current)}
        onDayPress={(d) => setSelectedDate(d.dateString)}
        onMonthChange={onMonthChange}
        markedDates={markedDates}
        theme={{
          backgroundColor: theme.colors.background,
          calendarBackground: theme.colors.background,
          textSectionTitleColor: theme.colors.onSurface,
          selectedDayBackgroundColor: theme.colors.primary,
          selectedDayTextColor: (theme.colors as any).onPrimary || '#fff',
          todayTextColor: theme.colors.primary,
          dayTextColor: theme.colors.onSurface,
          monthTextColor: theme.colors.onSurface,
          arrowColor: theme.colors.primary,
        }}
        style={{ borderRadius: 8 }}
      />

      <View style={{ alignItems: 'center', marginTop: 12, position: 'relative' }}>
        {showTimePicker && (
          <Pressable
            onPress={() => setShowTimePicker(false)}
            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
          />
        )}

        {pretty ? (
          <Text style={{ color: theme.colors.onSurface, marginBottom: 6 }}>{pretty}</Text>
        ) : (
          <Text style={{ color: theme.colors.onSurface, marginBottom: 6 }}>Heure</Text>
        )}
        <Pressable
          onPress={() => setShowTimePicker(true)}
          style={{
            paddingVertical: 10,
            paddingHorizontal: 20,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: theme.colors.outline,
            backgroundColor: theme.colors.background,
          }}
        >
          <Text
            style={{ color: theme.colors.onSurface, fontWeight: '600' }}
          >{`${hour.padStart(2, '0')}:${minute.padStart(2, '0')}`}</Text>
        </Pressable>

        {showTimePicker && (
          <View style={{ marginTop: 8 }}>
            <DateTimePicker
              value={timeValue}
              mode="time"
              is24Hour
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={(_e, picked) => {
                if (Platform.OS === 'android') setShowTimePicker(false);
                if (!picked) return;
                setHour(String(picked.getHours()).padStart(2, '0'));
                setMinute(String(picked.getMinutes()).padStart(2, '0'));
              }}
            />
          </View>
        )}
      </View>
    </View>
  );
}
