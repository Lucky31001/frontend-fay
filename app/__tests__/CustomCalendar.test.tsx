import React from 'react';
import { describe, it, expect } from '@jest/globals';
import { render, screen } from '@testing-library/react-native';
import CustomCalendar from '@/components/CustomCalendar';

describe('CustomCalendar', () => {
  it("rend le composant agenda et le sélecteur d'heure", async () => {
    render(<CustomCalendar />);

    // use async findBy to ensure state updates are flushed (avoid act warnings)
    expect(await screen.findByText(/Mon Agenda/i)).toBeTruthy();
    // 'Heure' is shown when no date/time selected
    expect(await screen.findByText(/Heure/i)).toBeTruthy();
    // time button displays HH:MM format
    expect(await screen.findByText(/\d{1,2}:\d{2}/)).toBeTruthy();
  });
});
