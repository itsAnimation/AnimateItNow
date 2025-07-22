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



// testinomial ke liye 
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
});


