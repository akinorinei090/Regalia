// ===============================
// REGALIA — CONFIGURAÇÕES
// ===============================

// Quando você tiver uma API de status, troque estes valores pela resposta da API.
// Exemplo esperado: { playersOnline: 7, maxPlayers: 20 }
const SERVER_CONFIG = {
  playersOnline: 0,
  maxPlayers: 20,
  // apiUrl: "https://SEU-ENDPOINT-AQUI"
};

const ip = document.getElementById("server-ip").textContent.trim();
const onlineEl = document.getElementById("players-online");
const maxEl = document.getElementById("players-max");
const barEl = document.getElementById("progress-bar");
const percentEl = document.getElementById("capacity-percent");
const copyMessage = document.getElementById("copy-message");

function updateCapacity(online, max) {
  online = Math.max(0, Number(online) || 0);
  max = Math.max(1, Number(max) || 20);
  const percent = Math.min(100, (online / max) * 100);

  onlineEl.textContent = online;
  maxEl.textContent = max;
  barEl.style.width = percent + "%";
  percentEl.textContent = Math.round(percent) + "%";
}

async function copyIP() {
  try {
    await navigator.clipboard.writeText(ip);
  } catch {
    const textarea = document.createElement("textarea");
    textarea.value = ip;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    textarea.remove();
  }

  copyMessage.classList.add("show");
  setTimeout(() => copyMessage.classList.remove("show"), 1800);
}

document.querySelectorAll(".copy-ip").forEach(button => {
  button.addEventListener("click", copyIP);
});

updateCapacity(SERVER_CONFIG.playersOnline, SERVER_CONFIG.maxPlayers);

/*
  FUTURA API:
  GitHub Pages não consegue, sozinho, consultar diretamente todos os servidores
  Minecraft. Quando você tiver um endpoint público de status, pode usar algo assim:

  async function updateFromAPI() {
    const response = await fetch(SERVER_CONFIG.apiUrl);
    const data = await response.json();
    updateCapacity(data.playersOnline, data.maxPlayers);
  }

  updateFromAPI();
  setInterval(updateFromAPI, 30000);
*/

// Animação das seções
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add("visible");
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach(el => observer.observe(el));

// Menu mobile
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");

menuToggle.addEventListener("click", () => {
  navLinks.classList.toggle("open");
});

document.querySelectorAll(".nav-links a").forEach(link => {
  link.addEventListener("click", () => navLinks.classList.remove("open"));
});
