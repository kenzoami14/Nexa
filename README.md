# Nexa — site communauté Minecraft

Le portail Nexa est organisé en trois rubriques : Accueil, Serveurs et Actualités. Le site est responsive et livré avec une API HTTP ainsi qu’un flux temps réel SSE, prêt à recevoir l’état d’une véritable API Minecraft.

## Démarrer

Prérequis : Node.js 20 ou plus récent. Aucune dépendance à installer.

```sh
npm start
```

Ouvrir [http://localhost:3000](http://localhost:3000).

## Organisation

- `frontend/` — site web responsive.
- `backend/server.js` — serveur HTTP, API JSON, flux SSE et fichiers statiques.
- `backend/servers.js` — configuration initiale de Poké'Nexa.

## Serveur configuré

- Adresse : `90.12.207.74`
- Minecraft : `1.21.1`
- Loader : Fabric

Les valeurs de statut et de joueurs ne sont pas simulées : elles restent inconnues jusqu’au branchement d’une source Minecraft réelle.

## API

- `GET /api/health` — santé du service.
- `GET /api/servers` — liste et configuration publique des serveurs.
- `GET /api/servers/:id` — détail d’un serveur.
- `GET /api/events` — flux SSE, prêt à pousser les changements d’état.
- `GET /api/launcher/manifest/:id` — manifeste destiné au futur launcher Nexa Desktop.

## Déploiement

Le `Dockerfile` et `render.yaml` sont inclus. Le service écoute le port transmis dans `PORT`; `/api/health` peut servir de contrôle de santé. Le frontend et le backend sont hébergés ensemble par le service Node, tout en restant séparés dans deux dossiers.

Le bouton « Copier l’adresse » copie l’IP du serveur. Un site web ne peut pas démarrer Minecraft directement : cela nécessitera plus tard le launcher Nexa Desktop.
