// 🎭 Function for displaying FAQ categories
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

// 🧹 Service worker registration removed to fix 404 error
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

// ✨ Enhanced typewriter effect with improved performance
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

// 🚀 Initialize typewriter effect
typewriter();

// 🧠 Function to make the FAQ collapsible with enhanced accessibility
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

// 🌐 Make toggleFAQ globally accessible
window.toggleFAQ = toggleFAQ;

// ⌨️ Add keyboard support for FAQ items
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

// 🐍 Global (or module-level) variables to store animation and listener references for snake cursor
let currentAnimationId = null
let currentMousemoveListener = null
let snakeContainerElement = null // Keep a reference to the container element

// 📦 Removed the problematic 'const lucide = { createIcons: () => {}, }' declaration.
// The actual 'lucide' object is provided by the external script loaded in HTML.
// Declaring it as 'const' here prevented the global 'lucide' from being used.

// 🏗️ Moved cursor functions outside DOMContentLoaded for better scope and reusability
const isMobile = window.matchMedia("(max-width: 768px)").matches

// 🎨 Enhanced snake cursor with improved performance
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

  // 🔄 Animate snake with optimized performance
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

// 🛑 Disable snake cursor with enhanced cleanup
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

// 🔄 Add event listener for page unload to ensure cleanup, especially for bfcache
window.addEventListener("pagehide", () => {
  disableSnakeCursor()
})

// 🌗 Theme toggle with enhanced functionality
window.addEventListener("DOMContentLoaded", () => {
  // Theme toggle
  const themeToggle = document.getElementById("theme-toggle")
  const body = document.body
  
  // 🎨 Set theme with improved icon handling
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
  
  // 🧠 Load saved theme with fallback
  const savedTheme = localStorage.getItem("theme")
  setTheme(savedTheme === "dark")
  
  // 🖱️ Add theme toggle event listener
  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const isDark = body.classList.contains("dark")
      setTheme(!isDark)
    })
  }
})

// 📱 Mobile menu toggle functionality
document.addEventListener('DOMContentLoaded', function() {
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.querySelector('.nav-menu');
  
  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', function() {
      navMenu.classList.toggle('active');
      menuToggle.classList.toggle('active');
    });
    
    // 🖱️ Close menu when clicking outside
    document.addEventListener('click', function(e) {
      if (!menuToggle.contains(e.target) && !navMenu.contains(e.target)) {
        navMenu.classList.remove('active');
        menuToggle.classList.remove('active');
      }
    });
  }
});

// 📈 Enhanced scroll progress indicator
function updateScrollProgress() {
  const scrollTop = window.scrollY;
  const docHeight = document.body.scrollHeight - window.innerHeight;
  const progress = (scrollTop / docHeight) * 100;
  
  const progressBar = document.getElementById('scroll-progress');
  if (progressBar) {
    progressBar.style.width = progress + '%';
  }
}

// 📊 Initialize scroll progress tracking
document.addEventListener('scroll', updateScrollProgress);

// 🎯 Smooth scroll to anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// 📋 Copy to clipboard functionality
function copyToClipboard(text) {
  // 📋 Try navigator clipboard API first
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(() => {
      // 🎉 Success callback
      console.log('Text copied to clipboard');
    }).catch(err => {
      // ⚠️ Error callback
      console.error('Failed to copy text: ', err);
    });
  } else {
    // 🆘 Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
  }
}

// 🧪 Console log for debugging purposes
console.log("✨ Script initialized successfully");

// 🕒 Performance monitoring placeholder
function logPerformance() {
  // 📊 This is a placeholder for future performance monitoring
  // console.log("Performance metrics:", performance.memory);
}

// 🧼 Cleanup function for memory management
function cleanup() {
  // 🧹 This is a placeholder for future cleanup operations
  console.log("🧹 Cleanup completed");
}

// 🚀 Initialize all components when DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
  // 🎬 All initialization code goes here
  console.log("🎬 All components initialized");
});