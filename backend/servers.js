// Remplacez ces valeurs par une source persistante ou une API Minecraft réelle.
export const servers = [
  { id: 'pokenexa', name: "Poké'Nexa", game: 'Minecraft Java', version: '1.20.1', loader: 'Forge 47.4.23', pack: 'PokéNexa · Saison 3', packVersion: '1.4.2', address: 'play.pokenexa.fr', status: 'online', players: 18, maxPlayers: 60, latency: 32, category: 'Aventure', accent: '#b7f36b', description: 'Attrape, entraîne et fais évoluer tes Pokémon dans un monde ouvert partagé.' },
  { id: 'fucking-fog', name: 'Fucking Fog', game: 'Minecraft Java', version: '1.20.1', loader: 'Forge 47.4.23', pack: 'Fogbound Survival', packVersion: '2.8.0', address: 'fog.nexa.gg', status: 'online', players: 7, maxPlayers: 32, latency: 48, category: 'Survie', accent: '#a78bfa', description: 'Une survie exigeante, mystérieuse et coopérative, enveloppée dans le brouillard.' },
  { id: 'medieval-rp', name: 'Royaumes oubliés', game: 'Minecraft Java', version: '1.21.1', loader: 'NeoForge 21.1.80', pack: 'Nexa Medieval RP', packVersion: '1.2.0', address: 'medieval.nexa.gg', status: 'maintenance', players: 0, maxPlayers: 48, latency: null, category: 'Roleplay', accent: '#f4b860', description: 'Bâtis ton histoire dans un royaume vivant, avec métiers, quêtes et factions.' },
  { id: 'nexa-vanilla', name: 'Nexa Vanilla+', game: 'Minecraft Java', version: '1.21.1', loader: 'Vanilla', pack: 'Vanilla+ communautaire', packVersion: '1.0.6', address: 'vanilla.nexa.gg', status: 'online', players: 24, maxPlayers: 100, latency: 21, category: 'Communauté', accent: '#67e8c1', description: 'Minecraft comme on l’aime, avec quelques améliorations et une communauté active.' }
];

export function publicServers() {
  return servers.map(({ id, name, game, version, loader, pack, packVersion, address, status, players, maxPlayers, latency, category, accent, description }) => ({ id, name, game, version, loader, pack, packVersion, address, status, players, maxPlayers, latency, category, accent, description }));
}
