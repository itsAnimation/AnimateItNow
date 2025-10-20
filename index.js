// ⏳ Progress Bar on scroll
      window.addEventListener("scroll", () => {
        const winScroll =
          document.body.scrollTop || document.documentElement.scrollTop;
        const height =
          document.documentElement.scrollHeight -
          document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        document.getElementById("progress-bar").style.width = scrolled + "%";
      });

      // ❓ FAQ Accordion
      const faqItems = document.querySelectorAll(".faq-item");
      faqItems.forEach((item) => {
        const question = item.querySelector(".faq-question");
        question.addEventListener("click", () => {
          // Close all other items before opening the new one
          faqItems.forEach((otherItem) => {
            if (otherItem !== item) {
              otherItem.classList.remove("active");
            }
          });
          // Toggle the clicked item
          item.classList.toggle("active");
        });
      });

      // 👥 Testimonial Carousel
      const testimonialCards = document.querySelectorAll(".testimonial-card");
      const testimonialNavButtons = document.querySelectorAll(
        ".testimonial-nav button"
      );
      const testimonialCarousel = document.querySelector(".testimonial-carousel");
      const arrowLeft = document.querySelector(".arrow-left");
      const arrowRight = document.querySelector(".arrow-right");
      let currentTestimonial = 0;

      function showTestimonial(index) {
        // Loop around if index goes out of bounds
        if (index < 0) {
          index = testimonialCards.length - 1;
        } else if (index >= testimonialCards.length) {
          index = 0;
        }

        testimonialCards.forEach((card) => card.classList.remove("active"));
        testimonialNavButtons.forEach((btn) => btn.classList.remove("active"));

        if (testimonialCards[index]) {
            testimonialCards[index].classList.add("active");
        }
        if (testimonialNavButtons[index]) {
            testimonialNavButtons[index].classList.add("active");
        }

        const cardWidth = 380; // card width (350) + gap (30)
        const totalCards = testimonialCards.length;
        const centerOffset = (testimonialCarousel.offsetWidth) - (cardWidth / 2);
        const offset = centerOffset - index * cardWidth;

        if (testimonialCarousel) {
          testimonialCarousel.style.transform = `translateX(${offset}px)`;
        }
        currentTestimonial = index;
      }

      testimonialNavButtons.forEach((button, index) => {
        button.addEventListener("click", () => showTestimonial(index));
      });

      if (arrowLeft) {
        arrowLeft.addEventListener("click", () => showTestimonial(currentTestimonial - 1));
      }
      if (arrowRight) {
        arrowRight.addEventListener("click", () => showTestimonial(currentTestimonial + 1));
      }

      let testimonialInterval = setInterval(() => {
        showTestimonial(currentTestimonial + 1);
      }, 4000);

      const testimonialSection = document.querySelector(".testimonials");
      if (testimonialSection) {
        testimonialSection.addEventListener("mouseenter", () => clearInterval(testimonialInterval));
        testimonialSection.addEventListener("mouseleave", () => {
          testimonialInterval = setInterval(() => {
            showTestimonial(currentTestimonial + 1);
          }, 4000);
        });
      }

      // ⬆️ Scroll to top button
      function scrollToTop() {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }

      window.onscroll = function () {
        const scrollBtn = document.getElementById("scrollBtn");
        if (
          document.body.scrollTop > 300 ||
          document.documentElement.scrollTop > 300
        ) {
          scrollBtn.style.display = "block";
        } else {
          scrollBtn.style.display = "none";
        }
      };

      // 🚀 Initialize when page loads
      document.addEventListener("DOMContentLoaded", () => {
        showTestimonial(0);
      });
    