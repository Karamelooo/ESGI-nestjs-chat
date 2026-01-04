# ESGI NestJS Chat

Une application de chat moderne et en temps réel construite avec **NestJS**, **Vue 3** et **Socket.IO**.

## Fonctionnalités

- **Messagerie en temps réel** : Livraison instantanée des messages via WebSockets.
- **Salons (Rooms)** : Créez, rejoignez et gérez des salons de discussion.
  - **# Général** : Salon par défaut pour tous les utilisateurs.
  - **Salons Privés** : Créez des salons nommés avec des membres spécifiques.
  - **Suppression de Salon** : Les propriétaires peuvent supprimer leurs salons (avec confirmation de sécurité).
- **Système Utilisateur** :
  - Inscription & Connexion (Auth JWT).
  - Personnalisation du profil (Nom d'utilisateur, Couleur d'avatar).
  - Indicateurs de frappe.
  - Statut utilisateur (En ligne).
- **Interactions Riches** :
  - Réactions Emoji sur les messages.
  - Persistance de l'historique des messages.
- **UI/UX** :
  - **Design Moderne** : Esthétique avec glassmorphism et transitions fluides.
  - **Mode Sombre/Clair** : Support complet du changement de thème.
  - **Responsive** : Fonctionne sur ordinateur et mobile.

## DStack Technique

- **Frontend** : Vue 3, Vite, Pinia, TailwindCSS, Shadcn-vue (Radix UI), Lucide Icons.
- **Backend** : NestJS, Socket.IO, Prisma (PostgreSQL).
- **Base de Données** : PostgreSQL.
- **Infrastructure** : Docker

## Installation & Configuration

### Prérequis

- Docker

### Démarrage Rapide (Docker)

1.  **Cloner le dépôt**

    ```bash
    git clone git@github.com:Karamelooo/ESGI-nestjs-chat.git
    cd ESGI-nestjs-chat
    ```

2.  **Démarrer l'application**

    ```bash
    docker compose up -d --build
    ```

    Cela démarrera :

    - Base de données PostgreSQL sur le port `5432`
    - API Backend sur le port `3000`
    - Frontend sur le port `5173`

3.  **Initialiser les migrations**

    ```bash
    docker compose exec back npx prisma migrate deploy
    ```

4.  **Accéder à l'application**
    Ouvrez [http://localhost:5173](http://localhost:5173) dans votre navigateur.

## Variables d'Environnement

Le projet utilise des valeurs par défaut pour le développement, mais vous pouvez les configurer via des fichiers `.env` dans les dossiers `back/` et `front/` si nécessaire.

**Backend (.env)**

```env
DATABASE_URL="postgresql://user:password@localhost:5432/nestchat?schema=public"
JWT_SECRET="supersecretkey"
```

**Frontend (.env)**

```env
VITE_API_URL="http://localhost:3000"
```
