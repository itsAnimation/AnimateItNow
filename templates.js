// 📦 This script now ONLY contains functionality specific to templates.html
// Theme toggle and cursor logic are handled by script.js

// 🔍 Search & Category Filter Functionality
const searchBar = document.getElementById("search-bar");
const templateCards = document.querySelectorAll(".template-card");
const noResultsMsg = document.querySelector(".no-results");
const filterToggle = document.getElementById("filter-toggle");
const categoryFilters = document.getElementById("category-filters");
const categoryButtons = document.querySelectorAll(".category-btn");

// 🎯 Current active category
let activeCategory = "all";

// 🔄 Toggle category filter visibility
filterToggle.addEventListener("click", (e) => {
  e.stopPropagation();
  categoryFilters.classList.toggle("show");
});

// 🚪 Close category filters when clicking outside
document.addEventListener("click", (e) => {
  if (!filterToggle.contains(e.target) && !categoryFilters.contains(e.target)) {
    categoryFilters.classList.remove("show");
  }
});

// 📂 Category filtering
categoryButtons.forEach(button => {
  button.addEventListener("click", () => {
    // Update active button
    categoryButtons.forEach(btn => btn.classList.remove("active"));
    button.classList.add("active");
    
    // Set active category
    activeCategory = button.dataset.category;
    
    // Filter templates
    filterTemplates();
    
    // Close dropdown
    categoryFilters.classList.remove("show");
  });
});

// 🔎 Search functionality
function filterTemplates() {
  const query = searchBar.value.trim().toLowerCase();
  let visibleCount = 0;

  templateCards.forEach((card) => {
    const title = card.querySelector("h2").textContent.trim().toLowerCase();
    const category = card.dataset.category;
    
    // Check if card matches search query
    const matchesSearch = query === "" || title.includes(query);
    
    // Check if card matches category filter
    const matchesCategory = activeCategory === "all" || category === activeCategory;
    
    // Show/hide card based on both filters
    if (matchesSearch && matchesCategory) {
      card.style.display = "";
      visibleCount++;
    } else {
      card.style.display = "none";
    }
  });

  // Show/hide no results message
  if (noResultsMsg) {
    noResultsMsg.style.display = visibleCount === 0 ? "block" : "none";
  }
}

// 🖱️ Add event listener to search bar
searchBar.addEventListener("input", filterTemplates);

// 🚀 Initialize filtering
filterTemplates();

// 🎬 Script for animation type one after other
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

// 🧠 Debug logging function for development
function debugLog(message) {
  // 📝 This is a placeholder for future debugging
  // console.log(`[Templates Debug] ${message}`);
}

if (target) {
  // 🔄 Animation loop for text typing effect
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
}

// 🧪 Performance monitoring placeholder
function monitorPerformance() {
  // 📊 This is a placeholder for future performance monitoring
  // console.log("Performance metrics:", performance.memory);
}

// 🧼 Cleanup function for memory management
function cleanup() {
  // 🧹 This is a placeholder for future cleanup operations
  console.log("🧹 Templates cleanup completed");
}