const form = document.getElementById('animate-form');
const logArea = document.getElementById('log');
const toggleThemeBtn = document.getElementById('toggle-theme');
const body = document.body;

// Floating label support for input
document.querySelectorAll('.form-group input, .form-group select').forEach(el => {
  el.addEventListener('blur', function() {
    if (el.value) el.classList.add('has-value');
    else el.classList.remove('has-value');
  });
});

// Handle form submission
form.addEventListener('submit', function(e) {
  e.preventDefault();
  const prompt = document.getElementById('prompt').value.trim();
  const frames = document.getElementById('frames').value;
  const style = document.getElementById('style').value;

  if (!prompt) {
    logArea.innerHTML = `<span class="log-icon"><i class="fa-solid fa-circle-exclamation"></i></span>
      <span style="color:var(--error);font-weight:600;">Please enter a valid animation prompt.</span>`;
    logArea.classList.remove('success');
    logArea.classList.add('error');
    return;
  }

  logArea.innerHTML = `
    <span class="log-icon"><i class="fa-solid fa-sparkles"></i></span>
    <span style="color:var(--success);font-weight:600;">Animation Request Submitted!</span>
    <br><br>
    <b>Prompt:</b> ${prompt}<br>
    <b>Frames:</b> ${frames}<br>
    <b>Style:</b> ${style}<br><br>
    <span style="color:var(--primary);">Status:</span> <span style="color:var(--success);">Success (demo)</span><br>
    <hr style="margin:0.7em 0; border-color:var(--primary);">
    <span style="color:var(--label);">Connect AnimateItNow backend to generate actual output here.</span>
  `;
  logArea.classList.remove('error');
  logArea.classList.add('success');
});

// Theme toggle
toggleThemeBtn.addEventListener("click", () => {
  body.classList.toggle("light-mode");
  toggleThemeBtn.innerHTML = body.classList.contains("light-mode")
    ? '<i class="fa-solid fa-sun"></i>'
    : '<i class="fa-solid fa-moon"></i>';
});

// Optional: Simple particles background effect (for extra polish)
const canvas = document.getElementById('bgParticles');
const ctx = canvas.getContext('2d');
let W = window.innerWidth, H = window.innerHeight;
canvas.width = W; canvas.height = H;
let particles = [];
for (let i = 0; i < 40; i++) {
  particles.push({
    x: Math.random()*W,
    y: Math.random()*H,
    r: Math.random()*2+1,
    dx: (Math.random()-0.5)*0.8,
    dy: (Math.random()-0.5)*0.8,
    c: `rgba(${100+Math.random()*100|0},${180+Math.random()*60|0},255,0.15)`
  });
}
function drawParticles() {
  ctx.clearRect(0,0,W,H);
  for (let p of particles) {
    ctx.beginPath();
    ctx.arc(p.x,p.y,p.r,0,2*Math.PI);
    ctx.fillStyle = p.c;
    ctx.fill();
    p.x += p.dx; p.y += p.dy;
    if (p.x<0||p.x>W) p.dx*=-1;
    if (p.y<0||p.y>H) p.dy*=-1;
  }
  requestAnimationFrame(drawParticles);
}
drawParticles();
window.addEventListener('resize',()=>{
  W = window.innerWidth; H = window.innerHeight;
  canvas.width = W; canvas.height = H;
});