const homeView = document.querySelector('#homeView');
const serversView = document.querySelector('#serversView');
const homeList = document.querySelector('#home-server-list');
const serverList = document.querySelector('#server-list');
const breadcrumb = document.querySelector('#breadcrumb');
const indicator = document.querySelector('#live-indicator');
const toast = document.querySelector('#toast');
let allServers = [];
let activeFilter = 'all';
let toastTimer;

const esc = (value) => String(value).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const statusLabel = (status) => status === 'online' ? 'En ligne' : status === 'maintenance' ? 'Maintenance' : 'Hors ligne';

function row(server, detailed = false) {
  const status = esc(server.status);
  const icon = server.id === 'pokenexa'
    ? '<img src="/assets/pokenexa-logo.png" alt="">'
    : `<span style="color:${esc(server.accent)}">${esc(server.category === 'Survie' ? '✦' : server.category === 'Roleplay' ? '⚔' : '✧')}</span>`;
  const playerValue = server.status === 'online' ? `${server.players}<span> / ${server.maxPlayers}</span>` : '—';
  const pack = detailed ? `<span class="server-spec"><strong>MODPACK</strong>${esc(server.pack)} · ${esc(server.packVersion)}</span>` : '';
  return `<article class="server-row">
    <div class="server-icon">${icon}</div>
    <div class="server-info">
      <div class="server-row-top"><h3>${esc(server.name)}</h3><span class="status-badge ${status}"><span></span>${statusLabel(server.status)}</span></div>
      <p>${esc(server.description)}</p>
      <div class="server-specs"><span class="server-spec"><strong>JOUEURS</strong>${playerValue}</span><span class="server-spec"><strong>MINECRAFT</strong>${esc(server.version)}</span><span class="server-spec"><strong>LOADER</strong>${esc(server.loader)}</span>${pack}</div>
    </div>
    <button class="row-action" data-connect="${esc(server.id)}" aria-label="Copier l’adresse de ${esc(server.name)}" title="Copier l’adresse">⧉</button>
  </article>`;
}

function render() {
  homeList.innerHTML = allServers.length ? allServers.map((server) => row(server)).join('') : '<div class="empty-state">Chargement des mondes Nexa…</div>';
  const shown = allServers.filter((server) => activeFilter === 'all' || (activeFilter === 'online' ? server.status === 'online' : server.category === activeFilter));
  serverList.innerHTML = shown.length ? shown.map((server) => row(server, true)).join('') : '<div class="empty-state">Aucun serveur dans cette catégorie pour le moment.</div>';
  document.querySelector('#count-all').textContent = String(allServers.length).padStart(2, '0');
  document.querySelector('#home-online-count').textContent = allServers.filter((server) => server.status === 'online').length;
  document.querySelector('#home-player-count').textContent = allServers.filter((server) => server.status === 'online').reduce((sum, server) => sum + server.players, 0);
}

function showPage(name) {
  const isServers = name === 'Serveurs';
  if (!isServers && name !== 'Accueil') {
    showToast(`${name} sera disponible dans une prochaine version.`);
    return;
  }
  homeView.hidden = isServers;
  serversView.hidden = !isServers;
  breadcrumb.textContent = name;
  document.querySelectorAll('.nav button').forEach((button) => button.classList.toggle('active', button.dataset.page === name));
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

async function load() {
  try {
    const response = await fetch('/api/servers');
    if (!response.ok) throw new Error('API indisponible');
    update((await response.json()).servers);
  } catch {
    indicator.textContent = 'Hors ligne';
    indicator.closest('.connection').classList.add('offline');
  }
}

function update(servers) {
  allServers = servers;
  render();
}

const events = new EventSource('/api/events');
events.addEventListener('servers', (event) => {
  update(JSON.parse(event.data).servers);
  indicator.textContent = 'Connecté';
  indicator.closest('.connection').classList.remove('offline');
});
events.onopen = () => {
  indicator.textContent = 'Connecté';
  indicator.closest('.connection').classList.remove('offline');
};
events.onerror = () => {
  indicator.textContent = 'Reconnexion…';
  indicator.closest('.connection').classList.add('offline');
};

document.querySelectorAll('.nav button').forEach((button) => button.addEventListener('click', () => showPage(button.dataset.page)));
document.querySelector('.brand').addEventListener('click', (event) => { event.preventDefault(); showPage('Accueil'); });
document.querySelector('#serversShortcut').addEventListener('click', () => showPage('Serveurs'));
document.querySelectorAll('[data-open-servers]').forEach((button) => button.addEventListener('click', () => showPage('Serveurs')));
document.querySelector('.filters').addEventListener('click', (event) => {
  const button = event.target.closest('[data-filter]');
  if (!button) return;
  activeFilter = button.dataset.filter;
  document.querySelectorAll('.filter').forEach((item) => item.classList.toggle('active', item === button));
  render();
});

document.addEventListener('click', async (event) => {
  const connect = event.target.closest('[data-connect]');
  if (!connect) return;
  const server = allServers.find((item) => item.id === connect.dataset.connect);
  if (!server) return;
  try { await navigator.clipboard.writeText(server.address); showToast(`Adresse copiée : ${server.address}`); }
  catch { showToast(`Adresse du serveur : ${server.address}`); }
});

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2800);
}

load();
