// Function to make the FAQ collapsible
function toggleFAQ(element) {
  if (!document.querySelector(".faq-item")) return;
  const faqItem = element.closest(".faq-item"); // to make sure we can click anywhere
  const isActive = faqItem.classList.contains("active");

  // Close all other FAQ items
  document.querySelectorAll(".faq-item.active").forEach((item) => {
    if (item !== faqItem) {
      item.classList.remove("active");
    }
  });

  // Toggle current item
  faqItem.classList.toggle("active", !isActive);
}

// Make toggleFAQ globally accessible
window.toggleFAQ = toggleFAQ;

// Global references for snake cursor logic
let currentAnimationId = null;
let currentMousemoveListener = null;
let snakeContainerElement = null;

const isMobile = window.matchMedia("(max-width: 768px)").matches;

function enableSnakeCursor() {
  disableSnakeCursor();

  snakeContainerElement = document.createElement("div");
  snakeContainerElement.id = "cursor-snake";
  document.body.appendChild(snakeContainerElement);

  const dots = [];
  const dotCount = 20;

  for (let i = 0; i < dotCount; i++) {
    const dot = document.createElement("div");
    dot.className = "snake-dot";
    snakeContainerElement.appendChild(dot);
    dots.push({ el: dot, x: 0, y: 0 });
  }

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;

  currentMousemoveListener = (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  };
  document.addEventListener("mousemove", currentMousemoveListener);

  function animateSnake() {
    let x = mouseX,
      y = mouseY;
    dots.forEach((dot, i) => {
      dot.x += (x - dot.x) * 0.2;
      dot.y += (y - dot.y) * 0.2;
      dot.el.style.left = dot.x + "px";
      dot.el.style.top = dot.y + "px";
      dot.el.style.transform = `scale(${1 - i / dotCount})`;
      x = dot.x;
      y = dot.y;
    });
    currentAnimationId = requestAnimationFrame(animateSnake);
  }

  animateSnake();
}

function disableSnakeCursor() {
  if (snakeContainerElement) {
    if (currentAnimationId) {
      cancelAnimationFrame(currentAnimationId);
      currentAnimationId = null;
    }
    if (currentMousemoveListener) {
      document.removeEventListener("mousemove", currentMousemoveListener);
      currentMousemoveListener = null;
    }
    snakeContainerElement.remove();
    snakeContainerElement = null;
  }
}

window.addEventListener("pagehide", () => {
  disableSnakeCursor();
});

