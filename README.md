# FAY — Application mobile (Expo)

Ce dépôt contient l'application mobile "FAY" développée avec Expo et React Native (router Expo). Ce README donne les instructions essentielles pour installer, lancer et contribuer au projet.

## Prérequis

- Node.js (14.x+ recommandé)
- npm
- Expo CLI est optionnel (nous utilisons `npx expo` dans les scripts)
- Un émulateur Android/iOS ou l'application Expo Go pour tester sur un appareil

Remarque sur les dépendances natives

- Certaines fonctionnalités utilisent des modules natifs/expo :
  - `@react-native-community/datetimepicker` (sélecteur d'heure natif)
  - `expo-image-picker` (sélection d'image depuis la galerie)
  - `expo-image-manipulator` (recadrage/redimensionnement côté client)
  - `expo-location` (géolocalisation + reverse-geocode)
  - `react-native-toast-message` (toasts globaux)

## Installation

1. Installer les dépendances :

   ```bash
   npm install
   ```

2. Lancer l'application en développement :

   ```bash
   npm start
   # ou
   npx expo start
   ```

   Pour démarrer directement sur un appareil/émulateur :

   ```bash
   npm run android
   npm run ios
   npm run web
   ```

## Scripts utiles (dans `package.json`)

- `npm start` — démarre le serveur Expo
- `npm run android` — démarre Expo et ouvre un appareil Android (émulateur ou appareil connecté)
- `npm run ios` — démarre Expo et ouvre un simulateur iOS (macOS seulement)
- `npm run web` — lance la version web
- `npm test` — lance la suite de tests (Jest)
- `npm run test:watch` — exécute les tests en mode watch
- `npm run lint` — exécute ESLint sur le projet
- `npm run format` — formate le code avec Prettier
- `npm run reset-project` — script utilitaire fourni qui réinitialise la structure (fourni par le template)

## Structure du projet (points principaux)

- `app/` — code des écrans et routes (file-based routing d'Expo Router)
  - `index.tsx` — point d'entrée des écrans
  - `login.tsx`, `RegisterScreen`, etc. — écrans principaux
- `components/` — composants réutilisables
- `screen/` — écrans non-routés (utilisés par l'app)
- `services/` — appels réseau / services (ex : `auth.ts`, `event.ts`)
- `context/` — context React (ex : `AuthContext.tsx`)
- `utils/` — utilitaires et client HTTP
- `assets/` — images et ressources statiques
- `types/` — types TypeScript partagés

  Remarque : le projet utilise TypeScript. Le fichier `tsconfig.json` est fourni.

## Configuration et variables d'environnement

Les appels réseau utilisent les services dans `services/`. Si l'application consomme une API distante, définissez l'URL de l'API dans `constant/urls.ts` ou via une approche d'environnement si vous préférez (ex : `app.config.js`, ou fichiers `.env` + `babel-plugin-inline-dotenv`).

Fonctionnalités importantes

- Sélecteur de date/heure : le composant `CustomCalendar` permet de choisir la date et l'heure (utilise le picker natif pour l'heure).
- Localisation : `LocationPicker` propose l'autocompletion d'adresses via Nominatim (OpenStreetMap) et un bouton "Utiliser ma position" (reverse-geocode via `expo-location`).
- Upload d'images : l'écran de création d'événement permet de choisir une image depuis la galerie, elle est recadrée et redimensionnée côté client pour correspondre au rendu des cartes (utilise `expo-image-manipulator`).
- Liste d'événements : l'écran liste ouvre un modal de détail (`EventDetailsModal`) quand on tape un événement (image, types overlay, date, lieu, note, prix, bouton pour ouvrir dans Maps).
- Toasts : les erreurs réseau et messages utilisateur s'affichent via `react-native-toast-message`.

Note : l'autocomplétion d'adresse utilise Nominatim (gratuit). Si vous préférez Google Places, une intégration peut être ajoutée mais nécessite une clé API et restrictions d'usage.

## Tests

Ce projet utilise Jest et `@testing-library/react-native`. Pour lancer les tests :

```bash
npm test
```

Pour lancer un seul test en mode watch :

```bash
npm run test:watch
```

## Linting & Format

- Linter : ESLint
- Formatteur : Prettier

Pour vérifier le lint :

```bash
npm run lint
```

Pour formater le code :

```bash
npm run format
```

## Développement & bonnes pratiques

- Respecter les conventions TypeScript et garder les composants petits et testables.
- Placer la logique réseau dans `services/` et l'état global dans `context/`.
- Ajouter des tests pour les composants critiques (écrans d'authentification, flux d'événement, etc.).

Tips pour le développement local

- Si vous modifiez des dépendances natives, redémarrez Metro avec :

```bash
npx expo start -c
```

- Pour tester l'accès à la galerie et à la localisation, testez sur un appareil physique ou un émulateur qui supporte ces permissions.

- Formattage décimal : les champs `Prix` et `Note` acceptent la virgule comme séparateur décimal dans l'UI (ex. `10,50`). Avant envoi au backend ces valeurs sont normalisées (`,` -> `.`).

## Déploiement

Pour publier en production, créez un build Expo (via EAS ou `expo build` selon votre configuration).

## Contribution

1. Forker le dépôt et créer une branche feature/bugfix
2. Ouvrir une Pull Request décrivant les changements
3. Ajouter des tests pour les modifications critiques

## Ressources

- Expo : https://expo.dev
- Expo Router : https://expo.dev/router
- React Native : https://reactnative.dev
- TypeScript : https://www.typescriptlang.org
- Jest : https://jestjs.io
- React Testing Library : https://testing-library.com/docs/react-native-testing-library/intro
- ESLint : https://eslint.org
- Prettier : https://prettier.io
- Axios : https://axios-http.com
- Ionicons : https://ionic.io/ionicons
- Nominatim : https://nominatim.org/release-docs/latest/api/Search/
