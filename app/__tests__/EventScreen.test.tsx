import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import EventScreen from '@/screen/EventScreen';
import * as eventService from '@/services/event';

jest.mock('@/services/event');

const sampleEvent = {
  id: 1,
  name: 'Soirée Test',
  location: 'Paris',
  price: 10,
};

describe('EventScreen', () => {
  beforeEach(() => {
    (eventService.get_event as jest.Mock).mockResolvedValue([sampleEvent]);
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
