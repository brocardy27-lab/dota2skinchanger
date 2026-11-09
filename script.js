// ---------- Config ----------
// Set this to the real installer URL when you have one.
const DOWNLOAD_URL = "https://github.com/brocardy27-lab/dota2skinchanger/releases/latest";

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
const revealTargets = document.querySelectorAll(".shot, .item, .spot, .feature, .step, .faq details, .section__head");
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

// ---------- Screenshot tabs ----------
const SHOTS = [
  { title: "Heroes", src: "assets/app-screenshot.png", w: 1915, h: 1012,
    alt: "Heroes screen: hero list on the left, cosmetic slots for the selected hero with replacement options, and a Build & Install button" },
  { title: "Loadout", src: "assets/app-loadout.png", w: 1915, h: 790,
    alt: "Loadout screen: equipped items for Drow Ranger by slot, with Install, Save, New list, Lists and Clear actions" },
  { title: "Find items", src: "assets/app-find-items.png", w: 996, h: 417,
    alt: "Find Items screen with the Steam inventory tab: paste a Steam inventory link or SteamID64 and load it" },
  { title: "Effects", src: "assets/app-effects.png", w: 1704, h: 775,
    alt: "Ability and Item Effects screen: a grid of 31 effect categories with variant counts" },
];
const shotImg = document.getElementById("shotImg");
document.querySelectorAll("[data-shot]").forEach((tab) => {
  tab.addEventListener("click", () => {
    const s = SHOTS[Number(tab.dataset.shot)];
    document.querySelectorAll("[data-shot]").forEach((t) => {
      t.classList.toggle("is-active", t === tab);
      t.setAttribute("aria-selected", String(t === tab));
    });
    Object.assign(shotImg, { src: s.src, alt: s.alt, width: s.w, height: s.h });
    document.getElementById("shotLink").href = s.src;
    document.getElementById("lightboxImg").src = s.src;
    document.getElementById("shotTitle").textContent = "Dota2SkinChanger · " + s.title;
  });
});

// ---------- Zoom any .js-zoom image into the lightbox ----------
document.querySelectorAll(".js-zoom").forEach((a) => {
  a.addEventListener("click", (e) => {
    document.getElementById("lightboxImg").src = a.getAttribute("href");
    openLightbox(e);
  });
});
// Keep lightbox in sync with the main preview when it's opened from there
document.getElementById("shotLink").addEventListener("click", () => {
  document.getElementById("lightboxImg").src = document.getElementById("shotLink").getAttribute("href");
}, true);
