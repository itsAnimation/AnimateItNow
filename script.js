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

function typewriter(elementId){
  const el=document.getElementById(elementId);
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
typewriter("modify");

// Apply typewriter effect to other elements
document.addEventListener('DOMContentLoaded', () => {
  typewriter('anotherElement'); // Replace 'anotherElement' with the ID of the element you want to apply the effect to
});

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

// Add copy functionality to FAQ items
function addCopyToFAQ() {
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const copyButton = document.createElement('button');
    copyButton.innerText = 'Copy';
    copyButton.classList.add('faq-copy-btn'); // Add a class for styling
    item.appendChild(copyButton);

    copyButton.addEventListener('click', (event) => {
      event.stopPropagation(); // Prevent FAQ toggle
      const text = item.querySelector('p').innerText;
      navigator.clipboard.writeText(text)
        .then(() => {
          copyButton.innerText = 'Copied!';
          setTimeout(() => copyButton.innerText = 'Copy', 1500);
        })
        .catch(err => console.error('Could not copy text: ', err));
    });
  });
}

// Add like button functionality
function addLikeButtons() {
  const templateCards = document.querySelectorAll('.template-card');
  templateCards.forEach(card => {
    const likeButton = document.createElement('button');
    likeButton.innerText = 'Like';
    likeButton.classList.add('like-btn'); // Add a class for styling
    card.appendChild(likeButton);

    let likes = 0; // Initialize likes count
    likeButton.addEventListener('click', (event) => {
      event.stopPropagation(); // Prevent card click
      likes++;
      likeButton.innerText = `Liked (${likes})`;
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
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
  addCopyToFAQ();
  addLikeButtons();
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



