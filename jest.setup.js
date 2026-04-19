/* global jest */

jest.mock('expo', () => ({}));
jest.mock('expo-constants', () => ({ manifest: {} }));
jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(async () => null),
  setItemAsync: jest.fn(async () => {}),
  deleteItemAsync: jest.fn(async () => {}),
}));

jest.mock('expo-router', () => ({
  useRouter: () => ({ push: jest.fn(), replace: jest.fn() }),
}));

// Mock AuthContext
jest.mock('@/context/AuthContext', () => {
  const React = require('react');
  return {
    AuthContext: React.createContext({ signIn: jest.fn() }),
  };
});

// Mock services / storage
// The real service file is at '@/services/auth'
jest.mock('@/services/auth', () => ({
  register: jest.fn(async () => ({ access_token: null, refresh_token: null })),
  login: jest.fn(async () => ({ access_token: null, refresh_token: null })),
}));
jest.mock('@/utils/storage', () => ({
  storage: {
    getItem: jest.fn(async () => null),
    setItem: jest.fn(async () => {}),
    removeItem: jest.fn(async () => {}),
  },
}));

// Mock native modules used by CustomCalendar to avoid async state updates during mount
jest.mock('expo-calendar', () => ({
  requestCalendarPermissionsAsync: jest.fn(async () => ({ status: 'granted' })),
  getCalendarsAsync: jest.fn(async () => []),
  getEventsAsync: jest.fn(async () => []),
  EntityTypes: { EVENT: 'event' },
}));

// Simplified Ionicons mock
jest.mock('@expo/vector-icons/Ionicons', () => {
  const React = require('react');
  const IoniconsMock = (props) =>
    React.createElement(
      'Text',
      { 'data-testid': 'ionicon', style: { color: props.color, fontSize: props.size } },
      props.name,
    );
  IoniconsMock.displayName = 'IoniconsMock';
  return IoniconsMock;
});

// Minimal DateTimePicker mock
jest.mock('@react-native-community/datetimepicker', () => {
  const React = require('react');
  const DateTimePickerMock = (props) => React.createElement('Text', { 'data-testid': 'datetimepicker' }, 'datetime');
  DateTimePickerMock.displayName = 'DateTimePickerMock';
  return DateTimePickerMock;
});
