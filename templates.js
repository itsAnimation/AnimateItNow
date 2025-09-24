//  This script now ONLY contains functionality specific to templates.html
// Theme toggle and cursor logic are handled by script.js
// Theme toggle functionality
const themeToggle = document.getElementById("theme-toggle");
const body = document.body;

function setTheme(isDark) {
  const newIcon = isDark ? "sun" : "moon";
  document.getElementById("container").classList.toggle("dark", isDark);
  body.classList.toggle("dark-theme", isDark);
  localStorage.setItem("theme", isDark ? "dark" : "light");

  if (themeToggle) {
    themeToggle.innerHTML = `<i data-lucide="${newIcon}"></i>`;
    lucide.createIcons();
  }
}

const savedTheme = localStorage.getItem("theme");
const prefersDark =
  window.matchMedia &&
  window.matchMedia("(prefers-color-scheme: dark)").matches;
setTheme(savedTheme === "dark" || (savedTheme === null && prefersDark));

themeToggle?.addEventListener("click", () => {
  setTheme(!body.classList.contains("dark-theme"));
});

lucide.createIcons();

// Scroll animation for cards
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  },
  { threshold: 0.1 }
);
document.querySelectorAll(".template-card").forEach((card) => {
  observer.observe(card);
});

// Search & Category Filter Functionality
const searchBar = document.getElementById("search-bar");
const templateCards = document.querySelectorAll(".template-card");
const noResultsMsg = document.querySelector(".no-results"); // Added a "no results" div to your HTML

function filterTemplates() {
  const query = searchBar.value.trim().toLowerCase();
  let visibleCount = 0;

  templateCards.forEach((card) => {
    const title = card.querySelector("h2").textContent.trim().toLowerCase();
    const matchesTitle = title.includes(query); // 'includes' is better than 'startsWith' for search
    if (matchesTitle) {
      card.style.display = "";
      visibleCount++;
    } else {
      card.style.display = "none";
    }
  });

  if (noResultsMsg) {
    noResultsMsg.style.display = visibleCount === 0 ? "block" : "none";
  }
}
searchBar.addEventListener("input", filterTemplates);

//script for animation type one after other
const texts = [
  "Typing Animation",
  "Gradient Text",
  "Neon Glow",
  "Wavy Text Animation",
  "Zoom on Hover",
];

let currTextIdx = 0; // Index of current string in the array
let charIdx = 0; // index of current char currently being typed /deleted
let isDelete = false;

const speed = 100; //type/delete speed
const pausTime = 1000; //pause time
const target = document.getElementById("textTarget");

function typeLoop() {
  const currentText = texts[currTextIdx];

  if (isDelete) {
    target.textContent = currentText.substring(0, charIdx--);
  } else {
    target.textContent = currentText.substring(0, charIdx++);
  }
  //typed full character
  if (!isDelete && charIdx === currentText.length + 1) {
    setTimeout(() => {
      isDelete = true;
      typeLoop();
    }, pausTime);
    return;
  }

  //move to next char when deleted
  if (isDelete && charIdx === 0) {
    isDelete = false;
    //use modulo so that it can reback at 0
    currTextIdx = (currTextIdx + 1) % texts.length;
  }

  // Deleting is faster (half the speed)
  // Typing is slower
  setTimeout(typeLoop, isDelete ? speed / 2 : speed);
}
typeLoop(); // start animation
