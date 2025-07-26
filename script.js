// Function to make the FAQ collapsible
    function toggleFAQ(element) {
      if (!document.querySelector('.faq-item')) return;
      const faqItem = element.closest('.faq-item'); // Ensure clicking anywhere in item works
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

    // Theme toggle function
    const body = document.body;
    function setTheme(dark) {
      const newIcon = dark ? 'sun' : 'moon';
      body.classList.toggle('dark', dark);
      localStorage.setItem('theme', dark ? 'dark' : 'light');

      // Update all theme toggle buttons
      const themeToggles = document.querySelectorAll('#theme-toggle');
      themeToggles.forEach(btn => {
        if (typeof lucide !== 'undefined' && lucide.createIcons) {
          btn.innerHTML = `<i data-lucide="${newIcon}"></i>`;
        } else {
          // Fallback to emojis if Lucide is not available
          btn.textContent = dark ? '☀️' : '🌙';
        }
      });
    }

    window.addEventListener('DOMContentLoaded', () => {
      // Theme toggle - handle multiple buttons
      const themeToggles = document.querySelectorAll('#theme-toggle');

      // Apply saved theme
      const savedTheme = localStorage.getItem('theme');
      setTheme(savedTheme === 'dark');

      // Add event listeners to all theme toggle buttons
      themeToggles.forEach(toggle => {
        toggle?.addEventListener('click', () => {
          const isDark = body.classList.contains('dark');
          setTheme(!isDark);
        });
      });

      // Initialize Lucide icons if available
      if (typeof lucide !== 'undefined' && lucide.createIcons) {
        lucide.createIcons();
      }

      // 🔽 Scroll Reveal Animation
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // observer.unobserve(entry.target); // Uncomment to animate only once
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

      // 📨 Contact form validation
      const contactForm = document.querySelector('.contact-form');
      if (contactForm) {
        const formInputs = contactForm.querySelectorAll('input[required], textarea[required]');
        function checkFormValidity() {
          return [...formInputs].every(input => input.value.trim() !== '');
        }

        contactForm.addEventListener('submit', function (e) {
          e.preventDefault();
          const allValid = checkFormValidity();
          if (allValid) {
            alert('Message sent successfully!');
            contactForm.reset();
          } else {
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

      // Hamburger Menu Toggle
      const hamburger = document.querySelector('.hamburger');
      const mobileMenu = document.querySelector('.mobile-menu');

      if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', () => {
          hamburger.classList.toggle('active');
          mobileMenu.classList.toggle('active');
        });

        // Close Mobile Menu When Clicking a Link
        const mobileLinks = document.querySelectorAll('.mobile-menu .nav-links a');
        mobileLinks.forEach(link => {
          link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            mobileMenu.classList.remove('active');
          });
        });

        // Close Mobile Menu When Clicking Outside
        document.addEventListener('click', (e) => {
          if (!mobileMenu.contains(e.target) && !hamburger.contains(e.target)) {
            hamburger.classList.remove('active');
            mobileMenu.classList.remove('active');
          }
        });
      }

      // Snake Cursor
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