const pages = {
  Accueil: document.querySelector('#homeView'),
  Serveurs: document.querySelector('#serversView'),
  Actualités: document.querySelector('#newsView')
};
const breadcrumb = document.querySelector('#breadcrumb');
const toast = document.querySelector('#toast');
let toastTimer;
let servers = [];

const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (character) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
})[character]);

function navigate(page) {
  if (!pages[page]) return;
  Object.entries(pages).forEach(([name, section]) => { section.hidden = name !== page; });
  document.querySelectorAll('.nav-item').forEach((button) => button.classList.toggle('active', button.dataset.page === page));
  breadcrumb.textContent = page;
  history.replaceState(null, '', `#${page.toLowerCase()}`);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function renderServers() {
  const target = document.querySelector('#server-list');
  if (!servers.length) {
    target.innerHTML = '<div class="empty-state">Les informations de Poké\'Nexa sont momentanément indisponibles.</div>';
    return;
  }
  target.innerHTML = servers.map((server) => `
    <article class="server-card">
      <div class="server-card-heading">
        <div class="server-emblem"><img src="/assets/pokenexa-logo.png" alt="Logo Poké'Nexa"></div>
        <div class="server-title"><span class="server-kicker">SERVEUR MINECRAFT</span><h2>${escapeHtml(server.name)}</h2><p>Une aventure à vivre ensemble.</p></div>
        <span class="status-pill"><i></i>Statut non vérifié</span>
      </div>
      <div class="server-details">
        <div class="detail"><span>ADRESSE DU SERVEUR</span><strong>${escapeHtml(server.address)}</strong></div>
        <div class="detail"><span>VERSION MINECRAFT</span><strong>${escapeHtml(server.version)}</strong></div>
        <div class="detail"><span>LOADER</span><strong>${escapeHtml(server.loader)}</strong></div>
        <div class="detail"><span>JOUEURS EN LIGNE</span><strong>—</strong></div>
      </div>
      <div class="server-actions"><button class="primary-button" data-connect="${escapeHtml(server.id)}">Copier l'adresse <span aria-hidden="true">⧉</span></button><a class="download-button" href="${escapeHtml(server.downloadUrl)}" download="PokeNexa.zip">Télécharger le modpack <span aria-hidden="true">↓</span></a><span class="api-note"><i class="api-dot"></i> Archive à importer dans CurseForge · Fabric 0.19.5</span></div>
    </article>`).join('');
}

async function copyAddress(id) {
  const server = servers.find((item) => item.id === id);
  if (!server) return;
  try {
    await navigator.clipboard.writeText(server.address);
    showToast(`Adresse copiée : ${server.address}`);
  } catch {
    showToast(`Adresse du serveur : ${server.address}`);
  }
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('visible'), 2800);
}

document.querySelectorAll('[data-page], [data-go]').forEach((control) => {
  control.addEventListener('click', (event) => {
    event.preventDefault();
    navigate(control.dataset.page || control.dataset.go);
  });
});
document.addEventListener('click', (event) => {
  const button = event.target.closest('[data-connect]');
  if (button) copyAddress(button.dataset.connect);
});

const easterEgg = document.querySelector('#easterEgg');
let logoClicks = 0;
let logoClickTimer;
document.querySelectorAll('.secret-logo').forEach((logo) => logo.addEventListener('click', () => {
  logoClicks += 1;
  clearTimeout(logoClickTimer);
  if (logoClicks >= 5) {
    logoClicks = 0;
    easterEgg.hidden = false;
    document.querySelector('.easter-close').focus();
  } else {
    logoClickTimer = setTimeout(() => { logoClicks = 0; }, 2500);
  }
}));
function closeEasterEgg() { easterEgg.hidden = true; }
document.querySelector('.easter-close').addEventListener('click', closeEasterEgg);
easterEgg.addEventListener('click', (event) => { if (event.target === easterEgg) closeEasterEgg(); });
document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && !easterEgg.hidden) closeEasterEgg(); });
window.addEventListener('hashchange', () => {
  const page = Object.keys(pages).find((name) => name.toLowerCase() === location.hash.slice(1));
  if (page) navigate(page);
});

async function loadServers() {
  try {
    const response = await fetch('/api/servers');
    if (!response.ok) throw new Error('API indisponible');
    servers = (await response.json()).servers;
    renderServers();
  } catch {
    document.querySelector('#server-list').innerHTML = '<div class="empty-state">Impossible de charger les informations du serveur pour le moment.</div>';
  }
}

const initialPage = Object.keys(pages).find((name) => name.toLowerCase() === location.hash.slice(1)) || 'Accueil';
navigate(initialPage);
loadServers();
// L’API SSE est conservée : elle permettra de pousser statut/joueurs dès qu’une source Minecraft réelle sera connectée.
const events = new EventSource('/api/events');
events.addEventListener('servers', (event) => {
  servers = JSON.parse(event.data).servers;
  renderServers();
});
