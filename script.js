window.addEventListener('DOMContentLoaded', () => {
// Theme toggle
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

function setTheme(dark) {
  if (dark) {
    body.classList.add('dark');
    themeToggle.textContent = '☀️';
    localStorage.setItem('theme', 'dark');
  } else {
    body.classList.remove('dark');
    themeToggle.textContent = '🌙';
    localStorage.setItem('theme', 'light');
  }
}

// Load theme preference
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') setTheme(true);
else setTheme(false);

themeToggle.addEventListener('click', () => {
  setTheme(!body.classList.contains('dark'));
});

// Fade-in and scroll animations
  // Animate landing section
  document.querySelectorAll('.fade-in').forEach(el => {
    el.style.opacity = 1;
  });

  // Scroll-triggered fade for info sections
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.2 });

  document.querySelectorAll('.scroll-fade').forEach(section => {
    observer.observe(section);
  });

  // Testimonial slider logic
  const slider = document.getElementById('slider');
  if(slider){
    const slides = document.querySelectorAll('.card');
    let current = 0;
    let total = slides.length;

    function showSlide(index) {
      const slides = document.querySelectorAll('.card');
      const total = slides.length;
      if (index >= total) current = 0;
      else if (index < 0) current = total - 1;
      else current = index;
      slider.style.transform = `translateX(-${current * 100}%)`;
    }

    function nextSlide() {
      showSlide(current + 1);
    }

    function prevSlide() {
      showSlide(current - 1);
    }

    setInterval(() => {
      nextSlide();
    }, 5000);
  }

  // Contact form validation
  const contactForm = document.querySelector('.contact-form');
  const submitBtn = document.querySelector('.submit-btn');
  if (contactForm && submitBtn) {
    const formInputs = contactForm.querySelectorAll('input[required], textarea[required]');
    // Initially disable the submit button
    submitBtn.disabled = true;
    // Function to check if all required fields are filled
    function checkFormValidity() {
      let allFieldsFilled = true;
      formInputs.forEach(input => {
        if (input.value.trim() === '') {
          allFieldsFilled = false;
        }
      });
      // Enable/disable button based on form validity
      if (allFieldsFilled) {
        submitBtn.disabled = false;
        submitBtn.classList.remove('disabled');
      } else {
        submitBtn.disabled = true;
        submitBtn.classList.add('disabled');
      }
    }
    // Add event listeners to all form inputs
    formInputs.forEach(input => {
      input.addEventListener('input', checkFormValidity);
      input.addEventListener('blur', checkFormValidity);
    });
  }

  const contributorsGrid = document.getElementById('contributors-grid');
  if (contributorsGrid) {
    const apiUrl = 'https://api.github.com/repos/AnujShrivastava01/AnimateItNow/contributors';
    fetch(apiUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
      })
      .then(contributors => {
        contributorsGrid.innerHTML = ''; // Clear any loading text/placeholders
        contributors.forEach(contributor => {
          // Create the card as a link to the contributor's profile
          const card = document.createElement('a');
          card.href = contributor.html_url;
          card.className = 'contributor-card'; // Use a new class for specific styling
          card.target = '_blank'; // Open link in a new tab
          card.rel = 'noopener noreferrer';
          card.innerHTML = `
            <img src="${contributor.avatar_url}" alt="${contributor.login}" class="contributor-avatar">
            <h3>${contributor.login}</h3>
            <p>Contributions: ${contributor.contributions}</p>
          `;
          contributorsGrid.appendChild(card);
        });
      })
      .catch(error => {
        console.error('Error fetching contributors:', error);
        contributorsGrid.innerHTML = '<p>Could not load contributors at this time.</p>';
      });
  }

  // Template functionality
  window.openPreview = function(templateUrl, title) {
    const modal = document.getElementById('preview-modal');
    const frame = document.getElementById('preview-frame');
    const titleElement = document.getElementById('preview-title');
    titleElement.textContent = title;
    // Always append ?embed=1 for preview
    frame.src = templateUrl + (templateUrl.includes('?') ? '&' : '?') + 'embed=1';
    modal.classList.add('active');
  };

  window.closePreview = function() {
    const modal = document.getElementById('preview-modal');
    const frame = document.getElementById('preview-frame');
    modal.classList.remove('active');
    frame.src = '';
  };

  window.viewCode = function(templateType) {
    const modal = document.getElementById('code-modal');
    const titleElement = document.getElementById('code-title');
    titleElement.textContent = `${templateType.charAt(0).toUpperCase() + templateType.slice(1)} Template Code`;
    modal.classList.add('active');
    // Load HTML code by default
    showCodeTab('html', templateType);
  };

  window.closeCodeModal = function() {
    const modal = document.getElementById('code-modal');
    modal.classList.remove('active');
  };

  window.showCodeTab = function(type, templateType) {
    // Remove active class from all tabs
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    // Add active class to clicked tab
    event.target.classList.add('active');
    const codeDisplay = document.getElementById('code-display').querySelector('code');
    // Get the current template type from the modal title if not provided
    if (!templateType) {
      const title = document.getElementById('code-title').textContent.toLowerCase();
      if (title.includes('login')) templateType = 'login';
      else if (title.includes('animated')) templateType = 'button';
      else if (title.includes('loading')) templateType = 'loader';
      else if (title.includes('modal')) templateType = 'modal';
    }
    loadCodeContent(type, templateType, codeDisplay);
  };

  function loadCodeContent(type, templateType, codeDisplay) {
    let content = '';
    switch (templateType) {
      case 'login':
        content = getLoginCode(type);
        break;
      case 'button':
        content = getButtonCode(type);
        break;
      case 'loader':
        content = getLoaderCode(type);
        break;
      case 'modal':
        content = getModalCode(type);
        break;
      default:
        content = 'Code not available';
    }
    codeDisplay.textContent = content;
  }

  function getLoginCode(type) {
    switch (type) {
      case 'html':
        return `<form class="login-form">
  <input type="text" placeholder="Username" />
  <input type="password" placeholder="Password" />
  <button type="submit">Login</button>
</form>`;
      case 'css':
        return `.login-form {
  max-width: 350px;
  margin: 2rem auto;
  padding: 2rem;
  background: #fff;
  border-radius: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.07);
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

.login-form input {
  padding: 0.8em 1em;
  border-radius: 0.5em;
  border: 1px solid #e0e7ff;
}

.login-form button {
  background: #4f8cff;
  color: #fff;
  padding: 0.8em 1em;
  border: none;
  border-radius: 0.5em;
  font-weight: 600;
  cursor: pointer;
}`;
      case 'js':
        return `// Add form validation
document.querySelector('.login-form').addEventListener('submit', function(e) {
  e.preventDefault();
  
  const username = this.querySelector('input[type="text"]').value;
  const password = this.querySelector('input[type="password"]').value;
  
  if (username && password) {
    alert('Login successful!');
  } else {
    alert('Please fill in all fields');
  }
});`;
      default:
        return 'Code not available';
    }
  }

  function getButtonCode(type) {
    switch (type) {
      case 'html':
        return `<button class="hover-btn glow">Glow Effect</button>\n<button class="hover-btn outline">Outline Effect</button>\n<button class="hover-btn gradient">Gradient Effect</button>`;
      case 'css':
        return `.hover-btn {\n  padding: 1em 2em;\n  border-radius: 2em;\n  font-weight: 600;\n  cursor: pointer;\n  transition: all 0.2s ease;\n}\n\n.hover-btn.glow {\n  background: #4f8cff;\n  color: #fff;\n  border: none;\n  box-shadow: 0 4px 16px rgba(79, 140, 255, 0.12);\n}\n\n.hover-btn.glow:hover {\n  background: #2563eb;\n  transform: scale(1.08);\n  box-shadow: 0 8px 24px rgba(79, 140, 255, 0.18);\n}\n\n.hover-btn.outline {\n  background: #fff;\n  color: #4f8cff;\n  border: 2px solid #4f8cff;\n}\n\n.hover-btn.outline:hover {\n  background: #4f8cff;\n  color: #fff;\n}`;
      case 'js':
        return `// Add click animations\ndocument.querySelectorAll('.hover-btn').forEach(btn => {\n  btn.addEventListener('click', function() {\n    this.style.transform = 'scale(0.95)';\n    setTimeout(() => {\n      this.style.transform = '';\n    }, 150);\n  });\n});`;
      default:
        return 'Code not available';
    }
  }

  function getLoaderCode(type) {
    switch (type) {
      case 'html':
        return `<div class="loader"></div>`;
      case 'css':
        return `.loader {\n  width: 48px;\n  height: 48px;\n  border: 6px solid #e0e7ff;\n  border-top: 6px solid #4f8cff;\n  border-radius: 50%;\n  animation: spin 1s linear infinite;\n}\n\n@keyframes spin {\n  0% { transform: rotate(0deg); }\n  100% { transform: rotate(360deg); }\n}`;
      case 'js':
        return `// Show/hide loader\nfunction showLoader() {\n  document.querySelector('.loader').style.display = 'block';\n}\n\nfunction hideLoader() {\n  document.querySelector('.loader').style.display = 'none';\n}\n\n// Example usage\nshowLoader();\nsetTimeout(hideLoader, 3000);`;
      default:
        return 'Code not available';
    }
  }

  function getModalCode(type) {
    switch (type) {
      case 'html':
        return `<button id="open-modal">Open Modal</button>\n\n<div id="modal" class="modal-overlay">\n  <div class="modal-content">\n    <h2>Modal Title</h2>\n    <p>Modal content goes here...</p>\n    <button id="close-modal">Close</button>\n  </div>\n</div>`;
      case 'css':
        return `.modal-overlay {\n  display: none;\n  position: fixed;\n  top: 0;\n  left: 0;\n  width: 100vw;\n  height: 100vh;\n  background: rgba(0, 0, 0, 0.4);\n  justify-content: center;\n  align-items: center;\n  z-index: 999;\n}\n\n.modal-content {\n  background: #fff;\n  padding: 2rem;\n  border-radius: 1rem;\n  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.18);\n  min-width: 300px;\n  max-width: 90vw;\n  text-align: center;\n}`;
      case 'js':
        return `document.getElementById('open-modal').onclick = function() {\n  document.getElementById('modal').style.display = 'flex';\n};\n\ndocument.getElementById('close-modal').onclick = function() {\n  document.getElementById('modal').style.display = 'none';\n};\n\n// Close modal when clicking outside\ndocument.getElementById('modal').onclick = function(e) {\n  if (e.target === this) {\n    this.style.display = 'none';\n  }\n};`;
      default:
        return 'Code not available';
    }
  }

  window.copyCode = function() {
    const codeContent = document.getElementById('code-display').querySelector('code').textContent;
    navigator.clipboard.writeText(codeContent).then(() => {
      const copyBtn = document.querySelector('.copy-btn');
      const originalText = copyBtn.textContent;
      copyBtn.textContent = 'Copied!';
      copyBtn.style.background = '#10b981';
      setTimeout(() => {
        copyBtn.textContent = originalText;
        copyBtn.style.background = '';
      }, 2000);
    }).catch(() => {
      alert('Failed to copy code. Please select and copy manually.');
    });
  };

  // Close modals when clicking outside
  document.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal-overlay')) {
      e.target.classList.remove('active');
      if (e.target.id === 'preview-modal') {
        document.getElementById('preview-frame').src = '';
      }
    }
  });
});

