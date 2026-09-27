# Nexa — site communauté Minecraft

Une première version déployable du portail Nexa, avec une interface responsive, une API HTTP et des mises à jour instantanées via Server-Sent Events (SSE). Le jeu de données est simulé et ne contacte aucun serveur Minecraft réel.

## Démarrer

Prérequis : Node.js 20 ou plus récent. Aucune dépendance à installer.

```sh
npm start
```

Ouvrir [http://localhost:3000](http://localhost:3000). Pour le rechargement automatique en développement : `npm run dev`.

## Organisation

- `frontend/` — site servi directement, sans étape de compilation.
- `backend/server.js` — serveur HTTP, API JSON, flux live SSE et fichiers statiques.
- `backend/servers.js` — données de démonstration à remplacer par une source réelle.

## API

- `GET /api/health` — santé du service.
- `GET /api/servers` — liste des serveurs et informations publiques.
- `GET /api/servers/:id` — détail d’un serveur.
- `GET /api/events` — flux SSE; l’événement `servers` transmet l’état complet toutes les 12 secondes.
- `GET /api/launcher/manifest/:id` — manifeste versionné destiné au futur launcher Nexa Desktop.

Le client utilise `EventSource`, qui gère la reconnexion automatiquement. SSE permet ici des mises à jour temps réel du serveur vers les navigateurs. Une future communication bidirectionnelle avec le launcher pourra ajouter un endpoint WebSocket sans changer le format des données (`schemaVersion`, `serverId`, versions, modpack et adresse).

## Déploiement

Le `Dockerfile` est prêt pour les plateformes acceptant Docker. Le fichier `render.yaml` permet aussi un déploiement Render depuis le dépôt. Le service écoute le port fourni dans `PORT` et expose `/api/health` pour le contrôle de santé. Pour publier le projet, connecter le dépôt à Render et lancer le déploiement du service.

## Avant la mise en production

Remplacer les données dans `backend/servers.js` par l’état d’une API Minecraft ou d’une base de données; relier les manifestes aux fichiers de modpack réellement hébergés; configurer le domaine et le HTTPS sur la plateforme. Le bouton « Se connecter » copie l’adresse du serveur : le navigateur ne peut pas lancer Minecraft directement sans le launcher desktop. Le formulaire « Être informé » est un lien de contact de démonstration.
