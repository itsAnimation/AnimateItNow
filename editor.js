const htmlCode = document.getElementById("htmlCode");
const cssCode = document.getElementById("cssCode");
const jsCode = document.getElementById("jsCode");
const runBtn = document.getElementById("runBtn");
const resetBtn = document.getElementById("resetBtn");
const outputFrame = document.getElementById("output");
const animationSearch = document.getElementById("animationSearch");
const suggestions = document.getElementById("suggestions");

const animations = [
  "bounce", "flash", "pulse", "rubberBand", "shakeX", "shakeY", "headShake", "swing",
  "tada", "wobble", "jello", "heartBeat", "backInDown", "backInLeft", "backInRight",
  "backInUp", "backOutDown", "backOutLeft", "backOutRight", "backOutUp", "bounceIn",
  "bounceInDown", "bounceInLeft", "bounceInRight", "bounceInUp", "bounceOut",
  "bounceOutDown", "bounceOutLeft", "bounceOutRight", "bounceOutUp", "fadeIn",
  "fadeInDown", "fadeInDownBig", "fadeInLeft", "fadeInLeftBig", "fadeInRight",
  "fadeInRightBig", "fadeInUp", "fadeInUpBig", "fadeOut", "fadeOutDown",
  "fadeOutDownBig", "fadeOutLeft", "fadeOutLeftBig", "fadeOutRight", "fadeOutRightBig",
  "fadeOutUp", "fadeOutUpBig", "flip", "flipInX", "flipInY", "flipOutX", "flipOutY",
  "lightSpeedInRight", "lightSpeedInLeft", "lightSpeedOutRight", "lightSpeedOutLeft",
  "rotateIn", "rotateInDownLeft", "rotateInDownRight", "rotateInUpLeft", "rotateInUpRight",
  "rotateOut", "rotateOutDownLeft", "rotateOutDownRight", "rotateOutUpLeft", "rotateOutUpRight",
  "hinge", "jackInTheBox", "rollIn", "rollOut", "zoomIn", "zoomInDown", "zoomInLeft",
  "zoomInRight", "zoomInUp", "zoomOut", "zoomOutDown", "zoomOutLeft", "zoomOutRight",
  "zoomOutUp", "slideInDown", "slideInLeft", "slideInRight", "slideInUp", "slideOutDown",
  "slideOutLeft", "slideOutRight", "slideOutUp"
];

runBtn.addEventListener("click", () => {
  const html = htmlCode.value;
  const css = `<style>${cssCode.value}</style>`;
  const js = `<script>${jsCode.value}<\/script>`;
  const animateCSS = `<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css"/>`;

  outputFrame.contentDocument.open();
  outputFrame.contentDocument.write(`${animateCSS} ${css} ${html} ${js}`);
  outputFrame.contentDocument.close();
});

animationSearch.addEventListener("input", () => {
  const query = animationSearch.value.toLowerCase();
  suggestions.innerHTML = "";

  if (!query) {
    suggestions.style.display = "none";
    return;
  }

  const filtered = animations.filter(anim => anim.toLowerCase().includes(query));

  filtered.forEach(anim => {
    const li = document.createElement("li");
    li.textContent = anim;
    li.className = "p-2 hover:bg-gray-200 cursor-pointer";
    li.addEventListener("click", () => {
      applyAnimation(anim);
      animationSearch.value = anim;
      suggestions.style.display = "none";
    });
    suggestions.appendChild(li);
  });

  suggestions.style.display = filtered.length ? "block" : "none";
});

animationSearch.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    const firstOption = suggestions.querySelector("li");
    if (firstOption) {
      firstOption.click();
    }
  }
});

function applyAnimation(animationName) {
  const body = outputFrame.contentDocument.body;
  if (!body) return;

  body.classList.add("animate__animated", `animate__${animationName}`);

  body.addEventListener("animationend", () => {
    body.classList.remove("animate__animated", `animate__${animationName}`);
  }, { once: true });
}

resetBtn.addEventListener("click", () => {
  htmlCode.value = "";
  cssCode.value = "";
  jsCode.value = "";
  animationSearch.value = "";
  suggestions.style.display = "none";
  outputFrame.srcdoc = "";
});
