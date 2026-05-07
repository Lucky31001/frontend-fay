import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, TextInput, ScrollView, Modal } from 'react-native';
import { useTheme, Button, IconButton } from 'react-native-paper';
import { get_event_type } from '@/services/event';

type Props = {
  visible: boolean;
  onClose: () => void;
  onSelect?: (selected: string[]) => void;
}

export default function SelectEventTypeModal({ visible, onClose, onSelect }: Props) {
  const theme = useTheme();
  
  const [types, setTypes] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const data = await get_event_type();
        setTypes(data || []);
      } catch (error) {
        console.error('Error fetching event types:', error);
      }
    };

    if (visible) fetchTypes();
  }, [visible]);

  const filtered = types.filter((t) =>
    (t.name || t).toLowerCase().includes(search.toLowerCase())
  );

  const toggleType = (typeName: string) => {
    setSelectedTypes((prev) =>
      prev.includes(typeName)
        ? prev.filter((i) => i !== typeName)
        : [...prev, typeName]
    );
  };

  const handleValidate = () => {
    onSelect?.(selectedTypes);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={{ flex: 1, backgroundColor: theme.colors.background, padding: 16, paddingTop: 52 }}>
        
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: theme.colors.onSurface }}>
            Filtrer par type
          </Text>
          <IconButton icon="close" onPress={onClose} />
        </View>

        <TextInput
          placeholder="Rechercher un type..."
          placeholderTextColor={theme.colors.onSurfaceVariant}
          value={search}
          onChangeText={setSearch}
          style={{
            borderWidth: 1,
            borderColor: theme.colors.outline,
            paddingHorizontal: 12,
            paddingVertical: 10,
            borderRadius: 8,
            marginBottom: 16,
            color: theme.colors.onSurface,
            backgroundColor: theme.colors.surfaceVariant,
          }}
        />

        <ScrollView contentContainerStyle={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {filtered.map((t) => {
            const typeName = t.name || t;
            const isSelected = selectedTypes.includes(typeName);
            
            return (
              <Pressable
                key={typeName}
                onPress={() => toggleType(typeName)}
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  borderRadius: 20,
                  backgroundColor: isSelected ? theme.colors.primary : theme.colors.surfaceVariant,
                  borderWidth: 1,
                  borderColor: isSelected ? theme.colors.primary : theme.colors.outline,
                }}
              >
                <Text style={{ color: isSelected ? theme.colors.onPrimary : theme.colors.onSurface }}>
                  {typeName}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <Button 
          mode="contained" 
          onPress={handleValidate}
          style={{ marginTop: 16, borderRadius: 8 }}
        >
          Valider ({selectedTypes.length})
        </Button>
      </View>
    </Modal>
  );
}