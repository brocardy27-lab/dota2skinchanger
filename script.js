// ---------- Config ----------
// Set this to the real installer URL when you have one.
const DOWNLOAD_URL = "#";

// Placeholder showcase items (original names; swap in your real catalog).
const ITEMS = [
  { name: "Emberforged Mantle", rarity: "arcana", icon: "🔥" },
  { name: "Frostbound Blade", rarity: "immortal", icon: "❄️" },
  { name: "Stormcaller Crown", rarity: "legendary", icon: "⚡" },
  { name: "Voidwalker Cloak", rarity: "mythical", icon: "🌌" },
  { name: "Thornguard Shield", rarity: "rare", icon: "🛡️" },
  { name: "Sunfire Courier", rarity: "immortal", icon: "🐉" },
  { name: "Moonlit Ward", rarity: "mythical", icon: "🌙" },
  { name: "Bloodmoon Effigy", rarity: "arcana", icon: "🩸" },
  { name: "Tidebreaker Anchor", rarity: "legendary", icon: "⚓" },
  { name: "Ironbark Gauntlets", rarity: "rare", icon: "🪵" },
  { name: "Spectral Terrain", rarity: "immortal", icon: "👻" },
  { name: "Starlight Announcer", rarity: "mythical", icon: "✨" },
];

// ---------- Showcase ----------
const cardsEl = document.getElementById("cards");
cardsEl.innerHTML = ITEMS.map(
  (it) => `
  <article class="card r-${it.rarity}" data-rarity="${it.rarity}">
    <div class="card__art"><span aria-hidden="true">${it.icon}</span></div>
    <div class="card__body">
      <h3>${it.name}</h3>
      <span class="card__rarity">${it.rarity}</span>
    </div>
  </article>`
).join("");

document.querySelectorAll(".chip").forEach((chip) => {
  chip.addEventListener("click", () => {
    document.querySelectorAll(".chip").forEach((c) => c.classList.remove("is-active"));
    chip.classList.add("is-active");
    const f = chip.dataset.filter;
    cardsEl.querySelectorAll(".card").forEach((card) => {
      card.classList.toggle("is-hidden", f !== "all" && card.dataset.rarity !== f);
    });
  });
});

// ---------- Mobile nav ----------
const toggle = document.getElementById("navToggle");
const links = document.getElementById("navLinks");
toggle.addEventListener("click", () => {
  const open = links.classList.toggle("is-open");
  toggle.setAttribute("aria-expanded", String(open));
});
links.querySelectorAll("a").forEach((a) =>
  a.addEventListener("click", () => {
    links.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  })
);

// ---------- Nav border on scroll ----------
const nav = document.querySelector(".nav");
const onScroll = () => nav.classList.toggle("is-scrolled", window.scrollY > 10);
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

// ---------- Count-up stats ----------
const fmt = (n) => (n >= 1000 ? Math.round(n / 1000) + "K" : String(n));
const countUp = (el) => {
  const target = Number(el.dataset.count);
  const start = performance.now();
  const dur = 1400;
  const tick = (t) => {
    const p = Math.min((t - start) / dur, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = fmt(Math.floor(target * eased));
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
};

// ---------- Reveal on scroll ----------
const revealTargets = document.querySelectorAll(".shot, .feature, .step, .card, .faq details, .section__head");
revealTargets.forEach((el) => el.classList.add("reveal"));

const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add("is-visible");
      io.unobserve(e.target);
    });
  },
  { threshold: 0.15 }
);
revealTargets.forEach((el) => io.observe(el));

const statsIO = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (!e.isIntersecting) return;
    e.target.querySelectorAll("[data-count]").forEach(countUp);
    statsIO.disconnect();
  });
});
statsIO.observe(document.querySelector(".stats"));

// ---------- Misc ----------
const downloadBtn = document.getElementById("downloadBtn");
if (DOWNLOAD_URL && DOWNLOAD_URL !== "#") {
  downloadBtn.href = DOWNLOAD_URL;
} else {
  // Test mode: no installer yet
  downloadBtn.addEventListener("click", (e) => {
    e.preventDefault();
    showToast("Download coming soon. This is a test build.");
  });
}

function showToast(msg) {
  let t = document.querySelector(".toast");
  if (!t) {
    t = document.createElement("div");
    t.className = "toast";
    t.setAttribute("role", "status");
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.classList.add("is-shown");
  clearTimeout(showToast._h);
  showToast._h = setTimeout(() => t.classList.remove("is-shown"), 2800);
}
document.getElementById("year").textContent = new Date().getFullYear();

// ---------- Screenshot lightbox ----------
const lightbox = document.getElementById("lightbox");
const openLightbox = (e) => {
  e.preventDefault();
  lightbox.hidden = false;
  document.body.style.overflow = "hidden";
  lightbox.querySelector(".lightbox__close").focus();
};
const closeLightbox = () => {
  lightbox.hidden = true;
  document.body.style.overflow = "";
  document.getElementById("shotLink").focus();
};
document.getElementById("shotLink").addEventListener("click", openLightbox);
lightbox.addEventListener("click", closeLightbox);
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !lightbox.hidden) closeLightbox();
});
