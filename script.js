// Function to make the FAQ collapasble
function toggleFAQ(element) {
  if (!document.querySelector('.faq-item')) return;
  const faqItem = element.closest('.faq-item'); //to make sure we can click anywhere
  const isActive = faqItem.classList.contains('active');
  
  // Close all other FAQ items
  document.querySelectorAll('.faq-item.active').forEach(item => {
    if (item !== faqItem) {
      item.classList.remove('active');
    }
  });
  
  // Toggle current item
  faqItem.classList.toggle('active', !isActive);
}

// Make toggleFAQ globally accessible
window.toggleFAQ = toggleFAQ;

// Micro-interaction functions
function addRippleEffect(element) {
  element.addEventListener('click', function(e) {
    const ripple = document.createElement('span');
    const rect = this.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.classList.add('ripple-effect');
    
    this.appendChild(ripple);
    
    setTimeout(() => {
      ripple.remove();
    }, 600);
  });
}

function addButtonPressFeedback(element) {
  element.addEventListener('mousedown', function() {
    this.classList.add('btn-press');
  });
  
  element.addEventListener('mouseup', function() {
    this.classList.remove('btn-press');
  });
  
  element.addEventListener('mouseleave', function() {
    this.classList.remove('btn-press');
  });
}

function addCardLiftEffect(element) {
  element.classList.add('card-lift');
}

function showFeedback(element, type = 'success') {
  element.classList.add(`feedback-${type}`);
  setTimeout(() => {
    element.classList.remove(`feedback-${type}`);
  }, 600);
}

function addCopyCodeFeedback() {
  const copyButtons = document.querySelectorAll('.copy-btn');
  copyButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      showFeedback(this, 'success');
      // Add visual feedback for copy action
      const originalText = this.textContent;
      this.textContent = 'Copied!';
      this.style.background = 'var(--feedback-success)';
      
      setTimeout(() => {
        this.textContent = originalText;
        this.style.background = '';
      }, 2000);
    });
  });
}

window.addEventListener('DOMContentLoaded', () => {
  // Theme toggle
  const themeToggle = document.getElementById('theme-toggle');
  const body = document.body;

  function setTheme(dark) {
    const newIcon = dark ? 'sun' : 'moon';
    body.classList.toggle('dark', dark);
    localStorage.setItem('theme', dark ? 'dark' : 'light');

    // Replace icon completely
    if (themeToggle) {
      themeToggle.innerHTML = `<i data-lucide="${newIcon}"></i>`;
      lucide.createIcons();
    }
    
    // Add feedback animation
    showFeedback(themeToggle, 'success');
  }

  const savedTheme = localStorage.getItem('theme');
  setTheme(savedTheme === 'dark');

  themeToggle?.addEventListener('click', () => {
    const isDark = body.classList.contains('dark');
    setTheme(!isDark);
  });

  lucide.createIcons();

  // Add micro-interactions to interactive elements
  const interactiveElements = document.querySelectorAll('.cta-btn, .template-btn, #theme-toggle, .nav-links a, .footer-right a');
  interactiveElements.forEach(element => {
    addRippleEffect(element);
    addButtonPressFeedback(element);
    element.classList.add('interactive');
  });

  // Add card lift effects to template cards
  const templateCards = document.querySelectorAll('.template-card');
  templateCards.forEach(card => {
    addCardLiftEffect(card);
  });

  // Add copy code feedback
  addCopyCodeFeedback();

  // 🔽 Scroll Reveal Animation
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // observer.unobserve(entry.target); // uncomment to animate only once
      }
    });
  }, { threshold: 0.2 });

  document.querySelectorAll('.scroll-fade').forEach(el => {
    observer.observe(el);
  });

  // 🧪 Testimonial slider
  const slider = document.getElementById('slider');
  if (slider) {
    const slides = document.querySelectorAll('.card');
    let current = 0;

    function showSlide(index) {
      const total = slides.length;
      if (index >= total) current = 0;
      else if (index < 0) current = total - 1;
      else current = index;
      slider.style.transform = `translateX(-${current * 100}%)`;
    }

    function nextSlide() {
      showSlide(current + 1);
    }

    setInterval(() => {
      nextSlide();
    }, 5000);
  }

 
  

 // 🧑‍💻 Contributors fetch
