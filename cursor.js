const cursor = document.createElement('div');
cursor.id = 'blob-cursor';
document.body.appendChild(cursor);

let mouseX = 0, mouseY = 0;
let currentX = 0, currentY = 0;

gsap.set(cursor, { xPercent: -50, yPercent: -50 });

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

gsap.ticker.add(() => {
  const dt = 0.15;
  currentX += (mouseX - currentX) * dt;
  currentY += (mouseY - currentY) * dt;
  gsap.set(cursor, { x: currentX, y: currentY });
});

document.querySelectorAll('.magnetic').forEach(el => {
  el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
  el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
});
const blob = document.querySelector(".blob-cursor");

document.addEventListener("mousemove", (e) => {
  blob.style.left = `${e.clientX}px`;
  blob.style.top = `${e.clientY}px`;
});

document.querySelectorAll("a, button, .hover-target").forEach((el) => {
  el.addEventListener("mouseenter", () => {
    blob.style.transform = "scale(2)";
  });
  el.addEventListener("mouseleave", () => {
    blob.style.transform = "scale(1)";
  });
});
