// Fixed and cleaned version of your full JS script

// Scroll Progress Bar
window.addEventListener("scroll", () => {
  const progressBar = document.querySelector(".progress-bar")
  const totalHeight = document.body.scrollHeight - window.innerHeight
  const progress = (window.scrollY / totalHeight) * 100
  progressBar.style.width = `${progress}%`
})

// Theme Toggle
const themeToggle = document.getElementById("theme-toggle")
const root = document.documentElement

function setTheme(dark) {
  root.setAttribute("data-theme", dark ? "dark" : "light")
  localStorage.setItem("theme", dark ? "dark" : "light")
  themeToggle.innerHTML = dark ? "light_mode" : "dark_mode"
}

// Load Theme
const storedTheme = localStorage.getItem("theme")
const isDark = storedTheme === "dark"
setTheme(isDark)

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    setTheme(root.getAttribute("data-theme") === "light")
  })
}

// Contributors Section Reveal
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show")
    }
  })
})

document.querySelectorAll(".hidden").forEach(el => observer.observe(el))

// FAQ Toggle
function toggleFAQ(element) {
  const faqItem = element.parentElement
  const isActive = faqItem.classList.contains("active")

  document.querySelectorAll(".faq-item.active").forEach(item => {
    if (item !== faqItem) {
      item.classList.remove("active")
    }
  })

  faqItem.classList.toggle("active", !isActive)
}

document.querySelectorAll(".faq-toggle").forEach(button => {
  button.addEventListener("click", () => toggleFAQ(button))
})

// Cursor Follower Snake Effect
const isMobile = window.matchMedia("(max-width: 768px)").matches

function enableSnakeCursor() {
  if (isMobile) return

  const snakeContainer = document.createElement("div")
  snakeContainer.id = "snake-container"
  document.body.appendChild(snakeContainer)

  const numDots = 30
  const dots = []

  for (let i = 0; i < numDots; i++) {
    const dot = document.createElement("div")
    dot.classList.add("snake-dot")
    snakeContainer.appendChild(dot)
    dots.push({ element: dot, x: 0, y: 0 })
  }

  let mouseX = 0
  let mouseY = 0

  document.addEventListener("mousemove", e => {
    mouseX = e.clientX
    mouseY = e.clientY
  })

  function animateSnake() {
    dots.forEach((dot, index) => {
      const next = dots[index - 1] || { x: mouseX, y: mouseY }
      dot.x += (next.x - dot.x) * 0.3
      dot.y += (next.y - dot.y) * 0.3
      dot.element.style.transform = `translate(${dot.x}px, ${dot.y}px)`
    })
    requestAnimationFrame(animateSnake)
  }

  animateSnake()
}

document.addEventListener("DOMContentLoaded", enableSnakeCursor)

// Contact Form Validation
const contactForm = document.querySelector(".contact-form")
if (contactForm) {
  contactForm.addEventListener("submit", e => {
    e.preventDefault()

    const name = contactForm.querySelector("input[name='name']")
    const email = contactForm.querySelector("input[name='email']")
    const message = contactForm.querySelector("textarea[name='message']")

    let valid = true

    if (!name.value.trim()) {
      name.classList.add("error")
      valid = false
    } else {
      name.classList.remove("error")
    }

    if (!email.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
      email.classList.add("error")
      valid = false
    } else {
      email.classList.remove("error")
    }

    if (!message.value.trim()) {
      message.classList.add("error")
      valid = false
    } else {
      message.classList.remove("error")
    }

    if (valid) {
      alert("Message sent successfully!")
      contactForm.reset()
    }
  })
}

// You can test a food-related effect visually with this:
// document.body.style.backgroundImage = 'url("https://www.transparenttextures.com/patterns/food.png")'
// document.body.style.backgroundRepeat = 'repeat';
