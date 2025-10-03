// Function for displaying FAQ categories
function displaycategory(category){
  const general=document.getElementById('general-faq');
  const technical=document.getElementById('technical-faq');
  if(category==='general'){
    general.style.display='block';
    technical.style.display='none';
  }
  else if(category==='technical'){
    general.style.display='none';
    technical.style.display='block';
  }
}
// Service worker registration removed to fix 404 error
// if ('serviceWorker' in navigator) {
//   window.addEventListener('load', () => {
//     navigator.serviceWorker.register('/sw.js').then((registration) => {
//       console.log('Service Worker registered:', registration);
//
//       registration.onupdatefound = () => {
//         const newWorker = registration.installing;
//         newWorker.onstatechange = () => {
//           if (
//             newWorker.state === 'installed' &&
//             navigator.serviceWorker.controller
//           ) {
//             console.log('New version available. Reloading...');
//             window.location.reload();
//           }
//         };
//       };
//     }).catch((error) => {
//       console.error('Service Worker registration failed:', error);
//     });
//   });
// }

function typewriter(){
  const el=document.getElementById("modify");
  if(!el)return;
  const text=el.textContent;
  el.textContent='';
  let index=0;
  let interval=setInterval(()=>{
    if(index<text.length){
      el.textContent+=text.charAt(index);
      index++;
    }
    else{
      clearInterval(interval);
      }
  },100);
}
typewriter();

// Function to make the FAQ collapsible
function toggleFAQ(element) {
  // Ensure we have a valid element
  if (!element || !document.querySelector(".faq-item")) return;
  
  // Find the closest FAQ item container
  const faqItem = element.closest(".faq-item");
  if (!faqItem) return;
  
  // Toggle the active class on this specific FAQ item
  const isActive = faqItem.classList.contains("active");
  faqItem.classList.toggle("active");
  
  // Update aria-expanded attribute for accessibility
  const button = faqItem;
  const answerId = button.getAttribute("aria-controls");
  const answer = document.getElementById(answerId);
  
  if (answer) {
    button.setAttribute("aria-expanded", !isActive);
    answer.hidden = isActive;
  }
}

// Make toggleFAQ globally accessible
window.toggleFAQ = toggleFAQ;

// Add keyboard support for FAQ items
document.addEventListener('DOMContentLoaded', function() {
  const faqItems = document.querySelectorAll('.faq-item');
  
  faqItems.forEach(item => {
    // Add click event
    item.addEventListener('click', function() {
      toggleFAQ(this);
    });
    
    // Add keyboard event
    item.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleFAQ(this);
      }
    });
  });
});

// Global (or module-level) variables to store animation and listener references for snake cursor
let currentAnimationId = null
let currentMousemoveListener = null
let snakeContainerElement = null // Keep a reference to the container element

// Removed the problematic 'const lucide = { createIcons: () => {}, }' declaration.
// The actual 'lucide' object is provided by the external script loaded in HTML.
// Declaring it as 'const' here prevented the global 'lucide' from being used.

// Moved cursor functions outside DOMContentLoaded for better scope and reusability
const isMobile = window.matchMedia("(max-width: 768px)").matches

function enableSnakeCursor() {
  // Always ensure a clean slate before enabling.
  // This is crucial for persistence across page navigations (especially with bfcache)
  disableSnakeCursor()

  snakeContainerElement = document.createElement("div") // Assign to global variable
  snakeContainerElement.id = "cursor-snake"
  document.body.appendChild(snakeContainerElement)

  const dots = []
  const dotCount = 20
  for (let i = 0; i < dotCount; i++) {
    const dot = document.createElement("div")
    dot.className = "snake-dot"
    snakeContainerElement.appendChild(dot) // Append to the new global container
    dots.push({ el: dot, x: 0, y: 0 })
  }

  let mouseX = window.innerWidth / 2
  let mouseY = window.innerHeight / 2

  // Store event listener reference in a global variable
  currentMousemoveListener = (e) => {
    mouseX = e.clientX
    mouseY = e.clientY
  }
  document.addEventListener("mousemove", currentMousemoveListener)

  function animateSnake() {
    let x = mouseX,
      y = mouseY
    dots.forEach((dot, i) => {
      dot.x += (x - dot.x) * 0.2
      dot.y += (y - dot.y) * 0.2
      dot.el.style.left = dot.x + "px"
      dot.el.style.top = dot.y + "px"
      dot.el.style.transform = `scale(${1 - i / dotCount})`
      x = dot.x
      y = dot.y
    })
    // Store the animation ID in a global variable
    currentAnimationId = requestAnimationFrame(animateSnake)
  }
  animateSnake()
}

