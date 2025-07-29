  // template gallery slider
  const template_slider = document.querySelector(".template-slider");
  const template_slides = template_slider.querySelectorAll("li");
  const slideCount = template_slides.length;
  let activeSlide = 0;

  // Ensure first slide is visible
  template_slides[0].classList.add("active");

  // Arrow buttons
  const leftArrow = document.getElementById("slider-left");
  const rightArrow = document.getElementById("slider-right");

  function showSlide(index) {
    template_slides[activeSlide].classList.remove("active");
    activeSlide = (index + slideCount) % slideCount;
    template_slides[activeSlide].classList.add("active");
  }

  // Auto slide
  let sliderInterval = setInterval(() => {
    showSlide(activeSlide + 1);
  }, 5000);

  // Arrow navigation
  if (leftArrow && rightArrow) {
    leftArrow.addEventListener("click", () => {
      showSlide(activeSlide - 1);
      clearInterval(sliderInterval);
      sliderInterval = setInterval(() => showSlide(activeSlide + 1), 5000);
    });
    rightArrow.addEventListener("click", () => {
      showSlide(activeSlide + 1);
      clearInterval(sliderInterval);
      sliderInterval = setInterval(() => showSlide(activeSlide + 1), 5000);
    });
  }
