window.addEventListener('DOMContentLoaded', () => {
  const themeToggle = document.getElementById('theme-toggle');
  const body = document.body;

  // Set theme
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

  // Scroll to Top Button
  const scrollBtn = document.getElementById('scrollTopBtn');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      scrollBtn.style.display = 'block';
    } else {
      scrollBtn.style.display = 'none';
    }
  });

  scrollBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Load saved theme
  const savedTheme = localStorage.getItem('theme');
  setTheme(savedTheme === 'dark');

  themeToggle.addEventListener('click', () => {
    setTheme(!body.classList.contains('dark'));
  });

  // Fade in on load
  document.querySelectorAll('.fade-in').forEach(el => {
    el.style.opacity = 1;
  });

  // Intersection observer for scroll fades
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

  // Testimonials Slider
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
      current++;
      showSlide(current);
    }

    setInterval(nextSlide, 5000);
  }

  // Contact Form Validation
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    const submitBtn = contactForm.querySelector('.submit-btn');
    const formInputs = contactForm.querySelectorAll('input[required], textarea[required]');
    submitBtn.disabled = true;

    function checkFormValidity() {
      let allFilled = true;
      formInputs.forEach(input => {
        if (input.value.trim() === '') {
          allFilled = false;
        }
      });

      submitBtn.disabled = !allFilled;
      submitBtn.classList.toggle('disabled', !allFilled);
    }

    formInputs.forEach(input => {
      input.addEventListener('input', checkFormValidity);
      input.addEventListener('blur', checkFormValidity);
    });
  }

  // Load GitHub Contributors
  const contributorsGrid = document.getElementById('contributors-grid');
  if (contributorsGrid) {
    const apiUrl = 'https://api.github.com/repos/AnujShrivastava01/AnimateItNow/contributors';

    fetch(apiUrl)
      .then(response => {
        if (!response.ok) throw new Error('Network error: ' + response.statusText);
        return response.json();
      })
      .then(contributors => {
        contributorsGrid.innerHTML = '';
        contributors.forEach(contributor => {
          const card = document.createElement('a');
          card.href = contributor.html_url;
          card.className = 'contributor-card';
          card.target = '_blank';
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
});
