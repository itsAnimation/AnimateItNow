// Typewriter effect for navbar title/logo text only
const typewriterEl = document.getElementById('typewriter');
const typeText = "Animate It Now";
let typeIdx = 0, typing = true;
function typeWriterLoop() {
  if (typing) {
    if (typeIdx <= typeText.length) {
      typewriterEl.textContent = typeText.slice(0, typeIdx);
      typeIdx++;
      setTimeout(typeWriterLoop, 80);
    } else {
      typing = false;
      setTimeout(typeWriterLoop, 700);
    }
  } else {
    if (typeIdx > 0) {
      typeIdx--;
      typewriterEl.textContent = typeText.slice(0, typeIdx);
      setTimeout(typeWriterLoop, 40);
    } else {
      typing = true;
      setTimeout(typeWriterLoop, 400);
    }
  }
}
typeWriterLoop();

// Navbar link active state (STATIC, NO animation, only style change)
document.querySelectorAll('.navbar-link').forEach(link => {
  link.addEventListener('click', function(e) {
    document.querySelectorAll('.navbar-link').forEach(l => l.classList.remove('active'));
    this.classList.add('active');
  });
});

// Theme toggle button (light/dark)
const themeBtn = document.getElementById('theme-btn');
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

function setLightMode(isLight) {
  document.body.classList.toggle('light-mode', isLight);
  themeBtn.innerHTML = isLight
    ? '<i class="fa-regular fa-moon"></i>'
    : '<i class="fa-regular fa-sun"></i>';
  themeToggle.checked = isLight;
}

themeToggle.addEventListener('change', () => setLightMode(themeToggle.checked));
themeBtn.addEventListener('click', () => setLightMode(!body.classList.contains('light-mode')));

// ----- Animated Network Lines Background -----
const canvas = document.getElementById('bgNetwork');
const ctx = canvas.getContext('2d');
let W = window.innerWidth, H = window.innerHeight;
canvas.width = W; canvas.height = H;

let points = [];
let N = 22;
function genPoints() {
  points = [];
  for (let i = 0; i < N; i++) {
    let r = Math.random();
    points.push({
      x: Math.random()*W*0.96 + W*0.01,
      y: Math.random()*H*0.96 + H*0.01,
      vx: 0.16 + Math.random()*0.09,
      vy: (Math.random()-0.5)*0.09,
      c: r>0.93 ? 'dot2' : 'dot'
    });
  }
}
genPoints();

function drawNetwork() {
  ctx.clearRect(0,0,W,H);
  let dotColor = body.classList.contains('light-mode') ? "#ffe9ae" : "#44d6ff";
  let lineColor = body.classList.contains('light-mode') ? "#dbe7fa" : "#19d4ff";
  let dot2Color = body.classList.contains('light-mode') ? "#dbe7fa" : "#7c3aed";
  for (let i=0;i<N;i++) {
    for (let j=i+1;j<N;j++) {
      let d = Math.hypot(points[i].x-points[j].x,points[i].y-points[j].y);
      if (d < 260) {
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(points[i].x, points[i].y);
        ctx.lineTo(points[j].x, points[j].y);
        ctx.strokeStyle = lineColor;
        ctx.shadowColor = lineColor;
        ctx.shadowBlur = 5;
        ctx.globalAlpha = 0.17-(d/350);
        ctx.lineWidth = 1.15;
        ctx.stroke();
        ctx.globalAlpha = 1;
        ctx.restore();
      }
    }
  }
  for (let p of points) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.c==='dot2'?7:5, 0, 2*Math.PI);
    ctx.fillStyle = p.c==='dot2'?dot2Color:dotColor;
    ctx.shadowColor = p.c==='dot2' ? dot2Color : dotColor;
    ctx.shadowBlur = p.c==='dot2'?16:10;
    ctx.globalAlpha = p.c==='dot2'?0.39:0.32;
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.restore();
  }
}
function animateNetwork() {
  for (let p of points) {
    p.x += p.vx;
    p.y += p.vy;
    if (p.x > W+50) p.x = -30;
    if (p.y<0||p.y>H) p.vy*=-1;
  }
  drawNetwork();
  requestAnimationFrame(animateNetwork);
}
drawNetwork();
animateNetwork();
window.addEventListener('resize',()=>{
  W = window.innerWidth; H = window.innerHeight;
  canvas.width = W; canvas.height = H;
  genPoints();
  drawNetwork();
});

// Log output when prompt is submitted
const animateForm = document.getElementById('animate-form');
const promptInput = document.getElementById('prompt');
const logArea = document.querySelector('.log-area-normal');

animateForm.addEventListener('submit', function(e) {
  e.preventDefault();
  const promptText = promptInput.value.trim();
  if (promptText) {
    logArea.innerHTML = `<div class="log-entry">Prompt received: <strong>${promptText}</strong></div>`;
    promptInput.value = "";
  } else {
    logArea.innerHTML = `<div class="log-entry">Please enter an animation prompt.</div>`;
  }
});