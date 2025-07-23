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

  const savedTheme = localStorage.getItem('theme');
  setTheme(savedTheme === 'dark');

  themeToggle?.addEventListener('click', () => {
    setTheme(!body.classList.contains('dark'));
  });

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

  // 📨 Contact form validation
  const contactForm = document.querySelector('.contact-form');
  const submitBtn = document.querySelector('.submit-btn');

  if (contactForm && submitBtn) {
    const formInputs = contactForm.querySelectorAll('input[required], textarea[required]');
    submitBtn.disabled = true;

    function checkFormValidity() {
      let allFieldsFilled = [...formInputs].every(input => input.value.trim() !== '');
      submitBtn.disabled = !allFieldsFilled;
      submitBtn.classList.toggle('disabled', !allFieldsFilled);
    }

    formInputs.forEach(input => {
      input.addEventListener('input', checkFormValidity);
      input.addEventListener('blur', checkFormValidity);
    });
  }

  // 🧑‍💻 Contributors fetch
  const contributorsGrid = document.getElementById('contributors-grid');
  if (contributorsGrid) {
    fetch('https://api.github.com/repos/AnujShrivastava01/AnimateItNow/contributors')
      .then(res => res.json())
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
      .catch(err => {
        console.error('Error fetching contributors:', err);
        contributorsGrid.innerHTML = '<p>Could not load contributors at this time.</p>';
      });
  }

// 🐍 Cursor Snake Trail Animation


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
  requestAnimationFrame(animateSnake);
}
animateSnake();
});