import React from 'react';
import { jest, describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { render, waitFor, fireEvent } from '@testing-library/react-native';
import { Alert } from 'react-native';
import EventScreen from '@/screen/EventScreen';
import CreateEventScreen from '@/screen/CreateEventScreen';
import * as eventService from '@/services/event';

jest.mock('@/services/event');

const mockPush = jest.fn();
jest.mock('expo-router', () => ({
  useRouter: () => ({ push: mockPush }),
}));

jest.mock('expo-image-picker', () => ({
  requestMediaLibraryPermissionsAsync: jest
    .fn<() => Promise<{ status: string }>>()
    .mockResolvedValue({ status: 'granted' }),
  launchImageLibraryAsync: jest
    .fn<() => Promise<{ canceled: boolean }>>()
    .mockResolvedValue({ canceled: true }),
  MediaTypeOptions: { Images: 'Images' },
}));

jest.mock('@/components/FieldInput', () => {
  const { TextInput, Text, View } = require('react-native');
  const MockFieldInput = ({ label, value, onChangeText, placeholder }: any) => (
    <View>
      <Text>{label}</Text>
      <TextInput
        testID={`input-${label.toLowerCase()}`}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
      />
    </View>
  );
  MockFieldInput.displayName = 'MockFieldInput';
  return MockFieldInput;
});

jest.mock('@/components/LocationPicker', () => {
  const { TextInput, View } = require('react-native');
  const MockLocationPicker = ({ value, onChange }: any) => (
    <View>
      <TextInput testID="input-location" value={value} onChangeText={onChange} />
    </View>
  );
  MockLocationPicker.displayName = 'MockLocationPicker';
  return MockLocationPicker;
});

jest.mock('@/components/EventTypeSelector', () => {
  const { Pressable, Text, View } = require('react-native');
  const MockEventTypeSelector = ({ value, onChange }: any) => (
    <View>
      <Pressable testID="select-type-soiree" onPress={() => onChange([...value, 'Soirée'])}>
        <Text>Soirée</Text>
      </Pressable>
    </View>
  );
  MockEventTypeSelector.displayName = 'MockEventTypeSelector';
  return MockEventTypeSelector;
});

jest.mock('@/components/CustomCalendar', () => {
  const { Pressable, Text, View } = require('react-native');
  const MockCustomCalendar = ({ onChange }: any) => (
    <View>
      <Pressable testID="select-date" onPress={() => onChange('2026-06-15T20:00:00Z')}>
        <Text>Choisir une date</Text>
      </Pressable>
    </View>
  );
  MockCustomCalendar.displayName = 'MockCustomCalendar';
  return MockCustomCalendar;
});

const mockEvent = {
  id: 1,
  name: 'Soirée Test',
  location: 'Paris',
  price: 10,
};


describe('EventScreen - Display events', () => {
  beforeEach(() => {
    (eventService.get_event as jest.Mock).mockResolvedValue([mockEvent]);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('fetches events and displays them', async () => {
    const { getByText } = render(<EventScreen />);

    await waitFor(() => expect(getByText('Soirée Test')).toBeTruthy());
    expect(getByText('Paris')).toBeTruthy();
    expect(getByText('10€')).toBeTruthy();
  });
});



describe('CreateEventScreen - Create event', () => {
  beforeEach(() => {
    (eventService.create_event as jest.Mock).mockResolvedValue(mockEvent);
    jest.spyOn(Alert, 'alert');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('does not submit when required fields are empty', () => {
    const { getByTestId } = render(<CreateEventScreen />);

    fireEvent.press(getByTestId('button-submit'));

    expect(eventService.create_event).not.toHaveBeenCalled();
  });

  it('fills all required fields and submits successfully', async () => {
    const { getByTestId } = render(<CreateEventScreen />);

    fireEvent.changeText(getByTestId('input-nom'), 'Soirée Test');
    fireEvent.changeText(getByTestId('input-location'), 'Paris');
    fireEvent.changeText(getByTestId('input-prix'), '10');
    fireEvent.changeText(getByTestId('input-note'), '4');
    fireEvent.changeText(getByTestId('input-capacité'), '100');
    fireEvent.press(getByTestId('select-type-soiree'));
    fireEvent.press(getByTestId('select-date'));

    fireEvent.press(getByTestId('button-submit'));

    await waitFor(() => {
      expect(eventService.create_event).toHaveBeenCalledTimes(1);
    });

    expect(eventService.create_event).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Soirée Test',
        location: 'Paris',
        price: '10',
        note: '4',
        capacity: '100',
        event_type: ['Soirée'],
        date: '2026-06-15T20:00:00Z',
      })
    );

    expect(Alert.alert).toHaveBeenCalledWith('Succès', "L'événement a été créé avec succès");
    expect(mockPush).toHaveBeenCalledWith('/(tabs)/event');
  });

  it('shows error alert when creation fails', async () => {
    (eventService.create_event as jest.Mock).mockRejectedValue(
      new Error('Erreur serveur')
    );

    const { getByTestId } = render(<CreateEventScreen />);

    fireEvent.changeText(getByTestId('input-nom'), 'Soirée Test');
    fireEvent.changeText(getByTestId('input-location'), 'Paris');
    fireEvent.changeText(getByTestId('input-prix'), '10');
    fireEvent.changeText(getByTestId('input-note'), '4');
    fireEvent.changeText(getByTestId('input-capacité'), '100');
    fireEvent.press(getByTestId('select-type-soiree'));
    fireEvent.press(getByTestId('select-date'));

    fireEvent.press(getByTestId('button-submit'));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('Erreur', 'Erreur serveur');
    });

    expect(mockPush).not.toHaveBeenCalled();
  });
});