function disableSnakeCursor() {
  // Use the global reference to the container element
  if (snakeContainerElement) {
    if (currentAnimationId) {
      cancelAnimationFrame(currentAnimationId)
      currentAnimationId = null // Reset global ID
    }
    if (currentMousemoveListener) {
      document.removeEventListener("mousemove", currentMousemoveListener)
      currentMousemoveListener = null // Reset global listener
    }
    snakeContainerElement.remove() // Remove the cursor container
    snakeContainerElement = null // Reset global reference
  }
}

// Add event listener for page unload to ensure cleanup, especially for bfcache
window.addEventListener("pagehide", () => {
  disableSnakeCursor()
})

window.addEventListener("DOMContentLoaded", () => {
  // Theme toggle
  const themeToggle = document.getElementById("theme-toggle")
  const body = document.body
  function setTheme(dark) {
    const newIcon = dark ? "sun" : "moon"
    body.classList.toggle("dark", dark) // Use 'dark' class for consistency
    localStorage.setItem("theme", dark ? "dark" : "light")
    // Replace icon completely
    if (themeToggle) {
      themeToggle.innerHTML = `<i data-lucide="${newIcon}"></i>`
      // Only call lucide.createIcons() if the lucide object is actually available
      if (window.lucide) {
        window.lucide.createIcons()
      }
    }
  }
  const savedTheme = localStorage.getItem("theme")
  setTheme(savedTheme === "dark")
  themeToggle?.addEventListener("click", () => {
    const isDark = body.classList.contains("dark") // Check for 'dark' class
    setTheme(!isDark)
  })
  // Only call lucide.createIcons() if the lucide object is actually available
  // This ensures icons are created on initial load if the library is ready.
  if (window.lucide) {
    window.lucide.createIcons()
  }

  // 🔽 Scroll Reveal Animation
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible")
          // observer.unobserve(entry.target); // uncomment to animate only once
        }
      })
    },
    { threshold: 0.2 },
  )
  document.querySelectorAll(".scroll-fade").forEach((el) => {
    observer.observe(el)
  })

  // 🧪 Testimonial slider
  const slider = document.getElementById("slider")
  if (slider) {
    const slides = document.querySelectorAll(".card")
    let current = 0
    function showSlide(index) {
      const total = slides.length
      if (index >= total) current = 0
      else if (index < 0) current = total - 1
      else current = index
      slider.style.transform = `translateX(-${current * 100}%)`
    }
    function nextSlide() {
      showSlide(current + 1)
    }
    setInterval(() => {
      nextSlide()
    }, 5000)
  }

  // 🧑‍💻 Contributors fetch
  const contributorsGrid = document.getElementById("contributors-grid")
  if (contributorsGrid) {
    fetch("https://api.github.com/repos/itsAnimation/AnimateItNow/contributors")
      .then((res) => res.json())
      .then((contributors) => {
        contributorsGrid.innerHTML = ""
        contributors.forEach((contributor) => {
          const card = document.createElement("a")
          card.href = contributor.html_url
          card.className = "contributor-card"
          card.target = "_blank"
          card.rel = "noopener noreferrer"
          card.innerHTML = `
            <img src="${contributor.avatar_url}" alt="${contributor.login}" class="contributor-avatar">
            <h3>${contributor.login}</h3>
            <p>Contributions: ${contributor.contributions}</p>
          `
          contributorsGrid.appendChild(card)
        })
      })
      .catch((err) => {
        console.error("Error fetching contributors:", err)
        contributorsGrid.innerHTML = "<p>Could not load contributors at this time.</p>"
      })
  }

  // 📨 Contact form validation
  const contactForm = document.querySelector(".contact-form")
  // Removed the problematic 'if (!contactForm) return;' line.
  // This line was preventing the rest of the DOMContentLoaded block (including theme toggle and cursor logic)
  // from executing on pages that do not have a .contact-form element.
  const formInputs = contactForm ? contactForm.querySelectorAll("input[required], textarea[required]") : []
  if (contactForm) {
    function checkFormValidity() {
      return [...formInputs].every((input) => input.value.trim() !== "")
    }
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault()
      const allValid = checkFormValidity()
      if (allValid) {
       showToast("Message sent successfully!");
        contactForm.reset()
      } else {
        alert("Please fill in all fields correctly. Fields cannot be empty or contain only spaces.")
      }
    })
    formInputs.forEach((input) => {
      input.addEventListener("input", () => {
        const allFieldsFilled = checkFormValidity()
        input.classList.toggle("invalid", !allFieldsFilled)
      })
    })
  }

  // FAQ Section Enhancement - Add event listeners for better accessibility
  const faqHeaders = document.querySelectorAll('.faq-question-header');
  faqHeaders.forEach(header => {
    // Add keyboard accessibility
    header.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleFAQ(header);
      }
    });
  });

 function showToast(message) {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  document.body.appendChild(toast);

  // Trigger fade-in
  setTimeout(() => toast.classList.add("show"), 100);

  // Fade out and remove
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 300); // Wait for transition to finish
  }, 3000);
}

  // Snake cursor initialization and state management
  const cursorToggle = document.getElementById("cursorToggle")
  if (!isMobile && cursorToggle) {
    // Read saved state from localStorage for initial setup
    const savedCursorState = localStorage.getItem("cursorEnabled")
    // Default to false if no state is saved, or use the saved state
    const initialCursorEnabled = savedCursorState !== null ? JSON.parse(savedCursorState) : false

    // Set initial state of the toggle checkbox
    cursorToggle.checked = initialCursorEnabled

    // Apply initial cursor state immediately
    if (initialCursorEnabled) {
      enableSnakeCursor()
    } else {
      disableSnakeCursor()
    }

    // Add event listener for changes to toggle cursor and save state
    cursorToggle.addEventListener("change", function () {
      if (this.checked) {
        enableSnakeCursor()
        localStorage.setItem("cursorEnabled", "true")
      } else {
        disableSnakeCursor()
        localStorage.setItem("cursorEnabled", "false")
      }
    })
  }

  // 🚦 ProgressBar Functionality
  function updateProgressBar() {
    const windowScroll = document.body.scrollTop || document.documentElement.scrollTop
    const documentHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight
    const scrollPercent = (windowScroll / documentHeight) * 100
    const progressBar = document.getElementById("progress-bar")
    if (progressBar) {
      progressBar.style.width = scrollPercent + "%"
    }
  }
  window.addEventListener("scroll", updateProgressBar)
  // Initialize on load
  updateProgressBar()
})



