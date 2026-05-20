# FAY Frontend — Manuel développeur

> Documentation pour l’installation, l’exécution et la contribution au projet frontend mobile FAY.

## Sommaire

* [1. Vue d’ensemble](./#1-vue-densemble)
* [2. Stack technique](./#2-stack-technique)
* [3. Prérequis](./#3-prérequis)
* [4. Installation](./#4-installation)
* [5. Lancement en local](./#5-lancement-en-local)
* [6. Scripts disponibles](./#6-scripts-disponibles)
* [7. Configuration et variables d’environnement](./#7-configuration-et-variables-denvironnement)
* [8. Structure du projet](./#8-structure-du-projet)
* [9. Qualité (lint/tests)](./#9-qualité-linttests)
* [10. Workflow de contribution](./#10-workflow-de-contribution)
* [11. CI](./#11-ci)
* [12. Dépannage rapide](./#12-dépannage-rapide)
* [13. Ressources](./#13-ressources)

***

## 1. Vue d’ensemble

Ce dépôt contient l’application mobile **FAY** développée avec **Expo**, **React Native** et **Expo Router**.

Objectif de ce document : fournir un **manuel d’utilisation pour développeur** (onboarding + maintenance quotidienne).

## 2. Stack technique

* Expo SDK 54
* React Native 0.81
* React 19
* TypeScript
* Expo Router
* Jest + Testing Library React Native
* ESLint + Prettier

## 3. Prérequis

* Node.js 20 recommandé (aligné CI)
* npm
* Émulateur Android/iOS ou Expo Go sur appareil

## 4. Installation

```bash
npm install
```

## 5. Lancement en local

```bash
npm start
```

Autres cibles :

```bash
npm run android
npm run ios
npm run web
```

## 6. Scripts disponibles

* `npm start` : démarre Expo (avec cache reset)
* `npm run android` : lance l’app sur Android
* `npm run ios` : lance l’app sur iOS (macOS)
* `npm run web` : lance la version web
* `npm test` : lance Jest
* `npm run test:watch` : tests en watch mode
* `npm run lint` : lint ESLint
* `npm run format` : formatage Prettier

## 7. Configuration et variables d’environnement

Le projet utilise `app.config.js` + `.env`.

Variable principale :

* `API_BASE_URL` : URL de base de l’API (exposée via `expo.extra.API_BASE_URL`)

Exemple `.env` :

```bash
API_BASE_URL=https://api.example.com
```

> Note : `app.json` a été renommé en `app.json.bak` pour éviter un conflit avec la config dynamique.

## 8. Structure du projet

* `app/` : routes et écrans (Expo Router)
* `components/` : composants UI réutilisables
* `screen/` : écrans métier
* `services/` : appels API (auth, events, profile, follow)
* `context/` : contextes React (auth, thème)
* `utils/` : client HTTP, stockage, helpers
* `constant/` : constantes globales
* `types/` : types TypeScript
* `assets/` : ressources statiques

## 9. Qualité (lint/tests)

Lint :

```bash
npm run lint
```

Tests :

```bash
npm test
```

CI utilise aussi :

```bash
npx expo-doctor
```

## 10. Workflow de contribution

1. Créer une branche feature/fix
2. Faire les changements ciblés
3. Vérifier lint + tests
4. Ouvrir une Pull Request claire

## 11. CI

Le workflow GitHub Actions (`.github/workflows/ci.yml`) exécute :

1. `npm ci`
2. `npx expo-doctor` (non bloquant)
3. `npm run lint`
4. `npx jest --runInBand --colors --verbose`

## 12. Dépannage rapide

* Problème cache Metro :

```bash
npx expo start -c
```

* Problèmes de permissions (galerie/localisation) : tester sur appareil réel ou émulateur correctement configuré.

## 13. Ressources

* Expo : https://expo.dev
* Expo Router : https://expo.dev/router
* React Native : https://reactnative.dev
* Jest : https://jestjs.io
* Testing Library RN : https://testing-library.com/docs/react-native-testing-library/intro
* ESLint : https://eslint.org
* Prettier : https://prettier.io
