import React from 'react';
import { jest, describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { render, waitFor } from '@testing-library/react-native';
import EventScreen from '@/screen/EventScreen';
import * as eventService from '@/services/event';


jest.mock('@/services/event');


const mockEvent = {
  id: 1,
  name: 'Soirée Test',
  location: 'Paris',
  price: 10,
};

const mockEventTypes = [
  { id: 1, name: 'Soirée' },
  { id: 2, name: 'Sport' },
];

describe('EventScreen', () => {
  beforeEach(() => {
    (eventService.get_event as jest.Mock).mockResolvedValue([mockEvent]);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // Start of the test
  it('fetches events and displays them', async () => {
    const { getByText } = render(<EventScreen />);

    await waitFor(() => expect(getByText('Soirée Test')).toBeTruthy());

    expect(getByText('Paris')).toBeTruthy();

    expect(getByText('10€')).toBeTruthy();
  });
});


describe('EventScreen EventType', () => {
  beforeEach(() => {
    (eventService.get_event_type as jest.Mock).mockResolvedValue(mockEventTypes);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('fetches event types and returns them', async () => {
    const result = await eventService.get_event_type();

    expect(result).toEqual(mockEventTypes);
    
    expect(eventService.get_event_type).toHaveBeenCalledTimes(1);
  });
});

describe('EventScreen CreateEvent', () => {
  beforeEach(() => {
    (eventService.create_event as jest.Mock).mockResolvedValue([mockEvent]);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('creates a new event and display them', async () => {
    const result = await eventService.create_event(mockEvent);

    expect(result).toEqual([mockEvent]);
  });
});