const grid = document.querySelector('#server-grid');
const indicator = document.querySelector('#live-indicator');
const toast = document.querySelector('#toast');
let allServers = [];
let activeFilter = 'all';
let toastTimer;

const esc = (value) => String(value).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const statusLabel = (status) => status === 'online' ? 'En ligne' : status === 'maintenance' ? 'Maintenance' : 'Hors ligne';

function card(server) {
  const online = server.status === 'online';
  const players = online ? `<span class="player-icon">♟</span> ${server.players}<i>/</i>${server.maxPlayers}` : `<span class="player-icon">—</span> Indisponible`;
  return `<article class="server-card" style="--accent:${esc(server.accent)}">
    <div class="card-art art-${esc(server.id)}"><div class="card-planet"></div><div class="card-moon"></div><span class="art-coordinate">${esc(server.category.toUpperCase())} <b>✳</b></span><span class="art-number">${String(allServers.indexOf(server) + 1).padStart(2, '0')}</span></div>
    <div class="card-content"><div class="card-status ${esc(server.status)}"><span></span>${statusLabel(server.status)}</div><div class="card-title-row"><div><h3>${esc(server.name)}</h3><p>${esc(server.description)}</p></div><span class="card-arrow">↗</span></div>
    <div class="card-stats"><div><span class="stat-label">JOUEURS</span><b>${players}</b></div><div><span class="stat-label">VERSION</span><b>${esc(server.version)}</b></div></div>
    <div class="pack-row"><span class="pack-icon">▦</span><span><small>MODPACK · ${esc(server.packVersion)}</small><b>${esc(server.pack)}</b></span><span class="loader-tag">${esc(server.loader)}</span></div>
    <div class="card-actions"><button class="button ${online ? 'button-card' : 'button-muted'}" data-connect="${esc(server.id)}" ${online ? '' : 'disabled'}>${online ? 'Se connecter' : 'Bientôt de retour'} <span>↗</span></button><button class="icon-button" data-copy="${esc(server.address)}" aria-label="Copier l’adresse du serveur">⧉</button></div></div></article>`;
}

function render() {
  const shown = allServers.filter((s) => activeFilter === 'all' || (activeFilter === 'online' ? s.status === 'online' : s.category === activeFilter));
  grid.innerHTML = shown.length ? shown.map(card).join('') : '<div class="empty-state">Aucun serveur dans cette catégorie pour le moment.</div>';
  document.querySelector('#count-all').textContent = String(allServers.length).padStart(2, '0');
}

function update(servers) { allServers = servers; render(); }
async function load() {
  try {
    const response = await fetch('/api/servers');
    if (!response.ok) throw new Error('API indisponible');
    update((await response.json()).servers);
  } catch { indicator.textContent = 'Mode hors ligne'; indicator.classList.add('offline'); }
}

const events = new EventSource('/api/events');
events.addEventListener('servers', (event) => {
  update(JSON.parse(event.data).servers);
  indicator.textContent = 'Connecté'; indicator.classList.remove('offline');
});
events.onopen = () => { indicator.textContent = 'Connecté'; indicator.classList.remove('offline'); };
events.onerror = () => { indicator.textContent = 'Reconnexion…'; indicator.classList.add('offline'); };
load();

document.querySelector('.filters').addEventListener('click', (event) => {
  const button = event.target.closest('[data-filter]');
  if (!button) return;
  activeFilter = button.dataset.filter;
  document.querySelectorAll('.filter').forEach((item) => item.classList.toggle('active', item === button));
  render();
});
grid.addEventListener('click', async (event) => {
  const connect = event.target.closest('[data-connect]');
  const copy = event.target.closest('[data-copy]');
  if (connect) {
    const server = allServers.find((item) => item.id === connect.dataset.connect);
    if (server) {
      try { await navigator.clipboard.writeText(server.address); showToast(`Adresse copiée : ${server.address}`); }
      catch { showToast(`Adresse du serveur : ${server.address}`); }
    }
  }
  if (copy) {
    try { await navigator.clipboard.writeText(copy.dataset.copy); showToast('Adresse du serveur copiée !'); }
    catch { showToast(`Adresse : ${copy.dataset.copy}`); }
  }
});
function showToast(message) {
  toast.textContent = message; toast.classList.add('show'); clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2800);
}
document.querySelector('.menu-toggle').addEventListener('click', () => document.querySelector('.nav').classList.toggle('open'));
