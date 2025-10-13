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

togglePassword.addEventListener("click", function () {
  const type =
    passwordInput.getAttribute("type") === "password" ? "text" : "password";
  passwordInput.setAttribute("type", type);
  this.querySelector("i").classList.toggle("fa-eye");
  this.querySelector("i").classList.toggle("fa-eye-slash");
});

// Form validation
const formValidator = {
  email: function (email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  showError: function (fieldId, message) {
    const field = document.getElementById(fieldId);
    const errorElement = document.getElementById(fieldId + "Error");

    if (field && errorElement) {
      field.classList.add("input-error");
      field.classList.remove("input-success");
      errorElement.textContent = message;
      errorElement.style.display = "block";
    }
  },

  showSuccess: function (fieldId) {
    const field = document.getElementById(fieldId);
    const errorElement = document.getElementById(fieldId + "Error");

    if (field && errorElement) {
      field.classList.remove("input-error");
      field.classList.add("input-success");
      errorElement.style.display = "none";
    }
  },

  clearErrors: function () {
    const errorElements = document.querySelectorAll(".error-message");
    const inputFields = document.querySelectorAll("input");

    errorElements.forEach((el) => {
      el.style.display = "none";
      el.textContent = "";
    });

    inputFields.forEach((field) => {
      field.classList.remove("input-error", "input-success");
    });
  },
};

// Security monitoring
const securityMonitor = {
  loginAttempts: 0,
  maxAttempts: 5,

  trackAttempt: function () {
    this.loginAttempts++;
    localStorage.setItem("loginAttempts", this.loginAttempts);
  },

  resetAttempts: function () {
    this.loginAttempts = 0;
    localStorage.setItem("loginAttempts", "0");
  },

  isRateLimited: function () {
    const storedAttempts = localStorage.getItem("loginAttempts");
    this.loginAttempts = storedAttempts ? parseInt(storedAttempts) : 0;
    return this.loginAttempts >= this.maxAttempts;
  },
};

// Page initialization
document.addEventListener("DOMContentLoaded", function () {
  initTheme();

  // Initialize security monitor
  securityMonitor.isRateLimited();

  const form = document.getElementById("loginForm");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const loginButton = document.getElementById("loginButton");
  const buttonText = document.getElementById("buttonText");
  const buttonSpinner = document.getElementById("buttonSpinner");

  // Real-time validation
  emailInput.addEventListener("blur", function () {
    if (this.value.trim()) {
      if (formValidator.email(this.value)) {
        formValidator.showSuccess("email");
      } else {
        formValidator.showError("email", "Please enter a valid email address");
      }
    }
  });

  passwordInput.addEventListener("blur", function () {
    if (this.value.trim()) {
      if (this.value.length >= 6) {
        formValidator.showSuccess("password");
      } else {
        formValidator.showError(
          "password",
          "Password must be at least 6 characters"
        );
      }
    }
  });

  // Form submission handler
  form.addEventListener("submit", async function (event) {
    event.preventDefault();

    // Clear previous errors
    formValidator.clearErrors();

    // Get form data
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    const rememberMe = document.getElementById("remember").checked;

    // Validate form
    let isValid = true;

    if (!email) {
      formValidator.showError("email", "Email is required");
      isValid = false;
    } else if (!formValidator.email(email)) {
      formValidator.showError("email", "Please enter a valid email address");
      isValid = false;
    }

    if (!password) {
      formValidator.showError("password", "Password is required");
      isValid = false;
    } else if (password.length < 6) {
      formValidator.showError(
        "password",
        "Password must be at least 6 characters"
      );
      isValid = false;
    }

    if (!isValid) {
      return;
    }

    // Check rate limiting
    if (securityMonitor.isRateLimited()) {
      formValidator.showError(
        "password",
        "Too many login attempts. Please try again later."
      );
      return;
    }

    // Track login attempt
    securityMonitor.trackAttempt();

    // Show loading state
    loginButton.disabled = true;
    buttonText.style.display = "none";
    buttonSpinner.style.display = "inline";

    try {
      // Simulate API call (replace with actual authentication)
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Reset attempts on success
      securityMonitor.resetAttempts();

      // Store remember me preference
      if (rememberMe) {
        localStorage.setItem("rememberMe", "true");
        localStorage.setItem("userEmail", email);
      } else {
        localStorage.removeItem("rememberMe");
        localStorage.removeItem("userEmail");
      }

      // Show success message
      alert("Login successful! Redirecting to dashboard...");

      // Redirect to dashboard (replace with actual navigation)
      setTimeout(() => {
        window.location.href = "dashboard.html";
      }, 1000);
    } catch (error) {
      formValidator.showError(
        "password",
        "Invalid email or password. Please try again."
      );
    } finally {
      // Reset loading state
      loginButton.disabled = false;
      buttonText.style.display = "inline";
      buttonSpinner.style.display = "none";
    }
  });

  // Pre-fill email if remember me was checked
  const rememberedEmail = localStorage.getItem("userEmail");
  const rememberMe = localStorage.getItem("rememberMe");

  if (rememberMe === "true" && rememberedEmail) {
    emailInput.value = rememberedEmail;
    document.getElementById("remember").checked = true;
  }

  // Social login handlers
  document
    .querySelector(".social-btn.google")
    .addEventListener("click", function () {
      alert("Google login would be implemented here");
    });

  document
    .querySelector(".social-btn.github")
    .addEventListener("click", function () {
      alert("GitHub login would be implemented here");
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
});
