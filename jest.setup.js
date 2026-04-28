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

// Ensure navigation focus effects run in tests so screens fetch data immediately
jest.mock('@react-navigation/native', () => ({
  // Minimal mock: schedule the provided focus effect to run asynchronously so it happens after mount
  useFocusEffect: (cb) => {
    try {
      setTimeout(() => {
        try {
          cb();
        } catch (e) {
          // ignore
        }
      }, 0);
    } catch (e) {
      // ignore
    }
    return undefined;
  },
}));

// Mock AuthContext with common helpers used in screens (hasRole, signIn, signOut)
jest.mock('@/context/AuthContext', () => {
  const React = require('react');
  return {
    AuthContext: React.createContext({
      signIn: jest.fn(),
      signOut: jest.fn(),
      hasRole: () => false,
    }),
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

// Provide a default mock for event service; tests can override this with jest.mock in specific suites
jest.mock('@/services/event', () => ({
  get_event: jest.fn(async () => []),
  get_event_type: jest.fn(async () => []),
  create_event: jest.fn(async () => ({})),
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

// Mock react-native-paper theme and simple components used in screens so tests don't need a Provider
jest.mock('react-native-paper', () => {
  const React = require('react');
  const { Text } = require('react-native');
  const useTheme = () => ({
    colors: { background: '#fff', onSurface: '#000', surface: '#fff', outline: '#ccc', primary: '#6200ee', error: '#b00020' },
  });

  const IconButton = (props) => React.createElement(Text, { onPress: props.onPress, 'data-testid': 'icon-button' }, props.icon || 'icon');
  const Button = (props) => React.createElement(Text, { onPress: props.onPress, 'data-testid': 'button' }, props.children);

  return { useTheme, IconButton, Button };
});

// Minimal DateTimePicker mock
jest.mock('@react-native-community/datetimepicker', () => {
  const React = require('react');
  const DateTimePickerMock = (props) =>
    React.createElement('Text', { 'data-testid': 'datetimepicker' }, 'datetime');
  DateTimePickerMock.displayName = 'DateTimePickerMock';
  return DateTimePickerMock;
});
