# WR505 - Movie API - PACO GARCIA - 2024

### Prérequis

- [Node.js](https://nodejs.org/en/)
- [Npm](https://www.npmjs.com/get-npm)
- Projet Backend [WR506](https://github.com/GarciaPaco/SymfonyS5)

### Installation

1. Cloner le projet sur votre machine
2. Installer les dépendances avec :
    ```bash
    npm install
    ```
3. Créer le fichier .env.local et y renseigner les variables d'environnement nécessaires
    ```bash
    cp .env .env.local
    ```
4. Renseigner la variable suivante :
    ```dotenv
    VITE_SERVER_API_URL #(url de l'api)
    VITE_SERVER_API_URL_SHORT #(url de l'api)

    ```
5. Lancer le serveur
- Development
```bash
npm install
npm run dev
```
- Production
```bash
npm install
npm run build
```

L'identifiant pour se connecter a l'application est :
```
username : exemple1@gmail.com
password : test
```

### Fonctionnalités

- [x] Fixtures
- [x] Authentification
- [x] Assert
- [x] Recherche
- [x] Upload
- [x] Pagination
- [x] Modification et suppression des films
- [x] Pop-up confirmation avant suppression de film
- [x] Création d'un nouveau film  
