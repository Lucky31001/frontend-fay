import React from 'react';
import { render, screen } from '@testing-library/react-native';
import RegisterScreen from '@/screen/RegisterScreen';

describe('RegisterScreen', () => {
    it('affiche correctement les champs principaux', () => {
        render(<RegisterScreen />);

        expect(screen.getByPlaceholderText("Nom d'utilisateur")).toBeTruthy();
        expect(screen.getByPlaceholderText('Email')).toBeTruthy();
        expect(screen.getByPlaceholderText('Mot de passe')).toBeTruthy();
        expect(screen.getByText("S\u2019inscrire")).toBeTruthy();
    });
});
