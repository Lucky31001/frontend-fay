import React, { useEffect, useState } from 'react';
import { View, Text, Alert, Linking} from 'react-native';
import { useTheme } from 'react-native-paper';
import { Calendar as RNCalendar } from 'react-native-calendars';
import * as Calendar from 'expo-calendar';

const isoDate = (d: Date) => d.toISOString().split('T')[0];

export default function CustomCalendar({ value, onChange }: { value?: string, onChange?: (v: string) => void }) {
  const theme = useTheme();
  const [selectedDate, setSelectedDate] = useState(value?.split('T')[0] || isoDate(new Date()));
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [markedDates, setMarkedDates] = useState<Record<string, any>>({});
  const [allEvents, setAllEvents] = useState<Calendar.Event[]>([]);

  //fonction qui permet d'avoir l'autorisation d'accès au calendrier et relance
  const requestCalendarAccess = async () => {
    const { status } = await Calendar.requestCalendarPermissionsAsync();

    if (status === 'granted') return true;

    Alert.alert(
      "Permission requise",
      "L'accès au calendrier est nécessaire pour voir vos rendez-vous. Voulez-vous l'activer dans les réglages ?",
      [
        { text: "Annuler", style: "cancel" },
        { 
          text: "Ouvrir les réglages", 
          onPress: () => Linking.openSettings()
        }
      ]
    );
    return false;
  };

  // Pour chaque changement de mois ou de date sélectionnée, chargement des événements du calendrier
  useEffect(() => {
    (async () => {
      const { status } = await Calendar.requestCalendarPermissionsAsync();
      
      if (status !== 'granted') {
        const ok = await requestCalendarAccess();
        if (!ok) return;
      }

      try {
        const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
        const ids = calendars.map(c => c.id);
        const start_date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
        const end_date = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0, 23, 59, 59);

        const events = await Calendar.getEventsAsync(ids, start_date, end_date);
        setAllEvents(events);
        
        const marks: Record<string, any> = {};
        events.forEach(ev => {
          marks[isoDate(new Date(ev.startDate))] = { marked: true, dotColor: 'red' };
        });

        marks[selectedDate] = { 
          ...marks[selectedDate], 
          selected: true, 
          selectedColor: theme.colors.primary 
        };

        setMarkedDates(marks);
      } catch (e) {
        console.log("Erreur :", e);
      }
    })();
  }, [currentMonth, selectedDate]);

  // Filtrage des événements pour la date sélectionnée
  const dayEvents = allEvents.filter(ev => isoDate(new Date(ev.startDate)) === selectedDate);

  return (
    <View style={{ backgroundColor: theme.colors.background, padding: 10 }}>
      <RNCalendar
        current={isoDate(currentMonth)}
        onDayPress={(day) => setSelectedDate(day.dateString)}
        onMonthChange={(month) => setCurrentMonth(new Date(month.year, month.month - 1, 1))}
        markedDates={markedDates}
        theme={{ 
          calendarBackground: 'transparent', 
          dayTextColor: theme.colors.onSurface,
          selectedDayBackgroundColor: theme.colors.primary,
          todayTextColor: theme.colors.primary 
        }}
      />

      <Text style={{ fontWeight: 'bold', marginTop: 20, color: theme.colors.primary }}>
        Agenda du jour
      </Text>

      {dayEvents.length > 0 ? (
        dayEvents.map((ev, i) => (
          <View key={i} style={{ padding: 10, backgroundColor: theme.colors.surfaceVariant, marginTop: 8, borderRadius: 8 }}>
            <Text style={{ fontWeight: 'bold' }}>{ev.title}</Text>
            <Text style={{ fontSize: 12 }}>
                {ev.allDay ? "Journée entière" : new Date(ev.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </View>
        ))
      ) : (
        <Text style={{ color: theme.colors.outline, marginTop: 10, fontStyle: 'italic' }}>
          Aucun événement trouvé pour cette date.
        </Text>
      )}
    </View>
  );
}