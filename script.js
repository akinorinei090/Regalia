/*
  REGALIA — configuração rápida
  1) Para trocar links de compra, edite a propriedade "url" de cada plano.
  2) Para configurar a votação, edite VOTE_LINKS.
  3) O contador online está preparado para receber API no futuro.
*/

const SERVER_IP = "br-eco-05.reis.host:25749";
const MAX_PLAYERS = 20;

// Coloque os links reais de compra aqui.
const VIP_PLANS = [
  { id:"lite-monthly", tier:"LITE", name:"LITE Mensal Anarquia", price:"R$ 9,90", duration:"Mensal", className:"tier-lite", url:"" },
  { id:"lite-3m", tier:"LITE", name:"LITE 3 Meses Anarquia", price:"R$ 29,90", duration:"3 meses", className:"tier-lite", url:"" },
  { id:"vip-monthly", tier:"VIP", name:"VIP Mensal Anarquia", price:"R$ 19,90", duration:"Mensal", className:"tier-vip", featured:true, url:"" },
  { id:"vip-3m", tier:"VIP", name:"VIP 3 Meses Anarquia", price:"R$ 49,90", duration:"3 meses", className:"tier-vip", featured:true, url:"" },
  { id:"plus-monthly", tier:"PLUS", name:"PLUS Mensal Anarquia", price:"R$ 39,90", duration:"Mensal", className:"tier-plus", url:"" },
  { id:"plus-3m", tier:"PLUS", name:"PLUS 3 Meses Anarquia", price:"R$ 89,90", duration:"3 meses", className:"tier-plus", url:"" },
  { id:"elite-monthly", tier:"ELITE", name:"ELITE Mensal Anarquia", price:"R$ 59,90", duration:"Mensal", className:"tier-elite", url:"" },
  { id:"elite-3m", tier:"ELITE", name:"ELITE 3 Meses Anarquia", price:"R$ 149,90", duration:"3 meses", className:"tier-elite", url:"" },
  { id:"life-monthly", tier:"Life", name:"Life Mensal Anarquia", price:"R$ 79,90", duration:"Mensal", className:"tier-life", url:"" },
  { id:"steal-monthly", tier:"Steal", name:"Steal Mensal Anarquia", price:"R$ 79,90", duration:"Mensal", className:"tier-steal", url:"" }
];

// Coloque os links de votação reais aqui.
const VOTE_LINKS = {
  1: "https://minecraftservers.org/vote/693330",
  2: "",
  3: ""
};

// Se no futuro houver uma API, ela pode chamar updatePlayerCount(n).
// Exemplo: updatePlayerCount(7);
function updatePlayerCount(online) {
  const safeValue = Math.max(0, Math.min(MAX_PLAYERS, Number(online) || 0));
  const count = document.getElementById("onlinePlayers");
  const progress = document.getElementById("playerProgress");
  if (count) count.textContent = String(Math.round(safeValue));
  if (progress) progress.style.width = `${(safeValue / MAX_PLAYERS) * 100}%`;
}

function showToast(message = "IP copiado!") {
  const toast = document.getElementById("toast");
  const text = document.getElementById("toastMessage");
  if (!toast || !text) return;
  text.textContent = message;
  toast.classList.add("show");
  clearTimeout(window.__toastTimer);
  window.__toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
}

async function copyServerIp() {
  try {
    await navigator.clipboard.writeText(SERVER_IP);
    showToast("IP copiado!");
  } catch {
    const temp = document.createElement("textarea");
    temp.value = SERVER_IP;
    temp.style.position = "fixed";
    temp.style.opacity = "0";
    document.body.appendChild(temp);
    temp.select();
    document.execCommand("copy");
    temp.remove();
    showToast("IP copiado!");
  }
}

function renderVipStore() {
  const grid = document.getElementById("shopGrid");
  if (!grid) return;

  grid.innerHTML = VIP_PLANS.map(plan => `
    <article class="shop-card ${plan.featured ? "featured" : ""}">
      <div class="shop-visual ${plan.className}">
        <div class="rank-glyph">${plan.tier}</div>
        <div class="rank-sub">REGALIA · PREMIUM</div>
      </div>
      <div class="shop-body">
        <div class="shop-meta">
          <span>${plan.tier}</span>
          <span class="shop-duration">${plan.duration}</span>
        </div>
        <h3>${plan.name}</h3>
        <div class="shop-price">${plan.price}</div>
        <button class="shop-buy" type="button" data-vip-id="${plan.id}">Comprar agora</button>
      </div>
    </article>
  `).join("");
}

function handleVipClick(id) {
  const plan = VIP_PLANS.find(item => item.id === id);
  if (!plan) return;
  if (plan.url) {
    window.open(plan.url, "_blank", "noopener,noreferrer");
  } else {
    showToast("Link de compra ainda não configurado.");
  }
}

function setupVoting() {
  document.querySelectorAll(".vote-link").forEach(link => {
    const slot = link.dataset.voteSlot;
    const url = VOTE_LINKS[slot];
    if (url) {
      link.href = url;
      link.target = "_blank";
      link.rel = "noopener";
      link.classList.add("is-configured");
    } else {
      link.href = "#";
      link.addEventListener("click", e => {
        e.preventDefault();
        showToast("Link de votação ainda não configurado.");
      });
    }
  });
}

function setupNavigation() {
  const toggle = document.getElementById("menuToggle");
  const nav = document.getElementById("siteNav");
  if (!toggle || !nav) return;

  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
  });

  nav.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

function setupRevealAnimations() {
  const items = document.querySelectorAll(".reveal");
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  items.forEach(item => observer.observe(item));
}

function setupCopyButtons() {
  document.querySelectorAll("[data-copy-ip]").forEach(button => {
    button.addEventListener("click", copyServerIp);
  });
}

function setupStore() {
  document.getElementById("shopGrid")?.addEventListener("click", event => {
    const button = event.target.closest("[data-vip-id]");
    if (button) handleVipClick(button.dataset.vipId);
  });
}

function init() {
  document.getElementById("heroIp").textContent = SERVER_IP;
  document.getElementById("serverIp").textContent = SERVER_IP;
  renderVipStore();
  setupVoting();
  setupNavigation();
  setupRevealAnimations();
  setupCopyButtons();
  setupStore();
  updatePlayerCount(0);
}

document.addEventListener("DOMContentLoaded", init);
