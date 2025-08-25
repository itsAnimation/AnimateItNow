
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
  if (!document.querySelector(".faq-item")) return
  const faqItem = element.closest(".faq-item") //to make sure we can click anywhere
  const isActive = faqItem.classList.contains("active")

  // Close all other FAQ items
  document.querySelectorAll(".faq-item.active").forEach((item) => {
    if (item !== faqItem) {
      item.classList.remove("active")
    }
  })

  // Toggle current item
  faqItem.classList.toggle("active", !isActive)
}

// Make toggleFAQ globally accessible
window.toggleFAQ = toggleFAQ

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
  // This is crucial for persistence across page navigations (especially with bfcache).
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


  // Scroll reveal via singleton manager
  const initScrollReveal = () => {
    if (window.scrollRevealManager) {
      document.querySelectorAll('.scroll-fade, .template-card').forEach((el)=>{
        if (!el.classList.contains('visible')) {
          window.scrollRevealManager.observe(el)
        }
      })
    }
  }
  initScrollReveal()
  window.addEventListener('pageshow', () => { initScrollReveal() })
  window.addEventListener('pagehide', () => { if (window.scrollRevealManager) { window.scrollRevealManager.disconnect() } })
   window.addEventListener('pagehide', () => {
     if (window.scrollRevealManager) { 
      window.scrollRevealManager.disconnect() 
    } 
  })
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

  // ðŸ”½ Scroll Reveal Animation
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

  // ðŸ§ª Testimonial slider
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

  // ðŸ§‘â€ðŸ’» Contributors fetch
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

  // ðŸ“¨ Contact form validation
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

  // ðŸš¦ ProgressBar Functionality
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

// Code Export Functionality - Initialize on both DOM ready and window load
let codeExportInitialized = false;

document.addEventListener('DOMContentLoaded', () => {
  initializeCodeExport();
  
  const logo = document.querySelector('.logo');
  if (logo) {
    // Remove any previous animation class just in case
    logo.classList.remove('animate-once');

    // Force reflow so browser restarts the animation
    void logo.offsetWidth;

    // Add class to start animation
    logo.classList.add('animate-once');

    // Remove after animation ends (so next refresh works again)
    logo.addEventListener('animationend', () => {
      logo.classList.remove('animate-once');
    }, { once: true });
  }
});

// Fallback initialization on window load
window.addEventListener('load', () => {
  initializeCodeExport();
});

function initializeCodeExport() {
  if (codeExportInitialized) return;
  
  const dropdownBtn = document.getElementById('copyCodeDropdownBtn');
  const dropdownContent = document.getElementById('copyCodeDropdownContent');
  const dropdownItems = document.querySelectorAll('.dropdown-item');

  if (!dropdownBtn || !dropdownContent) {
    console.error('Code export elements not found - button or dropdown missing');
    return;
  }

  codeExportInitialized = true;

  // Toggle dropdown on button click
  dropdownBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    dropdownContent.classList.toggle('show');
  });

  // Close dropdown when clicking outside
  document.addEventListener('click', () => {
    dropdownContent.classList.remove('show');
  });

  // Handle format selection
  dropdownItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.stopPropagation();
      const format = item.dataset.format;
      copyCodeInFormat(format);
      dropdownContent.classList.remove('show');
    });
  });
}

function copyCodeInFormat(format) {
  const codeSnippets = getCodeSnippets();
  const code = codeSnippets[format];
  
  if (!code) {
    showToast('Code format not available', 'error');
    return;
  }

  // Copy to clipboard
  navigator.clipboard.writeText(code).then(() => {
    showToast(`Code copied in ${format.toUpperCase()} format ✅`);
  }).catch(err => {
    console.error('Failed to copy code: ', err);
    showToast('Failed to copy code', 'error');
  });
}

function getCodeSnippets() {
  return {
    css: `/* CSS Hover Effects */
.box {
  width: 300px;
  height: 300px;
  background: #1a1a1a;
  border-radius: 8px;
  transition: all 0.3s ease;
  cursor: pointer;
}

.box.scale:hover {
  transform: scale(1.1);
}

.box.translate:hover {
  transform: translateY(-20px);
}

.box.rotate:hover {
  transform: rotate(15deg);
}

.box.Box-Shadow:hover {
  box-shadow: 0 20px 40px rgba(0,0,0,0.3);
}`,

    js: `// JavaScript Hover Effects
const boxes = document.querySelectorAll('.box');

boxes.forEach(box => {
  box.addEventListener('mouseenter', () => {
    if (box.classList.contains('scale')) {
      box.style.transform = 'scale(1.1)';
    } else if (box.classList.contains('translate')) {
      box.style.transform = 'translateY(-20px)';
    } else if (box.classList.contains('rotate')) {
      box.style.transform = 'rotate(15deg)';
    } else if (box.classList.contains('Box-Shadow')) {
      box.style.boxShadow = '0 20px 40px rgba(0,0,0,0.3)';
    }
  });

  box.addEventListener('mouseleave', () => {
    box.style.transform = '';
    box.style.boxShadow = '';
  });
});`,

    react: `// React Hover Effects Component
import React, { useState } from 'react';

const HoverBox = ({ type, children }) => {
  const [isHovered, setIsHovered] = useState(false);

  const getHoverStyles = () => {
    if (!isHovered) return {};
    
    switch(type) {
      case 'scale':
        return { transform: 'scale(1.1)' };
      case 'translate':
        return { transform: 'translateY(-20px)' };
      case 'rotate':
        return { transform: 'rotate(15deg)' };
      case 'shadow':
        return { boxShadow: '0 20px 40px rgba(0,0,0,0.3)' };
      default:
        return {};
    }
  };

  return (
    <div
      style={{
        width: '300px',
        height: '300px',
        background: '#1a1a1a',
        borderRadius: '8px',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        ...getHoverStyles()
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
    </div>
  );
};`,

    tailwind: `<!-- Tailwind CSS Hover Effects -->
<div class="w-72 h-72 bg-gray-900 rounded-lg transition-all duration-300 cursor-pointer hover:scale-110">
  Scale Effect
</div>

<div class="w-72 h-72 bg-gray-900 rounded-lg transition-all duration-300 cursor-pointer hover:-translate-y-5">
  Translate Effect
</div>

<div class="w-72 h-72 bg-gray-900 rounded-lg transition-all duration-300 cursor-pointer hover:rotate-12">
  Rotate Effect
</div>

<div class="w-72 h-72 bg-gray-900 rounded-lg transition-all duration-300 cursor-pointer hover:shadow-2xl">
  Shadow Effect
</div>`
  };
}

function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toastMessage');
  
  if (!toast || !toastMessage) return;

  toastMessage.textContent = message;
  
  // Add type-specific styling
  if (type === 'error') {
    toast.style.backgroundColor = '#e74c3c';
  } else {
    toast.style.backgroundColor = '#333';
  }
  
  toast.classList.add('show');
  
  // Remove toast after 3 seconds
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}





