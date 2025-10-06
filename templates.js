// 📦 Template-Specific Functionality Handler
// Theme management and cursor logic are delegated to script.js

// 🔍 Search & Category Filter System
const searchInput = document.getElementById("search-bar");
const templateCardElements = document.querySelectorAll(".template-card");
const noResultsMessage = document.querySelector(".no-results");
const filterToggleButton = document.getElementById("filter-toggle");
const categoryFilterContainer = document.getElementById("category-filters");
const categoryButtonElements = document.querySelectorAll(".category-btn");

// 🎯 Currently selected category filter
let currentActiveCategory = "all";

// 🔄 Toggle category filter dropdown visibility
filterToggleButton.addEventListener("click", (event) => {
  event.stopPropagation();
  categoryFilterContainer.classList.toggle("show");
});

// 🚪 Close category filters when user clicks outside the container
document.addEventListener("click", (event) => {
  if (!filterToggleButton.contains(event.target) && !categoryFilterContainer.contains(event.target)) {
    categoryFilterContainer.classList.remove("show");
  }
});

// 📂 Category filtering implementation
categoryButtonElements.forEach(button => {
  button.addEventListener("click", () => {
    // Update active button state
    categoryButtonElements.forEach(btn => btn.classList.remove("active"));
    button.classList.add("active");
    
    // Set current active category
    currentActiveCategory = button.dataset.category;
    
    // Apply template filtering
    applyTemplateFiltering();
    
    // Collapse dropdown after selection
    categoryFilterContainer.classList.remove("show");
  });
});

// 🔎 Search and filter functionality
function applyTemplateFiltering() {
  const searchQuery = searchInput.value.trim().toLowerCase();
  let visibleTemplateCount = 0;

  templateCardElements.forEach((cardElement) => {
    const cardTitle = cardElement.querySelector("h2").textContent.trim().toLowerCase();
    const cardCategory = cardElement.dataset.category;
    
    // Verify if card matches search criteria
    const matchesSearchQuery = searchQuery === "" || cardTitle.includes(searchQuery);
    
    // Verify if card matches category filter
    const matchesCategoryFilter = currentActiveCategory === "all" || cardCategory === currentActiveCategory;
    
    // Display logic based on filter conditions
    if (matchesSearchQuery && matchesCategoryFilter) {
      cardElement.style.display = "";
      visibleTemplateCount++;
    } else {
      cardElement.style.display = "none";
    }
  });

  // Handle no results message visibility
  if (noResultsMessage) {
    noResultsMessage.style.display = visibleTemplateCount === 0 ? "block" : "none";
  }
}

// 🖱️ Add input event listener to search bar
searchInput.addEventListener("input", applyTemplateFiltering);

// 🚀 Initialize template filtering on page load
applyTemplateFiltering();

// 🎬 Text Animation Handler for Sequential Display
const animationTexts = [
  "Typing Animation",
  "Gradient Text",
  "Neon Glow",
  "Wavy Text Animation",
  "Zoom on Hover",
];

let currentTextIndex = 0; // Current position in text array
let currentCharIndex = 0; // Current character position for typing/deleting
let isDeletingMode = false;

const animationSpeed = 100; // Character typing/deletion speed
const pauseDuration = 1000; // Pause between animations
const animationTarget = document.getElementById("textTarget");

// 🧠 Development debugging utility
function logDebugInfo(message) {
  // 📝 Placeholder for potential debugging requirements
  // console.log(`[Template System] ${message}`);
}

if (animationTarget) {
  // 🔄 Main animation loop for text effects
  function executeTypeAnimation() {
    const currentAnimationText = animationTexts[currentTextIndex];

    if (isDeletingMode) {
      animationTarget.textContent = currentAnimationText.substring(0, currentCharIndex--);
    } else {
      animationTarget.textContent = currentAnimationText.substring(0, currentCharIndex++);
    }
    
    // Completed typing full text
    if (!isDeletingMode && currentCharIndex === currentAnimationText.length + 1) {
      setTimeout(() => {
        isDeletingMode = true;
        executeTypeAnimation();
      }, pauseDuration);
      return;
    }

    // Transition to next text after deletion
    if (isDeletingMode && currentCharIndex === 0) {
      isDeletingMode = false;
      // Use modulo for circular array navigation
      currentTextIndex = (currentTextIndex + 1) % animationTexts.length;
    }

    // Deletion occurs at faster rate than typing
    setTimeout(executeTypeAnimation, isDeletingMode ? animationSpeed / 2 : animationSpeed);
  }
  
  executeTypeAnimation(); // Initialize animation sequence
}

// 🧪 Performance monitoring placeholder function
function trackPerformanceMetrics() {
  // 📊 Reserved for future performance monitoring implementation
  // console.log("Performance metrics collection:", performance.memory);
}

// 🧼 Resource cleanup and memory management
function performCleanupOperations() {
  // 🧹 Reserved for future cleanup and optimization tasks
  console.log("🧹 Template system cleanup operations completed");
}

// 🔄 Additional utility function for future enhancements
function initializeTemplateSystem() {
  console.log("🎯 Template filtering system initialized successfully");
}
