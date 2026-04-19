import React from 'react';
import { describe, it, expect } from '@jest/globals';
import { render, screen } from '@testing-library/react-native';
import LoginScreen from '@/screen/LoginScreen';

describe('LoginScreen', () => {
  it('affiche correctement les champs principaux', () => {
    render(<LoginScreen />);

    expect(screen.getByPlaceholderText("Nom d'utilisateur")).toBeTruthy();
    expect(screen.getByPlaceholderText('Mot de passe')).toBeTruthy();
    expect(screen.getByText('Se connecter')).toBeTruthy();
  });
});
