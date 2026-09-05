const root = document.documentElement;
const themeToggle = document.getElementById("themeToggle");
const themeIcon = document.getElementById("themeIcon");
const themeText = document.getElementById("themeText");
const menuToggle = document.getElementById("menuToggle");
const mobileNav = document.getElementById("mobileNav");
const mouseLight = document.getElementById("mouseLight");

function applyTheme(theme) {
  root.dataset.theme = theme;
  localStorage.setItem("portfolio-theme", theme);
  const dark = theme === "dark";
  themeIcon.textContent = dark ? "☾" : "☼";
  themeText.textContent = dark ? "Dark" : "Light";
}

applyTheme(localStorage.getItem("portfolio-theme") || "dark");

themeToggle.addEventListener("click", () => {
  applyTheme(root.dataset.theme === "dark" ? "light" : "dark");
});

menuToggle.addEventListener("click", () => {
  const open = mobileNav.classList.toggle("open");
  menuToggle.textContent = open ? "×" : "☰";
  menuToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
});

mobileNav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    mobileNav.classList.remove("open");
    menuToggle.textContent = "☰";
    menuToggle.setAttribute("aria-label", "Open menu");
  });
});

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const desktopPointer = window.matchMedia("(hover: hover) and (pointer: fine)");

let mouseX = window.innerWidth * 0.5;
let mouseY = window.innerHeight * 0.35;
let lightX = mouseX;
let lightY = mouseY;
let rafId = null;

function moveAmbientLight() {
  rafId = null;
  const ease = 0.075;
  lightX += (mouseX - lightX) * ease;
  lightY += (mouseY - lightY) * ease;
  mouseLight.style.transform = `translate3d(${lightX}px, ${lightY}px, 0)`;
  if (Math.abs(mouseX - lightX) > 0.4 || Math.abs(mouseY - lightY) > 0.4) {
    rafId = requestAnimationFrame(moveAmbientLight);
  }
}

function enableMouseLight() {
  if (!desktopPointer.matches || reduceMotion.matches) return;
  window.addEventListener("pointermove", (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;
    document.body.classList.add("mouse-active");
    if (!rafId) rafId = requestAnimationFrame(moveAmbientLight);
  }, { passive: true });
}

enableMouseLight();

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));
