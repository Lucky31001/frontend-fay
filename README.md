# FAY — Application mobile (Expo)

Ce dépôt contient l'application mobile "FAY" développée avec Expo et React Native (router Expo). Ce README donne les instructions essentielles pour installer, lancer et contribuer au projet.

## Prérequis

- Node.js (14.x+ recommandé)
- npm
- Expo CLI est optionnel (nous utilisons `npx expo` dans les scripts)
- Un émulateur Android/iOS ou l'application Expo Go pour tester sur un appareil

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
- `services/` — appels réseau / services (ex : `auth.service.ts`, `event.service.ts`)
- `context/` — context React (ex : `AuthContext.tsx`)
- `utils/` — utilitaires et client HTTP
- `assets/` — images et ressources statiques
- `types/` — types TypeScript partagés

  Remarque : le projet utilise TypeScript. Le fichier `tsconfig.json` est fourni.

## Configuration et variables d'environnement

Les appels réseau utilisent les services dans `services/`. Si l'application consomme une API distante, définissez l'URL de l'API dans `constant/urls.ts` ou via une approche d'environnement si vous préférez (ex : `app.config.js`, ou fichiers `.env` + `babel-plugin-inline-dotenv`).

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

## Déploiement

Pour publier en production, créez un build Expo (via EAS ou `expo build` selon votre configuration). Ce README ne couvre pas la configuration EAS ; si nécessaire, je peux ajouter une section dédiée.

## Contribution

1. Forker le dépôt et créer une branche feature/bugfix
2. Ouvrir une Pull Request décrivant les changements
3. Ajouter des tests pour les modifications critiques

## Ressources

- Expo : https://expo.dev
- Expo Router : https://expo.dev/router
- React Native : https://reactnative.dev

---

Si vous voulez, je peux :

- Ajouter une section pour la configuration EAS (builds) si vous utilisez EAS
- Générer un fichier `.env.example` et une petite section expliquant les variables d'API
- Traduire certaines parties du code ou ajouter un guide de contribution plus détaillé

Dites-moi ce que vous préférez.
