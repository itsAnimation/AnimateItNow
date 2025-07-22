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
window.addEventListener('DOMContentLoaded', () => {
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
}); 

// Contact form validation
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.querySelector('.contact-form');
    const submitBtn = document.querySelector('.submit-btn');
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
});

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
    frame.src = templateUrl;
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
        return `<button class="hover-btn glow">Glow Effect</button>
<button class="hover-btn outline">Outline Effect</button>
<button class="hover-btn gradient">Gradient Effect</button>`;
      case 'css':
        return `.hover-btn {
  padding: 1em 2em;
  border-radius: 2em;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.hover-btn.glow {
  background: #4f8cff;
  color: #fff;
  border: none;
  box-shadow: 0 4px 16px rgba(79, 140, 255, 0.12);
}

.hover-btn.glow:hover {
  background: #2563eb;
  transform: scale(1.08);
  box-shadow: 0 8px 24px rgba(79, 140, 255, 0.18);
}

.hover-btn.outline {
  background: #fff;
  color: #4f8cff;
  border: 2px solid #4f8cff;
}

.hover-btn.outline:hover {
  background: #4f8cff;
  color: #fff;
}`;
      case 'js':
        return `// Add click animations
document.querySelectorAll('.hover-btn').forEach(btn => {
  btn.addEventListener('click', function() {
    this.style.transform = 'scale(0.95)';
    setTimeout(() => {
      this.style.transform = '';
    }, 150);
  });
});`;
      default:
        return 'Code not available';
    }
  }

  function getLoaderCode(type) {
    switch (type) {
      case 'html':
        return `<div class="loader"></div>`;
      case 'css':
        return `.loader {
  width: 48px;
  height: 48px;
  border: 6px solid #e0e7ff;
  border-top: 6px solid #4f8cff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}`;
      case 'js':
        return `// Show/hide loader
function showLoader() {
  document.querySelector('.loader').style.display = 'block';
}

function hideLoader() {
  document.querySelector('.loader').style.display = 'none';
}

// Example usage
showLoader();
setTimeout(hideLoader, 3000);`;
      default:
        return 'Code not available';
    }
  }

  function getModalCode(type) {
    switch (type) {
      case 'html':
        return `<button id="open-modal">Open Modal</button>

<div id="modal" class="modal-overlay">
  <div class="modal-content">
    <h2>Modal Title</h2>
    <p>Modal content goes here...</p>
    <button id="close-modal">Close</button>
  </div>
</div>`;
      case 'css':
        return `.modal-overlay {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.4);
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.modal-content {
  background: #fff;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.18);
  min-width: 300px;
  max-width: 90vw;
  text-align: center;
}`;
      case 'js':
        return `document.getElementById('open-modal').onclick = function() {
  document.getElementById('modal').style.display = 'flex';
};

document.getElementById('close-modal').onclick = function() {
  document.getElementById('modal').style.display = 'none';
};

// Close modal when clicking outside
document.getElementById('modal').onclick = function(e) {
  if (e.target === this) {
    this.style.display = 'none';
  }
};`;
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