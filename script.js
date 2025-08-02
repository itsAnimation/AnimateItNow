
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



//dynamically add the active or current class only to the tab that matches the current route or URL section.
  window.addEventListener('DOMContentLoaded', () => {
    const currentPage = window.location.pathname.split("/").pop(); // e.g., about.html
    const navLinks = document.querySelectorAll(".nav-links a");

    navLinks.forEach(link => {
      // Remove 'active' class from all
      link.classList.remove("active");

      // Add 'active' class to current page's link
      if (link.getAttribute("href") === currentPage) {
        link.classList.add("active");
      }
    });
  });



// Make toggleFAQ globally accessible
window.toggleFAQ = toggleFAQ

// Global (or module-level) variables to store animation and listener references for snake cursor
let currentAnimationId = null
let currentMousemoveListener = null
let snakeContainerElement = null // Keep a reference to the container element

// Removed the problematic 'const lucide = { createIcons: () => {}, }' declaration.
// The actual 'lucide' object is provided by the external script loaded in HTML.
// Declaring it as 'const' here prevented the global 'lucide' from being used.


document.querySelectorAll(".faq-toggle").forEach(button => {
  button.addEventListener("click", () => toggleFAQ(button))
})


// Cursor Follower Snake Effect

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

// You can test a food-related effect visually with this:
// document.body.style.backgroundImage = 'url("https://www.transparenttextures.com/patterns/food.png")'
// document.body.style.backgroundRepeat = 'repeat';


//hover buttons logic

