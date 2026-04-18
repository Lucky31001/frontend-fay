import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useTheme } from 'react-native-paper';
import { Calendar as RNCalendar } from 'react-native-calendars';
import * as Calendar from 'expo-calendar';

export default function Calandar() {
  const theme = useTheme();
  const [current, setCurrent] = useState(new Date());
  const [markedDates, setMarkedDates] = useState<Record<string, any>>({});
  const [permissionGranted, setPermissionGranted] = useState<boolean | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // format date as YYYY-MM-DD in local timezone to avoid timezone shifts
  const isoDate = (d: Date) => {
    const y = d.getFullYear();
    const m = `${d.getMonth() + 1}`.padStart(2, '0');
    const day = `${d.getDate()}`.padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  const requestPermissions = async () => {
    try {
      const { status } = await Calendar.requestCalendarPermissionsAsync();
      setPermissionGranted(status === 'granted');
      return status === 'granted';
    } catch (e) {
      setPermissionGranted(false);
      return false;
    }
  };

  const loadEventsForMonth = useCallback(
    async (monthDate: Date) => {
      const ok = await requestPermissions();
      if (!ok) return;

      const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
      const calendarIds = calendars.map((c) => c.id);

      const start = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
      const end = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0, 23, 59, 59);

      let events: any[];
      try {
        events = await Calendar.getEventsAsync(calendarIds, start, end);
      } catch (e) {
        events = [];
      }

      const marks: Record<string, any> = {};
      events.forEach((ev) => {
        const start = ev.startDate ? new Date(ev.startDate) : null;
        if (!start) return;
        const day = isoDate(start);
        if (!marks[day]) marks[day] = { marked: true, dots: [{ color: theme.colors.primary }] };
        else marks[day].marked = true;
      });

      // apply customStyles for selected date and today to show rounded square
      const highlight = (base: any = {}) => ({
        ...base,
        customStyles: {
          container: {
            backgroundColor: '#6366f1',
            borderRadius: 8,
          },
          text: {
            color: '#ffffff',
            fontWeight: '600',
          },
        },
      });

      const todayKey = isoDate(new Date());

      marks[todayKey] = highlight(marks[todayKey]);

      if (selectedDate) {
        marks[selectedDate] = highlight(marks[selectedDate]);
      }

      setMarkedDates(marks);
    },
    [theme.colors.primary, selectedDate],
  );

  useEffect(() => {
    loadEventsForMonth(current);
  }, [current, loadEventsForMonth]);

  const onMonthChange = (month: { year: number; month: number }) => {
    setCurrent(new Date(month.year, month.month - 1, 1));
  };

  const onDayPress = (day: any) => {
    setSelectedDate(day.dateString);
    console.log('Selected date:', day);
  };

  if (permissionGranted === false) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Text style={{ color: theme.colors.onSurface }}>
          Calendar permission denied. Please enable it in settings.
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <RNCalendar
        markingType={'custom'}
        current={isoDate(current)}
        onDayPress={onDayPress}
        monthFormat={'MMMM yyyy'}
        enableSwipeMonths={true}
        onMonthChange={onMonthChange}
        markedDates={markedDates}
        theme={{}}
        style={{ borderRadius: 8 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
});
