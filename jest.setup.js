/* eslint-disable no-unused-vars */
/* global jest */
const React = require('react');
const { Text } = require('react-native');

// ─── Expo & Navigation ────────────────────────────────────────────────────────
jest.mock('expo', () => ({}));
jest.mock('expo-constants', () => ({ manifest: {} }));
jest.mock('expo-router', () => ({ useRouter: () => ({ push: jest.fn(), replace: jest.fn() }) }));
jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(async () => null),
  setItemAsync: jest.fn(async () => {}),
  deleteItemAsync: jest.fn(async () => {}),
}));
jest.mock('expo-calendar', () => ({
  requestCalendarPermissionsAsync: jest.fn(async () => ({ status: 'granted' })),
  getCalendarsAsync: jest.fn(async () => []),
  getEventsAsync: jest.fn(async () => []),
  EntityTypes: { EVENT: 'event' },
}));

// Run focus effects immediately so screens fetch data in tests
jest.mock('@react-navigation/native', () => ({
  useFocusEffect: (cb) => {
    try {
      setTimeout(() => {
        try {
          cb();
        } catch {}
      }, 0);
    } catch {}
  },
}));

// ─── App Context & Services ───────────────────────────────────────────────────
jest.mock('@/context/AuthContext', () => ({
  AuthContext: React.createContext({ signIn: jest.fn(), signOut: jest.fn(), hasRole: () => false }),
}));
jest.mock('@/services/auth', () => ({
  register: jest.fn(async () => ({ access_token: null, refresh_token: null })),
  login: jest.fn(async () => ({ access_token: null, refresh_token: null })),
}));
jest.mock('@/services/event', () => ({
  get_event: jest.fn(async () => []),
  get_event_type: jest.fn(async () => []),
  create_event: jest.fn(async () => ({})),
}));
jest.mock('@/utils/storage', () => ({
  storage: {
    getItem: jest.fn(async () => null),
    setItem: jest.fn(async () => {}),
    removeItem: jest.fn(async () => {}),
  },
}));

// ─── UI Components ────────────────────────────────────────────────────────────

jest.mock('@expo/vector-icons/Ionicons', () => {
  const Mock = (props) =>
    React.createElement(
      Text,
      { 'data-testid': 'ionicon', style: { color: props.color, fontSize: props.size } },
      props.name,
    );
  Mock.displayName = 'IoniconsMock';
  return Mock;
});
jest.mock('@react-native-community/datetimepicker', () => {
  const Mock = () => React.createElement(Text, { 'data-testid': 'datetimepicker' }, 'datetime');
  Mock.displayName = 'DateTimePickerMock';
  return Mock;
});
jest.mock('react-native-paper', () => ({
  useTheme: () => ({
    colors: {
      background: '#fff',
      onSurface: '#000',
      surface: '#fff',
      outline: '#ccc',
      primary: '#6200ee',
      error: '#b00020',
    },
  }),
  IconButton: (props) =>
    React.createElement(
      Text,
      { onPress: props.onPress, 'data-testid': 'icon-button' },
      props.icon ?? 'icon',
    ),
  Button: (props) =>
    React.createElement(Text, { onPress: props.onPress, 'data-testid': 'button' }, props.children),
}));