const codeSnippets = {
      glowBlue: `
            <style>
            .btn:hover{
            transform: scale(1.08);
            }
            #glowBtn{
            background: #4f8cff;
            color: #fff;
            padding: 1em 2em;
            border: none;
            border-radius: 2em;
            font-weight: 600;
            box-shadow: 0 0 10px #4d8fff;
            transition: background 0.2s, transform 0.2s;
            cursor: pointer;
            }
            </style>
            <button id = "glowBtn" class="btn glow">Glow</button>`,
      outlineBlue: `
            <style>
            .btn:hover{
            transform: scale(1.08);
            }
            #outlineBtn{
            background: #fff;
            color: #4f8cff;
            padding: 1em 2em;
            border: 2px solid #4f8cff;
            border-radius: 2em;
            font-size: 1.1rem;
            font-weight: 600;
            box-shadow: 0 4px 16px rgba(79, 140, 255, 0.12);
            transition: background 0.2s, transform 0.2s;
            cursor: pointer;
            }
            </style>
            <button id = "outlineBtn" class="btn">Outline</button>`,
      gradientBlue: `
            <style>
            .btn:hover{
            transform: scale(1.08);
            }
            #gradientBtn{
            background: linear-gradient(90deg, #4f8cff 60%, #2563eb 100%);
            color: #fff;
            padding: 1em 2em;
            border: none;
            border-radius: 2em;
            font-size: 1.1rem;
            font-weight: 600;
            box-shadow: 0 4px 16px rgba(79, 140, 255, 0.12);
            transition: background 0.2s, transform 0.2s;
            cursor: pointer;
            }
            </style>
            <button id = "gradientBtn" class="btn gradient">Gradient</button>`,
      glowBlack: `
            <style>
            .btn::after{
            content: "";
            z-index: -1;
            position: absolute;
            width: 100%;
            height: 100%;
            background-color: #333;
            left: 0;
            top: 0;
            border-radius: 2em;
            }
            .btn::before{
            content: "";
            background: linear-gradient(
              45deg,
              #f11616,rgb(224, 210, 10),rgb(106, 223, 10),
              rgba(16, 205, 139, 0.942),rgb(9, 194, 223),rgba(55, 13, 221, 0.871),
              rgb(220, 19, 169),rgb(222, 18, 18)
            );
            position: absolute;
            top:-2px;
            left: -2px;
            background-size:600%;
            z-index: -1;
            width: calc(100% + 0.3em);
            height: calc(100% + 0.3em);
            filter: blur(1em);
            animation: glow 20s linear infinite;
            border-radius: 2px;
            opacity: 0;
            }
            @keyframes glow{
                0%{
                    background-position: 0 0;
                }
                50%{
                    background-position: 400% 0;
                }
                100%{background-position: 0 0;}
            }
            .btn:hover{
            transform: scale(1.08);
            }
            #glowBtn{
            color: #fff;
            padding: 1em 2em;
            border: none;
            border-radius: 2em;
            font-weight: 600;
            cursor: pointer;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
            position: relative;
            z-index: 0;
            }
            </style>
            <button id = "glowBtn" class="btn glow">Glow</button>`,
      outlineBlack: `
            <style>
            .btn::after{
            content: "";
            z-index: -1;
            position: absolute;
            width: 100%;
            height: 100%;
            background-color: #333;
            left: 0;
            top: 0;
            border-radius: 2em;
            }
            .btn::before{
            content: "";
            background: linear-gradient(
              45deg,
              #f11616,rgb(224, 210, 10),rgb(106, 223, 10),
              rgba(16, 205, 139, 0.942),rgb(9, 194, 223),rgba(55, 13, 221, 0.871),
              rgb(220, 19, 169),rgb(222, 18, 18)
            );
            position: absolute;
            top:-2px;
            left: -2px;
            background-size:600%;
            z-index: -1;
            width: calc(100% + 0.3em);
            height: calc(100% + 0.3em);
            filter: blur(1em);
            animation: glow 20s linear infinite;
            border-radius: 2px;
            opacity: 0;
            }
            @keyframes glow{
                0%{
                    background-position: 0 0;
                }
                50%{
                    background-position: 400% 0;
                }
                100%{background-position: 0 0;}
            }
            .btn:hover{
            transform: scale(1.08);
            }
            #outlineBtn{
            padding: 1em 2em;
            border-radius: 2em;
            font-size: 1.1rem;
            font-weight: 600;
            cursor: pointer;
            border: none;
            color: white;
            position: relative;
            z-index: 0;
            }
            </style>
            <button id = "outlineBtn" class="btn outline">Outline</button>`,
      gradientBlack: `
            <style>
            .btn::after{
            content: "";
            z-index: -1;
            position: absolute;
            width: 100%;
            height: 100%;
            background-color: #333;
            left: 0;
            top: 0;
            border-radius: 2em;
            }
            .btn::before{
            content: "";
            background: linear-gradient(
              45deg,
              #f11616,rgb(224, 210, 10),rgb(106, 223, 10),
              rgba(16, 205, 139, 0.942),rgb(9, 194, 223),rgba(55, 13, 221, 0.871),
              rgb(220, 19, 169),rgb(222, 18, 18)
            );
            position: absolute;
            top:-2px;
            left: -2px;
            background-size:600%;
            z-index: -1;
            width: calc(100% + 0.3em);
            height: calc(100% + 0.3em);
            filter: blur(1em);
            animation: glow 20s linear infinite;
            border-radius: 2px;
            opacity: 0;
            }
            @keyframes glow{
                0%{
                    background-position: 0 0;
                }
                50%{
                    background-position: 400% 0;
                }
                100%{background-position: 0 0;}
            }
            .btn:hover{
            transform: scale(1.08);
            }
            #gradientBtn{
            padding: 1em 2em;
            border: none;
            border-radius: 2em;
            font-size: 1.1rem;
            font-weight: 600;
            cursor: pointer;
            color: white;
            position: relative;
            z-index: 0;
            }
            </style>
            <button id = "gradientBtn" class="btn gradient">Gradient</button>`
    };

    let currentShown = null;

function showBox(type) {
      const box = document.getElementById("greyBox");
      if (currentShown === type) {
        box.style.display = "none";
        box.textContent = "";
        currentShown = null;
      } else {
        box.style.display = "block";
        box.textContent = codeSnippets[type];
        currentShown = type;
      }
    }
