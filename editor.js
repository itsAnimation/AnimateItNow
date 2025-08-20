const htmlEditor = document.getElementById("htmlCode");
const cssEditor = document.getElementById("cssCode");
const jsEditor = document.getElementById("jsCode");
const output = document.getElementById("output");
const runBtn = document.getElementById("runBtn");
const resetBtn = document.getElementById("resetBtn");
const animationSearch = document.getElementById("animationSearch");
const suggestions = document.getElementById("suggestions");
const animations = [
"bounce", "flash", "pulse", "rubberBand", "shakeX", "shakeY", "headShake", "swing",
"tada", "wobble", "jello", "heartBeat", "backInDown", "backInLeft", "backInRight",
"backInUp", "backOutDown", "backOutLeft", "backOutRight", "backOutUp", "bounceIn",
"bounceInDown", "bounceInLeft", "bounceInRight", "bounceInUp", "bounceOut",
"bounceOutDown", "bounceOutLeft", "bounceOutRight", "bounceOutUp", "fadeIn",
"fadeInDown", "fadeInDownBig", "fadeInLeft", "fadeInLeftBig", "fadeInRight",
"fadeInRightBig", "fadeInUp", "fadeInUpBig", "fadeOut", "fadeOutDown",
"fadeOutDownBig", "fadeOutLeft", "fadeOutLeftBig", "fadeOutRight", "fadeOutRightBig",
"fadeOutUp", "fadeOutUpBig", "flip", "flipInX", "flipInY", "flipOutX", "flipOutY",
"lightSpeedInRight", "lightSpeedInLeft", "lightSpeedOutRight", "lightSpeedOutLeft",
"rotateIn", "rotateInDownLeft", "rotateInDownRight", "rotateInUpLeft", "rotateInUpRight",
"rotateOut", "rotateOutDownLeft", "rotateOutDownRight", "rotateOutUpLeft", "rotateOutUpRight",
"hinge", "jackInTheBox", "rollIn", "rollOut", "zoomIn", "zoomInDown", "zoomInLeft",
"zoomInRight", "zoomInUp", "zoomOut", "zoomOutDown", "zoomOutLeft", "zoomOutRight",
"zoomOutUp", "slideInDown", "slideInLeft", "slideInRight", "slideInUp", "slideOutDown",
"slideOutLeft", "slideOutRight", "slideOutUp"
];
document.getElementById("runBtn").addEventListener("click", () => {
  const html = htmlEditor.value.trim();
  const css = cssEditor.value.trim();
  const js = jsEditor.value.trim();
  const selectedAnimation = animationSearch.value.trim();


  const result = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <style>${css}
      @import url('https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css');
      </style>
    </head>
    <body>
    <div class="animate__animated animate__${selectedAnimation}">
      ${html}
      <script>
      document.addEventListener('DOMContentLoaded', () => {
                  const animatedElement = document.getElementById('animatable-content');
                  if (animatedElement) {
                      // Remove the class to force a reflow and re-run the animation
                      animatedElement.classList.remove('animate__${selectedAnimation}');
                      
                      // This line forces the browser to re-render, which is crucial for a re-run
                      void animatedElement.offsetWidth;
                      
                      // Re-add the class to start the animation again
                      animatedElement.classList.add('animate__${selectedAnimation}');
                  }
              });
        try {
          ${js}
        } catch (e) {
          document.body.innerHTML += '<pre style="color:red;">' + e + '</pre>';
        }
      <\/script>
    </body>
    </html>
  `;

  output.srcdoc = result;
});

document.getElementById("resetBtn").addEventListener("click", () => {
  htmlEditor.value = "";
  cssEditor.value = "";
  jsEditor.value = "";
  output.srcdoc = "<!DOCTYPE html><html><body></body></html>";
});
// --- Search Bar and Autocomplete ---
animationSearch.addEventListener("input", () => {
    const query = animationSearch.value.toLowerCase();
    suggestions.innerHTML = "";

    if (!query) {
        suggestions.style.display = "none";
        return;
    }

    const filtered = animations.filter(anim => anim.toLowerCase().includes(query));

    filtered.forEach(anim => {
        const li = document.createElement("li");
        li.textContent = anim;
        li.className = "p-2 hover:bg-gray-200 cursor-pointer";
        li.addEventListener("click", () => {
            animationSearch.value = anim;
            suggestions.style.display = "none";
        });
        suggestions.appendChild(li);
    });

    suggestions.style.display = filtered.length ? "block" : "none";
});

// --- Handle Enter key to select first suggestion ---
animationSearch.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        e.preventDefault();
        const firstOption = suggestions.querySelector("li");
        if (firstOption) {
            firstOption.click();
        }
    }
});

// --- Reset Button ---
resetBtn.addEventListener("click", () => {
    htmlEditor.value = "";
    cssEditor.value = "";
    jsEditor.value = "";
    animationSearch.value = "";
    suggestions.style.display = "none";
    outputFrame.srcdoc = "";
});

const toggleSwitch = document.getElementById("theme-toggle");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");
    const savedTheme = localStorage.getItem("theme");

    // Apply saved or preferred theme
    if (savedTheme) {
      document.documentElement.setAttribute("data-theme", savedTheme);
      toggleSwitch.checked = savedTheme === "dark";
    } else if (prefersDark.matches) {
      document.documentElement.setAttribute("data-theme", "dark");
      toggleSwitch.checked = true;
    }

    toggleSwitch.addEventListener("change", () => {
      const theme = toggleSwitch.checked ? "dark" : "light";
      document.documentElement.setAttribute("data-theme", theme);
      localStorage.setItem("theme", theme);
    });
