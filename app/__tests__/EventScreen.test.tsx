import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react-native';
import EventScreen from './EventScreen';
import { get_event } from '@/services/event';

// Simulation de la fonction get_event
jest.mock('@/services/event', () => ({
  get_event: jest.fn(),
}));

// 2. Mock du contexte d'auth (pour éviter les erreurs de Provider)
jest.mock('@/context/AuthContext', () => ({
  AuthContext: {
    Consumer: ({ children }: any) => children({ hasRole: () => true }),
  },
}));

describe('EventScreen', () => {
  it('doit afficher la liste des événements venant du back', async () => {
    // 3. La réponse "Vraie" mimée (JSON exact de ton test back)
    const data = [
      {
        id: 1,
        name: "soirée déguisées no limit",
        location: "Paris",
        price: 35,
        description: "Un super event",
        event_types: ["Jazz", "Electro"],
        note: 5.0,
      }
    ];

    // Quand get event est appelé on renvoie la reponse
    (get_event as jest.Mock).mockResolvedValue(mockBackResponse);

    const { getByText } = render(<EventScreen />);

    // 4. Vérification KISS : Est-ce que le nom de l'event apparaît ?
    await waitFor(() => {
      expect(getByText('soirée déguisées no limit')).toBeTruthy();
    });
    
    expect(getByText('Paris')).toBeTruthy();
  });

  it('doit afficher un message d’erreur en cas de faille du back', async () => {
    // On simule une erreur 500 ou réseau
    (get_event as jest.Mock).mockRejectedValue(new Error('Erreur API 500'));

    const { getByText } = render(<EventScreen />);

    await waitFor(() => {
      expect(getByText('Erreur API 500')).toBeTruthy();
    });
  });
});