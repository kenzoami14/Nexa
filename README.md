# Nexa — Poké'Nexa

Portail responsive Nexa avec les rubriques Accueil, Serveurs et Actualités, une API HTTP et un flux SSE prêt pour le statut live Minecraft.

## Lancer

Node.js 20+ puis `npm start`, et ouvrir http://localhost:3000.

## Poké'Nexa

- Minecraft Java 1.21.1
- Fabric 0.19.5
- Adresse : 90.12.207.74
- Modpack export CurseForge : `frontend/downloads/pokenexa-modpack.zip`

Dans le ZIP du modpack, CurseForge liste les mods à télécharger : les joueurs peuvent importer le fichier dans CurseForge, ou le futur Nexa Desktop Launcher pourra installer le profil.

Le statut et le nombre de joueurs sont volontairement inconnus avant branchement à une API Minecraft. `/api/events` est prêt à diffuser les mises à jour SSE. Le clic sur le logo Nexa cinq fois ouvre la photo surprise.

## API

- `GET /api/health`
- `GET /api/servers`
- `GET /api/events` (SSE)
- `GET /api/launcher/manifest/pokenexa`

## Déploiement Render

Le dépôt inclut un Dockerfile et `render.yaml`. Après connexion du dépôt GitHub à Render, chaque push sur la branche reliée peut déclencher un déploiement automatique.
