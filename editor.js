const animations = [
  "bounce", "flash", "pulse", "rubberBand", "shakeX", "shakeY", "headShake", "swing",
  "tada", "wobble", "jello", "heartBeat",
  "backInDown", "backInLeft", "backInRight", "backInUp",
  "backOutDown", "backOutLeft", "backOutRight", "backOutUp",
  "bounceIn", "bounceInDown", "bounceInLeft", "bounceInRight", "bounceInUp",
  "bounceOut", "bounceOutDown", "bounceOutLeft", "bounceOutRight", "bounceOutUp",
  "fadeIn", "fadeInDown", "fadeInDownBig", "fadeInLeft", "fadeInLeftBig",
  "fadeInRight", "fadeInRightBig", "fadeInUp", "fadeInUpBig",
  "fadeOut", "fadeOutDown", "fadeOutDownBig", "fadeOutLeft", "fadeOutLeftBig",
  "fadeOutRight", "fadeOutRightBig", "fadeOutUp", "fadeOutUpBig",
  "flip", "flipInX", "flipInY", "flipOutX", "flipOutY",
  "lightSpeedInRight", "lightSpeedInLeft", "lightSpeedOutRight", "lightSpeedOutLeft",
  "rotateIn", "rotateInDownLeft", "rotateInDownRight", "rotateInUpLeft", "rotateInUpRight",
  "rotateOut", "rotateOutDownLeft", "rotateOutDownRight", "rotateOutUpLeft", "rotateOutUpRight",
  "hinge", "jackInTheBox", "rollIn", "rollOut",
  "zoomIn", "zoomInDown", "zoomInLeft", "zoomInRight", "zoomInUp",
  "zoomOut", "zoomOutDown", "zoomOutLeft", "zoomOutRight", "zoomOutUp",
  "slideInDown", "slideInLeft", "slideInRight", "slideInUp",
  "slideOutDown", "slideOutLeft", "slideOutRight", "slideOutUp"
];

const searchInput = document.getElementById("animationSearch");
const suggestions = document.getElementById("suggestions");
const previewBox = document.getElementById("previewBox");

// Create dropdown list
function showSuggestions(list) {
  suggestions.innerHTML = "";
  list.forEach(anim => {
    const li = document.createElement("li");
    li.textContent = anim;
    li.className = "px-3 py-2 cursor-pointer hover:bg-blue-100";
    li.addEventListener("click", () => {
      applyAnimation(anim);
    });
    suggestions.appendChild(li);
  });
  suggestions.style.display = list.length ? "block" : "none";
}

// Apply animation to preview box
function applyAnimation(anim) {
  searchInput.value = anim;
  suggestions.style.display = "none";
  previewBox.className = "w-48 h-48 bg-gray-200 flex items-center justify-center mt-4 rounded animate__animated";
  void previewBox.offsetWidth; // restart animation
  previewBox.classList.add(`animate__${anim}`);
}

// Listen for typing in search bar
searchInput.addEventListener("input", () => {
  const query = searchInput.value.toLowerCase().trim();

  if (query === "") {
    suggestions.style.display = "none"; // hide if empty
    return;
  }

  const filtered = animations.filter(a => a.toLowerCase().includes(query));
  if (filtered.length > 0) {
    showSuggestions(filtered);
  } else {
    suggestions.style.display = "none";
  }
});

// Press Enter to apply animation directly
searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    const query = searchInput.value.trim();
    if (query && animations.includes(query)) {
      applyAnimation(query);
    }
  }
});

// Hide dropdown when clicking outside
document.addEventListener("click", (e) => {
  if (!e.target.closest("#animationSearch") && !e.target.closest("#suggestions")) {
    suggestions.style.display = "none";
  }
});
