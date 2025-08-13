
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

/* Unified DOM initialization: theme, reduced-motion, nav, images, animations */
document.addEventListener("DOMContentLoaded", () => {
  const body = document.body
  const themeToggle = document.getElementById("theme-toggle")
  const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)')

  function setTheme(isDark) {
    body.classList.toggle("dark", isDark)
    localStorage.setItem("theme", isDark ? "dark" : "light")
    if (window.lucide) {
      window.lucide.createIcons()
    }
  }

  // Initial theme
  const savedTheme = localStorage.getItem("theme")
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
  setTheme(savedTheme ? savedTheme === "dark" : prefersDark)

  themeToggle?.addEventListener("click", () => {
    setTheme(!body.classList.contains("dark"))
  })

  // Scroll reveal via singleton manager (respect reduced motion)
  const initScrollReveal = () => {
    const targets = document.querySelectorAll('.scroll-fade, .template-card')
    if (prefersReducedMotion?.matches) {
      targets.forEach(el => el.classList.add('visible'))
      return
    }
    if (window.scrollRevealManager) {
      targets.forEach((el) => {
        if (!el.classList.contains('visible')) {
          window.scrollRevealManager.observe(el)
        }
      })
    }
  }
  initScrollReveal()
  window.addEventListener('pageshow', initScrollReveal)
  window.addEventListener('pagehide', () => { window.scrollRevealManager?.disconnect() })

  // Global image loading hints (skip logo)
  ;(() => {
    document.querySelectorAll('img:not(.logo)').forEach((img) => {
      if (!img.hasAttribute('loading')) img.setAttribute('loading', 'lazy')
      if (!img.hasAttribute('decoding')) img.setAttribute('decoding', 'async')
    })
  })()

  // Inject mobile hamburger and wire up behavior
  ;(() => {
    const nav = document.querySelector('.navbar')
    const links = nav?.querySelector('.nav-links')
    if (!nav || !links) return
    if (!links.id) links.id = 'primary-nav'

    let toggle = nav.querySelector('.nav-toggle')
    if (!toggle) {
      toggle = document.createElement('button')
      toggle.className = 'nav-toggle'
      toggle.setAttribute('aria-controls', links.id)
      toggle.setAttribute('aria-expanded', 'false')
      toggle.setAttribute('aria-label', 'Toggle navigation menu')
      toggle.innerHTML = '<span></span><span></span><span></span>'
      nav.querySelector('.nav-right')?.prepend(toggle)
    }

    const onResizeClose = () => {
      if (window.innerWidth >= 768 && nav.classList.contains('is-open')) {
        nav.classList.remove('is-open')
        toggle.setAttribute('aria-expanded', 'false')
      }
    }

    toggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('is-open')
      toggle.setAttribute('aria-expanded', String(isOpen))
    })
    window.addEventListener('resize', debounce(onResizeClose, 200))
  })()

  // Progress bar (passive scroll)
  ;(() => {
    const progressBar = document.getElementById('progress-bar')
    if (!progressBar) return
    const updateProgressBar = () => {
      const windowScroll = document.body.scrollTop || document.documentElement.scrollTop
      const documentHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight
      const scrollPercent = documentHeight > 0 ? (windowScroll / documentHeight) * 100 : 0
      progressBar.style.width = scrollPercent + '%'
    }
    if (!prefersReducedMotion?.matches) {
      window.addEventListener('scroll', updateProgressBar, { passive: true })
    }
    updateProgressBar()
  })()

  // Respect reduced motion for snake cursor enable
  const rmq = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)')
  if (rmq?.matches) {
    disableSnakeCursor()
  }

  // Contact form logic remains unchanged below
})


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

  // Scroll to top button functionality remains below

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

function debounce(fn, wait) {
  let t
  return function(...args) {
    clearTimeout(t)
    t = setTimeout(() => fn.apply(this, args), wait)
  }
}




