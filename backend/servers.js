// Source initiale en attente d'une vraie API Minecraft pour le statut et les joueurs.
export const servers = [
  {
    id: 'pokenexa',
    name: "Poké'Nexa",
    game: 'Minecraft Java',
    version: '1.21.1',
    loader: 'Fabric',
    loaderName: 'fabric',
    loaderVersion: null,
    pack: "Poké'Nexa",
    packVersion: null,
    address: '90.12.207.74',
    downloadUrl: '/downloads/pokenexa-modpack.zip',
    status: 'unknown',
    players: null,
    maxPlayers: null,
    latency: null,
    description: 'Rejoins l’aventure Poké’Nexa.',
    category: 'Aventure'
  }
];

export function publicServers() {
  return servers.map(({ ...server }) => server);
}