const contributorsGrid = document.getElementById('contributors-grid');
if (contributorsGrid) {
  fetch('https://api.github.com/repos/itsAnimation/AnimateItNow/contributors')
    .then(res => res.json())
    .then(contributors => {
      contributorsGrid.innerHTML = '';
      contributors.forEach(contributor => {
        const card = document.createElement('a');
        card.href = contributor.html_url;
        card.className = 'contributor-card';
        card.target = '_blank';
        card.rel = 'noopener noreferrer';
        
        // Add micro-interactions to contributor cards
        addCardLiftEffect(card);
        addRippleEffect(card);
        
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
      contributorsGrid.innerHTML = '<p>Unable to load contributors at this time.</p>';
    });
}

// Contact form validation and feedback
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  const formInputs = contactForm.querySelectorAll('input, textarea');
  const submitBtn = contactForm.querySelector('#submit');

  function checkFormValidity() {
    let allValid = true;
    formInputs.forEach(input => {
      const value = input.value.trim();
      if (!value) {
        allValid = false;
      }
    });
    return allValid;
  }

  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    if (checkFormValidity()) {
      showFeedback(submitBtn, 'success');
      alert('Message sent successfully!');
      contactForm.reset();
    } else {
      showFeedback(submitBtn, 'error');
      alert('Please fill in all fields correctly. Fields cannot be empty or contain only spaces.');
    }
  });
  
  formInputs.forEach(input => {
    input.addEventListener('input', () => {
      const allFieldsFilled = checkFormValidity();
      input.classList.toggle('invalid', !allFieldsFilled);
    });
  });
}
  
const isMobile = window.matchMedia('(max-width: 768px)').matches;
const cursorToggle = document.getElementById('cursorToggle');

function enableSnakeCursor() {
  // Avoid duplicate containers if the toggle is flipped on again
  if (document.getElementById('cursor-snake')) return;

  const snakeContainer = document.createElement('div');
  snakeContainer.id = 'cursor-snake';
  document.body.appendChild(snakeContainer);

  const dots = [];
  const dotCount = 20;
  for (let i = 0; i < dotCount; i++) {
    const dot = document.createElement('div');
    dot.className = 'snake-dot';
    snakeContainer.appendChild(dot);
    dots.push({ el: dot, x: 0, y: 0 });
  }

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function animateSnake() {
    let x = mouseX, y = mouseY;
    dots.forEach((dot, i) => {
      dot.x += (x - dot.x) * 0.2;
      dot.y += (y - dot.y) * 0.2;
      dot.el.style.left = dot.x + 'px';
      dot.el.style.top = dot.y + 'px';
      dot.el.style.transform = `scale(${1 - i / dotCount})`;
      x = dot.x;
      y = dot.y;
    });

    // Save the animation ID to stop later
    snakeContainer.animationId = requestAnimationFrame(animateSnake);
  }

  animateSnake();
}

function disableSnakeCursor() {
  const snake = document.getElementById('cursor-snake');
  if (snake) {
    cancelAnimationFrame(snake.animationId); // Stop the animation
    snake.remove(); // Remove all dots
  }
}

// Add toggle functionality
if (!isMobile && cursorToggle) {
  cursorToggle.addEventListener('change', function () {
    if (this.checked) {
      enableSnakeCursor();
    } else {
      disableSnakeCursor();
    }
  });
}


  // 🚦 ProgressBar Functionality
  function updateProgressBar() {
    const windowScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const documentHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollPercent = (windowScroll / documentHeight) * 100;
    const progressBar = document.getElementById('progress-bar');
    if (progressBar) {
      progressBar.style.width = scrollPercent + '%';
    }
  }
  window.addEventListener('scroll', updateProgressBar);
  // Initialize on load
  updateProgressBar();




});