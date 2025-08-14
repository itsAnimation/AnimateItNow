// -------- FAQ Category Switch --------
function displayCategory(category) {
  document.getElementById('general-faq').style.display = category === 'general' ? 'block' : 'none';
  document.getElementById('technical-faq').style.display = category === 'technical' ? 'block' : 'none';
}

// -------- FAQ Toggle with Full Expand & Collapse --------
document.querySelectorAll('.faq-question').forEach(question => {
  question.addEventListener('click', () => {
    const item = question.parentElement;
    const answer = question.nextElementSibling;
    const isActive = item.classList.contains('active');

    // Close all other FAQ items
    document.querySelectorAll('.faq-item').forEach(faq => {
      if (faq !== item) {
        faq.classList.remove('active');
        const ans = faq.querySelector('.faq-answer');
        ans.style.maxHeight = "0px";
        ans.style.paddingTop = "0px";
        ans.style.paddingBottom = "0px";
      }
    });

    // Toggle current FAQ
    if (isActive) {
      // Close if already active
      item.classList.remove('active');
      answer.style.maxHeight = "0px";
      answer.style.paddingTop = "0px";
      answer.style.paddingBottom = "0px";
    } else {
      // Open fully
      item.classList.add('active');
      answer.style.maxHeight = answer.scrollHeight + "px";
      answer.style.paddingTop = "15px";
      answer.style.paddingBottom = "15px";
    }
  });
});

// -------- Typewriter Effect --------
function typewriter() {
  const el = document.getElementById("modify");
  if (!el) return;
  const text = el.textContent;
  el.textContent = '';
  let index = 0;
  let interval = setInterval(() => {
    if (index < text.length) {
      el.textContent += text.charAt(index);
      index++;
    } else {
      clearInterval(interval);
    }
  }, 100);
}
typewriter();

// -------- Scroll to Top --------
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// -------- Scroll to FAQ Smooth --------
function scrollToFAQ(event) {
  event.preventDefault();
  const el = document.getElementById('faq');
  window.scrollTo({ top: el.offsetTop - 70, behavior: 'smooth' });
}

// -------- Progress Bar --------
function updateProgressBar() {
  const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
  const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const scrollPercent = (scrollTop / scrollHeight) * 100;
  const progressBar = document.getElementById('progress-bar');
  if (progressBar) progressBar.style.width = scrollPercent + "%";
}
window.addEventListener('scroll', updateProgressBar);
updateProgressBar();

// -------- Scroll to Top Button Show/Hide --------
window.addEventListener('scroll', () => {
  const btn = document.getElementById("scrollBtn");
  if (document.documentElement.scrollTop > 20) btn.classList.add("show");
  else btn.classList.remove("show");
});

// -------- Swiper --------
const swiper = new Swiper(".swiper", {
  autoHeight: true,
  loop: true,
  pagination: { el: ".swiper-pagination" },
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
});
