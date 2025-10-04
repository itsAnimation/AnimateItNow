document.addEventListener("DOMContentLoaded", () => {
  // --- DATABASE OF ANIMATIONS ---
  const animationData = {
    "fade-in": {
      title: "Fade In",
      description:
        "The element smoothly fades into view from an invisible state.",
      html: `<div class="animate fade-in">Fade In</div>`,
      css: `/* Initial state: element is invisible and shifted down */
.fade-in {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.6s ease-out, transform 0.6s ease-out;
}

/* Final state: element is fully visible and in its original position */
.fade-in.visible {
  opacity: 1;
  transform: translateY(0);
}`,
    },
    "slide-left": {
      title: "Slide From Left",
      description:
        "The element slides into view from the left side of the screen.",
      html: `<div class="animate slide-left">Slide Left</div>`,
      css: `/* Initial state: element is invisible and shifted to the left */
.slide-left {
  opacity: 0;
  transform: translateX(-50px);
  transition: opacity 0.6s ease-out, transform 0.6s ease-out;
}

/* Final state: element is fully visible and in its original position */
.slide-left.visible {
  opacity: 1;
  transform: translateX(0);
}`,
    },
    "slide-right": {
      title: "Slide From Right",
      description:
        "The element slides into view from the right side of the screen.",
      html: `<div class="animate slide-right">Slide Right</div>`,
      css: `/* Initial state: element is invisible and shifted to the right */
.slide-right {
  opacity: 0;
  transform: translateX(50px);
  transition: opacity 0.6s ease-out, transform 0.6s ease-out;
}

/* Final state: element is fully visible and in its original position */
.slide-right.visible {
  opacity: 1;
  transform: translateX(0);
}`,
    },
    "zoom-in": {
      title: "Zoom In",
      description:
        "The element smoothly scales up from a smaller size to its original size.",
      html: `<div class="animate zoom-in">Zoom In</div>`,
      css: `/* Initial state: element is invisible and scaled down */
.zoom-in {
  opacity: 0;
  transform: scale(0.8);
  transition: opacity 0.6s ease-out, transform 0.6s ease-out;
}

/* Final state: element is fully visible and at its original scale */
.zoom-in.visible {
  opacity: 1;
  transform: scale(1);
}`,
    },
    "rotate-in": {
      title: "Rotate In",
      description: "The element rotates into place while fading in.",
      html: `<div class="animate rotate-in">Rotate In</div>`,
      css: `/* Initial state: element is invisible and rotated */
.rotate-in {
  opacity: 0;
  transform: rotate(-15deg) scale(0.9);
  transition: opacity 0.6s ease-out, transform 0.6s ease-out;
}

/* Final state: element is fully visible and at its original rotation/scale */
.rotate-in.visible {
  opacity: 1;
  transform: rotate(0deg) scale(1);
}`,
    },
    "scale-up": {
      title: "Scale Up",
      description:
        "The element scales up slightly on view, giving it emphasis.",
      html: `<div class="animate scale-up">Scale Up</div>`,
      css: `/* Initial state: element is invisible and scaled down */
.scale-up {
  opacity: 0;
  transform: scale(0.7);
  transition: opacity 0.6s ease-out, transform 0.6s ease-out;
}

/* Final state: element is fully visible and at its original scale */
.scale-up.visible {
  opacity: 1;
  transform: scale(1);
}`,
    },
  };

  const jsCode = `// Use the modern Intersection Observer API for performance
const animatedElements = document.querySelectorAll('.animate');

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        // If the element is intersecting the viewport, add the 'visible' class
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, {
    threshold: 0.5 // Trigger when 50% of the element is in view
});

// Observe each animated element
animatedElements.forEach(el => {
    observer.observe(el);
});`;

  // --- SCRIPT LOGIC ---

  // 1. Get animation type from URL
  const urlParams = new URLSearchParams(window.location.search);
  const animType = urlParams.get("anim") || "fade-in"; // Default to fade-in if not specified
  const currentAnim = animationData[animType];

  if (currentAnim) {
    // 2. Populate page content
    document.title = `${currentAnim.title} | AnimateItNow`;
    document.getElementById("animation-title").textContent = currentAnim.title;
    document.getElementById("animation-description").textContent =
      currentAnim.description;

    // Populate code blocks (use textContent to prevent HTML interpretation)
    document.getElementById("html-code").textContent = currentAnim.html;
    document.getElementById("css-code").textContent = currentAnim.css;
    document.getElementById("js-code").textContent = jsCode;

    // 3. Setup the live demo
    const demoBox = document.getElementById("demo-box");
    // Add a style tag to the head with the required CSS for the demo
    const styleTag = document.createElement("style");
    styleTag.textContent = currentAnim.css;
    document.head.appendChild(styleTag);
    // Add the animation class to the demo box
    demoBox.classList.add("animate", animType);

    // 4. Use Intersection Observer for the demo animation
    const demoObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          } else {
            // Optional: Reset animation when it scrolls out of view
            entry.target.classList.remove("visible");
          }
        });
      },
      { threshold: 0.8 }
    ); // Trigger when 80% is visible for a better demo feel

    demoObserver.observe(demoBox);
  }

  // 5. Handle "Copy to Clipboard" functionality
  const copyButtons = document.querySelectorAll(".copy-btn");
  copyButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const targetId = button.getAttribute("data-target");
      const codeElement = document.getElementById(targetId);
      const codeToCopy = codeElement.textContent;

      navigator.clipboard
        .writeText(codeToCopy)
        .then(() => {
          // Success feedback
          button.innerHTML = '<i class="fas fa-check"></i>Copied!';
          setTimeout(() => {
            button.innerHTML = '<i class="fas fa-copy"></i>Copy';
          }, 2000);
        })
        .catch((err) => {
          console.error("Failed to copy text: ", err);
        });
    });
  });
});