window.addEventListener("DOMContentLoaded", () => {
  const themeToggle = document.getElementById("theme-toggle");
  const themeToggleSide = document.getElementById("theme-toggle-side");
  const body = document.body;

  function setTheme(dark) {
    const newIcon = dark ? "sun" : "moon";
    body.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");

    [themeToggle, themeToggleSide].forEach((toggle) => {
      if (toggle) {
        toggle.innerHTML = `<i data-lucide="${newIcon}"></i>`;
      }
    });
    
    if (window.lucide) {
      window.lucide.createIcons();
    }
    
  }

  const savedTheme = localStorage.getItem("theme");
  setTheme(savedTheme === "dark");

  [themeToggle, themeToggleSide].forEach((toggle) => {
    if (toggle) {
      toggle.addEventListener("click", () => {
        const isDark = body.classList.contains("dark");
        setTheme(!isDark);
      });
    }
  });
  

  if (window.lucide) {
    window.lucide.createIcons();
  }

  // Scroll Reveal Animation
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    },
    { threshold: 0.2 }
  );

  document.querySelectorAll(".scroll-fade").forEach((el) => {
    observer.observe(el);
  });

  // Testimonial slider
  const slider = document.getElementById("slider");
  if (slider) {
    const slides = document.querySelectorAll(".card");
    let current = 0;

    function showSlide(index) {
      const total = slides.length;
      if (index >= total) current = 0;
      else if (index < 0) current = total - 1;
      else current = index;
      slider.style.transform = `translateX(-${current * 100}%)`;
    }

    function nextSlide() {
      showSlide(current + 1);
    }

    setInterval(() => {
      nextSlide();
    }, 5000);
  }

  // Contributors fetch
  const contributorsGrid = document.getElementById("contributors-grid");
  if (contributorsGrid) {
    fetch("https://api.github.com/repos/itsAnimation/AnimateItNow/contributors")
      .then((res) => res.json())
      .then((contributors) => {
        contributorsGrid.innerHTML = "";
        contributors.forEach((contributor) => {
          const card = document.createElement("a");
          card.href = contributor.html_url;
          card.className = "contributor-card";
          card.target = "_blank";
          card.rel = "noopener noreferrer";
          card.innerHTML = `
            <img src="${contributor.avatar_url}" alt="${contributor.login}" class="contributor-avatar">
            <h3>${contributor.login}</h3>
            <p>Contributions: ${contributor.contributions}</p>
          `;
          contributorsGrid.appendChild(card);
        });
      })
      .catch((err) => {
        console.error("Error fetching contributors:", err);
        contributorsGrid.innerHTML = "<p>Could not load contributors at this time.</p>";
      });
  }

  // Contact form validation
  const contactForm = document.querySelector(".contact-form");
  const formInputs = contactForm ? contactForm.querySelectorAll("input[required], textarea[required]") : [];

  if (contactForm) {
    function checkFormValidity() {
      return [...formInputs].every((input) => input.value.trim() !== "");
    }

    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const allValid = checkFormValidity();
      if (allValid) {
        alert("Message sent successfully!");
        contactForm.reset();
      } else {
        alert("Please fill in all fields correctly. Fields cannot be empty or contain only spaces.");
      }
    });

    formInputs.forEach((input) => {
      input.addEventListener("input", () => {
        const allFieldsFilled = checkFormValidity();
        input.classList.toggle("invalid", !allFieldsFilled);
      });
    });
  }

  // Snake cursor toggle sync
  // Independent toggle logic for desktop (top-nav) and mobile (sidebar)
const desktopToggle = document.getElementById("cursorToggle");       // Top-nav checkbox
const mobileToggle = document.getElementById("cursorToggleSidebar"); // Sidebar checkbox

// Initialize from localStorage (default: unchecked)
const savedCursorState = localStorage.getItem("cursorEnabled") === "true";

if (desktopToggle) {
  desktopToggle.checked = savedCursorState;
  desktopToggle.addEventListener("change", (e) => {
    if (e.target.checked) {
      enableSnakeCursor();
      localStorage.setItem("cursorEnabled", true);
    } else {
      disableSnakeCursor();
      localStorage.setItem("cursorEnabled", false);
    }
  });
}

// Mobile toggle works independently (no localStorage sync)
if (mobileToggle) {
  mobileToggle.addEventListener("change", (e) => {
    if (e.target.checked) {
      enableSnakeCursor();
    } else {
      disableSnakeCursor();
    }
  });
}

// Apply initial state (for desktop)
if (savedCursorState && desktopToggle?.checked) {
  enableSnakeCursor();
}

  // ProgressBar Functionality
  function updateProgressBar() {
    const windowScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const documentHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollPercent = (windowScroll / documentHeight) * 100;
    const progressBar = document.getElementById("progress-bar");
    if (progressBar) {
      progressBar.style.width = scrollPercent + "%";
    }
  }

  window.addEventListener("scroll", updateProgressBar);
  updateProgressBar();
});
let openSideBar = document.getElementById("openSlideBar");
let sideBar = document.getElementById("sidebar");
let closeSideBar = document.getElementById("closeSidebar");
openSideBar.addEventListener("click",()=>{
  sideBar.style.display = "block";
})
closeSideBar.addEventListener("click",()=>{
  sideBar.style.display = "none";
})