// Scroll to top button functionality
  // Show button when scrolled down
window.onscroll = function () {
  const btn = document.getElementById("scrollBtn");
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    btn.classList.add("show");
  } else {
    btn.classList.remove("show");
  }
};

// Scroll to top on click
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}




const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
  });
}

// Enhanced animation functions for the about page
document.addEventListener('DOMContentLoaded', function() {
  // Add parallax effect to floating elements
  const floatingElements = document.querySelectorAll('.floating-element');
  
  window.addEventListener('mousemove', (e) => {
    const x = (window.innerWidth - e.pageX) / 50;
    const y = (window.innerHeight - e.pageY) / 50;
    
    floatingElements.forEach((el, index) => {
      const speed = (index + 1) * 0.5;
      el.style.transform = `translate(${x * speed}px, ${y * speed}px) rotate(${x * speed}deg)`;
    });
  });
  
  // Add click animation to tech items
  const techItems = document.querySelectorAll('.about-tech-item');
  techItems.forEach(item => {
    item.addEventListener('click', function() {
      this.classList.add('animate__animated', 'animate__rubberBand');
      setTimeout(() => {
        this.classList.remove('animate__animated', 'animate__rubberBand');
      }, 1000);
    });
  });
  
  // Add hover effect to audience items
  const audienceItems = document.querySelectorAll('.about-audience-item');
  audienceItems.forEach(item => {
    item.addEventListener('mouseenter', function() {
      this.classList.add('animate__animated', 'animate__headShake');
      setTimeout(() => {
        this.classList.remove('animate__animated', 'animate__headShake');
      }, 1000);
    });
  });
  
  // Add counter animation for stats
  const statNumbers = document.querySelectorAll('.stat-number');
  const animateCounter = (element) => {
    const target = +element.getAttribute('data-count');
    const increment = target / 100;
    let current = 0;
    
    const updateCounter = () => {
      if (current < target) {
        current += increment;
        element.innerText = Math.ceil(current);
        setTimeout(updateCounter, 20);
      } else {
        element.innerText = target;
      }
    };
    
    updateCounter();
  };
  
  // Trigger counter animation when stats section is in view
  const statsSection = document.querySelector('.stats-container');
  if (statsSection) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          statNumbers.forEach(num => animateCounter(num));
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    
    observer.observe(statsSection);
  }
});

// Mobile menu toggle functionality
document.addEventListener('DOMContentLoaded', function() {
  const hamburgerMenu = document.querySelector('.hamburger-menu');
  const navRight = document.querySelector('.nav-right');
  
  if (hamburgerMenu && navRight) {
    hamburgerMenu.addEventListener('click', function() {
      hamburgerMenu.classList.toggle('active');
      navRight.classList.toggle('active');
    });
    
    // Close menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        hamburgerMenu.classList.remove('active');
        navRight.classList.remove('active');
      });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
      if (!navRight.contains(event.target) && !hamburgerMenu.contains(event.target)) {
        hamburgerMenu.classList.remove('active');
        navRight.classList.remove('active');
      }
    });
  }
});

