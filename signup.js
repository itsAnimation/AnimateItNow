// 🌗 Theme Toggle
const themeToggle = document.getElementById("theme-toggle");
const themeIcon = themeToggle.querySelector("i");
const body = document.body;

function setTheme(theme) {
  body.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);

  if (theme === "dark") {
    themeIcon.classList.remove("fa-moon");
    themeIcon.classList.add("fa-sun");
  } else {
    themeIcon.classList.remove("fa-sun");
    themeIcon.classList.add("fa-moon");
  }
}

function initTheme() {
  const savedTheme = localStorage.getItem("theme");
  const systemPrefersDark = window.matchMedia(
    "(prefers-color-scheme: dark)"
  ).matches;

  if (savedTheme) {
    setTheme(savedTheme);
  } else if (systemPrefersDark) {
    setTheme("dark");
  } else {
    setTheme("light");
  }
}

themeToggle.addEventListener("click", () => {
  const currentTheme = body.getAttribute("data-theme");
  setTheme(currentTheme === "light" ? "dark" : "light");
});

window
  .matchMedia("(prefers-color-scheme: dark)")
  .addEventListener("change", (e) => {
    if (!localStorage.getItem("theme")) {
      setTheme(e.matches ? "dark" : "light");
    }
  });

// 📱 Mobile Navigation Toggle
const hamburger = document.getElementById("hamburger");
const navLinks = document.querySelector(".nav-links");
const mobileMenu = document.getElementById("mobile-menu");

hamburger.addEventListener("click", () => {
  mobileMenu.classList.toggle("active");
  hamburger.classList.toggle("active");

  // Prevent body scroll when menu is open
  document.body.style.overflow = mobileMenu.classList.contains("active")
    ? "hidden"
    : "";
});

// Close mobile menu when clicking on links
document.querySelectorAll(".mobile-link-item a").forEach((link) => {
  link.addEventListener("click", () => {
    mobileMenu.classList.remove("active");
    hamburger.classList.remove("active");
    document.body.style.overflow = "";
  });
});

// Password visibility toggle
const togglePassword = document.getElementById("togglePassword");
const passwordInput = document.getElementById("password");

const toggleConfirmPassword = document.getElementById("toggleConfirmPassword");
const confirmPasswordInput = document.getElementById("confirm-password");

togglePassword.addEventListener("click", function () {
  const type =
    passwordInput.getAttribute("type") === "password" ? "text" : "password";
  passwordInput.setAttribute("type", type);
  this.querySelector("i").classList.toggle("fa-eye");
  this.querySelector("i").classList.toggle("fa-eye-slash");
});

toggleConfirmPassword.addEventListener("click", function () {
  const type =
    confirmPasswordInput.getAttribute("type") === "password"
      ? "text"
      : "password";
  confirmPasswordInput.setAttribute("type", type);
  this.querySelector("i").classList.toggle("fa-eye");
  this.querySelector("i").classList.toggle("fa-eye-slash");
});

// Password strength indicator
passwordInput.addEventListener("input", function () {
  const password = this.value;
  const strengthBar = document.querySelector(".strength-bar");
  const strengthText = document.querySelector(".strength-text");

  let strength = 0;
  let color = "#dc3545";
  let text = "Weak";

  if (password.length >= 8) strength += 25;
  if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength += 25;
  if (password.match(/\d/)) strength += 25;
  if (password.match(/[^a-zA-Z\d]/)) strength += 25;

  if (strength >= 75) {
    color = "#28a745";
    text = "Strong";
  } else if (strength >= 50) {
    color = "#ffc107";
    text = "Medium";
  }

  document.documentElement.style.setProperty(
    "--strength-width",
    strength + "%"
  );
  document.documentElement.style.setProperty("--strength-color", color);
  strengthText.textContent = text + " password";
  strengthText.style.color = color;
});

// Form validation
const form = document.getElementById("signup-form");
form.addEventListener("submit", function (e) {
  e.preventDefault();

  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirm-password").value;

  if (password !== confirmPassword) {
    alert("Passwords do not match!");
    return;
  }

  if (!document.getElementById("terms").checked) {
    alert("Please agree to the Terms of Service and Privacy Policy");
    return;
  }

  alert("Account created successfully!");
  form.reset();

  // Reset strength indicator
  document.documentElement.style.setProperty("--strength-width", "0%");
  document.querySelector(".strength-text").textContent = "Password strength";
  document.querySelector(".strength-text").style.color = "#6c757d";
});

// Header scroll effect
window.addEventListener("scroll", () => {
  const mainHeader = document.querySelector(".header");
  if (window.scrollY > 50) {
    mainHeader.classList.add("scrolled");
  } else {
    mainHeader.classList.remove("scrolled");
  }
});

// Initialize theme
document.addEventListener("DOMContentLoaded", () => {
  initTheme();
});
