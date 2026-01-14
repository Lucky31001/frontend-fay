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
jest.mock('@/services/auth.service', () => ({
    register: jest.fn(async () => ({ access_token: null, refresh_token: null })),
}));
jest.mock('@/utils/storage', () => ({
    storage: {
        getItem: jest.fn(async () => null),
        setItem: jest.fn(async () => {}),
        removeItem: jest.fn(async () => {}),
    },
}));
